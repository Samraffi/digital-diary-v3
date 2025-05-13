export const achievementNames: Record<string, string> = {
  // Territory Achievements
  'first_territory': 'Землевладелец',
  'territory_master': 'Правитель земель',
  'territory_diversity': 'Разнообразие владений',
  'master_developer': 'Мастер развития',
  'territory_empire': 'Империя',
  'development_master': 'Градостроитель',

  // Level Achievements
  'level_5': 'Опытный дворянин',
  'level_10': 'Мудрый правитель',
  'level_20': 'Легендарный властитель',
  'level_30': 'Величайший властитель',

  // Specialization Achievements
  'fortress_master': 'Военный стратег',
  'mining_master': 'Хозяин рудников',
  'temple_master': 'Покровитель храмов',

  // Territory Level Combinations
  'fortress_development': 'Неприступные стены',
  'temple_development': 'Святые земли',
  'mine_development': 'Золотая жила',

  // Territory Type Mastery
  'military_presence': 'Военное присутствие',
  'economic_power': 'Экономическая мощь',
  'spiritual_dominion': 'Духовное господство',

  // Advanced Development
  'perfect_territory': 'Совершенное владение',
  'development_expert': 'Эксперт развития',
  'master_of_all': 'Мастер всего',

  // Elite Achievements
  'max_development': 'Максимальное развитие',
  'territory_legend': 'Легенда земель',

  // Development Milestones
  'village_master': 'Покровитель поселений',
  'camp_master': 'Мастер лагерей',

  // Mastery Achievements
  'village_empire': 'Империя деревень',
  'fortress_empire': 'Империя крепостей',
  'temple_empire': 'Империя храмов',
  'resource_master': 'Мастер ресурсов',
  'level_master': 'Мастер развития',
  'territory_god': 'Повелитель земель',
  'perfect_development': 'Идеальное развитие',
  'empire_balance': 'Баланс империи',
  'perfect_balance': 'Идеальный баланс',
  'legendary_ruler': 'Легендарный правитель',

  // Royal Path Achievements
  'royal_economy': 'Королевское богатство',
  'royal_army': 'Непобедимая армия',
  'royal_capital': 'Великая столица',
  'royal_enlightenment': 'Просвещённый монарх',
  'royal_empire': 'Величайшая империя',
  'royal_perfection': 'Абсолютное совершенство',
  'royal_legacy': 'Вечное наследие',

  // Ultimate Achievements
  'balanced_ruler': 'Мудрый правитель',
  'ultimate_ruler': 'Абсолютный правитель'
}

export const getAchievementName = (id: string): string => {
  return achievementNames[id] || id
}
