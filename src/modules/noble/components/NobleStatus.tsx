'use client'

import { useNobleStore } from '../store'
import { StatBar } from './status/StatBar'
import { ExperienceBar } from './status/ExperienceBar'
import { PerksList } from './status/PerksList'

export function NobleStatus() {
  const { noble } = useNobleStore();

  if (!noble) return null

  const { experience = 0, experienceForNextLevel = 100 } = noble

  return (
    <div className="space-y-6">
      {/* Опыт */}
      {typeof experience !== 'undefined' && typeof experienceForNextLevel !== 'undefined' && (
        <ExperienceBar
          experience={experience}
          experienceForNextLevel={experienceForNextLevel}
        />
      )}

      {/* Статусы */}
      {noble.status && (
        <div className="space-y-4">
          {[
            {
              label: 'Репутация',
              value: noble.status.reputation,
              maxValue: 100,
              color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
              delay: 0.1
            },
            {
              label: 'Влияние',
              value: noble.status.influence,
              maxValue: 100,
              color: 'bg-gradient-to-r from-purple-500 to-indigo-500',
              delay: 0.2
            },
            {
              label: 'Популярность',
              value: noble.status.popularity,
              maxValue: 100,
              color: 'bg-gradient-to-r from-amber-500 to-orange-500',
              delay: 0.3
            }
          ].map((stat) => (
            <StatBar key={stat.label} {...stat} />
          ))}
        </div>
      )}

      {/* Перки */}
      {noble.perks && <PerksList perks={noble.perks} />}
    </div>
  )
}
