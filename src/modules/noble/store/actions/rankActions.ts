import { NobleRankType } from '../../types';
import { saveNoble } from '@/lib/db';

// Import state module
import {
  updateRank,
  checkRankProgress as checkAchievementRankProgress,
  SetState,
  GetState
} from '../../state';

import { updateRank as updateNobleRank } from '../../state/experienceOperations';
import { useNobleStore } from '..';

export const createRankActions = (set: SetState, get: GetState) => ({
  updateRank: (newRank: NobleRankType) => set((state) => {
    if (!state.noble) {
      return state;
    }

    if (state.noble.rank === newRank) {
      return state;
    }

    const updatedNoble = updateNobleRank(state.noble, newRank);
    if (!updatedNoble) {
      return state;
    }

    state.noble = updatedNoble;

    saveNoble(updatedNoble)
      .then(() => console.log('Saved noble state:', updatedNoble))
      .catch(error => {
        console.error('Failed to save noble state:', error);
      });

    return state;
  }),

  checkRankProgress: () => set((state) => {
    if (!state.noble) return state;

    // Call the rank progress check function with the current noble and updateRank function
    checkAchievementRankProgress(state.noble, get().updateRank);

    return state;
  })
});
