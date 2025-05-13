'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Card } from '@/shared/ui/Card'
import { withPageTransition } from '@/lib/hooks/usePageTransition'
import { useNobleStore } from '@/modules/noble/store'
import { useTutorialProgress } from '@/modules/noble/hooks/useTutorialProgress'
import Link from 'next/link'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

interface TutorialStep {
  id: string
  title: string
  description: string
  requirements: string
  reward: string
  action: {
    text: string
    path: string
  }
}

interface TutorialSection {
  rank: string
  icon: string
  color: string
  steps: TutorialStep[]
}

const progressPath: TutorialSection[] = [
  {
    rank: 'Барон',
    icon: '👑',
    color: 'from-amber-500/20 to-yellow-500/20',
    steps: [
      {
        id: 'baron-1',
        title: 'Первые шаги',
        description: 'Купите свою первую деревню на Королевском Рынке',
        requirements: 'Необходимо: 500 золота + 200 влияния',
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
        requirements: 'Необходимо: 1000 золота + 400 влияния',
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
        requirements: 'Необходимо: 500 золота + 200 влияния',
        reward: 'Награда: +300 опыта, +150 влияния, +300 золота',
        action: {
          text: 'Перейти на рынок',
          path: '/market'
        }
      }
    ]
  },
  {
    rank: 'Виконт',
    icon: '👑👑',
    color: 'from-emerald-500/20 to-teal-500/20',
    steps: [
      {
        id: 'viscount-1',
        title: 'Горное дело',
        description: 'Постройте свою первую шахту',
        requirements: 'Необходимо: 800 золота + 300 влияния',
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
        requirements: 'Необходимо: 1500 золота + 600 влияния на каждую территорию',
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
        requirements: 'Необходимо: 800 золота + 300 влияния',
        reward: 'Награда: +600 опыта, +300 влияния',
        action: {
          text: 'Перейти на рынок',
          path: '/market'
        }
      }
    ]
  },
  {
    rank: 'Граф',
    icon: '👑👑👑',
    color: 'from-purple-500/20 to-pink-500/20',
    steps: [
      {
        id: 'count-1',
        title: 'Военная мощь',
        description: 'Постройте свою первую крепость',
        requirements: 'Необходимо: 1200 золота + 500 влияния',
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
        requirements: 'Необходимо: 2500 золота + 1000 влияния на каждую территорию',
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
        requirements: 'Выполните все предыдущие задания',
        reward: 'Награда: титул Графа и все его привилегии',
        action: {
          text: 'Перейти на рынок',
          path: '/market'
        }
      }
    ]
  }
]

function TutorialPage() {
  const noble = useNobleStore(state => state.noble)
  const currentRank = noble?.rank || 'Барон'
  const tutorialProgress = useTutorialProgress()
  
  // Находим индекс текущего ранга
  const currentRankIndex = progressPath.findIndex(p => p.rank === currentRank)

  // Функция для проверки выполнения шага
  const isStepCompleted = (rankKey: 'baron' | 'viscount' | 'count', stepIndex: number) => {
    if (!tutorialProgress?.progress?.[rankKey]) return false
    return tutorialProgress.progress[rankKey][stepIndex]?.completed || false
  }

  // Если tutorialProgress еще не загружен, показываем загрузку
  if (!tutorialProgress?.progress) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Заголовок */}
      <Card gradient="from-purple-500/20 to-pink-500/20" className="p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Путь к величию</h1>
        <p className="text-gray-300">
          Пройдите путь от Барона до Графа, выполняя задания и развивая свои владения
        </p>
        {noble && (
          <div className="mt-4 flex gap-4">
            <div className="px-4 py-2 bg-white/10 rounded-lg">
              <span className="text-white font-medium">
                Текущий титул: {noble.rank}
              </span>
            </div>
            <div className="px-4 py-2 bg-white/10 rounded-lg">
              <span className="text-white font-medium">
                Опыт: {noble.experience} / {noble.experienceForNextLevel}
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Путь развития */}
      <div className="grid gap-8">
        {progressPath.map((pathSection, pathIndex) => {
          const isCurrentRank = pathSection.rank === currentRank
          const isPastRank = pathIndex < currentRankIndex
          const isFutureRank = pathIndex > currentRankIndex
          const rankKey = pathSection.rank.toLowerCase() as 'baron' | 'viscount' | 'count'

          return (
            <Card
              key={pathSection.rank}
              gradient={pathSection.color}
              className={`p-6 ${isFutureRank ? 'opacity-50' : ''}`}
            >
              {/* Заголовок ранга */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl">{pathSection.icon}</span>
                <h2 className="text-2xl font-bold text-white">
                  {pathSection.rank}
                  {isCurrentRank && (
                    <span className="ml-3 text-sm font-normal text-white/60">
                      (Текущий титул)
                    </span>
                  )}
                </h2>
              </div>

              {/* Шаги развития */}
              <div className="grid gap-4">
                {pathSection.steps.map((step, stepIndex) => {
                  const completed = isStepCompleted(rankKey, stepIndex)
                  
                  return (
                    <div
                      key={step.id}
                      className={`
                        relative p-6 rounded-lg
                        ${completed ? 'bg-white/10' : 'bg-white/5'}
                        ${isPastRank ? 'opacity-50' : ''}
                      `}
                    >
                      {/* Линия прогресса */}
                      {stepIndex < pathSection.steps.length - 1 && (
                        <div className="absolute left-8 top-[5.5rem] bottom-0 w-0.5 bg-white/10" />
                      )}

                      <div className="flex items-start gap-6">
                        {/* Номер шага */}
                        <div 
                          className={`
                            flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                            ${completed ? 'bg-emerald-500/20' : 'bg-white/10'}
                          `}
                        >
                          {completed ? (
                            <span className="text-2xl">✓</span>
                          ) : (
                            <span className="text-lg font-bold text-white">
                              {stepIndex + 1}
                            </span>
                          )}
                        </div>

                        {/* Содержание шага */}
                        <div className="flex-grow">
                          <h3 className="text-xl font-medium text-white mb-2">
                            {step.title}
                            {completed && (
                              <span className="ml-3 text-sm text-emerald-400">
                                Выполнено!
                              </span>
                            )}
                          </h3>
                          <p className="text-gray-300 mb-4">
                            {step.description}
                          </p>
                          <div className="space-y-2 mb-4">
                            <p className="text-amber-300 text-sm">
                              {step.requirements}
                            </p>
                            <p className="text-emerald-300 text-sm">
                              {step.reward}
                            </p>
                          </div>
                          {!completed && (
                            <Link
                              href={step.action.path}
                              className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-sm"
                            >
                              {step.action.text} →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )
        })}
      </div>
    </motion.div>
  )
}

export default withPageTransition(TutorialPage) 