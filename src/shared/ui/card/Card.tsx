'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { fadeInUp } from '../animations'
import { CardProps } from './types'

export function Card({
  children,
  className = '',
  gradient,
  hover = false,
  onClick,
  delay = 0,
  variants = fadeInUp,
  transition,
  noBg = false
}: CardProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const baseClasses = `
    relative overflow-hidden rounded-2xl
    ${!gradient ? 'bg-black' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `

  const renderContent = () => (
    <>
      {gradient && (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br opacity-10 ${gradient}`} />
          {!noBg && <div className="absolute inset-0 bg-black" />}
        </>
      )}
      <div className="relative">
        {children}
      </div>
    </>
  )

  if (!isMounted) {
    return (
      <div className={baseClasses} onClick={onClick}>
        {renderContent()}
      </div>
    )
  }

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={hover ? "hover" : undefined}
      whileTap={onClick ? "tap" : undefined}
      transition={{
        delay,
        ...(typeof variants.animate === 'object' ? variants.animate.transition : {}),
        ...transition
      }}
      className={baseClasses}
      onClick={onClick}
    >
      {renderContent()}
    </motion.div>
  )
} 