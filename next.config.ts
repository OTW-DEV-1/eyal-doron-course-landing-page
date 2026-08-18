import type { NextConfig } from 'next'
import { execSync } from 'node:child_process'

/**
 * Build stamp: the short git SHA of the commit this server was built (or, in
 * dev, started) from. Rendered as <meta name="build-commit"> so anyone can
 * confirm in seconds which version a browser is actually showing —
 * view-source and search "build-commit", or in the console:
 *   document.querySelector('meta[name="build-commit"]').content
 * In dev the value is fixed at server start; if it lags `git log`, the dev
 * server needs a restart.
 */
let buildCommit = 'unknown'
try {
  buildCommit = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
    .toString()
    .trim()
} catch {
  // Not a git checkout (e.g. some CI tarballs) — the stamp stays "unknown".
}

/**
 * Images are served from Supabase Storage in production and from /public/assets
 * in local development. Whitelist the Supabase host so next/image can optimise
 * remote files. NEXT_PUBLIC_SUPABASE_URL looks like https://<ref>.supabase.co.
 */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_BUILD_COMMIT: buildCommit },
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: 'https', hostname: supabaseHost, pathname: '/storage/v1/object/public/**' }]
      : [],
  },
}

export default nextConfig
