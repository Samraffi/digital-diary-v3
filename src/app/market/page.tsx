'use client'

import { motion } from 'framer-motion'
import { useNobleStore } from '@/modules/noble/store'
import { Card } from '@/shared/ui/card'
import { withPageTransition } from '@/lib/hooks/usePageTransition'
import { CreateProfileModal } from '@/shared/ui/modals/CreateProfileModal'
import { RoyalMarket } from '@/modules/noble/components/RoyalMarket'

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
        <h1 className="text-3xl font-bold text-white mb-2">Королевский Рынок</h1>
        <p className="text-gray-300">
          Расширяйте свои владения и торгуйте ресурсами
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

      {/* Королевский Рынок */}
      <RoyalMarket />
    </motion.div>
  )
}

export default withPageTransition(MarketPage)
