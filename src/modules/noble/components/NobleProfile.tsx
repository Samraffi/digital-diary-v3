'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardHeader, CardContent } from '@/shared/ui/card'
import { initializeNoble, setNoble } from '../redux/nobleSlice'
import type { RootState } from '@/lib/redux/store'
import { useGameNotifications } from '@/lib/hooks/useGameNotifications'
import { motion, AnimatePresence } from 'framer-motion'

export function NobleProfile() {
  const dispatch = useDispatch()
  const noble = useSelector((state: RootState) => state.noble.noble)
  const { notifyAchievement } = useGameNotifications()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(noble?.id || '')

  // Initial setup screen when there's no noble data
  if (!noble) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-slate-800/90 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/10"
        >
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
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
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Добро пожаловать в мир дворянства!</h2>
              <p className="text-gray-400">Для начала, давайте создадим ваш профиль дворянина.</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white text-center focus:border-white/30 focus:ring-2 focus:ring-white/10 focus:outline-none transition-all"
                  placeholder="Введите ваше имя"
                />
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
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
                </div>
              </div>

              <button
                onClick={() => {
                  if (name.trim()) {
                    dispatch(initializeNoble(name.trim()))
                    notifyAchievement('Профиль создан', `Добро пожаловать, ${name.trim()}!`)
                  }
                }}
                disabled={!name.trim()}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                Создать профиль
              </button>
            </div>

            <div className="text-sm text-gray-400">
              Ваше имя будет использоваться для идентификации в игре
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  const handleSave = () => {
    if (name.trim()) {
      dispatch(setNoble({ ...noble, id: name.trim() }))
      notifyAchievement('Имя изменено', `Новое имя: ${name.trim()}`)
      setIsEditing(false)
    }
  }

  // Calculate experience percentage
  const experiencePercentage = noble 
    ? Math.floor((noble.experience / noble.experienceForNextLevel) * 100)
    : 0;

  // Calculate total experience multiplier
  const totalMultiplier = noble
    ? (noble.experienceMultipliers.level * 
       noble.experienceMultipliers.rank * 
       noble.experienceMultipliers.bonus).toFixed(2)
    : '1.00';

  return (
    <div className="space-y-8">
      <Card gradient="from-indigo-500/20 to-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            {isEditing ? (
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  placeholder="Введите имя"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={() => {
                      setName(noble.id)
                      setIsEditing(false)
                    }}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{noble.id}</h2>
                  <p className="text-gray-400">{noble.rank}</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                >
                  Изменить
                </button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>
      
      {/* Stats Section */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold text-white">Статистика</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Уровень</div>
              <div className="text-xl font-bold text-white">{noble?.level}</div>
              <div className="mt-2">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${experiencePercentage}%` }}
                  />
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {noble?.experience} / {noble?.experienceForNextLevel} XP
                </div>
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Множители опыта</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Уровень:</span>
                  <span className="text-white">×{noble?.experienceMultipliers.level.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ранг:</span>
                  <span className="text-white">×{noble?.experienceMultipliers.rank.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Бонус:</span>
                  <span className="text-white">×{noble?.experienceMultipliers.bonus.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2">
                  <span className="text-gray-400">Итого:</span>
                  <span className="text-white font-bold">×{totalMultiplier}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Section */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold text-white">Ресурсы</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Золото</div>
              <div className="text-xl font-bold text-white">{noble?.resources.gold}</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Влияние</div>
              <div className="text-xl font-bold text-white">{noble?.resources.influence}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
