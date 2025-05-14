import { ReactNode } from 'react'
import { Variants, Transition } from 'framer-motion'

export interface CardProps {
  children: ReactNode
  className?: string
  gradient?: string
  hover?: boolean
  onClick?: () => void
  delay?: number
  variants?: Variants
  transition?: Transition
  noBg?: boolean
}

export interface CardPartProps {
  children: ReactNode
  className?: string
}

export interface CardGroupProps {
  children: ReactNode
  className?: string
  variants?: Variants
  transition?: Transition
} 