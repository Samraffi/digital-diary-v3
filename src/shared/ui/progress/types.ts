export interface ProgressBarProps {
  value: number
  max?: number
  color?: 'primary' | 'green' | 'blue' | 'purple' | 'yellow' | 'red'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
} 