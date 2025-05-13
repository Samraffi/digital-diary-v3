export type SpecialActionType = 
  | 'buy-village'     // Купить деревню
  | 'buy-mine'        // Купить шахту
  | 'buy-fortress'    // Купить крепость
  | 'buy-temple'      // Купить храм

export interface ActionCost {
  gold?: number
  influence?: number
}

export interface ActionRequirement {
  rank?: string
  territories?: number
  influence?: number
  achievements?: number
}

export interface SpecialAction {
  type: SpecialActionType
  name: string
  description: string
  cost: ActionCost
  requirements: ActionRequirement
  cooldown: number // в часах
  rewards?: {
    gold?: number
    influence?: number
    experience?: number
  }
  category?: 'territory' | 'action'
}

export const SPECIAL_ACTIONS: Record<SpecialActionType, SpecialAction> = {
  'buy-village': {
    type: 'buy-village',
    name: 'Купить деревню',
    description: 'Приобрести новую деревню для расширения владений',
    cost: {
      gold: 500,
      influence: 200
    },
    requirements: {
      rank: 'барон'
    },
    cooldown: 0,
    category: 'territory'
  },
  'buy-mine': {
    type: 'buy-mine',
    name: 'Купить шахту',
    description: 'Приобрести шахту для добычи ресурсов',
    cost: {
      gold: 800,
      influence: 300
    },
    requirements: {
      rank: 'виконт'
    },
    cooldown: 0,
    category: 'territory'
  },
  'buy-fortress': {
    type: 'buy-fortress',
    name: 'Купить крепость',
    description: 'Приобрести крепость для укрепления влияния',
    cost: {
      gold: 1200,
      influence: 500
    },
    requirements: {
      rank: 'граф'
    },
    cooldown: 0,
    category: 'territory'
  },
  'buy-temple': {
    type: 'buy-temple',
    name: 'Купить храм',
    description: 'Приобрести храм для повышения духовного влияния',
    cost: {
      gold: 1500,
      influence: 700
    },
    requirements: {
      rank: 'маркиз'
    },
    cooldown: 0,
    category: 'territory'
  }
}
