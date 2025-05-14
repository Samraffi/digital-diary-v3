import { useTutorialProgress, type TutorialProgress, type TutorialStep } from '../hooks/useTutorialProgress'
import { Card } from '@/shared/ui/card'
import { useNobleStore } from '../store'
import Link from 'next/link'
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid'
import { NobleRankType } from '../types'
import { rankTitles } from '../constants'

interface TutorialSection {
  rank: NobleRankType
  icon: string
  color: string
  steps: {
    id: string
    title: string
    description: string
    reward: string
    action: {
      text: string
      path: string
    }
  }[]
}

// Определяем порядок рангов для определения следующего
const RANK_ORDER: NobleRankType[] = ['барон', 'виконт', 'граф', 'маркиз', 'герцог', 'король']

// Маппинг рангов на ключи в объекте прогресса
const RANK_KEYS: Record<NobleRankType, keyof TutorialProgress> = {
  'барон': 'baron',
  'виконт': 'viscount',
  'граф': 'count',
  'маркиз': 'marquis',
  'герцог': 'duke',
  'король': 'king'
}

// Функция для получения следующего ранга
const getNextRank = (currentRank: NobleRankType): NobleRankType | null => {
  const currentIndex = RANK_ORDER.indexOf(currentRank)
  if (currentIndex === -1 || currentIndex === RANK_ORDER.length - 1) return null
  return RANK_ORDER[currentIndex + 1]
}

// Определяем путь прогресса с заданиями для каждого ранга
const progressPath: TutorialSection[] = [
  {
    rank: 'барон',
    icon: '👑',
    color: 'from-amber-500/20 to-orange-500/20',
    steps: [
      {
        id: 'baron-1',
        title: 'Первые шаги',
        description: 'Купите свою первую деревню на Королевском Рынке',
        reward: 'Награда: +100 опыта, +50 влияния, +100 золота',
        action: {
          text: 'Перейти на рынок',
          path: '/market'
        }
      },
      {
        id: 'baron-2',
        title: 'Развитие территории',
        description: 'Улучшите деревню до 2 уровня',
        reward: 'Награда: +200 опыта, +100 влияния, +200 золота',
        action: {
          text: 'К территориям',
          path: '/territories'
        }
      },
      {
        id: 'baron-3',
        title: 'Расширение влияния',
        description: 'Приобретите вторую деревню',
        reward: 'Награда: +300 опыта, +150 влияния, +300 золота',
        action: {
          text: 'Перейти на рынок',
          path: '/market'
        }
      }
    ]
  },
  {
    rank: 'виконт',
    icon: '👑👑',
    color: 'from-emerald-500/20 to-teal-500/20',
    steps: [
      {
        id: 'viscount-1',
        title: 'Горное дело',
        description: 'Постройте свою первую шахту',
        reward: 'Награда: +400 опыта, +200 влияния',
        action: {
          text: 'Перейти на рынок',
          path: '/market'
        }
      },
      {
        id: 'viscount-2',
        title: 'Эффективное управление',
        description: 'Улучшите все территории до 3 уровня',
        reward: 'Награда: +500 опыта, +250 влияния',
        action: {
          text: 'К территориям',
          path: '/territories'
        }
      },
      {
        id: 'viscount-3',
        title: 'Горный магнат',
        description: 'Постройте вторую шахту',
        reward: 'Награда: +600 опыта, +300 влияния',
        action: {
          text: 'Перейти на рынок',
          path: '/market'
        }
      }
    ]
  },
  {
    rank: 'граф',
    icon: '👑👑👑',
    color: 'from-purple-500/20 to-pink-500/20',
    steps: [
      {
        id: 'count-1',
        title: 'Военная мощь',
        description: 'Постройте свою первую крепость',
        reward: 'Награда: +800 опыта, +400 влияния',
        action: {
          text: 'Перейти на рынок',
          path: '/market'
        }
      },
      {
        id: 'count-2',
        title: 'Империя процветает',
        description: 'Улучшите все территории до 5 уровня',
        reward: 'Награда: +1000 опыта, +500 влияния',
        action: {
          text: 'К территориям',
          path: '/territories'
        }
      },
      {
        id: 'count-3',
        title: 'Абсолютная власть',
        description: 'Владейте всеми типами территорий (деревня, шахта, крепость)',
        reward: 'Награда: титул Графа и все его привилегии',
        action: {
          text: 'Перейти на рынок',
          path: '/market'
        }
      }
    ]
  }
]

