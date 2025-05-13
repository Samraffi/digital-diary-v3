'use client'

import { motion } from 'framer-motion'
import { ImperialQuests } from '@/modules/noble/components/ImperialQuests'
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

function QuestsPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <ImperialQuests />
    </motion.div>
  )
}

export default withPageTransition(QuestsPage)
