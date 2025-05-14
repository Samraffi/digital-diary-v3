'use client'

import { useState } from 'react'
import { Territory } from '../types/territory'
import { Card, CardHeader, CardContent } from '@/shared/ui/card'
import { useTerritoryStore } from '../store'
import { useGameNotifications } from '@/lib/hooks/useGameNotifications'

interface TerritoryProfileProps {
  territory: Territory
}

export function TerritoryProfile({ territory }: TerritoryProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(territory.name)
  const updateTerritory = useTerritoryStore(state => state.updateTerritory)
  const { notifyAchievement } = useGameNotifications()

  const handleSave = () => {
    if (name.trim()) {
      updateTerritory(territory.id, { name: name.trim() })
      notifyAchievement('Территория переименована', `Новое название: ${name.trim()}`)
      setIsEditing(false)
    }
  }

  return (
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
                placeholder="Введите название"
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
                    setName(territory.name)
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
              <h2 className="text-2xl font-bold text-white">{territory.name}</h2>
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
                <span className="text-gray-400">Тип</span>
                <span className="text-white font-medium">{territory.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Уровень</span>
                <span className="text-white font-medium">{territory.level}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Развитие</span>
                <span className="text-white font-medium">{territory.development} / {territory.maxDevelopment}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Производство</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Золото</span>
                <span className="text-yellow-500 font-medium">+{territory.production.gold}/ч</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Влияние</span>
                <span className="text-blue-500 font-medium">+{territory.production.influence}/ч</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
