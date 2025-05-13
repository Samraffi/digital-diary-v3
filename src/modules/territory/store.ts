import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Territory, TerritoryType } from './types/territory'
import type { TerritoryEffect } from './types/effects'
import type { TerritoryChronicleEntry } from './types/chronicle'
import { createTerritory } from './actions/createTerritory'

interface TerritoryStore {
  territories: Territory[]
  lastEffect: TerritoryEffect | null
  chronicles: TerritoryChronicleEntry[]
  addTerritory: (type: TerritoryType) => Promise<void>
  removeTerritory: (id: string) => void
  upgradeTerritory: (id: string) => void
  applyEffect: (effect: TerritoryEffect) => void
  updateTerritoryStatus: (id: string, updates: Partial<Territory['status']>) => void
  updateTerritory: (id: string, updates: Partial<Territory>) => void
  getTerritory: (id: string) => Territory | undefined
  addChronicleEntry: (entry: TerritoryChronicleEntry) => void
  getChroniclesForTerritory: (territoryId: string) => TerritoryChronicleEntry[]
  getAllChronicles: () => TerritoryChronicleEntry[]
}

export const useTerritoryStore = create<TerritoryStore>()(
  devtools(
    persist(
      (set, get) => ({
        territories: [],
        lastEffect: null,
        chronicles: [],

        addChronicleEntry: (entry: TerritoryChronicleEntry) => {
          set((state) => ({
            chronicles: [...state.chronicles, entry]
          }))
        },

        getChroniclesForTerritory: (territoryId: string) => {
          return get().chronicles.filter((entry) => entry.territoryId === territoryId)
        },

        getAllChronicles: () => {
          return get().chronicles
        },

        addTerritory: async (type) => {
          const territory = createTerritory(type)
          set((state) => ({
            territories: [...state.territories, territory]
          }))
          
          // Add chronicle entry for territory founding
          const chronicleEntry: TerritoryChronicleEntry = {
            id: Math.random().toString(36).substring(7),
            territoryId: territory.id,
            date: new Date().toISOString(),
            content: `Основана новая территория: ${territory.name}`,
            type: 'founded'
          }
          get().addChronicleEntry(chronicleEntry)
        },

        removeTerritory: (id) => {
          set((state) => ({
            territories: state.territories.filter((t) => t.id !== id)
          }))
        },

        upgradeTerritory: (id) => {
          set((state) => {
            const territory = state.territories.find(t => t.id === id)
            if (!territory) return state

            // Add chronicle entry for upgrade
            const chronicleEntry: TerritoryChronicleEntry = {
              id: Math.random().toString(36).substring(7),
              territoryId: id,
              date: new Date().toISOString(),
              content: `${territory.name} улучшена до уровня ${territory.level + 1}`,
              type: 'upgraded'
            }
            get().addChronicleEntry(chronicleEntry)

            return {
              territories: state.territories.map((t) =>
                t.id === id
                  ? {
                      ...t,
                      level: t.level + 1,
                      production: t.production ? {
                        gold: Math.floor(t.production.gold * 1.2),
                        influence: Math.floor(t.production.influence * 1.2)
                      } : t.production
                    }
                  : t
              )
            }
          })
        },

        applyEffect: (effect) => {
          set((state) => {
            const territory = state.territories.find(t => t.id === effect.territoryId)
            if (!territory) return state

            const updates = { ...territory.status }
            switch (effect.effect) {
              case 'development':
                updates.development = Math.min(100, updates.development + effect.bonus)
                break
              case 'diplomacy':
                updates.stability = Math.min(100, updates.stability + effect.bonus)
                break
              case 'trade':
                updates.happiness = Math.min(100, updates.happiness + effect.bonus)
                break
              case 'research':
                updates.development = Math.min(100, updates.development + effect.bonus)
                updates.stability = Math.min(100, updates.stability + Math.floor(effect.bonus / 2))
                break
            }

            // Используем requestAnimationFrame для оптимизации обновления
            requestAnimationFrame(() => {
              set({
                territories: state.territories.map(t =>
                  t.id === effect.territoryId
                    ? { ...t, status: updates }
                    : t
                ),
                lastEffect: effect
              })
            })

            return state
          })
        },

        getTerritory: (id) => {
          return get().territories.find(t => t.id === id)
        },

        updateTerritory: (id, updates) => {
          set((state) => ({
            territories: state.territories.map((territory) =>
              territory.id === id
                ? { ...territory, ...updates }
                : territory
            )
          }))
        },

        updateTerritoryStatus: (id, updates) => {
          set((state) => ({
            territories: state.territories.map((territory) =>
              territory.id === id
                ? {
                    ...territory,
                    status: { ...territory.status, ...updates }
                  }
                : territory
            )
          }))
        }
      }),
      {
        name: 'territory-store',
        version: 1
      }
    )
  )
)
