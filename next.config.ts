import type { NextConfig } from 'next'

/**
 * Images are served from Supabase Storage in production and from /public/assets
 * in local development. Whitelist the Supabase host so next/image can optimise
 * remote files. NEXT_PUBLIC_SUPABASE_URL looks like https://<ref>.supabase.co.
 */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: 'https', hostname: supabaseHost, pathname: '/storage/v1/object/public/**' }]
      : [],
  },
}

export default nextConfig
