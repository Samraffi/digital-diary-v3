'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  {
    name: 'Обзор',
    href: '/',
    icon: '🏰'
  },
  {
    name: 'Тронный Зал',
    href: '/throne-room',
    icon: '👑'
  },
  {
    name: 'Распорядок',
    href: '/schedule',
    icon: '⏰'
  },
  {
    name: 'Дневник',
    href: '/diary',
    icon: '📖'
  }
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="w-64 h-screen sticky top-0 bg-background/80 backdrop-blur-sm border-r border-border p-4">
      <div className="flex flex-col space-y-2">
        {navigation.map(({ name, href, icon }) => {
          const isActive = pathname === href

          return (
            <Link
              key={name}
              href={href}
              className={`
                px-3 py-2 rounded-md text-sm font-medieval
                transition-colors duration-200
                ${isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground/60 hover:text-foreground hover:bg-accent'
                }
              `}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{icon}</span>
                <span>{name}</span>
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
