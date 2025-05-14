import { NobleStore as BaseNobleStore } from '../../state';
import { Noble, NobleRankType } from '../../types';

export interface NobleStore extends BaseNobleStore {
  resetTutorialAchievements: () => void;
  setNoble: (noble: Noble | null) => void;
  updateRank: (newRank: NobleRankType) => void;
  checkRankProgress: () => void;
}