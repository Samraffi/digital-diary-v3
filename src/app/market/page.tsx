'use client'

import { motion } from 'framer-motion'
import { RoyalMarket } from '@/modules/noble/components/RoyalMarket'
import { withPageTransition } from '@/lib/hooks/usePageTransition'

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
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <RoyalMarket />
    </motion.div>
  )
}

export default withPageTransition(MarketPage)
