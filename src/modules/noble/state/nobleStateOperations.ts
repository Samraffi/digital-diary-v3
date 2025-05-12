import { Noble } from '../types';
import { TaskStreak, TaskStreaks } from './types';
import { saveNoble } from '@/lib/db';

export const INITIAL_NOBLE: Noble = {
  id: '',
  rank: 'baron',
  titles: [],
  resources: {
    gold: 100,
    influence: 0
  },
  experience: 0,
  level: 1,
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
  },
  stats: {
    tasksCompleted: 0,
    territoriesOwned: 0,
    totalInfluence: 0,
    specialEffects: {},
    taskStreaks: {}
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
            ...streak,
            lastCompleted: streak.lastCompleted ? new Date(streak.lastCompleted) : undefined
          }
        ])
      )
    }
  }
};

export const initializeNoble = (state: Noble | null, name: string): Noble => {
  const noble = { ...INITIAL_NOBLE, id: crypto.randomUUID() };
  saveNoble(noble).catch(console.error);
  return noble;
};
