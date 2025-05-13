import { Noble, NobleRank, NobleResources } from '../types';
import { NobleState } from './types';
import { rankRequirements } from '../constants';
import { debouncedSave } from './nobleStateOperations';

export const addResources = (
  noble: Noble | null,
  resources: Partial<NobleResources>,
  checkRankProgress: () => void
): Noble | null => {
  if (!noble) return null;

  const updatedNoble = { ...noble };
  
  if (resources.gold) {
    updatedNoble.resources.gold += resources.gold;
  }
  if (resources.influence) {
    updatedNoble.resources.influence += resources.influence;
    updatedNoble.stats.totalInfluence += resources.influence;
  }

  debouncedSave(updatedNoble);
  checkRankProgress();
  return updatedNoble;
};

export const removeResources = (
  noble: Noble | null,
  resources: Partial<NobleResources>
): Noble | null => {
  if (!noble) return null;

  const updatedNoble = { ...noble };
  
  if (resources.gold) {
    updatedNoble.resources.gold = Math.max(0, updatedNoble.resources.gold - resources.gold);
  }
  if (resources.influence) {
    updatedNoble.resources.influence = Math.max(0, updatedNoble.resources.influence - resources.influence);
  }

  debouncedSave(updatedNoble);
  return updatedNoble;
};

export const addExperience = (
  noble: Noble | null,
  amount: number
): Noble | null => {
  if (!noble) return null;

  const updatedNoble = { ...noble };
  updatedNoble.experience += amount;

  const newLevel = Math.floor(updatedNoble.experience / 900) + 1;
  if (newLevel > updatedNoble.level) {
    updatedNoble.level = newLevel;
    updatedNoble.resources.gold += 100 * newLevel;
    updatedNoble.resources.influence += 50 * newLevel;
    updatedNoble.stats.totalInfluence += 50 * newLevel;
  }

  debouncedSave(updatedNoble);
  return updatedNoble;
};

export const updateRank = (
  noble: Noble | null,
  newRank: NobleRank
): Noble | null => {
  if (!noble) return null;

  const updatedNoble = { ...noble };
  const oldRank = updatedNoble.rank;
  updatedNoble.rank = newRank;

  if (newRank === 'king' && oldRank !== 'king') {
    updatedNoble.resources.gold += 1000000;
    updatedNoble.resources.influence += 500000;
    updatedNoble.stats.totalInfluence += 500000;
    updatedNoble.experience += 10000;
  } else if (rankRequirements[newRank]) {
    const territories = rankRequirements[newRank].territories;
    const rewards = {
      gold: 1000 * (territories / 2),
      influence: 500 * (territories / 2)
    };
    updatedNoble.resources.gold += rewards.gold;
    updatedNoble.resources.influence += rewards.influence;
    updatedNoble.stats.totalInfluence += rewards.influence;
    updatedNoble.experience += 2000;
  }

  const newLevel = Math.floor(updatedNoble.experience / 1000) + 1;
  if (newLevel > updatedNoble.level) {
    updatedNoble.level = newLevel;
  }

  debouncedSave(updatedNoble);
  return updatedNoble;
};
