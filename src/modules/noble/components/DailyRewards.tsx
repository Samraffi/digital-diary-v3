import { useNobleStore } from '../store'
import { Card } from '@/shared/ui/Card'
import { useGameNotifications } from '@/lib/hooks/useGameNotifications'
import { useEffect, useState } from 'react'

const DAILY_REWARDS = [
  { day: 1, gold: 100, influence: 50 },
  { day: 2, gold: 150, influence: 75 },
  { day: 3, gold: 200, influence: 100 },
  { day: 4, gold: 250, influence: 125 },
  { day: 5, gold: 300, influence: 150 },
  { day: 6, gold: 400, influence: 200 },
  { day: 7, gold: 1000, influence: 500 },
]

export function DailyRewards() {
  const noble = useNobleStore(state => state.noble)
  const addResources = useNobleStore(state => state.addResources)
  const { notifyResourceReward, notifyAchievement } = useGameNotifications()
  const [lastClaimDate, setLastClaimDate] = useState<string | null>(null)
  const [currentStreak, setCurrentStreak] = useState(0)

  useEffect(() => {
    const savedDate = localStorage.getItem('lastDailyRewardClaim')
    const savedStreak = localStorage.getItem('dailyRewardStreak')
    
    if (savedDate) {
      setLastClaimDate(savedDate)
      setCurrentStreak(savedStreak ? parseInt(savedStreak) : 0)
    }
  }, [])

  const canClaimReward = () => {
    if (!lastClaimDate) return true
    
    const lastClaim = new Date(lastClaimDate)
    const now = new Date()
    
    // Сброс стрика если пропущен день
    if (now.getDate() - lastClaim.getDate() > 1) {
      setCurrentStreak(0)
      localStorage.setItem('dailyRewardStreak', '0')
      return true
    }
    
    return lastClaim.getDate() !== now.getDate()
  }

  const claimReward = () => {
    if (!canClaimReward() || !noble) return

    const newStreak = (currentStreak % 7) + 1
    const reward = DAILY_REWARDS[newStreak - 1]

    addResources({
      gold: reward.gold,
      influence: reward.influence
    })

    notifyResourceReward({
      gold: reward.gold,
      influence: reward.influence
    })

    if (newStreak === 7) {
      notifyAchievement(
        'Неделя завершена!',
        'Вы получили максимальную награду за ежедневные входы'
      )
    }

    setCurrentStreak(newStreak)
    setLastClaimDate(new Date().toISOString())
    localStorage.setItem('lastDailyRewardClaim', new Date().toISOString())
    localStorage.setItem('dailyRewardStreak', newStreak.toString())
  }

  if (!noble) return null

  return (
    <Card gradient="from-purple-500/20 to-pink-500/20" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Ежедневные награды</h2>
          <p className="text-gray-300">День {currentStreak}/7</p>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {DAILY_REWARDS.map((reward, index) => (
          <div
            key={reward.day}
            className={`
              p-3 rounded-lg border text-center
              ${index < currentStreak ? 'bg-purple-500/20 border-purple-500' : 'bg-white/5 border-white/10'}
              ${index === currentStreak && canClaimReward() ? 'animate-pulse border-pink-500' : ''}
            `}
          >
            <div className="text-sm font-bold mb-2">День {reward.day}</div>
            <div className="flex flex-col gap-1 text-sm">
              <span className="text-yellow-500">💰 {reward.gold}</span>
              <span className="text-blue-500">👑 {reward.influence}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={claimReward}
        disabled={!canClaimReward()}
        className={`
          mt-6 w-full py-2 px-4 rounded-lg font-bold
          ${canClaimReward()
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
        `}
      >
        {canClaimReward() ? 'Получить награду' : 'Награда уже получена'}
      </button>
    </Card>
  )
} 