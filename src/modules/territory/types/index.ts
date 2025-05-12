import { TERRITORY_TYPES } from './constants'
import type { TerritoryBuilding } from './territory'

export type {
  Territory,
  TerritoryType,
  TerritoryProduction,
  TerritoryStatus,
  TerritoryBuilding,
  TerritoryBuildingEffect,
  TerritoryUpgrade
} from './territory'

export type {
  TerritoryEffectType,
  TerritoryEffect,
  TerritoryConnection,
  TerritorySpecialization
} from './effects'

export { TERRITORY_TYPES }

// Re-export the type for backward compatibility
export type Building = TerritoryBuilding
