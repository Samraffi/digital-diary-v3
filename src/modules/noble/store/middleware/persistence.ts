import { PersistOptions } from 'zustand/middleware';
import { parseStoredNoble, NobleStorePersist } from '../../state';
import { isUuid, getDefaultNobleName } from '@/lib/utils/isUuid';
import { useTerritoryStore } from '../../../territory/store';
import { NobleStore } from './BaseNobleStore';


export const persistOptions: PersistOptions<NobleStore, NobleStorePersist> = {
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
      return;
    }

    const noble = state.noble;
    
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
