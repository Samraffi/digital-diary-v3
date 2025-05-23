import { Noble, NobleTitle, NobleRankType } from '../types';
import { NobleState } from './types';
import { debouncedSave } from './nobleStateOperations';
import { rankRequirements } from '../constants';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { selectTerritories } from '@/modules/territory/store';

export const completeAchievement = (
  noble: Noble | null,
  achievementId: string,
  checkRankProgress: () => void
): Noble | null => {
  if (!noble) return null;

  if (noble.achievements.completed.includes(achievementId)) {
    return noble;
  }

  const updatedNoble = { ...noble };
  updatedNoble.achievements.completed.push(achievementId);
  updatedNoble.achievements.total += 1;

  debouncedSave(updatedNoble);
  checkRankProgress();
  return updatedNoble;
};

export const incrementAchievementCategory = (
  noble: Noble | null,
  category: keyof Noble['achievements']['categories'],
  completeAchievementFn: (achievementId: string) => void
): Noble | null => {
  if (!noble) return null;

  const updatedNoble = { ...noble };
  updatedNoble.achievements.categories[category] += 1;

  debouncedSave(updatedNoble);
  if (updatedNoble.achievements.categories[category] >= 50) {
    completeAchievementFn(`category_master_${category}`);
  }

  return updatedNoble;
};

export const addTitle = (
  noble: Noble | null,
  title: NobleTitle
): Noble | null => {
  if (!noble) return null;

  const updatedNoble = { ...noble };
  updatedNoble.titles.push(title);
  
  debouncedSave(updatedNoble);
  return updatedNoble;
};

export const updateStats = (
  noble: Noble | null,
  stats: Partial<Noble['stats']>,
  checkRankProgress: () => void
): Noble | null => {
  if (!noble) return null;

  const updatedNoble = { ...noble };
  updatedNoble.stats = { ...updatedNoble.stats, ...stats };

  debouncedSave(updatedNoble);
  checkRankProgress();
  return updatedNoble;
};

export const checkRankProgress = (
  noble: Noble | null,
  updateRankFn: (newRank: NobleRankType) => void
): void => {
  if (!noble) {
    return;
  }

  // Получаем актуальное количество территорий
  const territories = useSelector((state: RootState) => selectTerritories(state));

  if (noble.rank === 'барон') {
    // Required achievements for Viscount
    const requiredAchievements = ['build-first-village', 'upgrade-village', 'expand-territory'];
    const completedAchievements = Array.from(noble.achievements.completed);
    
    const hasAllRequired = requiredAchievements.every(achievement => 
      completedAchievements.includes(achievement)
    );
    
    const missingAchievements = requiredAchievements.filter(achievement => 
      !completedAchievements.includes(achievement)
    );

    const requirements = {
      territories: 2,
      influence: 2500,
      achievements: 5
    };

    const current = {
      territories: territories.length,
      influence: noble.stats.totalInfluence,
      achievements: noble.achievements.total
    };

    const meetsRequirements = {
      territories: current.territories >= requirements.territories,
      influence: current.influence >= requirements.influence,
      achievements: current.achievements >= requirements.achievements,
      hasRequiredAchievements: hasAllRequired
    };

    const allRequirementsMet = Object.values(meetsRequirements).every(Boolean);

    if (allRequirementsMet) {
      updateRankFn('виконт');
    }
  }
};
