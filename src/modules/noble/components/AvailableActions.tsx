'use client'

import { useNobleStore } from '../store'
import { SPECIAL_ACTIONS, type SpecialAction } from '../types/actions'
import { rankRequirements } from '../constants'
import { NobleRank } from '../types'

export function AvailableActions() {
  const noble = useNobleStore(state => state.noble)

  if (!noble) return null

  const canPerformAction = (action: SpecialAction): boolean => {
    if (action.requirements.rank && 
        rankRequirements[action.requirements.rank as NobleRank].influence > noble.resources.influence) {
      return false
    }

    if (action.requirements.territories && 
        noble.stats.territoriesOwned < action.requirements.territories) {
      return false
    }

    if (action.requirements.influence && 
        noble.resources.influence < action.requirements.influence) {
      return false
    }

    if (action.requirements.achievements && 
        noble.achievements.total < action.requirements.achievements) {
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

  const availableActions = Object.values(SPECIAL_ACTIONS).filter(action => {
    const ranks: NobleRank[] = ['baron', 'viscount', 'count', 'marquess', 'duke']
    const rankIndex = ranks.indexOf(noble.rank)
    const requiredRankIndex = action.requirements.rank ? 
      ranks.indexOf(action.requirements.rank as NobleRank) : 0

    return rankIndex >= requiredRankIndex
  })

  return (
    <div className="space-y-4">
      {availableActions.map(action => {
        const isAvailable = canPerformAction(action)
        
        return (
          <div 
            key={action.type}
            className={`p-4 rounded-lg border ${
              isAvailable 
                ? 'bg-card hover:bg-accent/50 cursor-pointer' 
                : 'bg-card/50 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medieval text-lg">{action.name}</h3>
              <div className="flex items-center gap-2 text-sm">
                {action.cost.gold && (
                  <span className="flex items-center gap-1">
                    <span className="text-yellow-500">🪙</span>
                    {action.cost.gold}
                  </span>
                )}
                {action.cost.influence && (
                  <span className="flex items-center gap-1">
                    <span className="text-blue-500">⚜️</span>
                    {action.cost.influence}
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {action.description}
            </p>
            <div className="text-xs text-muted-foreground">
              Перезарядка: {action.cooldown} часов
            </div>
          </div>
        )
      })}
    </div>
  )
}
