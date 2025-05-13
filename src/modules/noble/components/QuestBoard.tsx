'use client'

import { useNobleStore } from '../store'
import { Card } from '@/shared/ui/Card'
import { QUESTS, type Quest } from '../types/quests'
import { useGameNotifications } from '@/lib/hooks/useGameNotifications'
import { useTutorialProgress, type TutorialProgress } from '@/modules/noble/hooks/useTutorialProgress'

function QuestCard({ quest, isAvailable, completedQuests, tutorialProgress }: { 
  quest: Quest
  isAvailable: boolean
  completedQuests: string[]
  tutorialProgress: ReturnType<typeof useTutorialProgress>
}) {
  const { notifyError, notifyAchievement } = useGameNotifications()
  const noble = useNobleStore(state => state.noble)
  
  if (!noble) return null

  const handleQuestStart = () => {
    if (!isAvailable) {
      const missingRequirements = []
      
      if (quest.requirements.rank && noble.rank !== quest.requirements.rank) {
        missingRequirements.push(`ранг ${quest.requirements.rank}`)
      }
      
      if (quest.requirements.influence && noble.resources.influence < quest.requirements.influence) {
        missingRequirements.push(`${quest.requirements.influence} влияния`)
      }
      
      if (quest.requirements.gold && noble.resources.gold < quest.requirements.gold) {
        missingRequirements.push(`${quest.requirements.gold} золота`)
      }
      
      if (quest.requirements.territories && noble.stats.territoriesOwned < quest.requirements.territories) {
        missingRequirements.push(`${quest.requirements.territories} территорий`)
      }
      
      if (quest.requirements.completedQuests) {
        const missingQuests = quest.requirements.completedQuests.filter(
          questId => !completedQuests.includes(questId)
        )
        if (missingQuests.length > 0) {
          missingQuests.forEach(questId => {
            missingRequirements.push(`выполнить задание "${QUESTS[questId].name}"`)
          })
        }
      }

      notifyError(
        'Не выполнены требования',
        `Для начала задания необходимо: ${missingRequirements.join(', ')}`
      )
      return
    }

    // TODO: Implement quest start logic
    notifyAchievement('Задание начато', `Вы начали выполнение задания "${quest.name}"`)
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
    return tutorialProgress.progress[rank as keyof TutorialProgress]?.[parseInt(step) - 1]?.completed
  }

  return (
    <button
      onClick={handleQuestStart}
      disabled={!isAvailable}
      className={`
        w-full p-4 rounded-lg border text-left transition-all duration-200
        ${isAvailable 
          ? 'bg-white/10 hover:bg-white/20 cursor-pointer border-amber-500/50' 
          : 'bg-white/5 opacity-75 cursor-not-allowed border-white/10'
        }
        ${quest.isTutorialQuest ? 'border-l-4 border-l-purple-500' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-medieval text-lg">{quest.name}</h3>
          {quest.isTutorialQuest && (
            <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
              Обучение
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs ${difficultyColors[quest.difficulty]}`}>
            {quest.difficulty.toUpperCase()}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-gray-400 mb-3">
        {quest.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {quest.requirements.rank && (
          <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300">
            👑 {quest.requirements.rank}
          </span>
        )}
        {quest.requirements.influence && (
          <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300">
            ⚜️ {quest.requirements.influence}
          </span>
        )}
        {quest.requirements.gold && (
          <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-300">
            💰 {quest.requirements.gold}
          </span>
        )}
        {quest.requirements.territories && (
          <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-300">
            🏰 {quest.requirements.territories}
          </span>
        )}
        {quest.requirements.tutorialStep && (
          <span className={`text-xs px-2 py-1 rounded ${
            isTutorialStepCompleted(quest.requirements.tutorialStep)
              ? 'bg-purple-500/20 text-purple-300'
              : 'bg-red-500/20 text-red-300'
          }`}>
            📚 Требуется шаг обучения
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Награды:</span>
          {quest.rewards.gold && (
            <span className="text-yellow-500">💰 {quest.rewards.gold}</span>
          )}
          {quest.rewards.influence && (
            <span className="text-blue-500">⚜️ {quest.rewards.influence}</span>
          )}
          {quest.rewards.experience && (
            <span className="text-purple-500">✨ {quest.rewards.experience}</span>
          )}
        </div>
      </div>

      {quest.rewards.completeTutorialStep && (
        <div className="mt-2 text-xs text-purple-300">
          ✨ Завершает шаг обучения
        </div>
      )}
    </button>
  )
}

export function QuestBoard() {
  const noble = useNobleStore(state => state.noble)
  const completedQuests = noble?.achievements.completed || []
  const tutorialProgress = useTutorialProgress()

  if (!noble) return null

  const isQuestAvailable = (quest: Quest): boolean => {
    if (quest.requirements.rank && noble.rank !== quest.requirements.rank) {
      return false
    }

    if (quest.requirements.influence && noble.resources.influence < quest.requirements.influence) {
      return false
    }

    if (quest.requirements.gold && noble.resources.gold < quest.requirements.gold) {
      return false
    }

    if (quest.requirements.territories && noble.stats.territoriesOwned < quest.requirements.territories) {
      return false
    }

    if (quest.requirements.completedQuests) {
      const missingQuests = quest.requirements.completedQuests.filter(
        questId => !completedQuests.includes(questId)
      )
      if (missingQuests.length > 0) {
        return false
      }
    }

    // Проверяем требования шага обучения
    if (quest.requirements.tutorialStep) {
      const [rank, step] = quest.requirements.tutorialStep.split('-')
      if (!tutorialProgress.progress[rank as keyof TutorialProgress]?.[parseInt(step) - 1]?.completed) {
        return false
      }
    }

    return true
  }

  // Сначала отфильтруем квесты обучения
  const tutorialQuests = Object.values(QUESTS).filter(q => q.isTutorialQuest)
  const regularQuests = Object.values(QUESTS).filter(q => !q.isTutorialQuest)

  // Группируем обычные задания по категориям
  const questsByCategory = regularQuests.reduce((acc, quest) => {
    if (!acc[quest.category]) {
      acc[quest.category] = []
    }
    acc[quest.category].push(quest)
    return acc
  }, {} as Record<string, Quest[]>)

  const categoryNames = {
    development: 'Развитие',
    trade: 'Торговля',
    diplomacy: 'Дипломатия',
    research: 'Исследования',
    strategy: 'Стратегия'
  }

  return (
    <div className="space-y-8">
      {/* Секция обучающих заданий */}
      <Card gradient="from-purple-500/20 to-blue-500/20" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Обучение</h2>
            <p className="text-gray-300">
              Выполняйте задания для продвижения по пути развития вашего благородного дома
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {tutorialQuests.map(quest => (
            <QuestCard
              key={quest.id}
              quest={quest}
              isAvailable={isQuestAvailable(quest)}
              completedQuests={completedQuests}
              tutorialProgress={tutorialProgress}
            />
          ))}
        </div>
      </Card>

      {/* Секция обычных заданий */}
      <Card gradient="from-amber-500/20 to-yellow-500/20" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Дополнительные задания</h2>
            <p className="text-gray-300">
              Выполняйте дополнительные задания для получения наград и развития владений
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(questsByCategory).map(([category, quests]) => (
            <div key={category}>
              <h3 className="text-xl font-medieval mb-4 text-blue-300">
                {categoryNames[category as keyof typeof categoryNames]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quests.map(quest => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    isAvailable={isQuestAvailable(quest)}
                    completedQuests={completedQuests}
                    tutorialProgress={tutorialProgress}
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