function TutorialStep({ 
  step, 
  isAvailable, 
  isCompleted,
  showConnector = true
}: {
  step: TutorialSection['steps'][0]
  isAvailable: boolean
  isCompleted: boolean
  showConnector?: boolean
}) {
  return (
    <div className="relative">
      {/* Коннектор между шагами */}
      {showConnector && (
        <div className="absolute left-6 -top-8 w-0.5 h-8 bg-gradient-to-b from-transparent to-white/20" />
      )}
      
      <div className={`
        relative p-4 rounded-lg border transition-all duration-200
        ${isCompleted 
          ? 'bg-white/20 border-green-500/50' 
          : isAvailable
            ? 'bg-white/10 border-amber-500/50 hover:bg-white/20'
            : 'bg-white/5 border-white/10 opacity-50'
        }
      `}>
        {/* Иконка замка */}
        <div className={`
          absolute -left-3 top-1/2 -translate-y-1/2
          w-6 h-6 rounded-full flex items-center justify-center
          ${isCompleted 
            ? 'bg-green-500' 
            : isAvailable 
              ? 'bg-amber-500' 
              : 'bg-gray-500'
          }
        `}>
          {isCompleted ? (
            <LockOpenIcon className="w-3 h-3 text-white" />
          ) : (
            <LockClosedIcon className="w-3 h-3 text-white" />
          )}
        </div>

        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medieval text-lg">{step.title}</h3>
          {isCompleted && (
            <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-300">
              Выполнено ✓
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-400 mb-3">
          {step.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300">
            {step.reward}
          </div>
        </div>

        <Link 
          href={step.action.path}
          className={`
            inline-flex items-center px-3 py-1 rounded text-sm
            transition-colors duration-200
            ${isAvailable
              ? 'bg-amber-500 hover:bg-amber-600 text-black'
              : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {step.action.text}
        </Link>
      </div>
    </div>
  )
}

export function TutorialProgress() {
  const { progress, isStepAvailable } = useTutorialProgress()
  const noble = useNobleStore(state => state.noble)

  if (!noble || !progress) return null

  const currentRank = noble.rank as NobleRankType
  const nextRank = getNextRank(currentRank)

  // Фильтруем секции, показывая только текущий и следующий ранг
  const visibleSections = progressPath.filter(section => 
    section.rank === currentRank || section.rank === nextRank
  )

  return (
    <div className="space-y-12">
      {visibleSections.map((section) => {
        const rankKey = RANK_KEYS[section.rank]
        const isCurrentRank = section.rank === currentRank
        
        // Проверяем, доступен ли весь раздел
        const currentRankProgress = progress[RANK_KEYS[currentRank]] as TutorialStep[]
        const isSectionAvailable = isCurrentRank || 
          (currentRank && 
           currentRankProgress?.length > 0 &&
           currentRankProgress.every(step => step.completed))

        return (
          <Card
            key={section.rank}
            gradient={section.color}
            className={`p-6 transition-all duration-200 ${
              !isSectionAvailable && 'opacity-50'
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{section.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {rankTitles[section.rank as NobleRankType]}
                  {isCurrentRank && (
                    <span className="ml-3 text-sm font-normal text-white/60">
                      (Текущий титул)
                    </span>
                  )}
                </h2>
                <p className="text-gray-300">
                  {isCurrentRank 
                    ? 'Задания для укрепления влияния'
                    : `Путь к титулу ${rankTitles[section.rank as NobleRankType]}а`
                  }
                </p>
              </div>
            </div>

            <div className="space-y-8 pl-8">
              {section.steps.map((step, stepIndex) => {
                const stepProgress = progress[rankKey]
                const isCompleted = Array.isArray(stepProgress) && stepProgress[stepIndex]?.completed
                const isAvailable = isSectionAvailable

                return (
                  <TutorialStep
                    key={step.id}
                    step={step}
                    isAvailable={!!isAvailable}
                    isCompleted={!!isCompleted}
                    showConnector={stepIndex > 0}
                  />
                )
              })}
            </div>

            {isCurrentRank && nextRank && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-gray-400">
                  Выполните все задания, чтобы получить титул {rankTitles[nextRank]}а
                </p>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
} 