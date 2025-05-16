'use client'

import { motion } from 'framer-motion'
import { useNobleStore } from '@/modules/noble/store'
import { NoblePathBoard } from '@/modules/noble/components/NoblePathBoard'
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

function RoadToGloryPage() {
  const { noble } = useNobleStore();

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
      <NoblePathBoard />
    </motion.div>
  )
}

export default withPageTransition(RoadToGloryPage)
