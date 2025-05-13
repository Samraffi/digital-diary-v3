'use client'

import { useNobleStore } from '../store'
import { Card } from '@/shared/ui/Card'
import { SPECIAL_ACTIONS } from '../types/actions'

export function ImperialQuests() {
  const noble = useNobleStore(state => state.noble)

  if (!noble) return null

  const territoryActions = Object.values(SPECIAL_ACTIONS).filter(a => a.category === 'territory')

  return (
    <Card gradient="from-purple-500/20 to-pink-500/20" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Покупка территорий</h2>
          <p className="text-gray-300">Расширяйте свои владения, приобретая новые территории</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {territoryActions.map(action => (
          <div
            key={action.type}
            className="p-4 rounded-lg border border-purple-500/50 bg-white/10"
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
            {action.requirements && (
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <span>Требуется:</span>
                {action.requirements.rank && (
                  <span className="text-purple-400">👑 {action.requirements.rank}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
