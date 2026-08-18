/**
 * Resolves an image path to its public URL.
 *
 * Images live in Supabase Storage in production. Until the bucket is created
 * (or in local dev without env vars) the identical files under /public/assets
 * are used, so the site renders correctly either way. Both sources use the same
 * relative paths — `logos/nestle.webp` resolves to the same file in both.
 *
 * Set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_BUCKET and run
 * `npm run upload-assets` to switch over.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? 'site-assets'

export function asset(path: string): string {
  const clean = path.replace(/^\/+/, '')
  if (!SUPABASE_URL) return `/assets/${clean}`
  return `${SUPABASE_URL.replace(/\/+$/, '')}/storage/v1/object/public/${BUCKET}/${clean}`
}

/** True when images are served from Supabase rather than the local /public copy. */
export const usingSupabaseAssets = Boolean(SUPABASE_URL)
