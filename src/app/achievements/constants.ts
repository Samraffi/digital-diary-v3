export type AchievementCategory = 'diplomacy' | 'development' | 'trade' | 'research' | 'strategy' | 'wisdom'

export const categories: {
  id: AchievementCategory
  name: string
  icon: string
  color: string
}[] = [
  { id: 'diplomacy', name: 'Дипломатия', icon: '🤝', color: 'from-blue-500 to-sky-500' },
  { id: 'development', name: 'Развитие', icon: '📈', color: 'from-green-500 to-emerald-500' },
  { id: 'trade', name: 'Торговля', icon: '💰', color: 'from-yellow-500 to-amber-500' },
  { id: 'research', name: 'Исследования', icon: '🔬', color: 'from-purple-500 to-violet-500' },
  { id: 'strategy', name: 'Стратегия', icon: '⚔️', color: 'from-red-500 to-rose-500' },
  { id: 'wisdom', name: 'Мудрость', icon: '📚', color: 'from-indigo-500 to-blue-500' }
] 