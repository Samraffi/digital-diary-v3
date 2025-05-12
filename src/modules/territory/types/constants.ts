export const EFFECT_DURATIONS = {
  SHORT: 900,    // 15 minutes in milliseconds
  MEDIUM: 1800,  // 30 minutes in milliseconds
  LONG: 3600,    // 1 hour in milliseconds
  PERMANENT: -1  // Special value for permanent effects
} as const

export const EFFECT_STRENGTHS = {
  WEAK: 1,
  MEDIUM: 2,
  STRONG: 3
} as const

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
