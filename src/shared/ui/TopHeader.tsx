'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotifications } from './notifications/NotificationsProvider'
import { useNobleStore } from '@/modules/noble/store'
import { Card } from './Card'
import Link from 'next/link'
import { useOutsideClick } from './hooks/useOutsideClick'
import { useKeyPress } from './hooks/useKeyPress'

export function TopHeader() {
  type DropdownType = 'none' | 'notifications' | 'influence';
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>('none')
  const { notifications } = useNotifications()
  const { noble } = useNobleStore()
  const hasNotifications = notifications.length > 0
  const dropdownRef = useRef<HTMLDivElement>(null)

  const closeDropdowns = () => {
    if (activeDropdown !== 'none') {
      setActiveDropdown('none')
    }
  }

  useOutsideClick(dropdownRef, closeDropdowns)
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

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-slate-900 shadow-lg border-b border-white/10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="h-16 flex items-center justify-between">
          {/* Логотип */}
          <div className="text-white font-medium">
            <img src="/logo.png" alt="Logo" className="h-8" />
          </div>

          <div ref={dropdownRef} className="flex items-center gap-5">
            {/* Влияние */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('influence')}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors"
              >
                <span className="text-yellow-500 text-xl">👑</span>
              </button>

              <AnimatePresence mode="wait">
                {activeDropdown === 'influence' && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 right-0 z-[200] translate-x-0 overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
                  >
                    <div className="bg-slate-950 p-1">
                      <div className="h-[1px] bg-white" />
                      <Card noBg gradient="from-indigo-600 via-indigo-500 to-purple-500" className="w-64 p-3">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">👑</span>
                            <span className="text-white font-medium">{formatNumber(noble?.resources?.influence ?? 0)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">💰</span>
                            <span className="text-white font-medium">{formatNumber(noble?.resources?.gold ?? 0)}</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Колокольчик уведомлений */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('notifications')}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors relative"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {hasNotifications && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              <AnimatePresence mode="wait">
                {activeDropdown === 'notifications' && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 right-0 z-[200] translate-x-0 overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
                  >
                    <div className="bg-slate-950 p-1">
                      <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      <Card noBg gradient="from-indigo-600 via-indigo-500 to-purple-500" className="w-80 p-4">
                        <h3 className="text-white font-medium mb-3">Уведомления</h3>
                        <div className="space-y-2">
                          {notifications.length > 0 ? (
                            notifications.map(notification => (
                              <div
                                key={notification.id}
                                className="p-2 rounded bg-black hover:bg-slate-900 transition-colors"
                              >
                                <div className="font-medium text-sm text-white">{notification.title}</div>
                                <div className="text-sm text-gray-400">{notification.message}</div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-400">Нет новых уведомлений</div>
                          )}
                        </div>
                      </Card>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Аватар профиля */}
            <div className="relative">
              <Link
                href="/profile"
                className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 ring-2 ring-white/20 flex items-center justify-center group transition-all hover:ring-white/30"
              >
                <svg
                  className="w-6 h-6 text-white opacity-90 group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
