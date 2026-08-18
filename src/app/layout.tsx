import type { Metadata, Viewport } from 'next'
import './globals.css'

const title = 'מטלנט לסופר-טלנט | ד״ר אייל דורון'
const description =
  'תהליך דיגיטלי היברידי מיוחד לארגונים, שמפתח את היכולת לחשוב אחרת ומעניק סט של כלי עבודה לחיים בעולם שלא מפסיק לרוץ.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: 'website', locale: 'he_IL' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f6f5f3',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="overflow-x-clip">{children}</body>
    </html>
  )
}
