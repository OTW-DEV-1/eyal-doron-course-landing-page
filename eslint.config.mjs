import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'project/**'] },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // Images come from Supabase Storage via a plain <img>. next/image would
      // need per-image dimensions the design does not fix, and several images
      // are deliberately oversized and positioned by CSS.
      '@next/next/no-img-element': 'off',
    },
  },
]

export default config
