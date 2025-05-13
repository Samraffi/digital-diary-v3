import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { ChronicleEntry, ChronicleStore } from '../territory/types/chronicle'

export const useChronicleStore = create<ChronicleStore>()(
  devtools(
    persist(
      (set, get) => ({
        entries: [],

        addEntry: (entry) => {
          set((state) => ({
            entries: [...state.entries, {
              ...entry,
              id: Math.random().toString(36).substring(7),
              date: new Date().toISOString(),
            }]
          }))
        },

        updateEntry: (id, updates) => {
          set((state) => ({
            entries: state.entries.map((entry) =>
              entry.id === id
                ? { ...entry, ...updates }
                : entry
            )
          }))
        },

        deleteEntry: (id) => {
          set((state) => ({
            entries: state.entries.filter((entry) => entry.id !== id)
          }))
        },

        getEntries: (category) => {
          return get().entries
            .filter((entry) => entry.category === category)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        }
      }),
      {
        name: 'chronicle-store',
        version: 1
      }
    )
  )
)
