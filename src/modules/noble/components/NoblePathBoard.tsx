'use client'

import { useNobleStore } from '../store'
import { Card } from '@/shared/ui/Card'
import { NOBLE_PATHS, type NoblePath } from '../types/noble-path'
import { useGameNotifications } from '@/lib/hooks/useGameNotifications'
import { useTutorialProgress } from '../hooks/useTutorialProgress'
import { useNoblePathProgress } from '@/lib/hooks/useNoblePathProgress'
import { NobleRankType } from '../types'
import { useTerritoryStore } from '@/modules/territory/store'
import { useEffect } from 'react'
import { Territory } from '@/modules/territory/types/territory'

function NoblePathCard({ path }: { path: NoblePath }) {
  const { completedPaths } = useNoblePathProgress()
  const tutorialProgress = useTutorialProgress()
  
  // Проверяем, выполнен ли этап пути
  const isCompleted = completedPaths.includes(path.id)
  const isAvailable = !isCompleted // Теперь все незавершенные пути считаются доступными для просмотра

  const difficultyColors = {
    easy: 'bg-green-500',
    medium: 'bg-yellow-500',
    hard: 'bg-red-500',
    epic: 'bg-purple-500'
  }

  return (
    <div
      className={`
        w-full p-4 rounded-lg border text-left transition-all duration-200
        ${isCompleted 
          ? 'bg-green-500/20 border-green-500/50' 
          : 'bg-white/10 border-amber-500/50'
        }
        ${path.isTutorialPath ? 'border-l-4 border-l-purple-500' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-medieval text-lg">{path.name}</h3>
          {path.isTutorialPath && (
            <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
              Основы
            </span>
          )}
          {isCompleted && (
            <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-300">
              Пройдено ✓
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs ${difficultyColors[path.difficulty]}`}>
            {path.difficulty === 'easy' ? 'НАЧАЛЬНЫЙ' :
             path.difficulty === 'medium' ? 'СРЕДНИЙ' :
             path.difficulty === 'hard' ? 'СЛОЖНЫЙ' :
             'ЭПИЧЕСКИЙ'}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-gray-400 mb-3">
        {path.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {path.requirements.rank && (
          <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300">
            👑 {path.requirements.rank}
          </span>
        )}
        {path.requirements.influence && (
          <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300">
            ⚜️ {path.requirements.influence}
          </span>
        )}
        {path.requirements.gold && (
          <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-300">
            💰 {path.requirements.gold}
          </span>
        )}
        {path.requirements.territories && (
          <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-300">
            🏰 {path.requirements.territories}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Награды:</span>
          {path.rewards.gold && (
            <span className="text-yellow-500">💰 {path.rewards.gold}</span>
          )}
          {path.rewards.influence && (
            <span className="text-blue-500">⚜️ {path.rewards.influence}</span>
          )}
          {path.rewards.experience && (
            <span className="text-purple-500">✨ {path.rewards.experience}</span>
          )}
        </div>
      </div>

      {!isCompleted && path.isTutorialPath && (
        <div className="mt-2 text-xs text-purple-300">
          ✨ Следующий этап в развитии вашего благородного дома
        </div>
      )}
    </div>
  )
}

export function NoblePathBoard() {
  const noble = useNobleStore(state => state.noble)
  const territories = useTerritoryStore((state: { territories: Territory[] }) => state.territories)
  const { completedPaths } = useNoblePathProgress()

  if (!noble) return null

  // Сначала отфильтруем этапы обучения
  const tutorialPaths = Object.values(NOBLE_PATHS).filter(p => p.isTutorialPath)
  const regularPaths = Object.values(NOBLE_PATHS).filter(p => !p.isTutorialPath)

  // Группируем обычные этапы по категориям
  const pathsByCategory = regularPaths.reduce((acc, path) => {
    if (!acc[path.category]) {
      acc[path.category] = []
    }
    acc[path.category].push(path)
    return acc
  }, {} as Record<string, NoblePath[]>)

  const categoryNames = {
    development: 'Экономика',
    trade: 'Торговля',
    diplomacy: 'Дипломатия',
    research: 'Знания',
    strategy: 'Военное дело'
  }

  return (
    <div className="space-y-8">
      {/* Секция обучающих этапов */}
      <Card gradient="from-purple-500/20 to-blue-500/20" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Дорога к величию</h2>
            <p className="text-gray-300">
              Отслеживайте свой прогресс в развитии благородного дома. Выполняйте задания в игре, чтобы продвигаться по пути.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {tutorialPaths.map(path => (
            <NoblePathCard
              key={path.id}
              path={path}
            />
          ))}
        </div>
      </Card>

      {/* Секция дополнительных этапов */}
      <Card gradient="from-blue-500/20 to-purple-500/20" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Дополнительные достижения</h2>
            <p className="text-gray-300">
              Особые цели и достижения для развития вашего благородного дома
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(pathsByCategory).map(([category, paths]) => (
            <div key={category}>
              <h3 className="text-xl font-medieval mb-4 text-blue-300">
                {categoryNames[category as keyof typeof categoryNames]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paths.map(path => (
                  <NoblePathCard
                    key={path.id}
                    path={path}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
} 