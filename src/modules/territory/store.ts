import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Territory } from './types/territory'
import type { TerritoryEffect } from './types/effects'

interface TerritoryStore {
  territories: Territory[]
  lastEffect: TerritoryEffect | null
  addTerritory: (territory: Territory) => void
  removeTerritory: (id: string) => void
  upgradeTerritory: (id: string) => void
  applyEffect: (effect: TerritoryEffect) => void
  updateTerritoryStatus: (id: string, updates: Partial<Territory['status']>) => void
}

export const useTerritoryStore = create<TerritoryStore>()(
  devtools(
    persist(
      (set, get) => ({
        territories: [],
        lastEffect: null,

        addTerritory: (territory) => {
          set((state) => ({
            territories: [...state.territories, territory]
          }))
        },

        removeTerritory: (id) => {
          set((state) => ({
            territories: state.territories.filter((t) => t.id !== id)
          }))
        },

        upgradeTerritory: (id) => {
          set((state) => ({
            territories: state.territories.map((territory) =>
              territory.id === id
                ? {
                    ...territory,
                    level: territory.level + 1,
                    production: territory.production ? {
                      gold: Math.floor(territory.production.gold * 1.2),
                      influence: Math.floor(territory.production.influence * 1.2)
                    } : territory.production
                  }
                : territory
            )
          }))
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

            return state // Возвращаем текущее состояние, так как обновление будет асинхронным
          })
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
