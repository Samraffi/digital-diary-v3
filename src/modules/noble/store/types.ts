import { Noble, NobleActions } from '../types';

export interface INobleStore {
  noble: Noble | null;
  isLoading: boolean;
  error: string | null;
  setNoble: (noble: Noble) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  addResources: NobleActions['addResources'];
  removeResources: NobleActions['removeResources'];
  addExperience: NobleActions['addExperience'];
  updateStats: NobleActions['updateStats'];
  unlockAchievement: NobleActions['unlockAchievement'];
  addTitle: NobleActions['addTitle'];
  updateTaskStreak: NobleActions['updateTaskStreak'];
}

import { NobleRankType } from '../types';

export interface NobleStorePersist {
  noble: {
    id: string;
    rank: NobleRankType;
    level: number;
    experience: number;
    experienceForNextLevel: number;
    experienceMultipliers: {
      level: number;
      rank: number;
      bonus: number;
    };
    achievements: {
      completed: string[];
      total: number;
      categories: {
        diplomacy: number;
        development: number;
        trade: number;
        research: number;
        strategy: number;
        wisdom: number;
      };
    };
    resources: {
      gold: number;
      influence: number;
    };
    stats: {
      totalInfluence: number;
      territoriesOwned: number;
      taskStreaks: Record<string, {
        current: number;
        best: number;
        lastCompleted?: Date;
      }>;
      specialEffects: Record<string, number>;
    };
    status: {
      reputation: number;
      influence: number;
      popularity: number;
    };
    perks: Array<{
      name: string;
      description: string;
      icon: string;
      bonus: {
        type: string;
        value: number;
      };
    }>;
    titles: Array<{
      id: string;
      name: string;
      description: string;
      unlockedAt: number;
    }>;
    taskStreaks: Record<string, {
      current: number;
      best: number;
      lastCompleted?: Date;
    }>;
  } | null;
}