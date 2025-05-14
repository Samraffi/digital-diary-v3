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

export const createRankActions = (set: SetState, get: GetState) => ({
  updateRank: (newRank: NobleRankType) => set((state) => {
    console.log('=== UPDATE RANK START ===');
    console.log('Attempting rank update:', {
      from: state.noble?.rank,
      to: newRank,
      currentState: state.noble ? {
        achievements: {
          completed: Array.from(state.noble.achievements.completed),
          total: state.noble.achievements.total
        },
        resources: {
          gold: state.noble.resources.gold,
          influence: state.noble.resources.influence
        },
        level: state.noble.level
      } : null
    });

    if (!state.noble) {
      console.log('❌ Cannot update rank: noble is null');
      return state;
    }

    if (state.noble.rank === newRank) {
      console.log('❌ Cannot update rank: already at target rank', newRank);
      return state;
    }

    const updatedNoble = updateNobleRank(state.noble, newRank);
    if (!updatedNoble) {
      console.log('❌ Rank update failed: updateNobleRank returned null');
      return state;
    }

    state.noble = updatedNoble;

    // Save immediately for rank changes
    console.log('💾 Saving noble state after rank update...');
    saveNoble(updatedNoble).catch(error => {
      console.error('Failed to save noble state:', error);
    });

    console.log('✅ Rank update successful:', {
      newRank: state.noble.rank,
      achievements: {
        completed: Array.from(state.noble.achievements.completed),
        total: state.noble.achievements.total
      },
      resources: {
        gold: state.noble.resources.gold,
        influence: state.noble.resources.influence
      }
    });

    console.log('=== UPDATE RANK END ===');
    return state;
  }),

  checkRankProgress: () => set((state) => {
    if (!state.noble) return state;

    // Call the rank progress check function with the current noble and updateRank function
    checkAchievementRankProgress(state.noble, get().updateRank);

    return state;
  })
});