import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/lib/providers'
import { Navigation } from '@/shared/ui/Navigation'
import '@/styles/globals.css'
import '@/styles/animations.css'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
})

export const metadata: Metadata = {
  title: 'Digital Diary',
  description: 'Цифровой дневник для отслеживания личного прогресса',
  manifest: '/manifest.json'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen">
            <Navigation />
            <main className="flex-1 p-4 md:p-6">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
