import { CardPartProps } from './types'

export function CardHeader({ children, className = '' }: CardPartProps) {
  return (
    <div className={`flex items-center justify-between p-6 ${className}`}>
      {children}
    </div>
  )
}

export function CardContent({ children, className = '' }: CardPartProps) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '' }: CardPartProps) {
  return (
    <div className={`flex items-center p-6 bg-black ${className}`}>
      {children}
    </div>
  )
} 