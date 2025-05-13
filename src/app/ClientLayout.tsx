'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { withPageTransition } from '@/lib/hooks/usePageTransition'
import { TerritoryProvider } from '@/modules/territory/providers/TerritoryProvider'
import { Card } from '@/shared/ui/Card'
import { TopHeader } from '@/shared/ui/TopHeader'
import { Toaster } from 'react-hot-toast'
import { TestControls } from '@/shared/ui/TestControls'

const tabs = [
  { name: 'Главный зал', path: '/main' },
  { name: 'Территории', path: '/territories' },
  { name: 'Летопись', path: '/history' },
  { name: 'Дневник', path: '/journal' },
  { name: 'Достижения', path: '/achievements' },
  { name: 'Рынок', path: '/market' },
  { name: 'Дорога к величию', path: '/road-to-glory' },
]

function ClientLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <TerritoryProvider>
      <div className="min-h-screen">
        <Toaster />
        <TestControls />
        {/* Верхний хедер */}
        <TopHeader />

        {/* Основной контент с отступом под верхний хедер */}
        <div className="container mx-auto px-4 pt-20 pb-8 lg:pb-12 max-w-7xl">
          {/* Основная навигация */}
          <nav className="mb-8">
            <Card gradient="from-indigo-500/20 to-purple-500/20" className="p-2 lg:p-4">
              <div className="flex items-center overflow-x-auto scrollbar-hide">
                {tabs.map(tab => {
                  const isActive = pathname === tab.path
                  return (
                    <Link
                      key={tab.path}
                      href={tab.path}
                      className={`
                        whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${isActive
                          ? 'bg-white/10 text-white'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      {tab.name}
                    </Link>
                  )
                })}
              </div>
            </Card>
          </nav>

          {/* Основной контент */}
          <main className="min-h-[calc(100vh-12rem)]">
            {children}
          </main>

          {/* Нижний градиент */}
          <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
        </div>
      </div>
    </TerritoryProvider>
  )
}

export default withPageTransition(ClientLayout)
