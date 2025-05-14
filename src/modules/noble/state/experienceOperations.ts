import { Noble, NobleRankType } from '../types';
import { 
  BASE_EXPERIENCE,
  calculateExperienceForLevel,
  calculateExperienceMultipliers,
  checkRankUpgrade,
  rankRequirements
} from '../constants';
import { debouncedSave } from './nobleStateOperations';

// Добавить опыт и проверить повышение уровня
export function addExperience(noble: Noble | null, baseAmount: number): Noble | null {
  if (!noble) return null;

  // Рассчитываем итоговый опыт с учетом всех множителей
  const totalMultiplier = 
    noble.experienceMultipliers.level * 
    noble.experienceMultipliers.rank * 
    noble.experienceMultipliers.bonus;
  
  const earnedExperience = Math.floor(baseAmount * totalMultiplier);
  let newExperience = noble.experience + earnedExperience;
  let newLevel = noble.level;
  
  // Проверяем повышение уровня
  while (newExperience >= noble.experienceForNextLevel) {
    newExperience -= noble.experienceForNextLevel;
    newLevel++;
  }

  // Если уровень изменился, обновляем множители и проверяем ранг
  if (newLevel !== noble.level) {
    const newRank = checkRankUpgrade(newLevel, noble.rank);
    return {
      ...noble,
      level: newLevel,
      experience: newExperience,
      experienceForNextLevel: calculateExperienceForLevel(newLevel),
      experienceMultipliers: calculateExperienceMultipliers(newLevel, newRank || noble.rank),
      rank: newRank || noble.rank
    };
  }

  // Если уровень не изменился, просто обновляем опыт
  return {
    ...noble,
    experience: newExperience
  };
}

// Добавить опыт за выполнение задачи
export function addTaskExperience(
  noble: Noble | null,
  taskDuration: number, // в минутах
  isCombo: boolean = false,
  isSpecialTime: boolean = false
): Noble | null {
  if (!noble) return null;

  // Базовый опыт за каждые 15 минут работы
  const baseExp = Math.floor(taskDuration / 15) * BASE_EXPERIENCE;
  
  // Дополнительные множители
  let bonusMultiplier = noble.experienceMultipliers.bonus;
  if (isCombo) bonusMultiplier *= 1.5;
  if (isSpecialTime) bonusMultiplier *= 2;

  // Обновляем множители
  const updatedNoble = {
    ...noble,
    experienceMultipliers: {
      ...noble.experienceMultipliers,
      bonus: bonusMultiplier
    }
  };

  // Добавляем опыт с новыми множителями
  return addExperience(updatedNoble, baseExp);
}

// Обновить ранг
export function updateRank(noble: Noble | null, newRank: NobleRankType): Noble | null {
  if (!noble) {
    console.log('Cannot update rank: noble is null');
    return null;
  }

  console.log('Updating rank:', {
    from: noble.rank,
    to: newRank,
    currentState: {
      level: noble.level,
      experience: noble.experience,
      achievements: noble.achievements.total,
      influence: noble.resources.influence
    }
  });

  const updatedNoble = {
    ...noble,
    rank: newRank,
    experienceMultipliers: calculateExperienceMultipliers(noble.level, newRank)
  };

  // Добавляем награды за новый ранг
  if (newRank === 'король' && noble.rank !== 'король') {
    updatedNoble.resources.gold += 1000000;
    updatedNoble.resources.influence += 500000;
    updatedNoble.stats.totalInfluence += 500000;
    updatedNoble.experience += 10000;
    console.log('Added king rank rewards');
  } else if (rankRequirements[newRank]) {
    const territories = rankRequirements[newRank].territories;
    const rewards = {
      gold: 1000 * (territories / 2),
      influence: 500 * (territories / 2)
    };
    updatedNoble.resources.gold += rewards.gold;
    updatedNoble.resources.influence += rewards.influence;
    updatedNoble.stats.totalInfluence += rewards.influence;
    updatedNoble.experience += 2000;
    console.log('Added rank rewards:', {
      rank: newRank,
      rewards: {
        gold: rewards.gold,
        influence: rewards.influence,
        experience: 2000
      }
    });
  }

  const newLevel = Math.floor(updatedNoble.experience / 1000) + 1;
  if (newLevel > updatedNoble.level) {
    updatedNoble.level = newLevel;
    console.log('Level increased to:', newLevel);
  }

  console.log('Final noble state after rank update:', {
    rank: updatedNoble.rank,
    level: updatedNoble.level,
    experience: updatedNoble.experience,
    resources: updatedNoble.resources
  });

  debouncedSave(updatedNoble);
  return updatedNoble;
} 