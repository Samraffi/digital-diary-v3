'use client'

import { Card } from '@/shared/ui/card'
import { NoblePath } from '../../types/noble-path'
import { NoblePathCard } from './NoblePathCard'

interface AdditionalPathsSectionProps {
  pathsByCategory: Record<string, NoblePath[]>
}

export function AdditionalPathsSection({ pathsByCategory }: AdditionalPathsSectionProps) {
  const categoryNames = {
    development: 'Экономика',
    trade: 'Торговля',
    diplomacy: 'Дипломатия',
    research: 'Знания',
    strategy: 'Военное дело'
  }

  return (
    <Card gradient="from-blue-500/20 to-purple-500/20" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Дополнительные достижения</h2>
          <p className="text-gray-300">
            Особые цели и достижения для развития вашего благородного дома
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(pathsByCategory).map(([category, paths]) => (
          <div key={category}>
            <h3 className="text-xl font-medieval mb-4 text-blue-300">
              {categoryNames[category as keyof typeof categoryNames]}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paths.map(path => (
                <NoblePathCard
                  key={path.id}
                  path={path}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}