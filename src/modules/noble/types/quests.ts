export interface QuestRequirement {
  rank?: string;
  territories?: number;
  influence?: number;
  achievements?: string[];
  completedQuests?: string[]; // Зависимости от других заданий
  gold?: number; // Требование к количеству золота
  tutorialStep?: string; // ID шага обучения, который нужно выполнить
}

export interface QuestReward {
  gold?: number;
  influence?: number;
  experience?: number;
  achievement?: string;
  completeTutorialStep?: string; // ID шага обучения, который будет завершен
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  category: 'development' | 'trade' | 'diplomacy' | 'research' | 'strategy';
  requirements: QuestRequirement;
  rewards: QuestReward;
  timeLimit?: number; // в минутах, если есть ограничение по времени
  isTutorialQuest?: boolean; // Является ли квест частью обучения
}

// Константы для заданий
export const QUESTS: Record<string, Quest> = {
  // Развитие (Development) - Обучающие квесты для Барона
  'build-first-village': {
    id: 'build-first-village',
    name: 'Первая деревня',
    description: 'Постройте свою первую деревню для расширения влияния',
    difficulty: 'easy',
    category: 'development',
    requirements: {
      rank: 'барон',
      influence: 200
    },
    rewards: {
      gold: 100,
      influence: 50,
      experience: 100,
      achievement: 'first_village',
      completeTutorialStep: 'baron-1'
    },
    isTutorialQuest: true
  },
  'upgrade-village': {
    id: 'upgrade-village',
    name: 'Развитие поселения',
    description: 'Улучшите деревню до 2 уровня',
    difficulty: 'easy',
    category: 'development',
    requirements: {
      rank: 'барон',
      gold: 1000,
      influence: 400,
      completedQuests: ['build-first-village'],
      tutorialStep: 'baron-1'
    },
    rewards: {
      gold: 200,
      influence: 100,
      experience: 200,
      completeTutorialStep: 'baron-2'
    },
    isTutorialQuest: true
  },
  'expand-territory': {
    id: 'expand-territory',
    name: 'Расширение влияния',
    description: 'Приобретите вторую деревню',
    difficulty: 'medium',
    category: 'development',
    requirements: {
      rank: 'барон',
      gold: 500,
      influence: 200,
      completedQuests: ['upgrade-village'],
      tutorialStep: 'baron-2'
    },
    rewards: {
      gold: 300,
      influence: 150,
      experience: 300,
      completeTutorialStep: 'baron-3'
    },
    isTutorialQuest: true
  },

  // Развитие - Обучающие квесты для Виконта
  'build-mine': {
    id: 'build-mine',
    name: 'Горное дело',
    description: 'Постройте шахту для увеличения добычи золота',
    difficulty: 'medium',
    category: 'development',
    requirements: {
      rank: 'виконт',
      influence: 300,
      completedQuests: ['expand-territory'],
      tutorialStep: 'baron-3'
    },
    rewards: {
      gold: 200,
      influence: 100,
      experience: 200,
      achievement: 'first_mine',
      completeTutorialStep: 'viscount-1'
    },
    isTutorialQuest: true
  },
  'territory-management': {
    id: 'territory-management',
    name: 'Эффективное управление',
    description: 'Улучшите все территории до 3 уровня',
    difficulty: 'hard',
    category: 'development',
    requirements: {
      rank: 'виконт',
      gold: 1500,
      influence: 600,
      completedQuests: ['build-mine'],
      tutorialStep: 'viscount-1'
    },
    rewards: {
      gold: 500,
      influence: 250,
      experience: 500,
      completeTutorialStep: 'viscount-2'
    },
    isTutorialQuest: true
  },
  'mining-empire': {
    id: 'mining-empire',
    name: 'Горный магнат',
    description: 'Постройте вторую шахту',
    difficulty: 'hard',
    category: 'development',
    requirements: {
      rank: 'виконт',
      gold: 800,
      influence: 300,
      completedQuests: ['territory-management'],
      tutorialStep: 'viscount-2'
    },
    rewards: {
      gold: 600,
      influence: 300,
      experience: 600,
      completeTutorialStep: 'viscount-3'
    },
    isTutorialQuest: true
  },

  // Дополнительные квесты (не часть обучения)
  'establish-trade-route': {
    id: 'establish-trade-route',
    name: 'Торговый путь',
    description: 'Установите торговый маршрут между двумя территориями',
    difficulty: 'easy',
    category: 'trade',
    requirements: {
      territories: 2
    },
    rewards: {
      gold: 150,
      influence: 50,
      experience: 100
    }
  },
  'create-market': {
    id: 'create-market',
    name: 'Рыночная площадь',
    description: 'Создайте рыночную площадь в одной из ваших территорий',
    difficulty: 'medium',
    category: 'trade',
    requirements: {
      completedQuests: ['establish-trade-route'],
      gold: 300
    },
    rewards: {
      gold: 200,
      influence: 100,
      experience: 200
    }
  },
  'first-alliance': {
    id: 'first-alliance',
    name: 'Первый союз',
    description: 'Заключите свой первый дипломатический союз',
    difficulty: 'medium',
    category: 'diplomacy',
    requirements: {
      rank: 'виконт'
    },
    rewards: {
      influence: 200,
      experience: 300
    }
  },
  'unlock-new-building': {
    id: 'unlock-new-building',
    name: 'Новые горизонты',
    description: 'Исследуйте новый тип постройки',
    difficulty: 'medium',
    category: 'research',
    requirements: {
      gold: 400,
      influence: 200
    },
    rewards: {
      experience: 300,
      achievement: 'researcher'
    }
  }
}; 