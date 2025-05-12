export type SpecialActionType = 
  | 'local-decree'    // Издать местный указ
  | 'trade-route'     // Открыть торговый путь
  | 'festival'        // Организовать фестиваль
  | 'royal-project'   // Запустить королевский проект
  | 'duchy-celebration' // Провести празднование герцогства

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
  rewards: {
    gold?: number
    influence?: number
    experience?: number
  }
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
    }
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
      rank: 'viscount',
      territories: 2
    },
    cooldown: 48,
    rewards: {
      gold: 100,
      influence: 50,
      experience: 200
    }
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
      rank: 'count',
      territories: 4,
      influence: 5000
    },
    cooldown: 72,
    rewards: {
      influence: 200,
      experience: 500
    }
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
      rank: 'marquess',
      territories: 6,
      influence: 9000,
      achievements: 20
    },
    cooldown: 168, // 7 дней
    rewards: {
      gold: 500,
      influence: 400,
      experience: 900
    }
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
      rank: 'duke',
      territories: 9,
      influence: 25000,
      achievements: 35
    },
    cooldown: 336, // 14 дней
    rewards: {
      gold: 900,
      influence: 800,
      experience: 2000
    }
  }
}
