import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Territory, TerritoryType } from './types/territory'
import type { TerritoryEffect } from './types/effects'
import { createTerritory } from './actions/createTerritory'
import { useNobleStore } from '../noble/store'

interface TerritoryStore {
  territories: Territory[]
  effects: TerritoryEffect[]
  lastEffect: TerritoryEffect | null
  addTerritory: (type: TerritoryType) => Promise<Territory>
  removeTerritory: (id: string) => void
  upgradeTerritory: (id: string) => void
  applyEffect: (effect: TerritoryEffect) => void
  updateTerritoryStatus: (id: string, updates: Partial<Territory['status']>) => void
  updateTerritory: (id: string, updates: Partial<Territory>) => void
  getTerritory: (id: string) => Territory | undefined
  addEffect: (effect: TerritoryEffect) => void
  removeEffect: (id: string) => void
}

export const useTerritoryStore = create<TerritoryStore>()(
  devtools(
    persist(
      (set, get) => {
        // Helper function to sync territory count with noble store
        const syncTerritoryCount = (territories: Territory[]) => {
          useNobleStore.getState().updateStats({
            territoriesOwned: territories.length
          });
        };
        
        return {
          territories: [],
          effects: [],
          lastEffect: null,

          addTerritory: async (type) => {
            const territory = createTerritory(type)
            set(state => {
              const newTerritories = [...state.territories, territory];
              state.territories = newTerritories;
              
              // Sync territory count
              syncTerritoryCount(newTerritories);
              
              return state;
            });
            
            // Добавляем достижение за первую территорию
            if (get().territories.length === 1) {
              useNobleStore.getState().completeAchievement('first_territory')
            }
            // Добавляем достижение за 5 территорий
            if (get().territories.length === 5) {
              useNobleStore.getState().completeAchievement('territory_master')
            }
            return territory
          },

          removeTerritory: (id) => {
            set(state => {
              const newTerritories = state.territories.filter(t => t.id !== id);
              state.territories = newTerritories;
              
              // Sync territory count
              syncTerritoryCount(newTerritories);
              
              return state;
            });
          },

          upgradeTerritory: (id) => {
            set((state) => ({
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
          },

          addEffect: (effect) => {
            // Implementation needed
          },

          removeEffect: (id) => {
            // Implementation needed
          }
        }
      },
      {
        name: 'territory-store',
        version: 1
      }
    )
  )
)
