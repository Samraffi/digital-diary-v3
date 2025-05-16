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
  updateTaskStreak: () => {}
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
    updateTaskStreak: store.updateTaskStreak.bind(store)
  };
};

export default useNobleStore;
  const [store] = useState(() => new NobleStore(initialState));
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getState());
    });
    
    return () => {
      unsubscribe();
    };
  }, [store]);

  const nobleSelector = (state: INobleStore) => state.noble;
  const isLoadingSelector = (state: INobleStore) => state.isLoading;
  const errorSelector = (state: INobleStore) => state.error;

  return {
    noble: nobleSelector(state),
    isLoading: isLoadingSelector(state),
    error: errorSelector(state),
    setNoble: store.setNoble.bind(store),
    setLoading: store.setLoading.bind(store),
    setError: store.setError.bind(store),
    addResources: store.addResources.bind(store),
    removeResources: store.removeResources.bind(store),
    addExperience: store.addExperience.bind(store),
    updateStats: store.updateStats.bind(store),
    unlockAchievement: store.unlockAchievement.bind(store),
    addTitle: store.addTitle.bind(store),
    updateTaskStreak: store.updateTaskStreak.bind(store)
  };
};

export default useNobleStore;