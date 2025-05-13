import { useEffect, useState } from 'react'
import { useNobleStore } from '../store'
import { useTerritoryStore } from '@/modules/territory/store'
import { useGameNotifications } from '@/lib/hooks/useGameNotifications'

interface TutorialStep {
  id: string
  completed: boolean
  requires?: string[] // ID заданий, которые нужно выполнить перед этим
}

export interface TutorialProgress {
  baron: TutorialStep[]
  viscount: TutorialStep[]
  count: TutorialStep[]
}

// Начальный прогресс с зависимостями
const getInitialProgress = (): TutorialProgress => ({
  baron: [
    { 
      id: 'baron-1', 
      completed: false, 
      requires: [] // Первое задание доступно сразу
    },
    { 
      id: 'baron-2', 
      completed: false,
      requires: ['baron-1'] // Требует выполнения первого задания
    },
    { 
      id: 'baron-3', 
      completed: false,
      requires: ['baron-1', 'baron-2'] // Требует выполнения первых двух заданий
    }
  ],
  viscount: [
    { 
      id: 'viscount-1', 
      completed: false,
      requires: ['baron-1', 'baron-2', 'baron-3'] // Требует выполнения всех заданий Барона
    },
    { 
      id: 'viscount-2', 
      completed: false,
      requires: ['viscount-1'] // Требует выполнения первого задания Виконта
    },
    { 
      id: 'viscount-3', 
      completed: false,
      requires: ['viscount-1', 'viscount-2'] // Требует выполнения первых двух заданий Виконта
    }
  ],
  count: [
    { 
      id: 'count-1', 
      completed: false,
      requires: ['viscount-1', 'viscount-2', 'viscount-3'] // Требует выполнения всех заданий Виконта
    },
    { 
      id: 'count-2', 
      completed: false,
      requires: ['count-1'] // Требует выполнения первого задания Графа
    },
    { 
      id: 'count-3', 
      completed: false,
      requires: ['count-1', 'count-2'] // Требует выполнения первых двух заданий Графа
    }
  ]
})

// Получаем прогресс из localStorage
const getTutorialProgress = (): TutorialProgress => {
  if (typeof window === 'undefined') return getInitialProgress()
  
  const saved = localStorage.getItem('tutorial_progress')
  if (!saved) return getInitialProgress()
  
  return JSON.parse(saved)
}

// Сохраняем прогресс в localStorage
const saveTutorialProgress = (progress: TutorialProgress) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('tutorial_progress', JSON.stringify(progress))
}

export const useTutorialProgress = () => {
  const noble = useNobleStore(state => state.noble)
  const addResources = useNobleStore(state => state.addResources)
  const addExperience = useNobleStore(state => state.addExperience)
  const territories = useTerritoryStore(state => state.territories)
  const { notifyAchievement, notifyError } = useGameNotifications()
  
  const [progress, setProgress] = useState<TutorialProgress>(getTutorialProgress)

  // Проверяем, доступно ли задание
  const isStepAvailable = (step: TutorialStep, allProgress: TutorialProgress): boolean => {
    if (!step.requires || step.requires.length === 0) return true
    
    return step.requires.every(reqId => {
      const [rank, stepIndex] = reqId.split('-')
      return allProgress[rank as keyof TutorialProgress][parseInt(stepIndex) - 1].completed
    })
  }

  // Функция для выдачи наград
  const giveReward = (
    resources: { gold: number, influence: number },
    experience: number,
    title: string
  ) => {
    addResources(resources)
    addExperience(experience)
    notifyAchievement(
      'Обучение завершено!',
      `${title}\nНаграда: ${resources.gold} золота, ${resources.influence} влияния, ${experience} опыта`
    )
  }

  // Проверяем выполнение шагов при изменении состояния
  useEffect(() => {
    if (!noble) return

    let updated = false
    const newProgress = { ...progress }

    // Проверка шагов Барона
    if (!newProgress.baron[0].completed && territories.some(t => t.type === 'village')) {
      newProgress.baron[0].completed = true
      giveReward(
        { gold: 100, influence: 50 },
        100,
        'Первая деревня приобретена!'
      )
      updated = true
    }

    if (!newProgress.baron[1].completed && 
        territories.some(t => t.type === 'village' && t.level >= 2) &&
        isStepAvailable(newProgress.baron[1], newProgress)) {
      newProgress.baron[1].completed = true
      giveReward(
        { gold: 200, influence: 100 },
        200,
        'Деревня улучшена до 2 уровня!'
      )
      updated = true
    }

    if (!newProgress.baron[2].completed && 
        territories.filter(t => t.type === 'village').length >= 2 &&
        isStepAvailable(newProgress.baron[2], newProgress)) {
      newProgress.baron[2].completed = true
      giveReward(
        { gold: 300, influence: 150 },
        300,
        'Вторая деревня приобретена!'
      )
      updated = true
    }

    // Проверка шагов Виконта
    if (!newProgress.viscount[0].completed && 
        territories.some(t => t.type === 'mine') &&
        isStepAvailable(newProgress.viscount[0], newProgress)) {
      newProgress.viscount[0].completed = true
      giveReward(
        { gold: 400, influence: 200 },
        400,
        'Первая шахта построена!'
      )
      updated = true
    }

    if (!newProgress.viscount[1].completed && 
        territories.every(t => t.level >= 3) &&
        isStepAvailable(newProgress.viscount[1], newProgress)) {
      newProgress.viscount[1].completed = true
      giveReward(
        { gold: 500, influence: 250 },
        500,
        'Все территории улучшены до 3 уровня!'
      )
      updated = true
    }

    if (!newProgress.viscount[2].completed && 
        territories.filter(t => t.type === 'mine').length >= 2 &&
        isStepAvailable(newProgress.viscount[2], newProgress)) {
      newProgress.viscount[2].completed = true
      giveReward(
        { gold: 600, influence: 300 },
        600,
        'Вторая шахта построена!'
      )
      updated = true
    }

    // Проверка шагов Графа
    if (!newProgress.count[0].completed && 
        territories.some(t => t.type === 'fortress') &&
        isStepAvailable(newProgress.count[0], newProgress)) {
      newProgress.count[0].completed = true
      giveReward(
        { gold: 800, influence: 400 },
        800,
        'Первая крепость построена!'
      )
      updated = true
    }

    if (!newProgress.count[1].completed && 
        territories.every(t => t.level >= 5) &&
        isStepAvailable(newProgress.count[1], newProgress)) {
      newProgress.count[1].completed = true
      giveReward(
        { gold: 1000, influence: 500 },
        1000,
        'Все территории улучшены до 5 уровня!'
      )
      updated = true
    }

    if (!newProgress.count[2].completed && 
        territories.some(t => t.type === 'village') &&
        territories.some(t => t.type === 'mine') &&
        territories.some(t => t.type === 'fortress') &&
        isStepAvailable(newProgress.count[2], newProgress)) {
      newProgress.count[2].completed = true
      giveReward(
        { gold: 2000, influence: 1000 },
        2000,
        'Владеете всеми типами территорий!'
      )
      updated = true
    }

    if (updated) {
      setProgress(newProgress)
      saveTutorialProgress(newProgress)
    }
  }, [noble, territories, progress, addResources, addExperience, notifyAchievement])

  return {
    progress,
    isStepAvailable: (rankKey: keyof TutorialProgress, stepIndex: number) => {
      const step = progress[rankKey][stepIndex]
      return isStepAvailable(step, progress)
    }
  }
} 