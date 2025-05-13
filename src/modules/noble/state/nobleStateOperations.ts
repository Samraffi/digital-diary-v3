import { Noble } from '../types';
import { saveNoble } from '@/lib/db';

export const INITIAL_NOBLE: Noble = {
  id: '',
  rank: 'барон',
  level: 1,
  experience: 0,
  experienceForNextLevel: 1000,
  resources: {
    gold: 100,
    influence: 0
  },
  status: {
    reputation: 0,
    authority: 0,
    popularity: 0
  },
  perks: [],
  titles: [],
  stats: {
    territoriesOwned: 0,
    totalInfluence: 0,
    taskStreaks: {},
    specialEffects: {}
  },
  taskStreaks: {},
  achievements: {
    completed: [],
    total: 0,
    categories: {
      diplomacy: 0,
      development: 0,
      trade: 0,
      research: 0,
      strategy: 0,
      wisdom: 0
    }
  }
};

// Debounce save operation
let saveTimeout: NodeJS.Timeout | null = null;
export const debouncedSave = (noble: Noble) => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
    saveNoble(noble).catch(console.error);
    saveTimeout = null;
  }, 2000);
};

// Helper to convert ISO strings back to Date objects in task streaks
export const parseStoredNoble = (noble: Noble | null): Noble | null => {
  if (!noble) return null;
  return {
    ...noble,
    stats: {
      ...noble.stats,
      taskStreaks: Object.fromEntries(
        Object.entries(noble.stats.taskStreaks).map(([key, streak]) => [
          key,
          {
            current: (streak as any).current || (streak as any).count || 0,
            best: (streak as any).best || (streak as any).count || 0,
            lastCompleted: streak.lastCompleted ? new Date(streak.lastCompleted) : undefined
          }
        ])
      )
    }
  }
};

export const initializeNoble = (state: Noble | null, name: string): Noble => {
  const noble = { ...INITIAL_NOBLE, id: name };
  saveNoble(noble).catch(console.error);
  return noble;
};
