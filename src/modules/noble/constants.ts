import { NobleRank } from './types'

export const rankTitles: Record<NobleRank, string> = {
  baron: 'Барон',
  viscount: 'Виконт',
  count: 'Граф',
  marquess: 'Маркиз',
  duke: 'Герцог',
  king: 'Король'
}

export const rankRequirements: Record<NobleRank, {
  territories: number;
  influence: number;
  achievements: number;
}> = {
  baron: {
    territories: 0,
    influence: 0,
    achievements: 0
  },
  viscount: {
    territories: 2,
    influence: 2500,
    achievements: 5
  },
  count: {
    territories: 4,
    influence: 5000,
    achievements: 10
  },
  marquess: {
    territories: 6,
    influence: 9000,
    achievements: 20
  },
  duke: {
    territories: 9,
    influence: 25000,
    achievements: 35
  },
  king: {
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
  baron: {
    maxTerritories: 3,
    resourceMultiplier: 1.0,
    specialActions: ['local-decree']
  },
  viscount: {
    maxTerritories: 5,
    resourceMultiplier: 1.2,
    specialActions: ['local-decree', 'trade-route']
  },
  count: {
    maxTerritories: 8,
    resourceMultiplier: 1.35,
    specialActions: ['local-decree', 'trade-route', 'festival']
  },
  marquess: {
    maxTerritories: 12,
    resourceMultiplier: 1.5,
    specialActions: ['local-decree', 'trade-route', 'festival', 'royal-project']
  },
  duke: {
    maxTerritories: 15,
    resourceMultiplier: 2.0,
    specialActions: ['local-decree', 'trade-route', 'festival', 'royal-project', 'duchy-celebration']
  },
  king: {
    maxTerritories: 25,
    resourceMultiplier: 3.0,
    specialActions: ['local-decree', 'trade-route', 'festival', 'royal-project', 'duchy-celebration', 'royal-conquest', 'royal-feast']
  }
}
