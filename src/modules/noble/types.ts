export type NobleRank = 'baron' | 'viscount' | 'count' | 'marquess' | 'duke' | 'king'

export interface Resources {
  gold: number
  influence: number
}

export interface Title {
  id: string
  name: string
  description: string
}

export interface Noble {
  id: string
  rank: NobleRank
  titles: Title[]
  resources: Resources
  experience: number
  level: number
  achievements: {
    completed: string[]
    total: number
    categories: {
      diplomacy: number
      development: number
      trade: number
      research: number
      strategy: number
      wisdom: number
    }
  }
  stats: {
    tasksCompleted: number
    territoriesOwned: number
    totalInfluence: number
    specialEffects: Record<string, number>
    taskStreaks: Record<string, {
      current: number
      best: number
      lastCompleted?: Date
    }>
  }
}

export interface NobleTitle {
  name: string
  requiredLevel: number
  bonuses: {
    production?: number
    influence?: number
    development?: number
  }
}

export const NOBLE_TITLES: Record<string, NobleTitle> = {
  squire: {
    name: 'Сквайр',
    requiredLevel: 1,
    bonuses: {
      production: 5
    }
  },
  baron: {
    name: 'Барон',
    requiredLevel: 5,
    bonuses: {
      production: 10,
      influence: 5
    }
  },
  count: {
    name: 'Граф',
    requiredLevel: 10,
    bonuses: {
      production: 15,
      influence: 10,
      development: 5
    }
  },
  duke: {
    name: 'Герцог',
    requiredLevel: 20,
    bonuses: {
      production: 20,
      influence: 15,
      development: 10
    }
  }
}
