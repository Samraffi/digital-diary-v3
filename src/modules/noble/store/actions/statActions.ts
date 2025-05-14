import {
  completeAchievement,
  updateStats,
  addSpecialEffect,
  SetState,
  GetState
} from '../../state';
import { Noble } from '../../types';

import { useTerritoryStore } from '../../../territory/store';

export const createStatActions = (set: SetState, get: GetState) => ({
  updateStats: (stats: Partial<Noble['stats']>) => set((state) => {
    state.noble = updateStats(state.noble, stats, get().checkRankProgress);
    return state;
  }),

  addSpecialEffect: (effect: string) => set((state) => {
    state.noble = addSpecialEffect(state.noble, effect, get().completeAchievement);
    return state;
  }),

  updateNoble: ({ id, rank }: Partial<Pick<Noble, 'id' | 'rank'>>) => set((state) => {
    if (!state.noble) return state;

    if (id) state.noble.id = id;
    if (rank) state.noble.rank = rank;
    return state;
  }),

  setNoble: (noble: Noble | null) => set((state) => {
    state.noble = noble
    // Проверяем ранг при загрузке профиля
    if (noble) {
      console.log('Noble loaded:', {
        rank: noble.rank,
        achievements: noble.achievements.completed,
        influence: noble.resources.influence,
        territories: useTerritoryStore.getState().territories.length
      })
      get().checkRankProgress()
    }
    return state
  }),
})