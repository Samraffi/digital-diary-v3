import { useEffect, useState } from 'react';
import NobleStore from './NobleStore';
import type { INobleStore } from './NobleStore';

const useNobleStore = (initialState: INobleStore) => {
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

  return {
    ...state,
    setNoble: store.setNoble.bind(store),
    setLoading: store.setLoading.bind(store),
    setError: store.setError.bind(store)
  };
};

export default useNobleStore;