'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function CreateProfileModal() {
  const router = useRouter()

  useEffect(() => {
    // Автоматически перенаправляем на страницу профиля через 3 секунды
    const timeout = setTimeout(() => {
      router.push('/profile')
    }, 3000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-slate-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/10"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Требуется создание профиля
            </h2>
            <p className="text-gray-300 mb-6">
              Для доступа к этому разделу необходимо создать профиль дворянина. Сейчас вы будете перенаправлены на страницу создания профиля.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => router.push('/profile')}
                className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300 hover:scale-105"
              >
                Перейти к созданию профиля
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
} 