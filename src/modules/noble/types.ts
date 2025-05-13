export interface NobleStats {
  totalInfluence: number
  territoriesOwned: number
  taskStreaks: Record<string, TaskStreak>
  specialEffects: Record<string, number>
}

export interface TaskStreak {
  current: number
  best: number
  lastCompleted?: Date
}

export interface NobleResources {
  gold: number
  influence: number
}

export interface NobleStatus {
  reputation: number
  influence: number
  popularity: number
}

export interface NoblePerk {
  name: string
  description: string
  icon: string
  bonus: {
    type: string
    value: number
  }
}

export interface NobleTitle {
  id: string
  name: string
  description: string
  unlockedAt: number
}

export interface NobleAchievements {
  total: number
  categories: {
    diplomacy: number
    development: number
    trade: number
    research: number
    strategy: number
    wisdom: number
  }
  completed: string[]
}

export type NobleRankType = 'барон' | 'виконт' | 'граф' | 'маркиз' | 'герцог' | 'король';

export interface RankRequirement {
  minLevel: number;
  maxLevel: number;
  title: NobleRankType;
  experienceMultiplier: number;
}

export interface ExperienceCalculation {
  baseExperience: number;
  levelMultiplier: number;
  bonusMultiplier: number;
}

export interface Noble {
  id: string
  rank: NobleRankType
  level: number
  experience: number
  experienceForNextLevel: number
  experienceMultipliers: {
    level: number
    rank: number
    bonus: number
  }
  resources: NobleResources
  stats: NobleStats
  status: NobleStatus
  perks: NoblePerk[]
  achievements: NobleAchievements
  titles: NobleTitle[]
  taskStreaks: Record<string, TaskStreak>
}

export type NobleRank = 
  | 'барон'
  | 'виконт'
  | 'граф'
  | 'маркиз'
  | 'герцог'
  | 'князь'
  | 'king'

export type TaskCategory = 
  | 'daily'
  | 'weekly'
  | 'development'
  | 'trade'
  | 'diplomacy'
  | 'research'
  | 'strategy'

export interface NobleActions {
  addResources: (resources: Partial<NobleResources>) => void
  removeResources: (resources: Partial<NobleResources>) => void
  updateStats: (stats: Partial<NobleStats>) => void
  addExperience: (amount: number) => void
  unlockAchievement: (achievement: string) => void
  addTitle: (title: NobleTitle) => void
  updateTaskStreak: (taskId: string, streak: TaskStreak) => void
}
