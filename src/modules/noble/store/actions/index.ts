import { NobleTitle } from '../../types';

// Import state module
import {
  initializeNoble,
  addExperience,
  addTitle,
  SetState,
  GetState
} from '../../state';

import { createResourceActions } from './resourceActions';
import { createAchievementActions } from './achievementActions';
import { createRankActions } from './rankActions';
import { createStatActions } from './statActions';
import { createTaskActions } from './taskActions';

export const createNobleActions = (set: SetState, get: GetState) => ({
  ...createResourceActions(set, get),
  ...createAchievementActions(set, get),
  ...createRankActions(set, get),
  ...createStatActions(set, get),
  ...createTaskActions(set, get),

  initializeNoble: (name: string) => set((state) => {
    state.noble = initializeNoble(state.noble, name);
    return state;
  }),

  addTitle: (title: NobleTitle) => set((state) => {
    state.noble = addTitle(state.noble, title);
    return state;
  }),

  addExperience: (amount: number) => set((state) => {
    state.noble = addExperience(state.noble, amount);
    return state;
  }),
});