'use client'

import { useNoblePathProgress } from '@/lib/hooks/useNoblePathProgress'
import { useNobleStore } from '../store'
import { NOBLE_PATHS } from '../types/noble-path'

export function AchievementsList() {
  const { completedPaths } = useNoblePathProgress()
  const noble = useNobleStore(state => state.noble)

  if (!noble) return null

  const sortedAchievements = [...Object.values(NOBLE_PATHS)].sort((a, b) => {
    const aCompleted = completedPaths.includes(a.id)
    const bCompleted = completedPaths.includes(b.id)
    if (aCompleted && !bCompleted) return -1
    if (!aCompleted && bCompleted) return 1
    return 0
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Достижения</h3>
        <span className="text-sm text-muted-foreground">
          {completedPaths.length} / {Object.keys(NOBLE_PATHS).length}
        </span>
      </div>

      <div className="space-y-4">
        {sortedAchievements.map((achievement) => {
          const isCompleted = completedPaths.includes(achievement.id)

          return (
            <div
              key={achievement.id}
              className={`
                p-3 rounded-lg border 
                ${isCompleted ? 'bg-primary/10 border-primary' : 'bg-card'}
              `}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    {achievement.name}
                    {isCompleted && <span className="text-green-500">✓</span>}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
                <div className="text-sm space-y-1">
                  {achievement.rewards.gold && (
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-yellow-500">🪙</span>
                      {achievement.rewards.gold}
                    </div>
                  )}
                  {achievement.rewards.influence && (
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-blue-500">⚜️</span>
                      {achievement.rewards.influence}
                    </div>
                  )}
                  {achievement.rewards.experience && (
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-purple-500">✨</span>
                      {achievement.rewards.experience}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {completedPaths.length === Object.keys(NOBLE_PATHS).length && (
        <div className="text-center p-4 bg-primary/10 rounded-lg">
          <p className="text-primary font-medium">
            Поздравляем! Вы получили все достижения! 🎉
          </p>
        </div>
      )}
    </div>
  )
}
