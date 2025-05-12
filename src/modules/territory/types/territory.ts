import type { TerritoryConnection, TerritorySpecialization } from './effects'
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
}

export interface TerritoryBuilding {
  id: string
  name: string
  level: number
  type: string
  effects: {
    type: 'production' | 'status'
    value: number
    target: keyof TerritoryProduction | keyof TerritoryStatus
  }[]
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
  connections: TerritoryConnection[]
  specialization?: TerritorySpecialization
}
