'use client'

import { useNobleStore } from '../store'
import { NOBLE_PATHS, type NoblePath } from '../types/noble-path'
import { useNoblePathProgress } from '@/lib/hooks/useNoblePathProgress'
import { useTerritoryStore } from '@/modules/territory/store'
import { Territory } from '@/modules/territory/types/territory'
import { TutorialPathsSection } from './path/TutorialPathsSection'
import { AdditionalPathsSection } from './path/AdditionalPathsSection'

export function NoblePathBoard() {
  const noble = useNobleStore(state => state.noble)
  const territories = useTerritoryStore((state: { territories: Territory[] }) => state.territories)
  const { completedPaths } = useNoblePathProgress()

  if (!noble) return null

  // Сначала отфильтруем этапы обучения
  const tutorialPaths = Object.values(NOBLE_PATHS).filter(p => p.isTutorialPath)
  const regularPaths = Object.values(NOBLE_PATHS).filter(p => !p.isTutorialPath)

  // Группируем обычные этапы по категориям
  const pathsByCategory = regularPaths.reduce((acc, path) => {
    if (!acc[path.category]) {
      acc[path.category] = []
    }
    acc[path.category].push(path)
    return acc
  }, {} as Record<string, NoblePath[]>)

  return (
    <div className="space-y-8">
      {/* Секция обучающих этапов */}
      <TutorialPathsSection tutorialPaths={tutorialPaths} />

      {/* Секция дополнительных этапов */}
      <AdditionalPathsSection pathsByCategory={pathsByCategory} />
    </div>
  )
}