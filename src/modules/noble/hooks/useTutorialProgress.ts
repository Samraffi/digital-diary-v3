import { useEffect, useState } from 'react'
import { useNobleStore } from '../store'
import { useTerritoryStore } from '@/modules/territory/store'
import { useGameNotifications } from '@/lib/hooks/useGameNotifications'
import { NobleRankType } from '../types'

export interface TutorialStep {
  id: string
  completed: boolean
  requires?: string[] // ID заданий, которые нужно выполнить перед этим
}

export interface TutorialProgress {
  baron: TutorialStep[]
  viscount: TutorialStep[]
  count: TutorialStep[]
  marquis: TutorialStep[]
  duke: TutorialStep[]
  king: TutorialStep[]
}

// Начальный прогресс с зависимостями
const getInitialProgress = (): TutorialProgress => ({
  baron: [
    { id: 'baron-1', completed: false },
    { id: 'baron-2', completed: false },
    { id: 'baron-3', completed: false }
  ],
  viscount: [
    { id: 'viscount-1', completed: false },
    { id: 'viscount-2', completed: false },
    { id: 'viscount-3', completed: false }
  ],
  count: [
    { id: 'count-1', completed: false },
    { id: 'count-2', completed: false },
    { id: 'count-3', completed: false }
  ],
  marquis: [
    { id: 'marquis-1', completed: false },
    { id: 'marquis-2', completed: false },
    { id: 'marquis-3', completed: false }
  ],
  duke: [
    { id: 'duke-1', completed: false },
    { id: 'duke-2', completed: false },
    { id: 'duke-3', completed: false }
  ],
  king: [
    { id: 'king-1', completed: false },
    { id: 'king-2', completed: false },
    { id: 'king-3', completed: false }
  ]
})

// Функция для сохранения прогресса в localStorage
const saveTutorialProgress = (progress: TutorialProgress) => {
  try {
    localStorage.setItem('tutorialProgress', JSON.stringify(progress))
  } catch (error) {
    console.error('Failed to save tutorial progress:', error)
  }
}

// Функция для загрузки прогресса из localStorage
const getTutorialProgress = (): TutorialProgress => {
  const initialProgress = getInitialProgress()
  try {
    const saved = localStorage.getItem('tutorialProgress')
    if (saved) {
      const savedProgress = JSON.parse(saved)
      // Объединяем сохраненный прогресс с начальным состоянием
      return {
        ...initialProgress,
        ...savedProgress,
        // Убеждаемся что все новые ранги существуют
        marquis: savedProgress.marquis || initialProgress.marquis,
        duke: savedProgress.duke || initialProgress.duke,
        king: savedProgress.king || initialProgress.king
      }
    }
  } catch (error) {
    console.error('Failed to load tutorial progress:', error)
  }
  return initialProgress
}

