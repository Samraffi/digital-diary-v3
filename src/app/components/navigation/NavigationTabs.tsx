'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Card } from '@/shared/ui/card'

const tabs = [
  { name: 'Главный зал', path: '/main' },
  { name: 'Территории', path: '/territories' },
  { name: 'Летопись', path: '/history' },
  { name: 'Дневник', path: '/journal' },
  { name: 'Достижения', path: '/achievements' },
  { name: 'Рынок', path: '/market' },
  { name: 'Дорога к величию', path: '/road-to-glory' },
]

export const NavigationTabs = () => {
  const pathname = usePathname()

  return (
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
  )
} 