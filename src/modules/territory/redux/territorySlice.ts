import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Territory, TerritoryType, TerritoryEffect } from '../types/territory';

interface TerritoryState {
  territories: Territory[];
  selectedTerritory: Territory | null;
  lastEffect?: TerritoryEffect;
  loading: boolean;
  error: string | null;
}

const initialState: TerritoryState = {
  territories: [],
  selectedTerritory: null,
  loading: false,
  error: null,
};

const territorySlice = createSlice({
  name: 'territory',
  initialState,
  reducers: {
    setTerritories: (state, action: PayloadAction<Territory[]>) => {
      state.territories = action.payload;
    },
    setSelectedTerritory: (state, action: PayloadAction<Territory>) => {
      state.selectedTerritory = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setTerritories, 
  setSelectedTerritory, 
  setLoading, 
  setError 
} = territorySlice.actions;

export default territorySlice.reducer;