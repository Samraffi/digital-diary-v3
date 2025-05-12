export const TERRITORY_TYPES = {
  camp: {
    name: 'Лагерь',
    description: 'Начальное поселение с минимальным производством',
    maxBuildings: 2,
    baseProduction: {
      gold: 5,
      influence: 2
    },
    requirements: {
      gold: 100,
      influence: 50
    }
  },
  village: {
    name: 'Деревня',
    description: 'Простое поселение с базовым производством ресурсов',
    maxBuildings: 3,
    baseProduction: {
      gold: 10,
      influence: 5
    },
    requirements: {
      gold: 200,
      influence: 100
    }
  },
  mine: {
    name: 'Шахта',
    description: 'Специализированное производство золота',
    maxBuildings: 2,
    baseProduction: {
      gold: 20,
      influence: 2
    },
    requirements: {
      gold: 300,
      influence: 150
    }
  },
  fortress: {
    name: 'Крепость',
    description: 'Военное укрепление с высоким влиянием',
    maxBuildings: 4,
    baseProduction: {
      gold: 8,
      influence: 15
    },
    requirements: {
      gold: 400,
      influence: 200
    }
  },
  temple: {
    name: 'Храм',
    description: 'Духовный центр с сильным влиянием',
    maxBuildings: 3,
    baseProduction: {
      gold: 5,
      influence: 20
    },
    requirements: {
      gold: 500,
      influence: 250
    }
  }
} as const

export type TerritoryType = keyof typeof TERRITORY_TYPES

export interface Building {
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

export type TerritoryEffectType = 'development' | 'diplomacy' | 'trade' | 'research'

export interface TerritoryEffect {
  territoryId: string
  effect: TerritoryEffectType
  bonus: number
}

export interface Territory {
  id: string
  name: string
  type: TerritoryType
  level: number
  production: {
    gold: number
    influence: number
  }
  status: {
    happiness: number
    stability: number
    development: number
  }
  specialization?: TerritorySpecialization
  buildings: Building[]
  connections: TerritoryConnection[]
}
