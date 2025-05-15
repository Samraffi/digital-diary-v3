import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import localforage from 'localforage'

const isServer = typeof window === 'undefined'

const storage = isServer
  ? {
      getItem: () => Promise.resolve(null),
      setItem: () => Promise.resolve(),
      removeItem: () => Promise.resolve()
    }
  : localforage.createInstance({
      name: 'digital-diary',
      storeName: 'redux-store',
      driver: [
        localforage.INDEXEDDB,
        localforage.WEBSQL,
        localforage.LOCALSTORAGE
      ]
    })
import territoryReducer from '../../modules/territory/redux/territorySlice';
import chronicleReducer from '../../modules/chronicles/redux/chronicleSlice';
import nobleReducer from '../../modules/noble/redux/nobleSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['noble'],
  debug: true,
  timeout: 5000,
  writeFailHandler: (err: Error) => {
    console.error('Failed to write to storage:', err)
  }
}

const persistedNobleReducer = persistReducer(persistConfig, nobleReducer)

export const store = configureStore({
  reducer: {
    territory: territoryReducer,
    chronicle: chronicleReducer,
    noble: persistedNobleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type AppDispatch = typeof store.dispatch;