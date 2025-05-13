'use client'

import { useTerritoryStore } from '@/modules/territory/store'
import { useNobleStore } from '@/modules/noble/store'
import { Card } from '@/shared/ui/Card'
import { SPECIAL_ACTIONS, type SpecialAction } from '../types/actions'
import { useGameNotifications } from '@/lib/hooks/useGameNotifications'
import { NobleRank } from '../types'
import { rankRequirements } from '../constants'

export function RoyalMarket() {
  const noble = useNobleStore(state => state.noble)
  const { addTerritory } = useTerritoryStore()
  const { notifyError, notifyAchievement } = useGameNotifications()
  const removeResources = useNobleStore(state => state.removeResources)

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
      notifyError('Недостаточно ресурсов', 'У вас не хватает ресурсов для покупки')
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {territories.map(action => {
          const isAvailable = canPerformAction(action)
          
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
                  : 'bg-white/5 opacity-50 cursor-not-allowed border-white/10'
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
              <p className="text-sm text-gray-400">
                {action.description}
              </p>
              {!isAvailable && action.requirements.rank && (
                <p className="text-xs text-red-400 mt-2">
                  Требуется ранг: {action.requirements.rank}
                </p>
              )}
            </button>
          )
        })}
      </div>
    </Card>
  )
}
