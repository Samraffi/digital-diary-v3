'use client'

import { motion } from 'framer-motion'
import { NobleProfile } from '@/modules/noble/components/NobleProfile'
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

function ProfilePage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <NobleProfile />
    </motion.div>
  )
}

export default withPageTransition(ProfilePage)
