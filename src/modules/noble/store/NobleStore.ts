import { INobleStore, NobleStorePersist } from '@modules/noble/store/types';
import { isUuid, getDefaultNobleName } from '@/lib/utils/isUuid';
import { useSelector } from 'react-redux';
import { RootState } from '@lib/redux/store';
import { selectTerritories } from '@modules/territory/store';

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
    setNoble: (noble: any) => {
      this.setNoble(noble);
    },
    setLoading: (isLoading: boolean) => {
      this.setLoading(isLoading);
    },
    setError: (error: string | null) => {
      this.setError(error);
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
      achievements: {
        ...state.noble.achievements,
        completed: new Set(state.noble.achievements.completed || []),
        total: state.noble.achievements.total || 0,
        categories: { ...state.noble.achievements.categories }
      }
    };
    
    if (noble.id && isUuid(noble.id)) {
      noble.id = getDefaultNobleName(noble.rank);
    }
    
    noble.resources = {
      gold: noble.resources?.gold || 0,
      influence: noble.resources?.influence || 0
    };
    
    noble.stats = {
      ...noble.stats,
      territoriesOwned: useSelector((state: RootState) => selectTerritories(state)).length
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
}

export type { INobleStore };
export default NobleStore;