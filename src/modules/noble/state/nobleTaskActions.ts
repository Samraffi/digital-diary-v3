import { Noble, TaskCategory, TaskStreak } from '../types';
import { debouncedSave } from './nobleStateOperations';

export const updateTaskStreak = (
  noble: Noble | null,
  category: TaskCategory,
  addExperienceFn: (amount: number) => void
): Noble | null => {
  if (!noble) return null;

  const updatedNoble = { ...noble };
  const now = new Date();
  const streak = updatedNoble.stats.taskStreaks[category] || {
    current: 0,
    best: 0,
    lastCompleted: undefined
  };

  const lastCompleted = streak.lastCompleted ? new Date(streak.lastCompleted) : undefined;
  if (lastCompleted && isNaN(lastCompleted.getTime())) {
    streak.lastCompleted = undefined;
  }

  const isNextDay = lastCompleted ? 
    now.getDate() === lastCompleted.getDate() + 1 &&
    now.getMonth() === lastCompleted.getMonth() &&
    now.getFullYear() === lastCompleted.getFullYear() : false;

  streak.current = isNextDay ? streak.current + 1 : 1;
  streak.best = Math.max(streak.best, streak.current);
  streak.lastCompleted = now;

  updatedNoble.stats.taskStreaks[category] = streak;
  debouncedSave(updatedNoble);

  if (streak.current > 1) {
    const bonusAmount = Math.min(50, streak.current * 10);
    addExperienceFn(bonusAmount);
  }

  return updatedNoble;
};

export const addSpecialEffect = (
  noble: Noble | null,
  effect: string,
  completeAchievementFn: (achievementId: string) => void
): Noble | null => {
  if (!noble) return null;

  const updatedNoble = { ...noble };
  updatedNoble.stats.specialEffects[effect] = 
    (updatedNoble.stats.specialEffects[effect] || 0) + 1;

  debouncedSave(updatedNoble);
  if (updatedNoble.stats.specialEffects[effect] >= 10) {
    completeAchievementFn(`effect_master_${effect}`);
  }

  return updatedNoble;
};

export const getTaskStreak = (
  noble: Noble | null,
  category: TaskCategory
) => {
  if (!noble) return undefined;
  return noble.stats.taskStreaks[category];
};
