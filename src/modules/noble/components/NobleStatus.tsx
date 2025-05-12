'use client'

import { useNobleStore } from '../store'
import { rankTitles, rankRequirements } from '../constants'
import { NobleRank } from '../types'

export function NobleStatus() {
  const noble = useNobleStore(state => state.noble)
  const { addResources, removeResources } = useNobleStore()

  if (!noble) {
    return null
  }

  const rankTitle = rankTitles[noble.rank]
  const experienceToNextLevel = (Math.floor(noble.experience / 900) + 1) * 900
  const levelProgress = (noble.experience % 900) / 10 // 0-100%

              const nextRanks: Record<NobleRank, NobleRank> = {
                'baron': 'viscount',
                'viscount': 'count',
                'count': 'marquess',
                'marquess': 'duke',
                'duke': 'king',
                'king': 'king'
              }

  return (
    <div className="p-6 rounded-lg bg-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-medieval">
          {rankTitle}
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">🪙</span>
            <span>{noble.resources.gold}</span>
            <div className="flex gap-1">
              <button
                onClick={() => addResources({ gold: 100000 })}
                className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 rounded"
              >
                +100k
              </button>
              <button
                onClick={() => removeResources({ gold: 100000 })}
                className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded"
              >
                -100k
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500">⚜️</span>
            <span>{noble.resources.influence}</span>
            <div className="flex gap-1">
              <button
                onClick={() => addResources({ influence: 100000 })}
                className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 rounded"
              >
                +100k
              </button>
              <button
                onClick={() => removeResources({ influence: 100000 })}
                className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded"
              >
                -100k
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Уровень {noble.level}</span>
          <span>{noble.experience} / {experienceToNextLevel} опыта</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
      </div>

      {/* Rank Requirements */}
      <div className="mt-4 space-y-2">
        <h3 className="text-sm font-semibold">
          {noble.rank === 'duke' 
            ? 'План свержения короля'
            : noble.rank === 'king'
            ? 'Вы - новый король!'
            : `Требования для ${rankTitles[nextRanks[noble.rank]]}`}
        </h3>
        {noble.rank !== 'king' ? (
          <>
            {(() => {
              const nextRank = nextRanks[noble.rank]
              const requirements = nextRank ? rankRequirements[nextRank] : undefined
              
              return (
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 bg-accent rounded">
                    <div className="text-sm text-muted-foreground mb-1">Территории</div>
                    <div className="text-lg mb-1">
                      {noble.stats.territoriesOwned} / {requirements?.territories ?? 0}
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, (noble.stats.territoriesOwned / (requirements?.territories ?? 1)) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-accent rounded">
                    <div className="text-sm text-muted-foreground mb-1">Влияние</div>
                    <div className="text-lg mb-1">
                      {noble.stats.totalInfluence} / {requirements?.influence ?? 0}
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, (noble.stats.totalInfluence / (requirements?.influence ?? 1)) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-accent rounded">
                    <div className="text-sm text-muted-foreground mb-1">Достижения</div>
                    <div className="text-lg mb-1">
                      {noble.achievements.total} / {requirements?.achievements ?? 0}
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, (noble.achievements.total / (requirements?.achievements ?? 1)) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })()}
          </>
        ) : (
          <div className="text-sm text-muted-foreground text-center p-4 bg-accent rounded">
            <div className="text-xl font-medieval mb-2">Да здравствует король!</div>
            <div>Вы достигли вершины власти и заняли королевский трон</div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Территории</div>
          <div className="text-xl font-medieval">{noble.stats.territoriesOwned}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Достижения</div>
          <div className="text-xl font-medieval">{noble.achievements.total}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Задания</div>
          <div className="text-xl font-medieval">{noble.stats.tasksCompleted}</div>
        </div>
      </div>

      {/* Active Titles */}
      {noble.titles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2">Титулы</h3>
          <div className="flex flex-wrap gap-2">
            {noble.titles.map(title => (
              <span
                key={title.id}
                className="px-2 py-1 text-sm bg-accent rounded"
              >
                {title.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
