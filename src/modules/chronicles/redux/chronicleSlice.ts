import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import type { ChronicleEntry } from '../types/chronicle'
import { logger } from '@/lib/utils/logger'

interface ChronicleState {
  entries: ChronicleEntry[]
}

const initialState: ChronicleState = {
  entries: []
}

const chronicleSlice = createSlice({
  name: 'chronicle',
  initialState,
  reducers: {
    addEntry: (state, action: PayloadAction<Omit<ChronicleEntry, 'id' | 'date'>>) => {
      const newEntry = {
        ...action.payload,
        id: Math.random().toString(36).substring(7),
        date: new Date().toISOString()
      }
      state.entries.push(newEntry)
    },
    updateEntry: (state, action: PayloadAction<{ id: string; updates: Partial<ChronicleEntry> }>) => {
      const index = state.entries.findIndex((entry: ChronicleEntry) => entry.id === action.payload.id)
      if (index !== -1) {
        state.entries[index] = { ...state.entries[index], ...action.payload.updates }
      }
    },
    deleteEntry: (state, action: PayloadAction<string>) => {
      state.entries = state.entries.filter((entry: ChronicleEntry) => entry.id !== action.payload)
    }
  }
})

export const { addEntry, updateEntry, deleteEntry } = chronicleSlice.actions

export const selectAllEntries = (state: { chronicle: ChronicleState }) => state.chronicle.entries
export const selectEntriesByCategory = (category: string) =>
  createSelector(
    [selectAllEntries],
    (entries) => {
      logger.debug('Selecting entries for category:', { category, entryCount: entries.length })
      return entries
        .filter(entry => entry.category === category)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
  )

export default chronicleSlice.reducer