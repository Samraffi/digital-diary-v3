'use client'

import { useEffect } from 'react'
import { useNobleStore } from '@/modules/noble/store'
import { useTerritoryStore } from '@/modules/territory/store'
import { useGameNotifications } from './useGameNotifications'

interface Achievement {
  id: string
  name: string
  description: string
  check: (noble: any, territories: any[]) => boolean
  reward: {
    gold?: number
    influence?: number
    experience?: number
  }
}

const ACHIEVEMENTS: Achievement[] = [
  // Territory Achievements
  {
    id: 'first_territory',
    name: 'Землевладелец',
    description: 'Приобретите свою первую территорию',
    check: (_, territories) => territories.length >= 1,
    reward: {
      gold: 200,
      influence: 100,
      experience: 300
    }
  },
  {
    id: 'territory_master',
    name: 'Правитель земель',
    description: 'Владейте 5 территориями',
    check: (_, territories) => territories.length >= 5,
    reward: {
      gold: 900,
      influence: 500,
      experience: 900
    }
  },
  {
    id: 'territory_diversity',
    name: 'Разнообразие владений',
    description: 'Владейте всеми типами территорий',
    check: (_, territories) => {
      const types = new Set(territories.map(t => t.type))
      return types.size >= 5
    },
    reward: {
      gold: 2000,
      influence: 900,
      experience: 1500
    }
  },
  {
    id: 'master_developer',
    name: 'Мастер развития',
    description: 'Улучшите территорию до 5 уровня',
    check: (_, territories) => territories.some(t => t.level >= 5),
    reward: {
      gold: 3000,
      influence: 1500,
      experience: 2000
    }
  },
  {
    id: 'territory_empire',
    name: 'Империя',
    description: 'Владейте 10 территориями',
    check: (_, territories) => territories.length >= 10,
    reward: {
      gold: 5000,
      influence: 2500,
      experience: 3000
    }
  },
  {
    id: 'development_master',
    name: 'Градостроитель',
    description: 'Имейте 3 территории 5-го уровня',
    check: (_, territories) => territories.filter(t => t.level >= 5).length >= 3,
    reward: {
      gold: 4000,
      influence: 2000,
      experience: 2500
    }
  },

  // Level Achievements
  {
    id: 'level_5',
    name: 'Опытный дворянин',
    description: 'Достигните 5 уровня',
    check: (noble) => noble.level >= 5,
    reward: {
      gold: 1000,
      influence: 500
    }
  },
  {
    id: 'level_10',
    name: 'Мудрый правитель',
    description: 'Достигните 10 уровня',
    check: (noble) => noble.level >= 10,
    reward: {
      gold: 2500,
      influence: 1000
    }
  },
  {
    id: 'level_20',
    name: 'Легендарный властитель',
    description: 'Достигните 20 уровня',
    check: (noble) => noble.level >= 20,
    reward: {
      gold: 5000,
      influence: 2500
    }
  },
  {
    id: 'level_30',
    name: 'Величайший властитель',
    description: 'Достигните 30 уровня',
    check: (noble) => noble.level >= 30,
    reward: {
      gold: 10000,
      influence: 5000
    }
  },

  // Specialization Achievements
  {
    id: 'fortress_master',
    name: 'Военный стратег',
    description: 'Владейте 3 крепостями',
    check: (_, territories) => territories.filter(t => t.type === 'fortress').length >= 3,
    reward: {
      influence: 1500,
      experience: 1200
    }
  },
  {
    id: 'mining_master',
    name: 'Хозяин рудников',
    description: 'Владейте 3 шахтами',
    check: (_, territories) => territories.filter(t => t.type === 'mine').length >= 3,
    reward: {
      gold: 3000,
      experience: 1200
    }
  },
  {
    id: 'temple_master',
    name: 'Покровитель храмов',
    description: 'Владейте 3 храмами',
    check: (_, territories) => territories.filter(t => t.type === 'temple').length >= 3,
    reward: {
      influence: 2000,
      experience: 1500
    }
  },

  // Territory Level Combinations
  {
    id: 'fortress_development',
    name: 'Неприступные стены',
    description: 'Имейте 3 крепости 4-го уровня',
    check: (_, territories) => territories.filter(t => t.type === 'fortress' && t.level >= 4).length >= 3,
    reward: {
      influence: 3000,
      experience: 2500
    }
  },
  {
    id: 'temple_development',
    name: 'Святые земли',
    description: 'Имейте 3 храма 4-го уровня',
    check: (_, territories) => territories.filter(t => t.type === 'temple' && t.level >= 4).length >= 3,
    reward: {
      influence: 3000,
      experience: 2500
    }
  },
  {
    id: 'mine_development',
    name: 'Золотая жила',
    description: 'Имейте 3 шахты 4-го уровня',
    check: (_, territories) => territories.filter(t => t.type === 'mine' && t.level >= 4).length >= 3,
    reward: {
      gold: 5000,
      experience: 2500
    }
  },

  // Territory Type Mastery
  {
    id: 'military_presence',
    name: 'Военное присутствие',
    description: 'Имейте 5 крепостей и 5 лагерей',
    check: (_, territories) => 
      territories.filter(t => t.type === 'fortress').length >= 5 &&
      territories.filter(t => t.type === 'camp').length >= 5,
    reward: {
      influence: 4000,
      experience: 3000
    }
  },
  {
    id: 'economic_power',
    name: 'Экономическая мощь',
    description: 'Имейте 5 шахт и 5 деревень',
    check: (_, territories) => 
      territories.filter(t => t.type === 'mine').length >= 5 &&
      territories.filter(t => t.type === 'village').length >= 5,
    reward: {
      gold: 8000,
      experience: 3000
    }
  },
  {
    id: 'spiritual_dominion',
    name: 'Духовное господство',
    description: 'Имейте 5 храмов уровня 3 или выше',
    check: (_, territories) => territories.filter(t => t.type === 'temple' && t.level >= 3).length >= 5,
    reward: {
      influence: 5000,
      experience: 3000
    }
  },

  // Advanced Development
  {
    id: 'perfect_territory',
    name: 'Совершенное владение',
    description: 'Улучшите любую территорию до 10 уровня',
    check: (_, territories) => territories.some(t => t.level >= 10),
    reward: {
      gold: 10000,
      influence: 5000,
      experience: 5000
    }
  },
  {
    id: 'development_expert',
    name: 'Эксперт развития',
    description: 'Имейте 5 территорий 5-го уровня',
    check: (_, territories) => territories.filter(t => t.level >= 5).length >= 5,
    reward: {
      gold: 8000,
      influence: 4000,
      experience: 4000
    }
  },
  {
    id: 'master_of_all',
    name: 'Мастер всего',
    description: 'Имейте хотя бы одну территорию каждого типа 5-го уровня',
    check: (_, territories) => {
      const types = ['fortress', 'mine', 'temple', 'village', 'camp']
      return types.every(type => territories.some(t => t.type === type && t.level >= 5))
    },
    reward: {
      gold: 15000,
      influence: 7500,
      experience: 5000
    }
  },

  // Elite Achievements
  {
    id: 'max_development',
    name: 'Максимальное развитие',
    description: 'Имейте 3 территории 10-го уровня',
    check: (_, territories) => territories.filter(t => t.level >= 10).length >= 3,
    reward: {
      gold: 20000,
      influence: 10000,
      experience: 8000
    }
  },
  {
    id: 'territory_legend',
    name: 'Легенда земель',
    description: 'Владейте 15 территориями',
    check: (_, territories) => territories.length >= 15,
    reward: {
      gold: 15000,
      influence: 7500,
      experience: 5000
    }
  },

  // Development Milestones
  {
    id: 'village_master',
    name: 'Покровитель поселений',
    description: 'Владейте 3 деревнями 3-го уровня',
    check: (_, territories) => territories.filter(t => t.type === 'village' && t.level >= 3).length >= 3,
    reward: {
      gold: 2000,
      influence: 1000,
      experience: 1500
    }
  },
  {
    id: 'camp_master',
    name: 'Мастер лагерей',
    description: 'Владейте 3 лагерями 3-го уровня',
    check: (_, territories) => territories.filter(t => t.type === 'camp' && t.level >= 3).length >= 3,
    reward: {
      gold: 2000,
      influence: 1000,
      experience: 1500
    }
  },

    // Mastery Achievements
    {
      id: 'village_empire',
      name: 'Империя деревень',
      description: 'Владейте 10 деревнями',
      check: (_, territories) => territories.filter(t => t.type === 'village').length >= 10,
      reward: {
        gold: 15000,
        influence: 7500,
        experience: 5000
      }
    },
    {
      id: 'fortress_empire',
      name: 'Империя крепостей',
      description: 'Владейте 10 крепостями',
      check: (_, territories) => territories.filter(t => t.type === 'fortress').length >= 10,
      reward: {
        gold: 15000,
        influence: 10000,
        experience: 5000
      }
    },
    {
      id: 'temple_empire',
      name: 'Империя храмов',
      description: 'Владейте 10 храмами',
      check: (_, territories) => territories.filter(t => t.type === 'temple').length >= 10,
      reward: {
        influence: 15000,
        experience: 5000
      }
    },
    {
      id: 'resource_master',
      name: 'Мастер ресурсов',
      description: 'Накопите 500000 золота и 200000 влияния одновременно',
      check: (noble) => noble.resources.gold >= 500000 && noble.resources.influence >= 200000,
      reward: {
        experience: 20000
      }
    },
    {
      id: 'level_master',
      name: 'Мастер развития',
      description: 'Достигните 50 уровня',
      check: (noble) => noble.level >= 50,
      reward: {
        gold: 50000,
        influence: 25000,
        experience: 10000
      }
    },
    {
      id: 'territory_god',
      name: 'Повелитель земель',
      description: 'Владейте 30 территориями',
      check: (_, territories) => territories.length >= 30,
      reward: {
        gold: 30000,
        influence: 15000,
        experience: 10000
      }
    },
    {
      id: 'perfect_development',
      name: 'Идеальное развитие',
      description: 'Имейте 10 территорий 10-го уровня',
      check: (_, territories) => territories.filter(t => t.level >= 10).length >= 10,
      reward: {
        gold: 50000,
        influence: 25000,
        experience: 15000
      }
    },
    {
      id: 'empire_balance',
      name: 'Баланс империи',
      description: 'Имейте по 5 территорий каждого типа',
      check: (_, territories) => {
        const types = ['fortress', 'mine', 'temple', 'village', 'camp']
        return types.every(type => territories.filter(t => t.type === type).length >= 5)
      },
      reward: {
        gold: 25000,
        influence: 12500,
        experience: 7500
      }
    },
    {
      id: 'perfect_balance',
      name: 'Идеальный баланс',
      description: 'Имейте все типы территорий 10-го уровня',
      check: (_, territories) => {
        const types = ['fortress', 'mine', 'temple', 'village', 'camp']
        return types.every(type => territories.some(t => t.type === type && t.level >= 10))
      },
      reward: {
        gold: 100000,
        influence: 50000,
        experience: 20000
      }
    },
    {
      id: 'legendary_ruler',
      name: 'Легендарный правитель',
      description: 'Достигните 100 уровня',
      check: (noble) => noble.level >= 100,
      reward: {
        gold: 200000,
        influence: 100000,
        experience: 50000
      }
    },

    // Royal Path Achievements
    {
      id: 'royal_economy',
      name: 'Королевское богатство',
      description: 'Имейте одновременно 1,000,000 золота и 500,000 влияния',
      check: (noble) => noble.resources.gold >= 1000000 && noble.resources.influence >= 500000,
      reward: {
        experience: 50000
      }
    },
    {
      id: 'royal_army',
      name: 'Непобедимая армия',
      description: 'Владейте 20 крепостями 5-го уровня',
      check: (_, territories) => territories.filter(t => t.type === 'fortress' && t.level >= 5).length >= 20,
      reward: {
        gold: 100000,
        influence: 50000,
        experience: 20000
      }
    },
    {
      id: 'royal_capital',
      name: 'Великая столица',
      description: 'Имейте 5 территорий каждого типа 10-го уровня',
      check: (_, territories) => {
        const types = ['fortress', 'mine', 'temple', 'village', 'camp']
        return types.every(type => territories.filter(t => t.type === type && t.level >= 10).length >= 5)
      },
      reward: {
        gold: 200000,
        influence: 100000,
        experience: 30000
      }
    },
    {
      id: 'royal_enlightenment',
      name: 'Просвещённый монарх',
      description: 'Достигните 200 уровня',
      check: (noble) => noble.level >= 200,
      reward: {
        gold: 500000,
        influence: 250000,
        experience: 100000
      }
    },
    {
      id: 'royal_empire',
      name: 'Величайшая империя',
      description: 'Владейте 50 территориями',
      check: (_, territories) => territories.length >= 50,
      reward: {
        gold: 150000,
        influence: 75000,
        experience: 25000
      }
    },
    {
      id: 'royal_perfection',
      name: 'Абсолютное совершенство',
      description: 'Имейте 20 территорий 10-го уровня',
      check: (_, territories) => territories.filter(t => t.level >= 10).length >= 20,
      reward: {
        gold: 300000,
        influence: 150000,
        experience: 50000
      }
    },
    {
      id: 'royal_legacy',
      name: 'Вечное наследие',
      description: 'Выполните все остальные достижения',
      check: (noble) => {
        const totalAchievements = ACHIEVEMENTS.length - 1 // Исключая само это достижение
        return noble.achievements.completed.length >= totalAchievements
      },
      reward: {
        gold: 1000000,
        influence: 500000,
        experience: 200000
      }
    },

    // Ultimate Achievements
  {
    id: 'balanced_ruler',
    name: 'Мудрый правитель',
    description: 'Имейте все типы территорий 3-го уровня',
    check: (_, territories) => {
      const types = ['fortress', 'mine', 'temple', 'village', 'camp']
      return types.every(type => territories.some(t => t.type === type && t.level >= 3))
    },
    reward: {
      gold: 5000,
      influence: 2500,
      experience: 3000
    }
  },
  {
    id: 'ultimate_ruler',
    name: 'Абсолютный правитель',
    description: 'Достигните 30 уровня и владейте 20 территориями',
    check: (noble, territories) => noble.level >= 30 && territories.length >= 20,
    reward: {
      gold: 50000,
      influence: 25000,
      experience: 10000
    }
  }
]

