'use client'

import { motion, Variants, Transition } from 'framer-motion'
import { ReactNode } from 'react'
import { fadeInUp, hoverScale } from './animations'

interface CardProps {
  children: ReactNode
  className?: string
  gradient?: string
  hover?: boolean
  onClick?: () => void
  delay?: number
  variants?: Variants
  transition?: Transition
}

export function Card({
  children,
  className = '',
  gradient,
  hover = false,
  onClick,
  delay = 0,
  variants = fadeInUp,
  transition
}: CardProps) {
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
      className={`
        relative overflow-hidden rounded-2xl
        ${gradient ? '' : 'bg-white/5 backdrop-blur-md'}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {gradient && (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
          <div className="absolute inset-0 bg-black/20" />
        </>
      )}
      <div className="relative">
        {children}
      </div>
    </motion.div>
  )
}

export function CardHeader({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`flex items-center justify-between p-6 ${className}`}>
      {children}
    </div>
  )
}

export function CardContent({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  )
}

export function CardFooter({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`flex items-center p-6 bg-white/5 ${className}`}>
      {children}
    </div>
  )
}

export function CardGroup({
  children,
  className = '',
  variants = fadeInUp,
  transition
}: {
  children: ReactNode
  className?: string
  variants?: Variants
  transition?: Transition
}) {
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
