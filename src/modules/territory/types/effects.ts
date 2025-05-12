export type TerritoryEffectType = 'development' | 'diplomacy' | 'trade' | 'research'

export interface TerritoryEffect {
  territoryId: string
  effect: TerritoryEffectType
  bonus: number
}

export interface ActiveEffect extends TerritoryEffect {
  endTime: number
}

export interface TerritoryConnection {
  id: string
  sourceId: string
  targetId: string
  type: 'road' | 'trade' | 'military'
  level: number
}

export interface TerritorySpecialization {
  type: string
  bonus: number // процентный бонус к производству
}
