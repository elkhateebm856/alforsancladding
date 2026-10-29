const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const vm = require('node:vm')
const ts = require('typescript')
const adminApp = require('firebase-admin/app')
const adminFirestore = require('firebase-admin/firestore')
const adminStorage = require('firebase-admin/storage')
const adminAuth = require('firebase-admin/auth')
const { restoreFirestoreBackup, writeFirestoreBackup } = require('./firebase-content-backup.cjs')

const root = path.resolve(__dirname, '..')
const applyChanges = process.argv.includes('--apply')
const restoreBackupIndex = process.argv.indexOf('--restore-backup')
const shouldUploadImages = process.argv.includes('--upload-images')
const maxDocumentBytes = 1_000_000
const imageUrlCache = new Map()
const imageErrors = []
const uploadedImageUrls = new Set()

function loadLocalEnvironment() {
  const envFile = path.join(root, '.env.local')
  if (!fs.existsSync(envFile)) return

  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!match || process.env[match[1]] !== undefined) continue
    let value = match[2]
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    process.env[match[1]] =
      match[1] === 'FIREBASE_PRIVATE_KEY' ? value.replace(/\\n/g, '\n') : value
  }
}

function loadLegacyModule(relativePath, exportName) {
  const filename = path.join(root, relativePath)
  const source = fs.readFileSync(filename, 'utf8')
  const javascript = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filename,
  }).outputText
  const compiledModule = { exports: {} }
  const sandbox = {
    exports: compiledModule.exports,
    module: compiledModule,
    require,
  }
  vm.runInNewContext(javascript, sandbox, { filename })
  const records = compiledModule.exports[exportName]
  if (!Array.isArray(records)) {
    throw new Error(`${relativePath} did not export an array named ${exportName}.`)
  }
  return records
}

function initializeFirebase() {
  const projectId = process.env.FIREBASE_PROJECT_ID || 'alforsancladding'
  if (projectId !== 'alforsancladding') {
    throw new Error('Refusing to connect to a Firebase project other than alforsancladding.')
  }
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  let credential

  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson)
    if (serviceAccount.project_id !== projectId) {
      throw new Error('Service account project_id does not match alforsancladding.')
    }
    credential = adminApp.cert(serviceAccount)
  } else if (clientEmail && privateKey) {
    credential = adminApp.cert({ projectId, clientEmail, privateKey })
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    credential = adminApp.applicationDefault()
  } else {
    throw new Error(
      'Firebase Admin credentials are missing. Configure FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env.local.',
    )
  }

  const app = adminApp.initializeApp(
    {
      credential,
      projectId,
      ...(process.env.FIREBASE_STORAGE_BUCKET
        ? { storageBucket: process.env.FIREBASE_STORAGE_BUCKET }
        : {}),
    },
    'alforsan-migration',
  )
  return {
    db: adminFirestore.getFirestore(app),
    storage: adminStorage.getStorage(app),
    auth: adminAuth.getAuth(app),
    bucketName:
      process.env.FIREBASE_STORAGE_BUCKET ||
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      '',
  }
}

async function verifyFirebaseAccess({ db, storage, auth, bucketName }) {
  await db.listCollections()

  const adminEmail = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim())
    .find(Boolean)
  if (!adminEmail) {
    throw new Error('Set ADMIN_EMAILS to the authorized administrator email before migration.')
  }
  await auth.getUserByEmail(adminEmail)

  if (shouldUploadImages) {
    if (!bucketName) {
      throw new Error('FIREBASE_STORAGE_BUCKET is required to verify image migration access.')
    }
    const bucket = storage.bucket(bucketName)
    await bucket.file(`migrated-articles/.access-check-${crypto.randomUUID()}`).exists()
  }
}

