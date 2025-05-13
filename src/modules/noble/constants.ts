import { NobleRank } from './types'
import { RankRequirement, NobleRankType } from './types'

export const rankTitles: Record<NobleRank, string> = {
  'барон': 'Барон',
  'виконт': 'Виконт',
  'граф': 'Граф',
  'маркиз': 'Маркиз',
  'герцог': 'Герцог',
  'король': 'Король'
}

export const rankRequirements: Record<NobleRank, {
  territories: number;
  influence: number;
  achievements: number;
}> = {
  'барон': {
    territories: 0,
    influence: 0,
    achievements: 0
  },
  'виконт': {
    territories: 2,
    influence: 2500,
    achievements: 5
  },
  'граф': {
    territories: 4,
    influence: 5000,
    achievements: 10
  },
  'маркиз': {
    territories: 6,
    influence: 9000,
    achievements: 20
  },
  'герцог': {
    territories: 9,
    influence: 25000,
    achievements: 35
  },
  'король': {
    territories: 15,
    influence: 50000,
    achievements: 45
  }
}

export const RANKS: RankRequirement[] = [
  {
    minLevel: 1,
    maxLevel: 20,
    title: 'барон',
    experienceMultiplier: 1
  },
  {
    minLevel: 21,
    maxLevel: 40,
    title: 'виконт',
    experienceMultiplier: 1.2
  },
  {
    minLevel: 41,
    maxLevel: 60,
    title: 'граф',
    experienceMultiplier: 1.5
  },
  {
    minLevel: 61,
    maxLevel: 80,
    title: 'маркиз',
    experienceMultiplier: 1.8
  },
  {
    minLevel: 81,
    maxLevel: 95,
    title: 'герцог',
    experienceMultiplier: 2.2
  },
  {
    minLevel: 96,
    maxLevel: 100,
    title: 'король',
    experienceMultiplier: 3
  }
];

export const BASE_EXPERIENCE = 100; // Базовый опыт за действие
export const LEVEL_MULTIPLIER = 0.05; // Множитель уровня (1 + level/20)

// Стартовые ресурсы для нового игрока
export const INITIAL_RESOURCES = {
  gold: 5000,
  influence: 1000
};

// Опыт необходимый для следующего уровня
export function calculateExperienceForLevel(level: number): number {
  return Math.floor(1000 * (1 + (level - 1) * 0.1));
}

// Получить требования для ранга
export function getRankRequirements(level: number): RankRequirement {
  return RANKS.find(rank => level >= rank.minLevel && level <= rank.maxLevel) || RANKS[0];
}

// Рассчитать множители опыта
export function calculateExperienceMultipliers(level: number, rank: NobleRankType) {
  const rankReq = RANKS.find(r => r.title === rank);
  return {
    level: 1 + (level / 20), // Множитель от уровня
    rank: rankReq?.experienceMultiplier || 1, // Множитель от ранга
    bonus: 1 // Базовый бонусный множитель
  };
}

// Проверить, достигнут ли следующий ранг
export function checkRankUpgrade(level: number, currentRank: NobleRankType): NobleRankType | null {
  const nextRank = RANKS.find(rank => 
    rank.minLevel === level && rank.title !== currentRank
  );
  return nextRank?.title || null;
}