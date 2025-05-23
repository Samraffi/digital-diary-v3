'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useNobleStore } from '@/modules/noble/store'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'
import { selectTerritories } from '@/modules/territory/store'
import { useGameNotifications } from './useGameNotifications'
import { NOBLE_PATHS, type NoblePath } from '@/modules/noble/types/noble-path'

export function useNoblePathProgress() {
  const pathname = usePathname()
  const {
    noble,
    addResources,
    unlockAchievement: completeAchievement,
    addExperience,
    updateStats
  } = useNobleStore();
  
  const territories = useSelector((state: RootState) => selectTerritories(state))
  const completedPaths = noble?.achievements.completed || []
  const { notifyAchievement } = useGameNotifications()

  // Функция для проверки условий выполнения этапа
  const checkPathConditions = (path: NoblePath): boolean => {
    // Если этап уже выполнен, возвращаем false
    if (completedPaths.includes(path.id)) {
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

  // Приватная функция для автоматического выполнения этапа
  const completePathAutomatically = (path: NoblePath, shouldNotify: boolean = false) => {
    if (completedPaths.includes(path.id)) return;

    // Проверяем, не было ли уже выдано вознаграждение
    const rewardsGiven = localStorage.getItem(`path_rewards_${path.id}`);
    if (rewardsGiven) return;

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

      // Отмечаем этап как выполненный и проверяем прогресс ранга
      completeAchievement(path.id);
      
      // Отмечаем, что награды были выданы
      localStorage.setItem(`path_rewards_${path.id}`, 'true');
      
      // Проверяем прогресс ранга только после того, как все награды выданы
      setTimeout(() => {
        updateStats({});
      }, 0);

      // Показываем уведомление только если это запрошено и это первое выполнение
      if (shouldNotify) {
        notifyAchievement('Новое достижение', `Вы достигли нового уровня развития: "${path.name}"`);
      }
    }
  }

  // Эффект для автоматической проверки выполнения этапов
  useEffect(() => {
    if (!territories || !noble) return;

    // Используем Set для отслеживания проверенных путей в этом рендере
    const checkedPaths = new Set<string>();

    // Проверяем все обучающие этапы
    Object.values(NOBLE_PATHS)
      .filter((path: NoblePath) => path.isTutorialPath && !checkedPaths.has(path.id))
      .forEach(path => {
        checkedPaths.add(path.id);
        const conditions = checkPathConditions(path);
        if (conditions) {
          // На странице дорога к величию не показываем уведомления
          const isRoadToGloryPage = pathname === '/road-to-glory';
          completePathAutomatically(path, !isRoadToGloryPage);
        }
      });
  }, [territories, noble?.id, pathname]); // Добавляем pathname в зависимости

  return {
    completedPaths
  };
} 