function localPublicFile(url) {
  let pathname
  try {
    if (url.startsWith('/')) {
      pathname = url.split(/[?#]/, 1)[0]
    } else {
      const parsed = new URL(url)
      if (!['alforsancladding.com', 'www.alforsancladding.com'].includes(parsed.hostname)) {
        return null
      }
      pathname = parsed.pathname
    }
    pathname = decodeURIComponent(pathname)
  } catch {
    return null
  }
  const filename = path.resolve(root, 'public', `.${pathname}`)
  const publicRoot = path.resolve(root, 'public') + path.sep
  return filename.startsWith(publicRoot) ? filename : null
}

function getImageReferences(article) {
  const refs = new Set()
  if (typeof article.image === 'string') refs.add(article.image)
  for (const match of article.content.matchAll(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)) {
    refs.add(match[1])
  }
  return [...refs]
}

async function makeStorageUrl(url, bucketName, storage) {
  if (!shouldUploadImages || !bucketName) return url
  if (imageUrlCache.has(url)) return imageUrlCache.get(url)

  const localFile = localPublicFile(url)
  if (!localFile) {
    imageUrlCache.set(url, url)
    return url
  }
  if (!fs.existsSync(localFile)) {
    imageErrors.push({ source: url, error: 'Local file not found; original URL retained.' })
    imageUrlCache.set(url, url)
    return url
  }

  const storagePath = `migrated-articles/${path
    .relative(path.join(root, 'public'), localFile)
    .split(path.sep)
    .join('/')}`
  const file = storage.bucket(bucketName).file(storagePath)
  let [exists] = await file.exists()
  let token

  if (exists) {
    const [metadata] = await file.getMetadata()
    token = metadata.metadata?.firebaseStorageDownloadTokens
    if (!token) {
      token = crypto.randomUUID()
      await file.setMetadata({
        metadata: { ...metadata.metadata, firebaseStorageDownloadTokens: token },
      })
    }
  } else {
    token = crypto.randomUUID()
    const extension = path.extname(localFile).toLowerCase()
    const contentType = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.avif': 'image/avif',
    }[extension] || 'application/octet-stream'
    await file.save(fs.readFileSync(localFile), {
      resumable: false,
      metadata: {
        contentType,
        cacheControl: 'public, max-age=31536000, immutable',
        metadata: { firebaseStorageDownloadTokens: token },
      },
    })
    exists = true
  }

  if (!exists) throw new Error(`Storage object was not created: ${storagePath}`)
  const storageUrl = `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucketName)}/o/${encodeURIComponent(storagePath)}?alt=media&token=${token}`
  uploadedImageUrls.add(storageUrl)
  imageUrlCache.set(url, storageUrl)
  return storageUrl
}

async function migrateArticle(db, storage, bucketName, source) {
  const slug = String(source.slug || '')
  if (!slug) throw new Error('Article is missing a slug.')
  const ref = db.collection('articles').doc(slug)
  const existing = await ref.get()
  if (existing.exists) return 'skipped'

  let article = {
    ...source,
    id: String(source.id ?? slug),
    slug,
    status: 'published',
  }

  if (shouldUploadImages && bucketName) {
    const replacements = new Map()
    for (const originalUrl of getImageReferences(article)) {
      try {
        replacements.set(originalUrl, await makeStorageUrl(originalUrl, bucketName, storage))
      } catch (error) {
        imageErrors.push({
          source: originalUrl,
          slug,
          error: error instanceof Error ? error.message : String(error),
        })
        replacements.set(originalUrl, originalUrl)
      }
    }
    const replaceUrls = (value) => {
      let updated = value
      for (const [originalUrl, replacement] of replacements) {
        if (replacement !== originalUrl) {
          updated = updated.split(originalUrl).join(replacement)
        }
      }
      return updated
    }
    article.image = replaceUrls(article.image)
    article.content = replaceUrls(article.content)
  }

  const document = {
    ...article,
    migration: {
      source: 'data/blog.ts',
      contentSha256: crypto.createHash('sha256').update(article.content).digest('hex'),
      migratedAt: adminFirestore.FieldValue.serverTimestamp(),
    },
    createdAt: adminFirestore.FieldValue.serverTimestamp(),
    updatedAt: adminFirestore.FieldValue.serverTimestamp(),
  }
  const serializedSize = Buffer.byteLength(
    JSON.stringify({ ...document, migration: { ...document.migration, migratedAt: null }, createdAt: null, updatedAt: null }),
    'utf8',
  )
  if (serializedSize >= maxDocumentBytes) {
    throw new Error(`Article document is ${serializedSize} bytes, above the safe Firestore limit.`)
  }

  await ref.create(document)
  const saved = await ref.get()
  if (
    !saved.exists ||
    saved.get('slug') !== slug ||
    saved.get('content') !== article.content ||
    saved.get('migration.contentSha256') !== document.migration.contentSha256
  ) {
    throw new Error('Article verification failed after Firestore write.')
  }
  return 'migrated'
}

async function migrateTestimonial(db, source) {
  const id = String(source.id)
  const ref = db.collection('testimonials').doc(id)
  if ((await ref.get()).exists) return 'skipped'

  await ref.create({
    ...source,
    id,
    status: 'approved',
    migration: {
      source: 'data/testimonials.ts',
      migratedAt: adminFirestore.FieldValue.serverTimestamp(),
    },
    createdAt: adminFirestore.FieldValue.serverTimestamp(),
    updatedAt: adminFirestore.FieldValue.serverTimestamp(),
  })
  const saved = await ref.get()
  if (!saved.exists || saved.get('text') !== source.text) {
    throw new Error('Testimonial verification failed after Firestore write.')
  }
  return 'migrated'
}

async function main() {
  loadLocalEnvironment()
  const projectId = process.env.FIREBASE_PROJECT_ID || 'alforsancladding'
  if (projectId !== 'alforsancladding') {
    throw new Error('Refusing to connect to a Firebase project other than alforsancladding.')
  }
  if (restoreBackupIndex >= 0) {
    if (applyChanges || !process.argv[restoreBackupIndex + 1]) {
      throw new Error('Use --restore-backup <file> by itself.')
    }
    const backupDirectory = path.resolve(root, '.migration-backups')
    const backupPath = path.resolve(root, process.argv[restoreBackupIndex + 1])
    const relativeBackupPath = path.relative(backupDirectory, backupPath)
    if (relativeBackupPath.startsWith('..') || path.isAbsolute(relativeBackupPath)) {
      throw new Error('Restore is limited to backup files in .migration-backups.')
    }
    const { db } = initializeFirebase()
    const result = await restoreFirestoreBackup(db, backupPath, projectId)
    console.log(`Restore complete: ${result.restored} restored, ${result.alreadyPresent} already present.`)
    return
  }
  if (process.argv.includes('--upload-images') && process.argv.includes('--no-image-upload')) {
    throw new Error('Do not combine --upload-images and --no-image-upload.')
  }

  const articles = loadLegacyModule('data/blog.ts', 'blogPosts')
  const testimonials = loadLegacyModule('data/testimonials.ts', 'testimonials')
  const duplicateSlugs = articles.length - new Set(articles.map((article) => article.slug)).size
  const imageReferences = new Set(articles.flatMap(getImageReferences))
  const localImageReferences = [...imageReferences].filter((url) => localPublicFile(url))
  const missingLocalImages = localImageReferences.filter((url) => {
    const filename = localPublicFile(url)
    return !filename || !fs.existsSync(filename)
  })
  const invalidArticles = articles.filter(
    (article) =>
      !article.slug ||
      !article.title ||
      !article.excerpt ||
      !article.content ||
      !article.image,
  )
  const validationErrors =
    duplicateSlugs + invalidArticles.length + missingLocalImages.length
  if (duplicateSlugs > 0) {
    throw new Error(`Source contains ${duplicateSlugs} duplicate article slugs.`)
  }

  console.log(`Project: ${process.env.FIREBASE_PROJECT_ID || 'alforsancladding'}`)
  console.log(`Articles found: ${articles.length}`)
  console.log(`Testimonials found: ${testimonials.length}`)
  console.log(`Unique image references: ${imageReferences.size}`)
  console.log(`Local images verified: ${localImageReferences.length - missingLocalImages.length}/${localImageReferences.length}`)
  console.log(`Missing local images: ${missingLocalImages.length}`)
  console.log(`Articles with missing required fields: ${invalidArticles.length}`)
  console.log(`Duplicate article slugs: ${duplicateSlugs}`)
  console.log(`Source validation errors: ${validationErrors}`)
  for (const url of missingLocalImages) console.error(`[missing local image] ${url}`)
  console.log(`Mode: ${applyChanges ? 'APPLY (writes enabled)' : 'DRY RUN (no writes)'}`)
  if (!applyChanges) {
    console.log(`Image upload: ${shouldUploadImages ? 'explicitly enabled' : 'disabled; original URLs will be preserved'}`)
    console.log('No Firebase data was changed. Run again with --apply after reviewing the counts.')
    return
  }
  if (validationErrors > 0) {
    throw new Error('Source validation must pass before Firebase writes are allowed.')
  }

  const firebase = initializeFirebase()
  const { db, storage, bucketName } = firebase
  await verifyFirebaseAccess(firebase)
  console.log('Firebase Firestore, administrator account, and Storage read access verified.')

  const backupDirectory = path.join(root, '.migration-backups')
  fs.mkdirSync(backupDirectory, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  for (const source of ['data/blog.ts', 'data/testimonials.ts']) {
    fs.copyFileSync(path.join(root, source), path.join(backupDirectory, `${path.basename(source, '.ts')}-${stamp}.ts`))
  }
  const { backupPath, snapshot } = await writeFirestoreBackup(
    db,
    backupDirectory,
    projectId,
    stamp,
  )
  const articlesBackedUp = snapshot.collections.articles.length
  const testimonialsBackedUp = snapshot.collections.testimonials.length
  console.log(`Local source and Firestore backup verified in ${path.relative(root, backupDirectory)}.`)
  console.log(`Existing Firebase records backed up: ${articlesBackedUp} articles, ${testimonialsBackedUp} testimonials.`)
  console.log(`Firestore backup file: ${path.relative(root, backupPath)}`)
  console.log(`Image upload: ${shouldUploadImages ? 'explicitly enabled' : 'disabled; original URLs will be preserved'}`)
  if (shouldUploadImages && !bucketName) {
    console.warn('Firebase Storage bucket is not configured; image URLs will remain unchanged.')
  }

  const summary = {
    articlesRead: articles.length,
    articlesMigrated: 0,
    articlesSkipped: 0,
    articlesFailed: 0,
    testimonialsRead: testimonials.length,
    testimonialsMigrated: 0,
    testimonialsSkipped: 0,
    testimonialsFailed: 0,
  }

  for (const article of articles) {
    try {
      const result = await migrateArticle(db, storage, bucketName, article)
      summary[result === 'migrated' ? 'articlesMigrated' : 'articlesSkipped'] += 1
      console.log(`[${result}] article: ${article.slug}`)
    } catch (error) {
      summary.articlesFailed += 1
      console.error(`[failed] article ${article.slug}:`, error)
    }
  }

  for (const testimonial of testimonials) {
    try {
      const result = await migrateTestimonial(db, testimonial)
      summary[result === 'migrated' ? 'testimonialsMigrated' : 'testimonialsSkipped'] += 1
      console.log(`[${result}] testimonial: ${testimonial.id}`)
    } catch (error) {
      summary.testimonialsFailed += 1
      console.error(`[failed] testimonial ${testimonial.id}:`, error)
    }
  }

  console.log('\nMigration summary:')
  console.log(JSON.stringify(summary, null, 2))
  console.log(`Images uploaded/reused: ${uploadedImageUrls.size}`)
  console.log(`Image issues (original paths retained): ${imageErrors.length}`)
  for (const issue of imageErrors) console.error(JSON.stringify(issue))
  if (summary.articlesFailed || summary.testimonialsFailed) process.exitCode = 1
}

main().catch((error) => {
  console.error('Migration stopped:', error instanceof Error ? error.message : error)
  process.exitCode = 1
})
