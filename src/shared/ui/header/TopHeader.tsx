'use client'

import { useState, useRef } from 'react'
import { useNobleStore } from '@/modules/noble/store'
import Link from 'next/link'
import { useKeyPress } from '../hooks/useKeyPress'
import { ResourceDisplay } from './ResourceDisplay'
import { DropdownType } from './types'

export function TopHeader() {
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>('none')
  const { noble } = useNobleStore()
  const influenceButtonRef = useRef<HTMLButtonElement>(null)

  const closeDropdowns = () => {
    if (activeDropdown !== 'none') {
      setActiveDropdown('none')
    }
  }

  useKeyPress('Escape', closeDropdowns)

  const toggleDropdown = (dropdown: DropdownType) => {
    setActiveDropdown(current => current === dropdown ? 'none' : dropdown)
  }

  if (!noble) return null

  return (
    <header className="fixed left-0 right-0 top-0 z-40 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/main" className="text-xl font-semibold text-white">
            <img className='w-8' src="/logo.png" alt="logo" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ResourceDisplay
            icon="⚜️"
            value={noble.resources.influence}
            onClick={() => toggleDropdown('influence')}
            buttonRef={influenceButtonRef}
            showDropdown={activeDropdown === 'influence'}
            onDropdownClose={closeDropdowns}
          />
          <ResourceDisplay
            icon="🪙"
            value={noble.resources.gold}
          />
          <ResourceDisplay
            icon="⭐"
            value={noble.level}
          />
        </div>
      </div>
    </header>
  )
} 