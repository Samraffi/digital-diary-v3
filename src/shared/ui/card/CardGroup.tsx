'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { fadeInUp } from '../animations'
import { CardGroupProps } from './types'

export function CardGroup({
  children,
  className = '',
  variants = fadeInUp,
  transition
}: CardGroupProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  )
} 