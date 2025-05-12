import { Noble, Title } from '../types';
import { NobleState } from './types';
import { debouncedSave } from './nobleStateOperations';

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
  title: Title
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
  updateRankFn: (newRank: 'king') => void
): void => {
  if (!noble) return;

  if (noble.achievements.completed.includes('royal_capital')) {
    updateRankFn('king');
  }
};
