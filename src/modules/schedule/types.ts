export interface TimeSlot {
  startTime: string; // формат "HH:mm"
  endTime: string;
  duration: string;
}

export interface ScheduleTask {
  id: string;
  timeSlot: TimeSlot;
  activity: string;
  category: TaskCategory;
  isCompleted: boolean;
  completedAt?: Date;
}

export type TaskCategory = 
  | 'english'     // Дипломатические миссии
  | 'coding'      // Развитие территорий
  | 'linkedin'    // Торговые связи
  | 'learning'    // Исследования
  | 'break'       // Восстановление
  | 'meal'        // Пир
  | 'reading'     // Изучение манускриптов
  | 'entertainment' // Праздники
  | 'chess'       // Стратегия
  | 'reflection'  // Совет мудрецов

export interface TaskTerritoryEffect {
  territoryTypes: ('fortress' | 'camp' | 'village' | 'mine' | 'temple')[];
  developmentBonus: number;
  resourceMultiplier: number;
  specialEffect?: string;
}

export interface TaskReward {
  gold: number;
  influence: number;
  experience: number;
  territoryEffect?: TaskTerritoryEffect;
  nextTaskBonus?: number; // Для перерывов
}

export const CATEGORY_REWARDS: Record<TaskCategory, TaskReward> = {
  english: {
    gold: 20,
    influence: 25,
    experience: 25,
    territoryEffect: {
      territoryTypes: ['temple'],
      developmentBonus: 5,
      resourceMultiplier: 1.2,
      specialEffect: 'diplomacy'
    }
  },
  coding: {
    gold: 30,
    influence: 20,
    experience: 30,
    territoryEffect: {
      territoryTypes: ['fortress', 'village'],
      developmentBonus: 8,
      resourceMultiplier: 1.1
    }
  },
  linkedin: {
    gold: 25,
    influence: 25,
    experience: 20,
    territoryEffect: {
      territoryTypes: ['village', 'mine'],
      developmentBonus: 3,
      resourceMultiplier: 1.3,
      specialEffect: 'trade'
    }
  },
  learning: {
    gold: 25,
    influence: 20,
    experience: 35,
    territoryEffect: {
      territoryTypes: ['temple'],
      developmentBonus: 6,
      resourceMultiplier: 1.15,
      specialEffect: 'research'
    }
  },
  break: {
    gold: 5,
    influence: 5,
    experience: 5,
    nextTaskBonus: 0.2 // 20% бонус к следующему заданию
  },
  meal: {
    gold: 10,
    influence: 5,
    experience: 5,
    territoryEffect: {
      territoryTypes: ['village'],
      developmentBonus: 2,
      resourceMultiplier: 1.05
    }
  },
  reading: {
    gold: 15,
    influence: 15,
    experience: 20,
    territoryEffect: {
      territoryTypes: ['temple'],
      developmentBonus: 4,
      resourceMultiplier: 1.1,
      specialEffect: 'wisdom'
    }
  },
  entertainment: {
    gold: 10,
    influence: 10,
    experience: 15,
    territoryEffect: {
      territoryTypes: ['village'],
      developmentBonus: 3,
      resourceMultiplier: 1.1,
      specialEffect: 'happiness'
    }
  },
  chess: {
    gold: 20,
    influence: 15,
    experience: 25,
    territoryEffect: {
      territoryTypes: ['fortress'],
      developmentBonus: 5,
      resourceMultiplier: 1.15,
      specialEffect: 'strategy'
    }
  },
  reflection: {
    gold: 25,
    influence: 25,
    experience: 30,
    territoryEffect: {
      territoryTypes: ['temple', 'fortress'],
      developmentBonus: 7,
      resourceMultiplier: 1.2,
      specialEffect: 'wisdom'
    }
  }
}

export const CATEGORY_ICONS: Record<TaskCategory, string> = {
  english: '🇬🇧',
  coding: '💻',
  linkedin: '💼',
  learning: '📚',
  break: '☕',
  meal: '🍽️',
  reading: '📖',
  entertainment: '🎬',
  chess: '♟️',
  reflection: '✍️'
}

export const CATEGORY_COLORS: Record<TaskCategory, {
  bg: string,
  text: string,
  border: string
}> = {
  english: {
    bg: 'bg-blue-900/20',
    text: 'text-blue-200',
    border: 'border-blue-700'
  },
  coding: {
    bg: 'bg-purple-900/20',
    text: 'text-purple-200',
    border: 'border-purple-700'
  },
  linkedin: {
    bg: 'bg-indigo-900/20',
    text: 'text-indigo-200',
    border: 'border-indigo-700'
  },
  learning: {
    bg: 'bg-green-900/20',
    text: 'text-green-200',
    border: 'border-green-700'
  },
  break: {
    bg: 'bg-gray-800/20',
    text: 'text-gray-300',
    border: 'border-gray-700'
  },
  meal: {
    bg: 'bg-yellow-900/20',
    text: 'text-yellow-200',
    border: 'border-yellow-700'
  },
  reading: {
    bg: 'bg-amber-900/20',
    text: 'text-amber-200',
    border: 'border-amber-700'
  },
  entertainment: {
    bg: 'bg-pink-900/20',
    text: 'text-pink-200',
    border: 'border-pink-700'
  },
  chess: {
    bg: 'bg-cyan-900/20',
    text: 'text-cyan-200',
    border: 'border-cyan-700'
  },
  reflection: {
    bg: 'bg-emerald-900/20',
    text: 'text-emerald-200',
    border: 'border-emerald-700'
  }
}
