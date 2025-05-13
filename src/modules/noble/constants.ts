import { NobleRank } from './types'

export const rankTitles: Record<NobleRank, string> = {
  'барон': 'Барон',
  'виконт': 'Виконт',
  'граф': 'Граф',
  'маркиз': 'Маркиз',
  'герцог': 'Герцог',
  'князь': 'Князь',
  'king': 'Король'
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
  'князь': {
    territories: 12,
    influence: 35000,
    achievements: 40
  },
  'king': {
    territories: 15,
    influence: 50000,
    achievements: 45
  }
}