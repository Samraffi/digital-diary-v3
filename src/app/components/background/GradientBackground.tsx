'use client'

import { motion } from 'framer-motion'
import { gradientVariants } from '../animations/variants'

export const GradientBackground = () => {
  return (
    <motion.div
      variants={gradientVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="inset-0"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Шумовой эффект с помощью CSS */}
      <div 
        className="absolute inset-0 mix-blend-soft-light opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(at 51% 52%, rgb(17, 24, 39) 0px, transparent 50%),
            repeating-linear-gradient(0deg, rgba(255,255,255, 0.03) 0px, rgba(255,255,255, 0.03) 1px, transparent 1px, transparent 4px),
            repeating-linear-gradient(90deg, rgba(255,255,255, 0.03) 0px, rgba(255,255,255, 0.03) 1px, transparent 1px, transparent 4px)
          `
        }}
      />
      
      {/* Градиентное затемнение */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
    </motion.div>
  )
} 