import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

import { persistOptions } from './middleware/persistence';
import { NobleStore } from './middleware/BaseNobleStore';
import { createNobleActions } from './actions';

import { SetState, GetState } from '../state';


const createNobleStore = (
  set: SetState,
  get: GetState
): NobleStore => ({
  noble: null,
  isLoading: false,
  error: null,

  ...createNobleActions(set, get),
});

export const useNobleStore = create<NobleStore>()(
  persist(
    immer(createNobleStore),
    persistOptions
  )
);