export function useAchievements() {
  const noble = useNobleStore(state => state.noble)
  const territories = useTerritoryStore(state => state.territories)
  const { addResources, completeAchievement, addExperience } = useNobleStore()
  const { notifyAchievement, notifyResourceReward } = useGameNotifications()

  useEffect(() => {
    if (!noble) return

    // Проверяем каждое достижение
    ACHIEVEMENTS.forEach(achievement => {
      // Пропускаем уже полученные достижения
      if (noble.achievements.completed.includes(achievement.id)) return

      // Проверяем условие достижения
      if (achievement.check(noble, territories)) {
        // Начисляем награду
        const reward = achievement.reward
        if (reward.gold || reward.influence) {
          addResources({
            gold: reward.gold,
            influence: reward.influence
          })
          notifyResourceReward({
            gold: reward.gold,
            influence: reward.influence
          })
        }
        if (reward.experience) {
          addExperience(reward.experience)
        }

        // Отмечаем достижение как полученное
        completeAchievement(achievement.id)

        // Показываем уведомление
        // Специальное уведомление для королевского достижения
        if (achievement.id === 'royal_capital') {
          notifyAchievement('Теперь ты король!', 'Вы достигли вершины власти')
        } else {
          notifyAchievement(achievement.name, achievement.description)
        }
      }
    })
  }, [noble, territories, addResources, addExperience, completeAchievement, notifyAchievement, notifyResourceReward])

  return {
    achievements: ACHIEVEMENTS,
    completed: noble?.achievements.completed || []
  }
}
