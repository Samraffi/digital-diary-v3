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

export const rankBenefits: Record<NobleRank, {
  maxTerritories: number;
  resourceMultiplier: number;
  specialActions: string[];
}> = {
  'барон': {
    maxTerritories: 3,
    resourceMultiplier: 1.0,
    specialActions: ['local-decree']
  },
  'виконт': {
    maxTerritories: 5,
    resourceMultiplier: 1.2,
    specialActions: ['local-decree', 'trade-route']
  },
  'граф': {
    maxTerritories: 8,
    resourceMultiplier: 1.35,
    specialActions: ['local-decree', 'trade-route', 'festival']
  },
  'маркиз': {
    maxTerritories: 12,
    resourceMultiplier: 1.5,
    specialActions: ['local-decree', 'trade-route', 'festival', 'royal-project']
  },
  'герцог': {
    maxTerritories: 15,
    resourceMultiplier: 2.0,
    specialActions: ['local-decree', 'trade-route', 'festival', 'royal-project', 'duchy-celebration']
  },
  'князь': {
    maxTerritories: 20,
    resourceMultiplier: 2.5,
    specialActions: ['local-decree', 'trade-route', 'festival', 'royal-project', 'duchy-celebration', 'princely-decree']
  },
  'king': {
    maxTerritories: 25,
    resourceMultiplier: 3.0,
    specialActions: ['local-decree', 'trade-route', 'festival', 'royal-project', 'duchy-celebration', 'royal-conquest', 'royal-feast']
  }
}
