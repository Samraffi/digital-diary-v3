import { NobleResources } from '../../types';
import { addResources, removeResources, SetState, GetState } from '../../state';

export const createResourceActions = (set: SetState, get: GetState) => ({
  addResources: (resources: Partial<NobleResources>) => set((state) => {
    if (!state.noble) return state;

    if (resources.gold) {
      state.noble.resources.gold += resources.gold;
      // Увеличиваем репутацию при получении золота
      state.noble.status.reputation = Math.min(100, state.noble.status.reputation + Math.floor(resources.gold / 1000));
    }
    if (resources.influence) {
      state.noble.resources.influence += resources.influence;
      state.noble.stats.totalInfluence += resources.influence;
      // Увеличиваем влияние при получении influence
      state.noble.status.influence = Math.min(100, state.noble.status.influence + Math.floor(resources.influence / 500));
    }

    // Увеличиваем популярность при получении ресурсов
    state.noble.status.popularity = Math.min(100, state.noble.status.popularity + 1);

    return state;
  }),

  removeResources: (resources: Partial<NobleResources>) => set((state) => {
    state.noble = removeResources(state.noble, resources);
    return state;
  }),
});