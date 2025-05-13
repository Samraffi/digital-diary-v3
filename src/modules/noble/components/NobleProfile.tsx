'use client'

import { useState } from 'react'
import { useNobleStore } from '../store'
import { Card, CardHeader, CardContent } from '@/shared/ui/Card'
import { useGameNotifications } from '@/lib/hooks/useGameNotifications'

export function NobleProfile() {
  const noble = useNobleStore(state => state.noble)
  const initializeNoble = useNobleStore(state => state.initializeNoble)
  const updateNoble = useNobleStore(state => state.updateNoble)
  const { notifyAchievement } = useGameNotifications()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(noble?.id || '')

  // Initial setup screen when there's no noble data
  if (!noble) {
    return (
      <Card gradient="from-indigo-500/20 to-purple-500/20">
        <CardHeader>
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-white mb-4">Добро пожаловать в мир дворянства!</h2>
            <p className="text-gray-400 mb-8">Для начала, давайте создадим ваш профиль дворянина.</p>
            <div className="flex flex-col items-center gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-2 w-64 rounded-lg bg-white/10 border border-white/20 text-white text-center"
                placeholder="Введите ваше имя"
              />
              <button
                onClick={() => {
                  if (name.trim()) {
                    initializeNoble(name.trim())
                    notifyAchievement('Профиль создан', `Добро пожаловать, ${name.trim()}!`)
                  }
                }}
                className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300 hover:scale-105"
              >
                Создать профиль
              </button>
            </div>
          </div>
        </CardHeader>
      </Card>
    )
  }

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
              <div className="text-xl font-bold text-white">{noble.level}</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Опыт</div>
              <div className="text-xl font-bold text-white">
                {noble.experience} / {noble.experienceForNextLevel}
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
              <div className="text-xl font-bold text-white">{noble.resources.gold}</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Влияние</div>
              <div className="text-xl font-bold text-white">{noble.resources.influence}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
