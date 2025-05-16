'use client'

import { motion } from 'framer-motion'
import { useNobleStore } from '@/modules/noble/store'
import { CardGroup } from '@/shared/ui/card'
import { staggerContainer } from '@/shared/ui/animations'
import { withPageTransition } from '@/lib/hooks/usePageTransition'
import { CreateProfileModal } from '@/shared/ui/modals/CreateProfileModal'
import { AchievementHeader } from './components/AchievementHeader'
import { CategoryCard } from './components/CategoryCard'
import { CompletedAchievements } from './components/CompletedAchievements'
import { categories } from './constants'

function AchievementsContent() {
  const { noble } = useNobleStore();
  const achievements = noble?.achievements;

  if (!noble) {
    return <CreateProfileModal />
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8"
    >
      <AchievementHeader noble={noble} totalCategories={categories.length} />

      <CardGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <CategoryCard
            key={category.id}
            {...category}
            count={noble.achievements.categories[category.id]}
            index={index}
          />
        ))}
      </CardGroup>

      <CompletedAchievements completedAchievements={noble.achievements.completed} />
    </motion.div>
  )
}

export default withPageTransition(AchievementsContent)
