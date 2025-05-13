'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { withPageTransition } from '@/lib/hooks/usePageTransition'
import { TerritoryProvider } from '@/modules/territory/providers/TerritoryProvider'
import { NotificationsProvider } from '@/shared/ui/notifications/NotificationsProvider'
import { Card } from '@/shared/ui/Card'
import { TopHeader } from '@/shared/ui/TopHeader'

const tabs = [
  { name: 'Главный зал', path: '/main' },
  { name: 'Территории', path: '/territories' },
  { name: 'Летопись', path: '/history' },
  { name: 'Дневник', path: '/journal' },
  { name: 'Достижения', path: '/achievements' },
  { name: 'Рынок', path: '/market' },
  { name: 'Миссии', path: '/quests' },
  { name: 'Обучение', path: '/tutorial' },
]

function ClientLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <NotificationsProvider>
      <TerritoryProvider>
        <div className="min-h-screen">
          {/* Верхний хедер */}
          <TopHeader />

          {/* Основной контент с отступом под верхний хедер */}
          <div className="container mx-auto px-4 pt-20 pb-8 lg:pb-12 max-w-7xl">
            {/* Основная навигация */}
            <nav className="mb-8">
              <Card gradient="from-indigo-500/20 to-purple-500/20" className="p-2 lg:p-4">
                <div className="flex items-center overflow-x-auto scrollbar-hide">
                  <div className="flex gap-2 lg:gap-4 px-2">
                    {tabs.map((tab) => {
                      const isActive = pathname === tab.path

                      return (
                        <Link
                          key={tab.path}
                          href={tab.path}
                          className={`
                            relative whitespace-nowrap px-6 py-3 rounded-lg text-sm font-medium
                            transition-all duration-300 hover:scale-[1.02]
                            ${isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/15'}
                          `}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="active-tab"
                              className="absolute inset-0 bg-white/25 rounded-lg"
                              transition={{ type: "spring", duration: 0.5 }}
                            />
                          )}
                          <span className="relative z-10 text-base">{tab.name}</span>
                        </Link>
                      )
                    })}
                  </div>
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
    </NotificationsProvider>
  )
}

export default withPageTransition(ClientLayout)
