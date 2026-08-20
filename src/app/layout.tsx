import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'

const GTM_ID = 'GTM-5J6338JG'

const title = 'מטלנט לסופר-טלנט | ד״ר אייל דורון'
const description =
  'תהליך דיגיטלי היברידי מיוחד לארגונים, שמפתח את היכולת לחשוב אחרת ומעניק סט של כלי עבודה לחיים בעולם שלא מפסיק לרוץ.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: 'website', locale: 'he_IL' },
  robots: { index: true, follow: true },
  // Which commit this page was built from — see next.config.ts.
  other: { 'build-commit': process.env.NEXT_PUBLIC_BUILD_COMMIT ?? 'unknown' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f6f5f3',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        {/* Google Tag Manager — beforeInteractive is always injected into <head>. */}
        <Script id="gtm" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body className="overflow-x-clip">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  )
}
