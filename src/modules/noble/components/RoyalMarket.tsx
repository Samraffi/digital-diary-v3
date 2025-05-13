'use client'

import { useTerritoryStore } from '@/modules/territory/store'
import { useNobleStore } from '@/modules/noble/store'
import { Card } from '@/shared/ui/Card'
import { SPECIAL_ACTIONS, type SpecialAction } from '../types/actions'
import { useGameNotifications } from '@/lib/hooks/useGameNotifications'
import { NobleRank } from '../types'
import { rankRequirements } from '../constants'
import { useEffect } from 'react'

function ProgressBar({ current, max, color = 'amber' }: { 
  current: number
  max: number
  color?: 'amber' | 'blue' | 'purple'
}) {
  const percentage = Math.min(Math.floor((current / max) * 100), 100)
  return (
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-full ${
          color === 'amber' ? 'bg-amber-500' :
          color === 'blue' ? 'bg-blue-500' :
          'bg-purple-500'
        }`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

export function RoyalMarket() {
  const noble = useNobleStore(state => state.noble)
  const { addTerritory } = useTerritoryStore()
  const { notifyError, notifyAchievement, notifyInfo } = useGameNotifications()
  const removeResources = useNobleStore(state => state.removeResources)

  // Показываем приветственное сообщение при первом посещении рынка
  useEffect(() => {
    if (noble) {
      notifyInfo(
        'Добро пожаловать на Королевский Рынок!',
        `У вас ${noble.resources.influence} единиц влияния. Для покупки территорий нужно накопить больше влияния через выполнение заданий и достижения. Самая доступная территория - деревня (требуется 200 влияния).`
      )
    }
  }, [])

  if (!noble) return null

  const canPerformAction = (action: SpecialAction): boolean => {
    if (action.requirements.rank && 
        rankRequirements[action.requirements.rank as NobleRank].influence > noble.resources.influence) {
      return false
    }

    if (action.cost.gold && noble.resources.gold < action.cost.gold) {
      return false
    }

    if (action.cost.influence && noble.resources.influence < action.cost.influence) {
      return false
    }

    return true
  }

  const handlePurchase = async (action: SpecialAction) => {
    if (!canPerformAction(action)) {
      const missingResources = []
      if (action.cost.gold && noble.resources.gold < action.cost.gold) {
        missingResources.push(`${action.cost.gold - noble.resources.gold} золота`)
      }
      if (action.cost.influence && noble.resources.influence < action.cost.influence) {
        missingResources.push(`${action.cost.influence - noble.resources.influence} влияния`)
      }
      if (action.requirements.rank && 
          rankRequirements[action.requirements.rank as NobleRank].influence > noble.resources.influence) {
        missingResources.push(`ранг ${action.requirements.rank}`)
      }

      notifyError(
        'Недостаточно ресурсов', 
        `Не хватает: ${missingResources.join(', ')}`
      )
      return
    }

    if (action.category === 'territory') {
      const territoryType = action.type.replace('buy-', '') as any
      try {
        removeResources(action.cost)
        await addTerritory(territoryType)
        notifyAchievement('Покупка успешна', `Вы приобрели ${action.name.toLowerCase()}`)
      } catch (error) {
        notifyError('Ошибка', 'Не удалось совершить покупку')
      }
    }
  }

  const territories = Object.values(SPECIAL_ACTIONS).filter(a => a.category === 'territory')

  return (
    <Card gradient="from-yellow-500/20 to-amber-500/20" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Королевский Рынок</h2>
          <p className="text-gray-300">Приобретайте новые территории и ресурсы</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">💰</span>
              <span className="text-white font-bold">{noble.resources.gold}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500">👑</span>
              <span className="text-white font-bold">{noble.resources.influence}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {territories.map(action => {
          const isAvailable = canPerformAction(action)
          const goldProgress = action.cost.gold 
            ? noble.resources.gold / action.cost.gold 
            : 1
          const influenceProgress = action.cost.influence 
            ? noble.resources.influence / action.cost.influence 
            : 1
          
          return (
            <button
              key={action.type}
              onClick={() => handlePurchase(action)}
              disabled={!isAvailable}
              className={`
                relative p-4 rounded-lg border text-left
                transition-all duration-200
                ${isAvailable 
                  ? 'bg-white/10 hover:bg-white/20 cursor-pointer border-amber-500/50' 
                  : 'bg-white/5 opacity-75 cursor-not-allowed border-white/10'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medieval text-lg">{action.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  {action.cost.gold && (
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-500">💰</span>
                      {action.cost.gold}
                    </span>
                  )}
                  {action.cost.influence && (
                    <span className="flex items-center gap-1">
                      <span className="text-blue-500">👑</span>
                      {action.cost.influence}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-400 mb-3">
                {action.description}
              </p>

              <div className="space-y-2">
                {action.cost.gold && (
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Золото</span>
                      <span className="text-yellow-500">
                        {noble.resources.gold}/{action.cost.gold}
                      </span>
                    </div>
                    <ProgressBar 
                      current={noble.resources.gold}
                      max={action.cost.gold}
                      color="amber"
                    />
                  </div>
                )}

                {action.cost.influence && (
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Влияние</span>
                      <span className="text-blue-500">
                        {noble.resources.influence}/{action.cost.influence}
                      </span>
                    </div>
                    <ProgressBar 
                      current={noble.resources.influence}
                      max={action.cost.influence}
                      color="blue"
                    />
                  </div>
                )}
              </div>

              {!isAvailable && action.requirements.rank && (
                <div className="mt-3 text-xs text-red-400">
                  Требуется ранг: {action.requirements.rank}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </Card>
  )
}
