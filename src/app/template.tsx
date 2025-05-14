'use client'

import { motion } from 'framer-motion'
import { pageVariants } from './components/animations/variants'
import { GradientBackground } from './components/background/GradientBackground'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <GradientBackground />

      {/* Анимированный контент */}
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="relative"
      >
        {children}
      </motion.div>
    </div>
  )
}
