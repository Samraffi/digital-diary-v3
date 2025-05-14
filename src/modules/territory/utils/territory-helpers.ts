import { Territory } from '../types/territory'

export const getTypeColor = (type: Territory['type']) => {
  switch (type) {
    case 'camp':
      return 'from-green-500/20 to-green-600/20'
    case 'mine':
      return 'from-blue-500/20 to-blue-600/20'
    case 'village':
      return 'from-yellow-500/20 to-yellow-600/20'
    case 'fortress':
      return 'from-purple-500/20 to-purple-600/20'
    case 'temple':
      return 'from-red-500/20 to-red-600/20'
    default:
      return 'from-primary/20 to-primary-600/20'
  }
}

export const getTypeIcon = (type: Territory['type']) => {
  switch (type) {
    case 'camp':
      return '⛺'
    case 'mine':
      return '⛏️'
    case 'village':
      return '🏘️'
    case 'fortress':
      return '🏰'
    case 'temple':
      return '🏛️'
    default:
      return '🏙️'
  }
} 