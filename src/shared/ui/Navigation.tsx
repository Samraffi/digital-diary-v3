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
    { href: '/main', label: 'Тронный зал', icon: '👑' },
    { href: '/diary', label: 'Дневник', icon: '📖' },
    { href: '/schedule', label: 'Расписание', icon: '📅' }
  ]

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-slate-100/80 dark:bg-background/80">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Основная навигация */}
        <nav className="flex items-center justify-center h-12 border-b border-slate-200/20">
          <ul className="flex items-center gap-1 mx-auto">
            {routes.map((({ href, label, icon }) => {
              const isActive = pathname === href || pathname?.startsWith(href) && href !== '/'

              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    relative whitespace-nowrap px-2.5 mx-2 py-2 rounded-lg text-sm font-medium
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
                  <span className="flex items-center gap-1.5">
                    <span>{icon}</span>
                    <span>{label}</span>
                  </span>
                </Link>
              )
            }))}
          </ul>
        </nav>

        {/* Статус дворянина */}
        {noble && (
          <div className="flex items-center justify-end h-8 border-b border-slate-200/20">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 cursor-help" title="Золото">
                  <span className="text-[10px]">💰</span>
                </div>
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 cursor-help" title="Влияние">
                  <span className="text-[10px]">👑</span>
                </div>
              </div>
              <div className="flex flex-col items-end text-[11px]">
                <p className="font-medium leading-none">{noble.resources.gold.toLocaleString()}</p>
                <p className="font-medium leading-none">{noble.resources.influence.toLocaleString()}</p>
              </div>
              <div className="h-5 w-px bg-slate-200/20" />
              <div className="flex items-center gap-1.5">
                <div className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-400">
                  <span className="text-[10px]">⚜️</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-[11px] font-medium leading-none">
                    {`${noble.rank.charAt(0).toUpperCase() + noble.rank.slice(1)} ${noble.id}`}
                  </p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-none mt-0.5">
                    Уровень {noble.level}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
