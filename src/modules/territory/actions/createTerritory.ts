import { Territory, TerritoryType } from '../types/territory'
import { TERRITORY_TYPES } from '../types/constants'

export function createTerritory(type: TerritoryType): Territory {
  const baseInfo = TERRITORY_TYPES[type]
  const id = `${type}_${Date.now()}_${Math.floor(Math.random() * 1000)}`
  
  return {
    id,
    name: `${baseInfo.name} #${Math.floor(Math.random() * 100)}`,
    type,
    level: 1,
    development: 0,
    maxDevelopment: 100,
    production: {
      gold: baseInfo.baseProduction.gold,
      influence: baseInfo.baseProduction.influence
    },
    status: {
      development: 50,
      happiness: 50,
      stability: 50,
      overall: 50,
      isProsperous: true
    },
    buildings: [],
    connections: []
  }
}
