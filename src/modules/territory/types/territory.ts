import type { TerritorySpecialization } from './effects'
export type { TerritoryEffect } from './effects'
import { TERRITORY_TYPES } from './constants'

export type TerritoryType = keyof typeof TERRITORY_TYPES

export interface TerritoryProduction {
  gold: number
  influence: number
}

export interface TerritoryStatus {
  development: number
  happiness: number
  stability: number
  overall: number
  isProsperous: boolean
}

export interface TerritoryBuilding {
  id: string
  name: string
  level: number
  type: string
  effects: {
    production?: {
      gold?: number
      influence?: number
    }
    status?: {
      happiness?: number
      stability?: number
      development?: number
    }
  }
}

export interface Territory {
  id: string
  name: string
  type: TerritoryType
  level: number
  development: number
  maxDevelopment: number
  production: TerritoryProduction
  status: TerritoryStatus
  buildings: TerritoryBuilding[]
  connections: import('./effects').TerritoryConnection[],
  lastEffect?: import('./effects').TerritoryEffect
  specialization?: TerritorySpecialization
}
