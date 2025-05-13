'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useNobleStore } from '@/modules/noble/store'
import { Card } from './Card'
import Link from 'next/link'
import { useOutsideClick } from './hooks/useOutsideClick'
import { useKeyPress } from './hooks/useKeyPress'

interface DropdownProps {
  onClose: () => void
  children: React.ReactNode
  buttonRef: React.RefObject<HTMLButtonElement>
}

function Dropdown({ onClose, children, buttonRef }: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  useOutsideClick([dropdownRef, buttonRef], onClose)

  return createPortal(
    <div
      ref={dropdownRef}
      className="fixed right-0 top-16 z-50 animate-in fade-in slide-in-from-top-5 duration-200"
    >
      {children}
    </div>,
    document.body
  )
}

export function TopHeader() {
  type DropdownType = 'none' | 'influence'
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

  const formatNumber = (num: number, decimals: number = 0) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num)
  }

  if (!noble) return null

  return (
    <header className="fixed left-0 right-0 top-0 z-40 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/main" className="text-xl font-semibold text-white">
            Digital Diary
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Влияние */}
          <div className="relative">
            <button
              ref={influenceButtonRef}
              onClick={() => toggleDropdown('influence')}
              className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-white transition-colors hover:bg-slate-700"
            >
              <span className="font-medium">⚜️ {formatNumber(noble.resources.influence)}</span>
            </button>

            <AnimatePresence>
              {activeDropdown === 'influence' && (
                <Dropdown onClose={closeDropdowns} buttonRef={influenceButtonRef}>
                  <div className="p-1">
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <Card
                      noBg
                      gradient="from-indigo-800 via-indigo-900 to-indigo-950"
                      className="w-80 p-4"
                    >
                      <h3 className="text-white font-medium mb-3">Влияние</h3>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-200">
                          Влияние - это мера вашего могущества и власти. Оно необходимо для:
                        </div>
                        <ul className="list-disc list-inside text-sm text-gray-200 space-y-1">
                          <li>Повышения ранга</li>
                          <li>Расширения территорий</li>
                          <li>Найма советников</li>
                        </ul>
                      </div>
                    </Card>
                  </div>
                </Dropdown>
              )}
            </AnimatePresence>
          </div>

          {/* Золото */}
          <div className="rounded-lg bg-slate-800 px-3 py-1.5">
            <span className="text-sm font-medium text-white">
              🪙 {formatNumber(noble.resources.gold)}
            </span>
          </div>

          {/* Опыт */}
          <div className="rounded-lg bg-slate-800 px-3 py-1.5">
            <span className="text-sm font-medium text-white">
              ⭐ {noble.level}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
