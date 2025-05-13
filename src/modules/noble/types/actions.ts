export type SpecialActionType = 
  | 'local-decree'    // Издать местный указ
  | 'trade-route'     // Открыть торговый путь
  | 'festival'        // Организовать фестиваль
  | 'royal-project'   // Запустить королевский проект
  | 'duchy-celebration' // Провести празднование герцогства
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
  'local-decree': {
    type: 'local-decree',
    name: 'Местный Указ',
    description: 'Издайте указ, влияющий на одну из ваших территорий',
    cost: {
      influence: 100
    },
    requirements: {
      territories: 1
    },
    cooldown: 24,
    rewards: {
      gold: 50,
      experience: 100
    },
    category: 'action'
  },
  'trade-route': {
    type: 'trade-route',
    name: 'Торговый Путь',
    description: 'Установите торговый маршрут между двумя территориями',
    cost: {
      gold: 200,
      influence: 150
    },
    requirements: {
      rank: 'виконт',
      territories: 2
    },
    cooldown: 48,
    rewards: {
      gold: 100,
      influence: 50,
      experience: 200
    },
    category: 'action'
  },
  'festival': {
    type: 'festival',
    name: 'Фестиваль',
    description: 'Организуйте масштабный праздник для своих подданных',
    cost: {
      gold: 500,
      influence: 300
    },
    requirements: {
      rank: 'граф',
      territories: 4,
      influence: 5000
    },
    cooldown: 72,
    rewards: {
      influence: 200,
      experience: 500
    },
    category: 'action'
  },
  'royal-project': {
    type: 'royal-project',
    name: 'Королевский Проект',
    description: 'Запустите масштабный проект, который привлечет внимание короны',
    cost: {
      gold: 900,
      influence: 500
    },
    requirements: {
      rank: 'маркиз',
      territories: 6,
      influence: 9000,
      achievements: 20
    },
    cooldown: 168,
    rewards: {
      gold: 500,
      influence: 400,
      experience: 900
    },
    category: 'action'
  },
  'duchy-celebration': {
    type: 'duchy-celebration',
    name: 'Празднование Герцогства',
    description: 'Устройте грандиозное празднование в честь вашего герцогства',
    cost: {
      gold: 2000,
      influence: 900
    },
    requirements: {
      rank: 'герцог',
      territories: 9,
      influence: 25000,
      achievements: 35
    },
    cooldown: 336,
    rewards: {
      gold: 900,
      influence: 800,
      experience: 2000
    },
    category: 'action'
  },
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
