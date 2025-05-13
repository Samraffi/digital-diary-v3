import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, PersistOptions } from 'zustand/middleware';
import { Noble, NobleRank, NobleResources, NobleTitle, TaskCategory } from './types';

// Import state module
import {
  INITIAL_NOBLE,
  parseStoredNoble,
  initializeNoble,
  addResources,
  removeResources,
  addExperience,
  updateRank,
  completeAchievement,
  incrementAchievementCategory,
  addTitle,
  updateStats,
  checkRankProgress as checkAchievementRankProgress,
  updateTaskStreak,
  addSpecialEffect,
  getTaskStreak
} from './state';

// Import store types
import {
  NobleStore,
  NobleStorePersist,
  SetState,
  GetState
} from './state';

import { isUuid, getDefaultNobleName } from '@/lib/utils/isUuid';

const persistOptions: PersistOptions<NobleStore, NobleStorePersist> = {
  version: 2,
  name: 'noble-storage',
  partialize: (state) => ({
    noble: state.noble
  }),
  onRehydrateStorage: () => (state) => {
    if (state?.noble) {
      // Проверяем и мигрируем ID если это UUID
      if (state.noble.id && isUuid(state.noble.id)) {
        const newName = getDefaultNobleName(state.noble.rank);
        state.noble.id = newName;
      }
      state.noble = parseStoredNoble(state.noble);
    }
  },
  migrate: (persistedState: any, version) => {
    if (version === 1) {
      const state = persistedState as NobleStorePersist;
      if (state.noble && isUuid(state.noble.id)) {
        state.noble.id = getDefaultNobleName(state.noble.rank);
      }
    }
    return persistedState as NobleStorePersist;
  }
};

const createNobleStore = (
  set: SetState,
  get: GetState
): NobleStore => ({
  noble: null,
  isLoading: false,
  error: null,

  updateNoble: ({ id, rank }: Partial<Pick<Noble, 'id' | 'rank'>>) => set((state) => {
    if (!state.noble) return state
    
    return {
      ...state,
      noble: {
        ...state.noble,
        ...(id && { id }),
        ...(rank && { rank })
      }
    }
  }),

  initializeNoble: (name: string) => set((state) => {
    state.noble = initializeNoble(state.noble, name);
    return state;
  }),

  addResources: (resources: Partial<NobleResources>) => set((state) => {
    state.noble = addResources(state.noble, resources, get().checkRankProgress);
    return state;
  }),

  removeResources: (resources: Partial<NobleResources>) => set((state) => {
    state.noble = removeResources(state.noble, resources);
    return state;
  }),

  addTitle: (title: NobleTitle) => set((state) => {
    state.noble = addTitle(state.noble, title);
    return state;
  }),

  updateRank: (newRank: NobleRank) => set((state) => {
    state.noble = updateRank(state.noble, newRank);
    return state;
  }),

  addExperience: (amount: number) => set((state) => {
    state.noble = addExperience(state.noble, amount);
    return state;
  }),

  completeAchievement: (achievementId: string) => set((state) => {
    state.noble = completeAchievement(state.noble, achievementId, get().checkRankProgress);
    return state;
  }),

  updateStats: (stats: Partial<Noble['stats']>) => set((state) => {
    state.noble = updateStats(state.noble, stats, get().checkRankProgress);
    return state;
  }),

  updateTaskStreak: (category: TaskCategory) => set((state) => {
    state.noble = updateTaskStreak(state.noble, category, get().addExperience);
    return state;
  }),

  addSpecialEffect: (effect: string) => set((state) => {
    state.noble = addSpecialEffect(state.noble, effect, get().completeAchievement);
    return state;
  }),

  incrementAchievementCategory: (category: keyof Noble['achievements']['categories']) => 
    set((state) => {
      state.noble = incrementAchievementCategory(state.noble, category, get().completeAchievement);
      return state;
    }),

  getTaskStreak: (category: TaskCategory) => 
    getTaskStreak(get().noble, category),

  checkRankProgress: () => set((state) => {
    if (!state.noble) return state;
    checkAchievementRankProgress(state.noble, get().updateRank);
    return state;
  })
});

// Create store with middleware
export const useNobleStore = create<NobleStore>()(
  persist(
    immer(createNobleStore),
    persistOptions
  )
);
