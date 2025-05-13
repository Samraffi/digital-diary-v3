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
  const { notifyError } = useGameNotifications()
  const { isPathAvailable, autoCompletePath, completedPaths } = useNoblePathProgress()
  const tutorialProgress = useTutorialProgress()
  
  // Проверяем, выполнен ли этап пути
  const isCompleted = completedPaths.includes(path.id)
  const isAvailable = isPathAvailable(path)

  const handlePathStart = () => {
    if (!isAvailable) {
      const missingRequirements = []
      
      if (path.requirements.rank) {
        missingRequirements.push(`ранг ${path.requirements.rank}`)
      }
      
      if (path.requirements.influence) {
        missingRequirements.push(`${path.requirements.influence} влияния`)
      }
      
      if (path.requirements.gold) {
        missingRequirements.push(`${path.requirements.gold} золота`)
      }
      
      if (path.requirements.territories) {
        missingRequirements.push(`${path.requirements.territories} территорий`)
      }
      
      if (path.requirements.completedPaths) {
        const missingPaths = path.requirements.completedPaths.filter(
          pathId => !completedPaths.includes(pathId)
        )
        if (missingPaths.length > 0) {
          missingPaths.forEach(pathId => {
            missingRequirements.push(`выполнить этап "${NOBLE_PATHS[pathId].name}"`)
          })
        }
      }

      notifyError(
        'Не выполнены условия',
        `Для этого этапа необходимо: ${missingRequirements.join(', ')}`
      )
      return
    }

    if (isCompleted) {
      notifyError('Этап уже пройден', 'Вы уже прошли этот этап развития')
      return
    }

    autoCompletePath(path)
  }

  const difficultyColors = {
    easy: 'bg-green-500',
    medium: 'bg-yellow-500',
    hard: 'bg-red-500',
    epic: 'bg-purple-500'
  }

  // Проверяем, выполнен ли шаг обучения, если он требуется
  const isTutorialStepCompleted = (stepId: string) => {
    const [rank, step] = stepId.split('-')
    const rankSteps = tutorialProgress.progress[rank as keyof typeof tutorialProgress.progress]
    if (!Array.isArray(rankSteps)) return false
    const tutorialStep = rankSteps[parseInt(step) - 1]
    return tutorialStep?.completed ?? false
  }

  return (
    <button
      onClick={handlePathStart}
      disabled={!isAvailable || isCompleted}
      className={`
        w-full p-4 rounded-lg border text-left transition-all duration-200
        ${isCompleted 
          ? 'bg-green-500/20 border-green-500/50 cursor-not-allowed' 
          : isAvailable
            ? 'bg-white/10 hover:bg-white/20 cursor-pointer border-amber-500/50' 
            : 'bg-white/5 opacity-75 cursor-not-allowed border-white/10'
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
        {path.requirements.tutorialStep && (
          <span className={`text-xs px-2 py-1 rounded ${
            isTutorialStepCompleted(path.requirements.tutorialStep)
              ? 'bg-purple-500/20 text-purple-300'
              : 'bg-red-500/20 text-red-300'
          }`}>
            📚 Требуется шаг обучения
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Достижения:</span>
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

      {path.rewards.completeTutorialStep && (
        <div className="mt-2 text-xs text-purple-300">
          ✨ Открывает следующий этап развития
        </div>
      )}
    </button>
  )
}

export function NoblePathBoard() {
  const noble = useNobleStore(state => state.noble)
  const territories = useTerritoryStore((state: { territories: Territory[] }) => state.territories)
  const { isPathAvailable } = useNoblePathProgress()

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
            <h2 className="text-2xl font-bold text-white">Основы правления</h2>
            <p className="text-gray-300">
              Пройдите основные этапы становления вашего благородного дома
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
            <h2 className="text-2xl font-bold text-white">Пути развития</h2>
            <p className="text-gray-300">
              Выберите свой путь развития и получите уникальные преимущества
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