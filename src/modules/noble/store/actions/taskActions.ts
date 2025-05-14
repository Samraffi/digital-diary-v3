import { TaskCategory } from '../../types';

import {
  addExperience,
  updateTaskStreak,
  getTaskStreak,
  SetState,
  GetState
} from '../../state';

import { addTaskExperience } from '../../state/experienceOperations';

export const createTaskActions = (set: SetState, get: GetState) => ({
  addTaskExperience: (duration: number, isCombo: boolean = false, isSpecialTime: boolean = false) =>
    set((state) => {
      state.noble = addTaskExperience(state.noble, duration, isCombo, isSpecialTime);
      return state;
    }),

  updateTaskStreak: (category: TaskCategory) => set((state) => {
    state.noble = updateTaskStreak(state.noble, category, get().addExperience);
    return state;
  }),

  getTaskStreak: (category: TaskCategory) =>
    getTaskStreak(get().noble, category)
})