import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/lib/providers'
import '@/styles/globals.css'

// const inter = Inter({ subsets: ['latin', 'cyrillic'] })
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Territory Management',
  description: 'Manage your territories and schedules',
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
