# Firebase content administration

The application targets the existing Firebase project `alforsancladding` on the Spark plan. Firebase CLI authentication is active and the account can access this project. A Web app named `Alforsan Cladding Website` has been registered and its public config is in the ignored local `.env.local`. The default Firestore database exists in `nam5`; it was empty when last inspected. Authentication uses Email/Password. The existing admin account was created with an ephemeral password; verification and password-reset emails were requested, and the owner must complete those email actions. Firebase Admin credentials are not configured. The dashboard now uses Firebase's browser SDK with restrictive Firestore rules, so it does not need a service account. Firebase Storage is not used; images stay in `public/`. The reviewed Firestore rules were deployed; no content has been migrated and no billing plan has been changed.

## Configure local and production environments

1. The Web app is already registered and its public configuration is in `.env.local`. These client values are not service-account secrets.
2. The Email/Password provider and admin account are configured. The owner must use the Firebase email links to verify the account and set a new password before signing in.
3. Keep the existing default Firestore database in `nam5`; do not create another database. The deployed rules allow public reads only for published articles, approved testimonials, and minimal content-visibility metadata. All content writes and private reads require the verified `alforsancladding@gmail.com` account. Other collections deny access.
4. No Storage service is enabled or required. The editor selects existing images from `public/`; image uploads remain disabled. This avoids Blaze billing.
5. `.env.local` is already created from `.env.example` in this checkout. Only public Web app configuration is required for the dashboard; never commit the file.
6. Firebase Admin service-account values are optional and only needed for the separate legacy server API routes or CLI migration utility. If configured, keep them only in local ignored `.env.local` and production secret variables:
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY` (preserve newlines or use `\n`)
   - `FIREBASE_PROJECT_ID=alforsancladding`
   - `FIREBASE_STORAGE_BUCKET` (the exact bucket name shown in Firebase Console)
7. `ADMIN_EMAILS` is only used by the optional server-side Admin SDK routes. The browser dashboard is restricted to the same fixed administrator email in its UI and Firestore security rules.
8. Keep `NEXT_PUBLIC_ADMIN_IMAGE_UPLOADS_ENABLED=false`. The admin editor can select images already in `public/` without Firebase Storage.
9. In Vercel, configure only the public Firebase Web app values for the free browser-based dashboard. Never commit `.env.local`, a service-account JSON file, or private keys.

If using a service-account JSON environment variable instead of the two credential variables, set `FIREBASE_SERVICE_ACCOUNT_JSON` to the complete JSON value and do not commit it.

## Security rules

`firestore.rules` grants read access only to published articles, approved testimonials, and non-content visibility markers. A write or any other content read requires the exact admin email and a verified Firebase Auth token. These rules were deployed to the existing project. `storage.rules` deny all access; Storage is unused. Future rule changes must be reviewed before deployment:

```powershell
firebase deploy --only firestore:rules --project alforsancladding
```

The rules never enable public content writes. Do not deploy Storage rules or enable billing.

## Safe content migration

The current source contains 17 articles (1,180,584 HTML content characters) and 4 testimonials. The article source includes 89 unique local image references; all were found in `public/` during the local audit. The largest serialized article is approximately 237 KB, below Firestore's 1 MiB document limit.

First review the dry-run output:

```powershell
npm run migrate:content:dry
```

The CLI migration utility still requires Firebase Admin credentials. Do not run it unless credentials and a verified backup are available:

```powershell
npm run migrate:content -- --apply
```

The migration creates local source copies and a verified JSON backup of existing `articles` and `testimonials` documents in the ignored `.migration-backups/` directory before its first Firestore write. A restore command can restore missing documents from that backup and refuses to overwrite different existing records:

```powershell
node scripts/migrate-firebase-content.cjs --restore-backup .migration-backups\firestore-content-<timestamp>.json
```

It uses article slugs and stable testimonial IDs, skips existing Firestore documents without overwriting them, verifies every write, records counts and failures, and never deletes Firestore documents. Image upload is disabled by default; original site paths are preserved. Uploading images requires the explicit `--upload-images` flag and a configured Storage bucket. Do not use that flag unless the project owner approves any associated billing.

The migration is **not considered complete** until the script reports its final counts and all content and image issues have been reviewed. The legacy source files remain in place as a safety fallback.

## Administration

- Sign in: `/admin/login`
- Dashboard: `/admin`
- Existing articles remain available as legacy entries until they are migrated.
- Article edits, new articles, and moderation use the Firebase browser SDK; Firestore rules authorize every request independently of the UI.
- New articles can be saved as drafts or published. Their existing slug is immutable after creation to preserve URLs.
- Article HTML is sanitized when rendered. Existing images in `public/` can be selected in the editor. Uploads remain disabled on Spark.

The admin account must first be verified through its email link and have a password set through the reset email. Firebase Admin credentials are not required for dashboard CRUD. The current Vercel account does not have the Alforsan site project available; do not create a duplicate project.
