import { useEffect, useState } from 'react'
import { useNobleStore } from '../store'
import { useTerritoryStore } from '@/modules/territory/store'
import { useGameNotifications } from '@/lib/hooks/useGameNotifications'
import { NobleRankType } from '../types'

export interface TutorialStep {
  id: string
  completed: boolean
  requires?: string[]
}

export interface TutorialProgress {
  profileId?: string
  version: string
  baron: TutorialStep[]
  viscount: TutorialStep[]
  count: TutorialStep[]
  marquis: TutorialStep[]
  duke: TutorialStep[]
  king: TutorialStep[]
}

const CURRENT_VERSION = '2.0';

// Начальный прогресс
const getInitialProgress = (): TutorialProgress => ({
  version: '2.0',
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

// Функция для полного сброса прогресса
const resetAllProgress = (nobleId: string) => {
  // Очищаем локальное хранилище
  localStorage.removeItem('tutorialProgress');
  
  // Очищаем все достижения, связанные с обучением
  const noble = useNobleStore.getState().noble;
  if (noble) {
    noble.achievements.completed = noble.achievements.completed.filter(
      id => !id.startsWith('tutorial_') && !id.startsWith('rank_')
    );
  }

  // Создаем новый прогресс
  const newProgress = getInitialProgress();
  newProgress.profileId = nobleId;
  
  return newProgress;
}

// Функция для загрузки прогресса из localStorage
const getTutorialProgress = (): TutorialProgress => {
  try {
    const saved = localStorage.getItem('tutorialProgress')
    if (saved) {
      const savedProgress = JSON.parse(saved)
      // Проверяем версию сохранения
      if (!savedProgress.version || savedProgress.version !== '2.0') {
        return resetAllProgress(savedProgress.profileId)
      }
      return savedProgress.progress
    }
  } catch (error) {
    console.error('Failed to load tutorial progress:', error)
  }
  return resetAllProgress(null)
}

// Функция для сохранения прогресса в localStorage
const saveTutorialProgress = (progress: TutorialProgress) => {
  try {
    localStorage.setItem('tutorialProgress', JSON.stringify({
      version: '2.0',
      progress
    }))
  } catch (error) {
    console.error('Failed to save tutorial progress:', error)
  }
}

// Функция для проверки завершенности шага
const isStepCompleted = (step: TutorialStep | undefined, progress: TutorialProgress): boolean => {
  if (!step) return false
  return step.completed
}

// Проверяем, доступно ли задание
const isStepAvailable = (step: TutorialStep | undefined, progress: TutorialProgress): boolean => {
  if (!step) return false;
  if (!step.requires || step.requires.length === 0) return true;

  return step.requires.every(reqId => {
    const [rank, stepNum] = reqId.split('-');
    const rankSteps = progress[rank as keyof TutorialProgress];
    if (!Array.isArray(rankSteps)) return false;
    
    const requiredStep = rankSteps[parseInt(stepNum) - 1];
    return requiredStep?.completed ?? false;
  });
}

export const useTutorialProgress = () => {
  const noble = useNobleStore(state => state.noble)
  const addResources = useNobleStore(state => state.addResources)
  const addExperience = useNobleStore(state => state.addExperience)
  const updateRank = useNobleStore(state => state.updateRank)
  const territories = useTerritoryStore(state => state.territories)
  const { notifyAchievement } = useGameNotifications()
  
  const [progress, setProgress] = useState<TutorialProgress>(getTutorialProgress)

  // При первом запуске или смене профиля сбрасываем прогресс
  useEffect(() => {
    if (noble) {
      const savedProgress = getTutorialProgress()
      if (!savedProgress.profileId || savedProgress.profileId !== noble.id) {
        const newProgress = resetAllProgress(noble.id)
        setProgress(newProgress)
        saveTutorialProgress(newProgress)
      }
    }
  }, [noble?.id])

  // Функция для выдачи наград
  const giveReward = (
    resources: { gold: number, influence: number },
    experience: number,
    title: string,
    newRank?: NobleRankType,
    stepId?: string
  ) => {
    if (!noble) return

    // Проверяем, не было ли уже выдано достижение
    const tutorialAchievementId = `tutorial_${stepId}`
    if (noble.achievements.completed.includes(tutorialAchievementId)) {
      return
    }

    // Проверяем ранг
    if (newRank) {
      const rankAchievementId = `rank_${newRank.toLowerCase()}`
      if (noble.achievements.completed.includes(rankAchievementId)) {
        return
      }
      updateRank(newRank)
      useNobleStore.getState().completeAchievement(rankAchievementId)
    }

    addResources(resources)
    addExperience(experience)

    if (stepId) {
      useNobleStore.getState().completeAchievement(tutorialAchievementId)
    }

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
      newProgress.baron[0].completed = true;
      giveReward(
        { gold: 100, influence: 50 },
        100,
        'Первая деревня построена!',
        undefined,
        'baron-1'
      );
      updated = true;
    }

    if (!newProgress.baron[1].completed && 
        territories.some(t => t.type === 'village' && t.level >= 2) &&
        isStepAvailable(newProgress.baron[1], newProgress)) {
      newProgress.baron[1].completed = true;
      giveReward(
        { gold: 200, influence: 100 },
        200,
        'Деревня улучшена до 2 уровня!',
        undefined,
        'baron-2'
      );
      updated = true;
    }

    if (!newProgress.baron[2].completed && 
        territories.filter(t => t.type === 'village').length >= 2 &&
        isStepAvailable(newProgress.baron[2], newProgress)) {
      newProgress.baron[2].completed = true;
      giveReward(
        { gold: 300, influence: 150 },
        300,
        'Вторая деревня построена!',
        undefined,
        'baron-3'
      );
      updated = true;
    }

    // Проверка шагов Виконта
    if (!newProgress.viscount[0].completed && 
        territories.some(t => t.type === 'mine') &&
        isStepAvailable(newProgress.viscount[0], newProgress)) {
      newProgress.viscount[0].completed = true;
      giveReward(
        { gold: 400, influence: 200 },
        400,
        'Первая шахта построена!',
        'виконт',
        'viscount-1'
      );
      updated = true;
    }

    if (!newProgress.viscount[1].completed && 
        territories.every(t => t.level >= 3) &&
        isStepAvailable(newProgress.viscount[1], newProgress)) {
      newProgress.viscount[1].completed = true;
      giveReward(
        { gold: 500, influence: 250 },
        500,
        'Все территории улучшены до 3 уровня!',
        undefined,
        'viscount-2'
      );
      updated = true;
    }

    if (!newProgress.viscount[2].completed && 
        territories.filter(t => t.type === 'mine').length >= 2 &&
        isStepAvailable(newProgress.viscount[2], newProgress)) {
      newProgress.viscount[2].completed = true;
      giveReward(
        { gold: 600, influence: 300 },
        600,
        'Вторая шахта построена!',
        undefined,
        'viscount-3'
      );
      updated = true;
    }

    // Проверка шагов Графа
    if (!newProgress.count[0].completed && 
        territories.some(t => t.type === 'fortress') &&
        isStepAvailable(newProgress.count[0], newProgress)) {
      newProgress.count[0].completed = true;
      giveReward(
        { gold: 800, influence: 400 },
        800,
        'Первая крепость построена!',
        'граф',
        'count-1'
      );
      updated = true;
    }

    if (!newProgress.count[1].completed && 
        territories.every(t => t.level >= 5) &&
        isStepAvailable(newProgress.count[1], newProgress)) {
      newProgress.count[1].completed = true;
      giveReward(
        { gold: 1000, influence: 500 },
        1000,
        'Все территории улучшены до 5 уровня!',
        undefined,
        'count-2'
      );
      updated = true;
    }

    if (!newProgress.count[2].completed && 
        territories.some(t => t.type === 'village') &&
        territories.some(t => t.type === 'mine') &&
        territories.some(t => t.type === 'fortress') &&
        isStepAvailable(newProgress.count[2], newProgress)) {
      newProgress.count[2].completed = true;
      giveReward(
        { gold: 2000, influence: 1000 },
        2000,
        'Владеете всеми типами территорий!',
        undefined,
        'count-3'
      );
      updated = true;
    }

    // Проверка шагов Маркиза
    if (newProgress.marquis && newProgress.marquis[0] && !newProgress.marquis[0].completed && 
        territories.some(t => t.type === 'temple') &&
        isStepAvailable(newProgress.marquis[0], newProgress)) {
      newProgress.marquis[0].completed = true
      giveReward(
        { gold: 1000, influence: 500 },
        800,
        'Первый храм построен!',
        'маркиз'
      )
      updated = true
    }

    if (!newProgress.marquis[1].completed && 
        territories.every(t => t.level >= 7) &&
        isStepAvailable(newProgress.marquis[1], newProgress)) {
      newProgress.marquis[1].completed = true
      giveReward(
        { gold: 1500, influence: 750 },
        1000,
        'Все территории улучшены до 7 уровня!'
      )
      updated = true
    }

    if (!newProgress.marquis[2].completed && 
        territories.filter(t => t.type === 'temple').length >= 2 &&
        isStepAvailable(newProgress.marquis[2], newProgress)) {
      newProgress.marquis[2].completed = true
      giveReward(
        { gold: 2000, influence: 1000 },
        1200,
        'Второй храм построен!'
      )
      updated = true
    }

    // Проверка шагов Герцога
    if (newProgress.duke && newProgress.duke[0] && !newProgress.duke[0].completed &&
        territories.length >= 10 &&
        isStepAvailable(newProgress.duke[0], newProgress)) {
      newProgress.duke[0].completed = true
      giveReward(
        { gold: 2500, influence: 1250 },
        1500,
        'Владеете 10 территориями!',
        'герцог'
      )
      updated = true
    }

    if (!newProgress.duke[1].completed && 
        territories.every(t => t.level >= 8) &&
        isStepAvailable(newProgress.duke[1], newProgress)) {
      newProgress.duke[1].completed = true
      giveReward(
        { gold: 3000, influence: 1500 },
        2000,
        'Все территории улучшены до 8 уровня!'
      )
      updated = true
    }

    if (!newProgress.duke[2].completed && 
        territories.filter(t => t.level >= 10).length >= 1 &&
        isStepAvailable(newProgress.duke[2], newProgress)) {
      newProgress.duke[2].completed = true
      giveReward(
        { gold: 4000, influence: 2000 },
        2500,
        'Первая территория достигла 10 уровня!'
      )
      updated = true
    }

    // Проверка шагов Короля
    if (newProgress.king && newProgress.king[0] && !newProgress.king[0].completed &&
        territories.length >= 15 &&
        isStepAvailable(newProgress.king[0], newProgress)) {
      newProgress.king[0].completed = true
      giveReward(
        { gold: 5000, influence: 2500 },
        3000,
        'Владеете 15 территориями!',
        'король'
      )
      updated = true
    }

    if (!newProgress.king[1].completed && 
        territories.filter(t => t.level >= 10).length >= 3 &&
        isStepAvailable(newProgress.king[1], newProgress)) {
      newProgress.king[1].completed = true
      giveReward(
        { gold: 7500, influence: 3750 },
        4000,
        'Три территории достигли 10 уровня!'
      )
      updated = true
    }

    if (!newProgress.king[2].completed && 
        territories.every(t => t.level >= 10) &&
        isStepAvailable(newProgress.king[2], newProgress)) {
      newProgress.king[2].completed = true
      giveReward(
        { gold: 10000, influence: 5000 },
        5000,
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