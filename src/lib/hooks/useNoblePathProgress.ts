'use client'

import { useEffect } from 'react'
import { useNobleStore } from '@/modules/noble/store'
import { useTerritoryStore } from '@/modules/territory/store'
import { useGameNotifications } from './useGameNotifications'
import { NOBLE_PATHS, type NoblePath } from '@/modules/noble/types/noble-path'
import { useTutorialProgress } from '@/modules/noble/hooks/useTutorialProgress'
import { NobleRankType } from '@/modules/noble/types'

export function useNoblePathProgress() {
  const noble = useNobleStore(state => state.noble)
  const territories = useTerritoryStore(state => state.territories)
  const completedPaths = noble?.achievements.completed || []
  const tutorialProgress = useTutorialProgress()
  const completeAchievement = useNobleStore(state => state.completeAchievement)
  const addResources = useNobleStore(state => state.addResources)
  const addExperience = useNobleStore(state => state.addExperience)
  const checkRankProgress = useNobleStore(state => state.checkRankProgress)
  const { notifyAchievement } = useGameNotifications()

  // Функция для проверки доступности этапа
  const isPathAvailable = (path: NoblePath): boolean => {
    if (!noble) return false;

    // Если этап уже выполнен, он не доступен
    if (completedPaths.includes(path.id)) {
      return false;
    }

    // Проверяем зависимости от других этапов
    if (path.requirements.completedPaths) {
      const missingPaths = path.requirements.completedPaths.filter(
        (pathId: string) => !completedPaths.includes(pathId)
      );
      if (missingPaths.length > 0) {
        return false;
      }
    }

    // Проверяем требования к рангу
    if (path.requirements.rank && noble.rank !== path.requirements.rank) {
      return false;
    }

    // Проверяем требования к влиянию
    if (path.requirements.influence && noble.resources.influence < path.requirements.influence) {
      return false;
    }

    // Проверяем требования к золоту
    if (path.requirements.gold && noble.resources.gold < path.requirements.gold) {
      return false;
    }

    // Проверяем требования к территориям
    if (path.requirements.territories && noble.stats.territoriesOwned < path.requirements.territories) {
      return false;
    }

    // Проверяем требования шага обучения
    if (path.requirements.tutorialStep) {
      const [rank, step] = path.requirements.tutorialStep.split('-');
      const rankSteps = tutorialProgress.progress[rank as keyof typeof tutorialProgress.progress];
      if (!Array.isArray(rankSteps)) {
        return false;
      }
      const tutorialStep = rankSteps[parseInt(step) - 1];
      if (!tutorialStep?.completed) {
        return false;
      }
    }

    return true;
  }

  // Функция для проверки условий выполнения этапа
  const checkPathConditions = (path: NoblePath): boolean => {
    // Если этап уже выполнен или недоступен, возвращаем false
    if (completedPaths.includes(path.id) || !isPathAvailable(path)) {
      return false;
    }
    
    // Проверяем специфические условия для разных типов этапов
    switch (path.id) {
      case 'build-first-village':
        // Для первого этапа проверяем только наличие деревни
        return territories.some(t => t.type === 'village');
      
      case 'upgrade-village':
        // Для второго этапа нужна деревня уровня 2 и выполненный первый этап
        if (!completedPaths.includes('build-first-village')) {
          return false;
        }
        return territories.some(t => t.type === 'village' && t.level >= 2);
      
      case 'expand-territory':
        // Для третьего этапа нужны две деревни и выполненный второй этап
        if (!completedPaths.includes('upgrade-village')) {
          return false;
        }
        return territories.filter(t => t.type === 'village').length >= 2;
      
      case 'build-mine':
        // Для этапа виконта нужна шахта и выполненные все этапы барона
        if (!completedPaths.includes('expand-territory')) {
          return false;
        }
        return territories.some(t => t.type === 'mine');
      
      case 'territory-management':
        // Все территории должны быть уровня 3 и выполнен этап шахты
        if (!completedPaths.includes('build-mine')) {
          return false;
        }
        return territories.every(t => t.level >= 3);
      
      case 'mining-empire':
        // Нужны две шахты и выполненный этап управления территориями
        if (!completedPaths.includes('territory-management')) {
          return false;
        }
        return territories.filter(t => t.type === 'mine').length >= 2;
      
      default:
        return false;
    }
  }

  // Функция для автоматического выполнения этапа
  const autoCompletePath = (path: NoblePath) => {
    if (completedPaths.includes(path.id)) return;

    // Выдаем награды
    if (path.rewards) {
      if (path.rewards.gold || path.rewards.influence) {
        addResources({
          gold: path.rewards.gold || 0,
          influence: path.rewards.influence || 0
        });
      }

      if (path.rewards.experience) {
        addExperience(path.rewards.experience);
      }

      if (path.rewards.completeTutorialStep && tutorialProgress) {
        tutorialProgress.giveReward(
          {
            gold: path.rewards.gold,
            influence: path.rewards.influence
          },
          path.rewards.experience || 0,
          path.name,
          path.requirements.rank as NobleRankType,
          path.rewards.completeTutorialStep
        );
      }

      // Отмечаем этап как выполненный и проверяем прогресс ранга
      completeAchievement(path.id);
      
      // Проверяем прогресс ранга только после того, как все награды выданы
      setTimeout(() => {
        checkRankProgress();
      }, 0);
    }

    notifyAchievement('Новое достижение', `Вы достигли нового уровня развития: "${path.name}"`);
  }

  // Эффект для автоматической проверки выполнения этапов
  useEffect(() => {
    if (!territories || !noble) return;

    // Проверяем все обучающие этапы
    Object.values(NOBLE_PATHS)
      .filter((path: NoblePath) => path.isTutorialPath)
      .forEach(path => {
        const conditions = checkPathConditions(path);
        if (conditions) {
          autoCompletePath(path);
        }
      });
  }, [territories, noble, completedPaths]);

  return {
    isPathAvailable,
    checkPathConditions,
    autoCompletePath,
    completedPaths
  };
} 