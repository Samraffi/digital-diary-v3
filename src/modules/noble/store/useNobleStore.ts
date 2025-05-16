import { useEffect, useState } from 'react';
import NobleStore from './NobleStore';
import type { INobleStore } from './NobleStore';
import { Noble, NobleResources } from '../types';

const initialState: INobleStore = {
  noble: null,
  isLoading: false,
  error: null,
  setNoble: () => {},
  setLoading: () => {},
  setError: () => {},
  addResources: () => {},
  removeResources: () => {},
  addExperience: () => {},
  updateStats: () => {},
  unlockAchievement: () => {},
  addTitle: () => {},
  updateTaskStreak: () => {},
  updateRank: () => {},
  resetTutorialAchievements: () => {}
};

const useNobleStore = (initialStateOverride?: Partial<INobleStore>) => {
  const initState = { ...initialState, ...initialStateOverride };
  const [store] = useState(() => new NobleStore(initState));
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getState());
    });
    
    return () => {
      unsubscribe();
    };
  }, [store]);

  return {
    noble: state.noble,
    resources: state.noble?.resources as NobleResources,
    achievements: state.noble?.achievements,
    stats: state.noble?.stats,
    status: state.noble?.status,
    perks: state.noble?.perks,
    titles: state.noble?.titles,
    taskStreaks: state.noble?.taskStreaks,
    isLoading: state.isLoading,
    error: state.error,
    setNoble: store.setNoble.bind(store),
    setLoading: store.setLoading.bind(store),
    setError: store.setError.bind(store),
    addResources: store.addResources.bind(store),
    removeResources: store.removeResources.bind(store),
    addExperience: store.addExperience.bind(store),
    updateStats: store.updateStats.bind(store),
    unlockAchievement: store.unlockAchievement.bind(store),
    addTitle: store.addTitle.bind(store),
    updateTaskStreak: store.updateTaskStreak.bind(store),
    completeAchievement: store.unlockAchievement.bind(store),
    updateRank: store.updateRank.bind(store),
    resetTutorialAchievements: store.resetTutorialAchievements.bind(store)
  };
};

export default useNobleStore;