import { useEffect, useState } from 'react'
import { useNobleStore } from '../store'
import { useTerritoryStore } from '@/modules/territory/store'
import { useGameNotifications } from '@/lib/hooks/useGameNotifications'
import { NobleRankType } from '../types'

export interface TutorialStep {
  id: string
  completed: boolean
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
  
  // Создаем новый прогресс
  const newProgress = getInitialProgress();
  newProgress.profileId = nobleId;
  
  return newProgress;
}

// Функция для загрузки прогресса из localStorage
const getTutorialProgress = (): TutorialProgress => {
  try {
    const saved = localStorage.getItem('tutorialProgress');
    if (saved) {
      const savedData = JSON.parse(saved);
      // Проверяем версию сохранения
      if (!savedData.version || savedData.version !== CURRENT_VERSION) {
        const noble = useNobleStore.getState().noble;
        return resetAllProgress(noble?.id || 'default');
      }
      return savedData.progress;
    }
  } catch (error) {
    console.error('Failed to load tutorial progress:', error);
  }
  const noble = useNobleStore.getState().noble;
  return resetAllProgress(noble?.id || 'default');
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
  return true;
}

export const useTutorialProgress = () => {
  const noble = useNobleStore(state => state.noble)
  const addResources = useNobleStore(state => state.addResources)
  const addExperience = useNobleStore(state => state.addExperience)
  const updateRank = useNobleStore(state => state.updateRank)
  const resetAchievements = useNobleStore(state => state.resetTutorialAchievements)
  const territories = useTerritoryStore(state => state.territories)
  const { notifyAchievement } = useGameNotifications()
  
  // Инициализируем состояние с пустым прогрессом
  const [progress, setProgress] = useState<TutorialProgress | null>(null)

  // Функция для выдачи наград
  const giveReward = (
    resources: { gold?: number; influence?: number },
    experience: number,
    achievementText: string,
    newRank?: NobleRankType,
    tutorialStepId?: string
  ) => {
    if (!noble) return;

    // Добавляем ресурсы
    if (resources.gold || resources.influence) {
      addResources(resources);
    }

    // Добавляем опыт
    if (experience > 0) {
      addExperience(experience);
    }

    // Обновляем ранг если указан
    if (newRank) {
      updateRank(newRank);
    }

    // Показываем уведомление о достижении
    notifyAchievement(
      'Обучение',
      achievementText
    );

    // Если указан ID шага обучения, помечаем его как выполненный
    if (tutorialStepId && progress) {
      const [rank, stepNum] = tutorialStepId.split('-');
      const rankSteps = progress[rank as keyof TutorialProgress];
      if (Array.isArray(rankSteps)) {
        const stepIndex = parseInt(stepNum) - 1;
        if (rankSteps[stepIndex]) {
          rankSteps[stepIndex].completed = true;
          setProgress({ ...progress });
          saveTutorialProgress(progress);
        }
      }
    }
  };

  // Эффект для инициализации прогресса
  useEffect(() => {
    if (noble && !progress) {
      const savedProgress = getTutorialProgress()
      if (!savedProgress.profileId || savedProgress.profileId !== noble.id) {
        const newProgress = resetAllProgress(noble.id)
        setProgress(newProgress)
        saveTutorialProgress(newProgress)
        // Сбрасываем достижения только при создании нового прогресса
        resetAchievements()
      } else {
        setProgress(savedProgress)
      }
    }
  }, [noble, progress, resetAchievements])

  // Возвращаем null, если прогресс еще не инициализирован
  if (!progress) {
    return {
      progress: getInitialProgress(),
      isStepAvailable: () => false,
      giveReward
    }
  }

  return {
    progress,
    isStepAvailable: (rankKey: keyof TutorialProgress, stepIndex: number) => {
      const steps = progress[rankKey]
      if (!steps || !Array.isArray(steps)) return false
      const step = steps[stepIndex]
      return isStepAvailable(step, progress)
    },
    giveReward
  }
} 