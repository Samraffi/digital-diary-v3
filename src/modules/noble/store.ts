import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, PersistOptions } from 'zustand/middleware';
import { Noble, NobleRank, NobleRankType, NobleResources, NobleTitle, TaskCategory } from './types';
import { saveNoble } from '@/lib/db';

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
  NobleStore as BaseNobleStore,
  NobleStorePersist,
  SetState,
  GetState
} from './state';

import { isUuid, getDefaultNobleName } from '@/lib/utils/isUuid';
import { addTaskExperience, updateRank as updateNobleRank } from './state/experienceOperations';
import { useTerritoryStore } from '../territory/store';

// Расширяем интерфейс store
interface NobleStore extends BaseNobleStore {
  resetTutorialAchievements: () => void;
  setNoble: (noble: Noble | null) => void;
  updateRank: (newRank: NobleRankType) => void;
  checkRankProgress: () => void;
}

const persistOptions: PersistOptions<NobleStore, NobleStorePersist> = {
  version: 2,
  name: 'noble-storage',
  partialize: (state) => ({
    noble: state.noble ? {
      ...state.noble,
      achievements: {
        ...state.noble.achievements,
        completed: Array.from(state.noble.achievements.completed),
        total: state.noble.achievements.total,
        categories: { ...state.noble.achievements.categories }
      },
      resources: { ...state.noble.resources },
      stats: { ...state.noble.stats }
    } : null
  }),
  onRehydrateStorage: () => (state) => {
    if (!state?.noble) {
      console.log('Rehydrating noble store: no state found');
      return;
    }

    const noble = state.noble;
    console.log('Rehydrating noble store:', {
      state: {
        rank: noble.rank,
        achievements: {
          completed: Array.from(noble.achievements.completed),
          total: noble.achievements.total
        },
        resources: { ...noble.resources },
        stats: { ...noble.stats },
        territories: useTerritoryStore.getState().territories.length
      }
    });
    
    // Проверяем и мигрируем ID если это UUID
    if (noble.id && isUuid(noble.id)) {
      noble.id = getDefaultNobleName(noble.rank);
    }
    
    // Ensure achievements array is properly initialized
    noble.achievements = {
      ...noble.achievements,
      completed: Array.from(noble.achievements.completed || []),
      total: noble.achievements.total || 0,
      categories: { ...noble.achievements.categories }
    };
    
    // Ensure resources are properly initialized
    noble.resources = {
      gold: noble.resources?.gold || 0,
      influence: noble.resources?.influence || 0
    };
    
    // Ensure stats are properly initialized
    noble.stats = {
      ...noble.stats,
      territoriesOwned: useTerritoryStore.getState().territories.length
    };
    
    const rehydratedNoble = parseStoredNoble(noble);
    state.noble = rehydratedNoble;
    
    if (rehydratedNoble) {
      console.log('Noble store rehydrated:', {
        rank: rehydratedNoble.rank,
        achievements: {
          completed: Array.from(rehydratedNoble.achievements.completed),
          total: rehydratedNoble.achievements.total
        },
        resources: rehydratedNoble.resources,
        stats: rehydratedNoble.stats
      });
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

  setNoble: (noble) => set((state) => {
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

  updateNoble: ({ id, rank }: Partial<Pick<Noble, 'id' | 'rank'>>) => set((state) => {
    if (!state.noble) return state;
    
    if (id) state.noble.id = id;
    if (rank) state.noble.rank = rank;
    return state;
  }),

  initializeNoble: (name: string) => set((state) => {
    state.noble = initializeNoble(state.noble, name);
    return state;
  }),

  addResources: (resources: Partial<NobleResources>) => set((state) => {
    if (!state.noble) return state;
    
    if (resources.gold) {
      state.noble.resources.gold += resources.gold;
      // Увеличиваем репутацию при получении золота
      state.noble.status.reputation = Math.min(100, state.noble.status.reputation + Math.floor(resources.gold / 1000));
    }
    if (resources.influence) {
      state.noble.resources.influence += resources.influence;
      state.noble.stats.totalInfluence += resources.influence;
      // Увеличиваем влияние при получении influence
      state.noble.status.influence = Math.min(100, state.noble.status.influence + Math.floor(resources.influence / 500));
    }

    // Увеличиваем популярность при получении ресурсов
    state.noble.status.popularity = Math.min(100, state.noble.status.popularity + 1);

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

  updateRank: (newRank: NobleRankType) => set((state) => {
    console.log('=== UPDATE RANK START ===');
    console.log('Attempting rank update:', {
      from: state.noble?.rank,
      to: newRank,
      currentState: state.noble ? {
        achievements: {
          completed: Array.from(state.noble.achievements.completed),
          total: state.noble.achievements.total
        },
        resources: {
          gold: state.noble.resources.gold,
          influence: state.noble.resources.influence
        },
        level: state.noble.level
      } : null
    });
    
    if (!state.noble) {
      console.log('❌ Cannot update rank: noble is null');
      return state;
    }
    
    if (state.noble.rank === newRank) {
      console.log('❌ Cannot update rank: already at target rank', newRank);
      return state;
    }
    
    const updatedNoble = updateNobleRank(state.noble, newRank);
    if (!updatedNoble) {
      console.log('❌ Rank update failed: updateNobleRank returned null');
      return state;
    }
    
    state.noble = updatedNoble;
    
    // Save immediately for rank changes
    console.log('💾 Saving noble state after rank update...');
    saveNoble(updatedNoble).catch(error => {
      console.error('Failed to save noble state:', error);
    });
    
    console.log('✅ Rank update successful:', {
      newRank: state.noble.rank,
      achievements: {
        completed: Array.from(state.noble.achievements.completed),
        total: state.noble.achievements.total
      },
      resources: {
        gold: state.noble.resources.gold,
        influence: state.noble.resources.influence
      }
    });
    
    console.log('=== UPDATE RANK END ===');
    return state;
  }),

  addExperience: (amount: number) => set((state) => {
    state.noble = addExperience(state.noble, amount);
    return state;
  }),

  addTaskExperience: (duration: number, isCombo: boolean = false, isSpecialTime: boolean = false) => 
    set((state) => {
      state.noble = addTaskExperience(state.noble, duration, isCombo, isSpecialTime);
      return state;
    }),

  completeAchievement: (achievementId: string) => set((state) => {
    if (!state.noble) return state;
    
    console.log('Completing achievement:', {
      achievementId,
      currentAchievements: Array.from(state.noble.achievements.completed),
      currentTotal: state.noble.achievements.total
    });
    
    if (!state.noble.achievements.completed.includes(achievementId)) {
      // Create a new array instead of mutating
      state.noble.achievements.completed = [...state.noble.achievements.completed, achievementId];
      state.noble.achievements.total += 1;
      
      console.log('Achievement added:', {
        achievementId,
        newAchievements: Array.from(state.noble.achievements.completed),
        newTotal: state.noble.achievements.total
      });
      
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
      console.log('Achievement completed, checking rank progress...');
      get().checkRankProgress();
    } else {
      console.log('Achievement already completed:', achievementId);
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
    
    // Call the rank progress check function with the current noble and updateRank function
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
