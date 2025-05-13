'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useNobleStore } from '@/modules/noble/store'
import { motion } from 'framer-motion'

export function Navigation() {
  const pathname = usePathname()
  const noble = useNobleStore(state => state.noble)

  const routes = [
    { href: '/', label: 'Главная', icon: '🏰' },
    { href: '/throne-room/main', label: 'Тронный зал', icon: '👑' },
    { href: '/diary', label: 'Дневник', icon: '📖' },
    { href: '/schedule', label: 'Расписание', icon: '📅' }
  ]

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-slate-100/80 dark:bg-background/80 border-b border-slate-200/20">
      <div className="container mx-auto px-4 max-w-7xl">
        <nav className="flex items-center justify-between h-16">
          {/* Основная навигация */}
          <ul className="flex items-center gap-1">
            {routes.map((({ href, label, icon }) => {
              const isActive = pathname === href || pathname?.startsWith(href) && href !== '/'

              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    relative whitespace-nowrap px-3 mx-6 py-3 rounded-lg text-sm font-medium
                    transition-all duration-300 hover:scale-[1.02]
                    ${isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/15'}
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute inset-0 mr-3 bg-white/25 rounded-lg"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  {/* <span className="relative z-10 text-base">{tab.name}</span> */}
                  <span className="flex items-center gap-1.5">
                    <span>{icon}</span>
                    <span>{label}</span>
                  </span>
                </Link>
              )
            }))}
          </ul>

          {/* Статус дворянина */}
          {noble && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-yellow-500">
                    <span className="text-xs">💰</span>
                  </div>
                  <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500">
                    <span className="text-xs">👑</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-xs font-medium">{noble.resources.gold.toLocaleString()}</p>
                  <p className="text-xs font-medium">{noble.resources.influence.toLocaleString()}</p>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200/20" />
              <div className="flex items-center gap-2">
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-400">
                  <span className="text-sm">⚜️</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium leading-tight">
                    {`${noble.rank.charAt(0).toUpperCase() + noble.rank.slice(1)} ${noble.id}`}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Уровень {noble.level}
                  </p>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
