import { createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type { Territory, TerritoryType } from './types/territory';
import { RootState } from '../../lib/redux/store';
import { setTerritories, setSelectedTerritory } from './redux/territorySlice';

// Async Thunks
export const addTerritory = createAsyncThunk(
  'territory/addTerritory',
  async (type: TerritoryType, { dispatch, getState }) => {
    const newTerritory: Territory = {
      id: Date.now().toString(),
      name: `Territory ${Date.now()}`,
      type,
      level: 1,
      development: 0,
      maxDevelopment: 100,
      production: {
        gold: 0,
        influence: 0,
      },
      status: {
        development: 0,
        happiness: 0,
        stability: 0,
        overall: 0,
        isProsperous: false,
      },
      buildings: [],
      connections: [],
    };
    
    const state = getState() as RootState;
    const territories = [...state.territory.territories, newTerritory];
    dispatch(setTerritories(territories));
    return newTerritory;
  }
);

export const removeTerritory = createAsyncThunk(
  'territory/removeTerritory',
  async (id: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    const territories = state.territory.territories.filter((t: Territory) => t.id !== id);
    dispatch(setTerritories(territories));
  }
);

export const upgradeTerritory = createAsyncThunk(
  'territory/upgradeTerritory',
  async (id: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    const territories = state.territory.territories.map((t: Territory) =>
      t.id === id ? { ...t, level: t.level + 1 } : t
    );
    
    dispatch(setTerritories(territories));
  }
);

export const updateTerritory = createAsyncThunk(
  'territory/updateTerritory',
  async ({ id, updates }: { id: string, updates: Partial<Territory> }, { dispatch, getState }) => {
    const state = getState() as RootState;
    const territories = state.territory.territories.map((t: Territory) =>
      t.id === id ? { ...t, ...updates } : t
    );
    dispatch(setTerritories(territories));
  }
);

export const applyEffect = createAsyncThunk(
  'territory/applyEffect',
  async (effect: { territoryId: string, type: string, bonus: number }, { dispatch, getState }) => {
    const state = getState() as RootState;
    const territories = state.territory.territories.map((t: Territory) =>
      t.id === effect.territoryId ? { ...t, specialization: effect } : t
    );
    dispatch(setTerritories(territories));
  }
);

// Selectors
export const selectTerritories = (state: RootState) => state.territory.territories;
export const selectSelectedTerritory = (state: RootState) => state.territory.selectedTerritory;

export const selectTerritoryById = createSelector(
  [selectTerritories, (state: RootState, id: string) => id],
  (territories: Territory[], id: string) => territories.find((t: Territory) => t.id === id)
);
