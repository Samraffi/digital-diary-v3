import { ReactNode } from 'react'
import type { Variants, Transition } from 'framer-motion'

export interface CardProps {
  children: ReactNode
  className?: string
  gradient?: string
  hover?: boolean
  onClick?: () => void
  delay?: number
  variants?: typeof Variants
  transition?: typeof Transition
  noBg?: boolean
}

export interface CardPartProps {
  children: ReactNode
  className?: string
}

export interface CardGroupProps {
  children: ReactNode
  className?: string
  variants?: typeof Variants
  transition?: typeof Transition
}