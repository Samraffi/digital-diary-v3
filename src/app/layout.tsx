import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from '@/lib/providers'
 
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: 'Digital Diary',
  description: 'A modern nobleman\'s daily planner and territory management system',
}
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className={`
        min-h-screen bg-slate-900 text-slate-100
        font-sans antialiased
      `}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