export const useTutorialProgress = () => {
  const noble = useNobleStore(state => state.noble)
  const addResources = useNobleStore(state => state.addResources)
  const addExperience = useNobleStore(state => state.addExperience)
  const updateRank = useNobleStore(state => state.updateRank)
  const territories = useTerritoryStore(state => state.territories)
  const { notifyAchievement } = useGameNotifications()
  
  const [progress, setProgress] = useState<TutorialProgress>(getTutorialProgress)

  // Проверяем, доступно ли задание
  const isStepAvailable = (step: TutorialStep | undefined, allProgress: TutorialProgress): boolean => {
    if (!step) return false
    if (!step.requires || step.requires.length === 0) return true
    
    return step.requires.every(reqId => {
      const [rank, stepIndex] = reqId.split('-')
      return allProgress[rank as keyof TutorialProgress]?.[parseInt(stepIndex) - 1]?.completed ?? false
    })
  }

  // Функция для выдачи наград
  const giveReward = (
    resources: { gold: number, influence: number },
    experience: number,
    title: string,
    newRank?: NobleRankType
  ) => {
    addResources(resources)
    addExperience(experience)
    if (newRank) {
      updateRank(newRank)
      // Добавляем достижение за получение нового ранга
      useNobleStore.getState().completeAchievement(`rank_${newRank.toLowerCase()}`)
    }
    // Добавляем достижение за прохождение обучения
    useNobleStore.getState().completeAchievement('tutorial_progress')
    notifyAchievement(
      'Обучение завершено!',
      `${title}\nНаграда: ${resources.gold} золота, ${resources.influence} влияния, ${experience} опыта${newRank ? `, новый титул: ${newRank}` : ''}`
    )
  }

  useEffect(() => {
    if (!noble || !territories) return

    const newProgress = { ...progress }
    let updated = false

    // Проверка шагов Барона
    if (!newProgress.baron[0].completed && 
        territories.some(t => t.type === 'village')) {
      newProgress.baron[0].completed = true
      giveReward(
        { gold: 100, influence: 50 },
        100,
        'Первая деревня построена!'
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
        'Вторая деревня построена!'
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
        'Первая шахта построена!',
        'виконт' // Повышаем до виконта при постройке первой шахты
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
        'Первая крепость построена!',
        'граф' // Повышаем до графа при постройке первой крепости
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

    // Проверка шагов Маркиза
    if (newProgress.marquis && newProgress.marquis[0] && !newProgress.marquis[0].completed && 
        territories.some(t => t.type === 'temple') &&
        isStepAvailable(newProgress.marquis[0], newProgress)) {
      newProgress.marquis[0].completed = true
      giveReward(
        { gold: 1500, influence: 800 },
        1000,
        'Вы построили свой первый храм!',
        'маркиз'
      )
    }

    if (!newProgress.marquis[1].completed && 
        territories.every(t => t.level >= 7) &&
        isStepAvailable(newProgress.marquis[1], newProgress)) {
      newProgress.marquis[1].completed = true
      giveReward(
        { gold: 3000, influence: 1500 },
        2000,
        'Все территории улучшены до 7 уровня!'
      )
      updated = true
    }

    if (!newProgress.marquis[2].completed && 
        territories.filter(t => t.type === 'temple').length >= 2 &&
        isStepAvailable(newProgress.marquis[2], newProgress)) {
      newProgress.marquis[2].completed = true
      giveReward(
        { gold: 4000, influence: 2000 },
        2500,
        'Второй храм построен!'
      )
      updated = true
    }

    // Проверка шагов Герцога
    if (newProgress.duke && newProgress.duke[0] && !newProgress.duke[0].completed &&
        territories.filter(t => t.type === 'temple').length >= 2 &&
        isStepAvailable(newProgress.duke[0], newProgress)) {
      newProgress.duke[0].completed = true
      giveReward(
        { gold: 2000, influence: 1000 },
        1500,
        'Вы построили второй храм!'
      )
    }

    if (!newProgress.duke[1].completed && 
        territories.every(t => t.level >= 8) &&
        isStepAvailable(newProgress.duke[1], newProgress)) {
      newProgress.duke[1].completed = true
      giveReward(
        { gold: 7000, influence: 3500 },
        4000,
        'Все территории улучшены до 8 уровня!'
      )
      updated = true
    }

    if (!newProgress.duke[2].completed && 
        territories.filter(t => t.level >= 10).length >= 1 &&
        isStepAvailable(newProgress.duke[2], newProgress)) {
      newProgress.duke[2].completed = true
      giveReward(
        { gold: 10000, influence: 5000 },
        5000,
        'Первая территория достигла 10 уровня!'
      )
      updated = true
    }

    // Проверка шагов Короля
    if (newProgress.king && newProgress.king[0] && !newProgress.king[0].completed &&
        territories.filter(t => t.type === 'temple').length >= 3 &&
        isStepAvailable(newProgress.king[0], newProgress)) {
      newProgress.king[0].completed = true
      giveReward(
        { gold: 3000, influence: 1500 },
        2000,
        'Вы построили третий храм!',
        'король'
      )
    }

    if (!newProgress.king[1].completed && 
        territories.filter(t => t.level >= 10).length >= 3 &&
        isStepAvailable(newProgress.king[1], newProgress)) {
      newProgress.king[1].completed = true
      giveReward(
        { gold: 20000, influence: 10000 },
        10000,
        'Три территории достигли 10 уровня!'
      )
      updated = true
    }

    if (!newProgress.king[2].completed && 
        territories.every(t => t.level >= 10) &&
        isStepAvailable(newProgress.king[2], newProgress)) {
      newProgress.king[2].completed = true
      giveReward(
        { gold: 50000, influence: 25000 },
        20000,
        'Все территории достигли максимального уровня!'
      )
      updated = true
    }

    if (updated) {
      setProgress(newProgress)
      saveTutorialProgress(newProgress)
    }
  }, [noble, territories, progress, addResources, addExperience, updateRank, notifyAchievement])

  return {
    progress,
    isStepAvailable: (rankKey: keyof TutorialProgress, stepIndex: number) => {
      const steps = progress[rankKey]
      if (!steps || !Array.isArray(steps)) return false
      const step = steps[stepIndex]
      return isStepAvailable(step, progress)
    }
  }
} 