icons: { icon: imgUrl('favicon.png') },import type { Metadata, Viewport } from 'next'
import { Heebo, Rubik } from 'next/font/google'
import { imgUrl } from '@/lib/assets'
import './globals.css'

const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  weight: ['700', '800', '900'],
  variable: '--font-rubik',
  display: 'swap',
})

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '700', '800', '900'],
  variable: '--font-heebo',
  display: 'swap',
})

// לפני עלייה לאוויר: להגדיר NEXT_PUBLIC_SITE_URL לדומיין האמיתי
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bigcoach.example'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'BIG COACH, גולן בובליל | ליווי תזונה ואימונים',
  description:
    'ליווי אישי צמוד לאימונים, תזונה ומנטליות. גולן בובליל, באר שבע והדרום. אונליין בכל הארץ.',
  icons: { icon: imgUrl('logo.png') },
  openGraph: {
    type: 'website',
    title: 'BIG COACH, גולן בובליל | ליווי תזונה ואימונים',
    description: 'ליווי אישי צמוד לאימונים, תזונה ומנטליות. שיחת היכרות 20 דקות, בלי עלות.',
    images: [imgUrl('hero.jpg')],
    locale: 'he_IL',
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#232323',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} ${heebo.variable}`}>
      <body>
        <link rel="preconnect" href="https://ypujlwhqccutmscfrnuz.supabase.co" crossOrigin="anonymous" />
        {children}
      </body>
    </html>
  )
}
