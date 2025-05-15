import { Noble } from '../../types';
import {
  completeAchievement,
  incrementAchievementCategory,
  SetState,
  GetState
} from '../../state';
import { saveNoble } from '@/lib/db';

export const createAchievementActions = (set: SetState, get: GetState) => ({
  completeAchievement: (achievementId: string) => set((state) => {
    if (!state.noble) return state;

    if (!state.noble.achievements.completed.includes(achievementId)) {
      // Create a new array instead of mutating
      state.noble.achievements.completed = [...state.noble.achievements.completed, achievementId];
      state.noble.achievements.total += 1;

      // Увеличиваем все статусы при получении достижения
      state.noble.status.reputation = Math.min(100, state.noble.status.reputation + 5);
      state.noble.status.influence = Math.min(100, state.noble.status.influence + 5);
      state.noble.status.popularity = Math.min(100, state.noble.status.popularity + 5);

      // Create a clean copy for saving
      const nobleToSave = {
        ...state.noble,
        achievements: {
          ...state.noble.achievements,
          completed: Array.from(state.noble.achievements.completed)
        }
      };

      // Save immediately after completing achievement
      saveNoble(nobleToSave).catch(error => {
        console.error('Failed to save noble state:', error);
      });

      // Проверяем прогресс ранга после получения достижения
      get().checkRankProgress();
    }
    return state;
  }),

  resetTutorialAchievements: () => set((state) => {
    if (!state.noble) return state;

    state.noble.achievements.completed = state.noble.achievements.completed.filter(
      id => !id.startsWith('tutorial_') && !id.startsWith('rank_')
    );

    return state;
  }),

  incrementAchievementCategory: (category: keyof Noble['achievements']['categories']) =>
    set((state) => {
      state.noble = incrementAchievementCategory(state.noble, category, get().completeAchievement);
      return state;
    }),
});
