import { NobleRankType } from '@/modules/noble/types'

interface PathRequirements {
  rank?: NobleRankType
  influence?: number
  gold?: number
  territories?: number
  completedPaths?: string[]
}

interface PathRewards {
  gold?: number
  influence?: number
  experience?: number
}

export interface NoblePath {
  id: string
  name: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard' | 'epic'
  isTutorialPath: boolean
  requirements: PathRequirements
  rewards: PathRewards
}

export const NOBLE_PATHS: Record<string, NoblePath> = {
  'build-first-village': {
    id: 'build-first-village',
    name: 'Основание первой деревни',
    description: 'Постройте свою первую деревню для начала развития владений',
    category: 'development',
    difficulty: 'easy',
    isTutorialPath: true,
    requirements: {
      rank: 'барон' as NobleRankType,
      influence: 10,
      gold: 100
    },
    rewards: {
      gold: 200,
      influence: 20,
      experience: 100
    }
  },
  'upgrade-village': {
    id: 'upgrade-village',
    name: 'Развитие деревни',
    description: 'Улучшите деревню до 2 уровня',
    category: 'development',
    difficulty: 'medium',
    isTutorialPath: true,
    requirements: {
      rank: 'барон' as NobleRankType,
      influence: 20,
      gold: 300,
      completedPaths: ['build-first-village']
    },
    rewards: {
      gold: 400,
      influence: 40,
      experience: 200
    }
  },
  'expand-territory': {
    id: 'expand-territory',
    name: 'Расширение владений',
    description: 'Постройте вторую деревню',
    category: 'development',
    difficulty: 'hard',
    isTutorialPath: true,
    requirements: {
      rank: 'барон' as NobleRankType,
      influence: 40,
      gold: 500,
      completedPaths: ['upgrade-village']
    },
    rewards: {
      gold: 600,
      influence: 60,
      experience: 300
    }
  },
  'build-mine': {
    id: 'build-mine',
    name: 'Основание шахты',
    description: 'Постройте первую шахту',
    category: 'development',
    difficulty: 'medium',
    isTutorialPath: true,
    requirements: {
      rank: 'виконт' as NobleRankType,
      influence: 60,
      gold: 800,
      completedPaths: ['expand-territory']
    },
    rewards: {
      gold: 1000,
      influence: 80,
      experience: 400
    }
  },
  'territory-management': {
    id: 'territory-management',
    name: 'Управление территориями',
    description: 'Улучшите все территории до 3 уровня',
    category: 'development',
    difficulty: 'hard',
    isTutorialPath: true,
    requirements: {
      rank: 'виконт' as NobleRankType,
      influence: 100,
      gold: 1500,
      completedPaths: ['build-mine']
    },
    rewards: {
      gold: 2000,
      influence: 150,
      experience: 600
    }
  },
  'mining-empire': {
    id: 'mining-empire',
    name: 'Горная империя',
    description: 'Постройте вторую шахту',
    category: 'development',
    difficulty: 'epic',
    isTutorialPath: true,
    requirements: {
      rank: 'виконт' as NobleRankType,
      influence: 200,
      gold: 3000,
      completedPaths: ['territory-management']
    },
    rewards: {
      gold: 4000,
      influence: 300,
      experience: 1000
    }
  }
} 