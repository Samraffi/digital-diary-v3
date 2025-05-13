'use client'

import { useNobleStore } from '../store'
import { Card } from '@/shared/ui/Card'
import { SPECIAL_ACTIONS } from '../types/actions'

export function ImperialQuests() {
  const noble = useNobleStore(state => state.noble)

  if (!noble) return null

  const quests = Object.values(SPECIAL_ACTIONS).filter(a => a.category === 'action')

  return (
    <Card gradient="from-purple-500/20 to-pink-500/20" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Императорский Указ</h2>
          <p className="text-gray-300">Важные задания и поручения от короны</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {quests.map(quest => (
          <div
            key={quest.type}
            className="p-4 rounded-lg border border-purple-500/50 bg-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medieval text-lg">{quest.name}</h3>
              <div className="flex items-center gap-4">
                {quest.rewards && (
                  <div className="flex items-center gap-2 text-sm">
                    {quest.rewards.gold && (
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-500">💰</span>
                        {quest.rewards.gold}
                      </span>
                    )}
                    {quest.rewards.influence && (
                      <span className="flex items-center gap-1">
                        <span className="text-blue-500">👑</span>
                        {quest.rewards.influence}
                      </span>
                    )}
                    {quest.rewards.experience && (
                      <span className="flex items-center gap-1">
                        <span className="text-green-500">⭐</span>
                        {quest.rewards.experience}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="text-purple-400">⏳</span>
                  {quest.cooldown}ч
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              {quest.description}
            </p>
            {quest.requirements.rank && (
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <span>Требуется:</span>
                <span className="text-purple-400">👑 {quest.requirements.rank}</span>
                {quest.requirements.territories && (
                  <span className="text-blue-400">🏰 {quest.requirements.territories}</span>
                )}
                {quest.requirements.influence && (
                  <span className="text-yellow-400">⚜️ {quest.requirements.influence}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
