'use client'

import { useState } from 'react'
import { useNobleStore } from '../store'
import { Card, CardHeader, CardContent } from '@/shared/ui/Card'
import { useGameNotifications } from '@/lib/hooks/useGameNotifications'

export function NobleProfile() {
  const noble = useNobleStore(state => state.noble)
  const updateNoble = useNobleStore(state => state.updateNoble)
  const { notifyAchievement } = useGameNotifications()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(noble?.id || '')

  if (!noble) return null

  const handleSave = () => {
    if (name.trim()) {
      updateNoble({ id: name.trim() })
      notifyAchievement('Имя изменено', `Новое имя: ${name.trim()}`)
      setIsEditing(false)
    }
  }

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
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Характеристики</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Уровень</span>
                  <span className="text-white font-medium">{noble.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Опыт</span>
                  <span className="text-white font-medium">
                    {noble.experience} / {noble.experienceForNextLevel}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${(noble.experience / noble.experienceForNextLevel) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Достижения</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-amber-500">🏆</span>
                    <span className="text-gray-400">Всего</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{noble.achievements.total}</p>
                </div>
                <div className="p-4 rounded-lg bg-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-purple-500">🏰</span>
                    <span className="text-gray-400">Территории</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{noble.stats.territoriesOwned}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Кошелек */}
      <Card gradient="from-amber-500/20 to-yellow-500/20">
        <CardHeader>
          <h2 className="text-xl font-bold text-white">Ресурсы</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Золото</span>
                <span className="text-yellow-500 font-bold">{noble.resources.gold}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
                  style={{ width: `${Math.min((noble.resources.gold / 1000) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Влияние</span>
                <span className="text-blue-500 font-bold">{noble.resources.influence}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  style={{ width: `${Math.min((noble.resources.influence / 1000) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
