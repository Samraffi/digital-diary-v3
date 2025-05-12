'use client'

import { useAchievements } from '@/lib/hooks/useAchievements'
import { useNobleStore } from '../store'

export function AchievementsList() {
  const { achievements, completed } = useAchievements()
  const noble = useNobleStore(state => state.noble)

  if (!noble) return null

  const sortedAchievements = [...achievements].sort((a, b) => {
    const aCompleted = completed.includes(a.id)
    const bCompleted = completed.includes(b.id)
    if (aCompleted && !bCompleted) return -1
    if (!aCompleted && bCompleted) return 1
    return 0
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Достижения</h3>
        <span className="text-sm text-muted-foreground">
          {completed.length} / {achievements.length}
        </span>
      </div>

      <div className="grid gap-3">
        {sortedAchievements.map((achievement) => {
          const isCompleted = completed.includes(achievement.id)

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
                  {achievement.reward.gold && (
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-yellow-500">🪙</span>
                      {achievement.reward.gold}
                    </div>
                  )}
                  {achievement.reward.influence && (
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-blue-500">⚜️</span>
                      {achievement.reward.influence}
                    </div>
                  )}
                  {achievement.reward.experience && (
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-purple-500">✨</span>
                      {achievement.reward.experience}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {completed.length === achievements.length && (
        <div className="text-center p-4 bg-primary/10 rounded-lg">
          <p className="text-primary font-medium">
            Поздравляем! Вы получили все достижения! 🎉
          </p>
        </div>
      )}
    </div>
  )
}
