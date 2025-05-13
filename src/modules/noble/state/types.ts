import { Noble, NobleRank, NobleResources, NobleTitle } from '../types';
import { TaskCategory } from '@/modules/schedule/types';

// Store Types
export type SetState = (fn: (state: NobleStore) => NobleStore | Partial<NobleStore>) => void;
export type GetState = () => NobleStore;

export interface NobleStore extends NobleState {
  // Actions
  initializeNoble: (name: string) => void;
  addResources: (resources: Partial<NobleResources>) => void;
  removeResources: (resources: Partial<NobleResources>) => void;
  addTitle: (title: NobleTitle) => void;
  updateRank: (newRank: NobleRank) => void;
  addExperience: (amount: number) => void;
  completeAchievement: (achievementId: string) => void;
  updateStats: (stats: Partial<Noble['stats']>) => void;
  checkRankProgress: () => void;
  updateNoble: (updates: Partial<Pick<Noble, 'id' | 'rank'>>) => void;
  
  // Task-related actions
  updateTaskStreak: (category: TaskCategory) => void;
  addSpecialEffect: (effect: string) => void;
  incrementAchievementCategory: (category: keyof Noble['achievements']['categories']) => void;
  getTaskStreak: (category: TaskCategory) => TaskStreak | undefined;
}

// Task-related Types
export interface TaskStreak {
  current: number;
  best: number;
  lastCompleted?: Date;
}

export type TaskStreaks = {
  [K in TaskCategory]?: TaskStreak;
};

// Core State Types
export interface NobleState {
  noble: Noble | null;
  isLoading: boolean;
  error: string | null;
}

// Persist Types
export interface NobleStorePersist {
  noble: Noble | null;
}
