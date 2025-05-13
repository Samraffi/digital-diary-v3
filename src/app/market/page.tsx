'use client'

import { motion } from 'framer-motion'
import { useNobleStore } from '@/modules/noble/store'
import { Card } from '@/shared/ui/Card'
import { withPageTransition } from '@/lib/hooks/usePageTransition'
import { CreateProfileModal } from '@/shared/ui/modals/CreateProfileModal'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

function MarketPage() {
  const noble = useNobleStore(state => state.noble)

  if (!noble) {
    return <CreateProfileModal />
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Заголовок */}
      <Card gradient="from-emerald-500/20 to-teal-500/20" className="p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Рынок</h1>
        <p className="text-gray-300">
          Торгуйте ресурсами и улучшайте свои владения
        </p>
        <div className="mt-4 flex gap-4">
          <div className="px-4 py-2 bg-white/10 rounded-lg">
            <span className="text-white font-medium">
              Золото: {noble.resources.gold}
            </span>
          </div>
          <div className="px-4 py-2 bg-white/10 rounded-lg">
            <span className="text-white font-medium">
              Влияние: {noble.resources.influence}
            </span>
          </div>
        </div>
      </Card>

      {/* Торговые предложения */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Здесь будут торговые предложения */}
        <Card className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-400">
              Торговые предложения скоро появятся
            </p>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

export default withPageTransition(MarketPage)
