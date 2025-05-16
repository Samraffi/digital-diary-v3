import { INobleStore, NobleStorePersist } from '@modules/noble/store/types';
import { isUuid, getDefaultNobleName } from '@/lib/utils/isUuid';
import { useSelector } from 'react-redux';
import { RootState } from '@lib/redux/store';
import { selectTerritories } from '@modules/territory/store';
import { Noble, NobleResources, NobleStats, NobleTitle, TaskStreak } from '../types';

class NobleStore implements INobleStore {
  get noble() {
    return this.state.noble;
  }

  get isLoading() {
    return this.state.isLoading;
  }

  get error() {
    return this.state.error;
  }

  private state: INobleStore = {
    noble: null,
    isLoading: false,
    error: null,
    setNoble: (noble: Noble) => {
      this.setNoble(noble);
    },
    setLoading: (isLoading: boolean) => {
      this.setLoading(isLoading);
    },
    setError: (error: string | null) => {
      this.setError(error);
    },
    addResources: (resources: Partial<NobleResources>) => {
      this.addResources(resources);
    },
    removeResources: (resources: Partial<NobleResources>) => {
      this.removeResources(resources);
    },
    addExperience: (amount: number) => {
      this.addExperience(amount);
    },
    updateStats: (stats: Partial<NobleStats>) => {
      this.updateStats(stats);
    },
    unlockAchievement: (achievement: string) => {
      this.unlockAchievement(achievement);
    },
    addTitle: (title: NobleTitle) => {
      this.addTitle(title);
    },
    updateTaskStreak: (taskId: string, streak: TaskStreak) => {
      this.updateTaskStreak(taskId, streak);
    }
  };
  private subscribers: Array<() => void> = [];
  private storageKey = 'noble-storage';
  private version = 2;

  constructor(initialState: INobleStore) {
    this.state = this.rehydrate(initialState);
  }

  private rehydrate(initialState: INobleStore): INobleStore {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return initialState;

    try {
      const parsed = JSON.parse(stored);
      if (parsed.version !== this.version) {
        return this.migrate(parsed, parsed.version);
      }
      return this.initializeState(parsed);
    } catch {
      return initialState;
    }
  }

  private initializeState(state: NobleStorePersist): INobleStore {
    if (!state.noble) return { ...this.state };

    const noble = {
      ...state.noble,
      level: state.noble.level || 1,
      experience: state.noble.experience || 0,
      experienceForNextLevel: state.noble.experienceForNextLevel || 100,
      experienceMultipliers: state.noble.experienceMultipliers || {
        level: 1,
        rank: 1,
        bonus: 1
      },
      achievements: {
        ...state.noble.achievements,
        completed: Array.from(state.noble.achievements.completed || []),
        total: state.noble.achievements.total || 0,
        categories: { ...state.noble.achievements.categories }
      },
      status: state.noble.status || {
        reputation: 0,
        influence: 0,
        popularity: 0
      },
      perks: state.noble.perks || [],
      titles: state.noble.titles || [],
      taskStreaks: state.noble.taskStreaks || {}
    };
    
    if (noble.id && isUuid(noble.id)) {
      noble.id = getDefaultNobleName(noble.rank);
    }
    
    noble.resources = {
      gold: noble.resources?.gold || 0,
      influence: noble.resources?.influence || 0
    };
    
    noble.stats = {
      totalInfluence: noble.stats?.totalInfluence || 0,
      territoriesOwned: useSelector((state: RootState) => selectTerritories(state)).length,
      taskStreaks: noble.stats?.taskStreaks || {},
      specialEffects: noble.stats?.specialEffects || {}
    };

    return {
      ...this.state,
      noble: noble,
      isLoading: false,
      error: null
    };
  }

  private migrate(state: any, version: number): INobleStore {
    if (version === 1) {
      if (state.noble && isUuid(state.noble.id)) {
        state.noble.id = getDefaultNobleName(state.noble.rank);
      }
    }
    return state as INobleStore;
  }

  private persist() {
    const toPersist = {
      version: this.version,
      noble: this.state.noble ? {
        ...this.state.noble,
        achievements: {
          ...this.state.noble.achievements,
          completed: Array.from(this.state.noble.achievements.completed),
          total: this.state.noble.achievements.total,
          categories: { ...this.state.noble.achievements.categories }
        },
        resources: { ...this.state.noble.resources },
        stats: { ...this.state.noble.stats }
      } : null
    };

    localStorage.setItem(this.storageKey, JSON.stringify(toPersist));
  }

  getState() {
    return this.state;
  }

  setState(updater: (state: INobleStore) => INobleStore) {
    this.state = updater(this.state);
    this.persist();
    this.notifySubscribers();
  }

  subscribe(callback: () => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(sub => sub());
  }

  setNoble(noble: any) {
    this.setState(state => ({
      ...state,
      noble: noble
    }));
  }

  setLoading(isLoading: boolean) {
    this.setState(state => ({
      ...state,
      isLoading: isLoading
    }));
  }

  setError(error: string | null) {
    this.setState(state => ({
      ...state,
      error: error
    }));
  }

  addResources(resources: Partial<NobleResources>) {
    this.setState(state => {
      if (!state.noble) return state;
      return {
        ...state,
        noble: {
          ...state.noble,
          resources: {
            ...state.noble.resources,
            ...resources
          }
        }
      };
    });
  }

  removeResources(resources: Partial<NobleResources>) {
    this.setState(state => {
      if (!state.noble) return state;
      return {
        ...state,
        noble: {
          ...state.noble,
          resources: {
            gold: Math.max(0, state.noble.resources.gold - (resources.gold || 0)),
            influence: Math.max(0, state.noble.resources.influence - (resources.influence || 0))
          }
        }
      };
    });
  }

  addExperience(amount: number) {
    this.setState(state => {
      if (!state.noble) return state;
      const newExperience = state.noble.experience + amount;
      return {
        ...state,
        noble: {
          ...state.noble,
          experience: newExperience,
          level: this.calculateLevel(newExperience)
        }
      };
    });
  }

  updateStats(stats: Partial<NobleStats>) {
    this.setState(state => {
      if (!state.noble) return state;
      return {
        ...state,
        noble: {
          ...state.noble,
          stats: {
            ...state.noble.stats,
            ...stats
          }
        }
      };
    });
  }

  unlockAchievement(achievement: string) {
    this.setState(state => {
      if (!state.noble) return state;
      return {
        ...state,
        noble: {
          ...state.noble,
          achievements: {
            ...state.noble.achievements,
            completed: [...state.noble.achievements.completed, achievement],
            total: state.noble.achievements.total + 1
          }
        }
      };
    });
  }

  addTitle(title: NobleTitle) {
    this.setState(state => {
      if (!state.noble) return state;
      return {
        ...state,
        noble: {
          ...state.noble,
          titles: [...state.noble.titles, title]
        }
      };
    });
  }

  updateTaskStreak(taskId: string, streak: TaskStreak) {
    this.setState(state => {
      if (!state.noble) return state;
      return {
        ...state,
        noble: {
          ...state.noble,
          taskStreaks: {
            ...state.noble.taskStreaks,
            [taskId]: streak
          }
        }
      };
    });
  }

  private calculateLevel(experience: number): number {
    // Basic level calculation formula
    return Math.floor(Math.sqrt(experience / 100));
  }
}

export type { INobleStore };
export default NobleStore;