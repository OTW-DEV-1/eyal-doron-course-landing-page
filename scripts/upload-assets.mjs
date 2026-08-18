#!/usr/bin/env node
/**
 * Mirrors public/assets into a Supabase Storage bucket.
 *
 *   1. Create a Supabase project.
 *   2. Copy .env.example to .env.local and fill in the three SUPABASE values.
 *      SUPABASE_SECRET_KEY must be a secret key (sb_secret_...) from
 *      Settings -> API Keys. A publishable key cannot write to storage.
 *   3. npm run upload-assets
 *
 * The bucket is created public if it does not exist. Re-running is safe: files
 * are upserted, so this doubles as the way to push updated artwork.
 *
 * Once NEXT_PUBLIC_SUPABASE_URL is set, src/lib/assets.ts serves every image
 * from Supabase instead of /public — the paths are identical on both sides.
 */
import { createClient } from '@supabase/supabase-js'
import { readdir, readFile } from 'node:fs/promises'
import { join, relative, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const ASSETS_DIR = join(ROOT, 'public', 'assets')

// Load .env.local without adding a dotenv dependency.
try {
  const env = await readFile(join(ROOT, '.env.local'), 'utf8')
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
} catch {
  // No .env.local — fall back to the ambient environment.
}

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL
// SUPABASE_SERVICE_ROLE_KEY is the pre-2025 name for the same credential;
// still accepted so existing .env files and deploy configs keep working.
const KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? 'site-assets'

if (!URL_ || !KEY) {
  console.error(
    'Missing config. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY\n' +
      'in .env.local (see .env.example), then re-run `npm run upload-assets`.',
  )
  process.exit(1)
}

// The publishable key is the prominent one in the dashboard, so it is the easy
// one to grab by mistake. It cannot write to storage, and without this check the
// failure surfaces as an opaque permissions error on the first upload.
if (KEY.startsWith('sb_publishable_')) {
  console.error('That is a publishable key. Uploading needs the secret key (sb_secret_...) from Settings -> API Keys.')
  process.exit(1)
}

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
}

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

const supabase = createClient(URL_, KEY, { auth: { persistSession: false } })

const { data: buckets, error: listErr } = await supabase.storage.listBuckets()
if (listErr) {
  console.error('Could not list buckets:', listErr.message)
  process.exit(1)
}

if (!buckets.some((b) => b.name === BUCKET)) {
  console.log(`Creating public bucket "${BUCKET}"…`)
  const { error } = await supabase.storage.createBucket(BUCKET, { public: true })
  if (error) {
    console.error('Could not create bucket:', error.message)
    process.exit(1)
  }
}

const files = await walk(ASSETS_DIR)
console.log(`Uploading ${files.length} files to ${BUCKET}…`)

let ok = 0
let failed = 0
for (const file of files) {
  const key = relative(ASSETS_DIR, file).split('\\').join('/')
  const body = await readFile(file)
  const { error } = await supabase.storage.from(BUCKET).upload(key, body, {
    contentType: MIME[extname(file).toLowerCase()] ?? 'application/octet-stream',
    upsert: true,
    cacheControl: '31536000',
  })
  if (error) {
    console.error(`  ✗ ${key}: ${error.message}`)
    failed++
  } else {
    console.log(`  ✓ ${key}`)
    ok++
  }
}

console.log(`\nDone: ${ok} uploaded, ${failed} failed.`)
console.log(`Public URL prefix: ${URL_}/storage/v1/object/public/${BUCKET}/`)
process.exit(failed ? 1 : 0)
