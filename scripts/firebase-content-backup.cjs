const fs = require('node:fs')
const path = require('node:path')
const adminFirestore = require('firebase-admin/firestore')

const format = 'alforsan-firestore-content-backup'
const collections = ['articles', 'testimonials']
const marker = '__firebaseBackupType'

function encodeValue(value) {
  if (value === null || typeof value !== 'object') return value
  if (Buffer.isBuffer(value)) {
    return { [marker]: 'bytes', value: value.toString('base64') }
  }

  const type = value.constructor?.name
  if (type === 'Timestamp') {
    return {
      [marker]: 'timestamp',
      seconds: value.seconds,
      nanoseconds: value.nanoseconds,
    }
  }
  if (type === 'GeoPoint') {
    return { [marker]: 'geoPoint', latitude: value.latitude, longitude: value.longitude }
  }
  if (type === 'DocumentReference' && typeof value.path === 'string') {
    return { [marker]: 'documentReference', value: value.path }
  }
  if (Array.isArray(value)) {
    return { [marker]: 'array', value: value.map(encodeValue) }
  }

  return {
    [marker]: 'object',
    value: Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, encodeValue(entry)]),
    ),
  }
}

function decodeValue(value, db) {
  if (value === null || typeof value !== 'object') return value
  const type = value[marker]
  if (type === 'timestamp') {
    return new adminFirestore.Timestamp(value.seconds, value.nanoseconds)
  }
  if (type === 'geoPoint') {
    return new adminFirestore.GeoPoint(value.latitude, value.longitude)
  }
  if (type === 'bytes') {
    return Buffer.from(value.value, 'base64')
  }
  if (type === 'documentReference') {
    return db.doc(value.value)
  }
  if (type === 'array') return value.value.map((entry) => decodeValue(entry, db))
  if (type === 'object') {
    return Object.fromEntries(
      Object.entries(value.value).map(([key, entry]) => [key, decodeValue(entry, db)]),
    )
  }
  throw new Error('Backup contains an unsupported or untagged value.')
}

function assertBackup(backup, projectId) {
  if (
    backup.format !== format ||
    backup.version !== 1 ||
    backup.projectId !== projectId ||
    backup.database !== '(default)' ||
    !backup.collections ||
    Object.keys(backup.collections).length !== collections.length ||
    collections.some((name) => !Array.isArray(backup.collections[name])) ||
    Object.keys(backup.collections).some((name) => !collections.includes(name))
  ) {
    throw new Error('Backup format or Firebase project does not match.')
  }
}

async function writeFirestoreBackup(db, backupDirectory, projectId, stamp) {
  const snapshot = {
    format,
    version: 1,
    projectId,
    database: '(default)',
    createdAt: new Date().toISOString(),
    collections: {},
  }

  for (const name of collections) {
    const result = await db.collection(name).get()
    snapshot.collections[name] = result.docs
      .map((document) => ({ id: document.id, data: encodeValue(document.data()) }))
      .sort((left, right) => left.id.localeCompare(right.id))
  }

  fs.mkdirSync(backupDirectory, { recursive: true })
  const filename = `firestore-content-${stamp}.json`
  const backupPath = path.join(backupDirectory, filename)
  const serialized = JSON.stringify(snapshot, null, 2)
  fs.writeFileSync(backupPath, serialized, { encoding: 'utf8', flag: 'wx' })

  const verified = JSON.parse(fs.readFileSync(backupPath, 'utf8'))
  assertBackup(verified, projectId)
  for (const name of collections) {
    const expected = snapshot.collections[name]
    const actual = verified.collections[name]
    if (
      !Array.isArray(actual) ||
      actual.length !== expected.length ||
      actual.some(
        (record, index) =>
          record.id !== expected[index].id ||
          JSON.stringify(record.data) !== JSON.stringify(expected[index].data),
      ) ||
      expected.some(
        (record) =>
          JSON.stringify(encodeValue(decodeValue(record.data, db))) !==
          JSON.stringify(record.data),
      )
    ) {
      throw new Error(`Firestore backup verification failed for collection ${name}.`)
    }
  }
  return { backupPath, snapshot }
}

async function restoreFirestoreBackup(db, backupPath, projectId) {
  const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'))
  assertBackup(backup, projectId)
  let restored = 0
  let alreadyPresent = 0

  for (const name of collections) {
    const records = backup.collections[name] || []
    const ids = new Set()
    for (const record of records) {
      if (!record || typeof record.id !== 'string' || !record.id || record.id.includes('/')) {
        throw new Error(`Backup contains an invalid document ID in ${name}.`)
      }
      if (ids.has(record.id)) throw new Error(`Backup contains duplicate IDs in ${name}.`)
      ids.add(record.id)

      const ref = db.collection(name).doc(record.id)
      const expected = decodeValue(record.data, db)
      const current = await ref.get()
      if (current.exists) {
        if (
          JSON.stringify(encodeValue(current.data())) !==
          JSON.stringify(encodeValue(expected))
        ) {
          throw new Error(`Refusing to overwrite a different existing document: ${name}/${record.id}.`)
        }
        alreadyPresent += 1
        continue
      }

      await ref.create(expected)
      const saved = await ref.get()
      if (
        !saved.exists ||
        JSON.stringify(encodeValue(saved.data())) !== JSON.stringify(encodeValue(expected))
      ) {
        throw new Error(`Restore verification failed for ${name}/${record.id}.`)
      }
      restored += 1
    }
  }

  return { restored, alreadyPresent }
}

module.exports = { restoreFirestoreBackup, writeFirestoreBackup }
