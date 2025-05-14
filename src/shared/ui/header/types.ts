import { ReactNode, RefObject } from 'react'

export interface DropdownProps {
  onClose: () => void
  children: ReactNode
  buttonRef: RefObject<HTMLButtonElement>
}

export type DropdownType = 'none' | 'influence'

export interface ResourceDisplayProps {
  icon: string
  value: number
  onClick?: () => void
  buttonRef?: RefObject<HTMLButtonElement>
  showDropdown?: boolean
  onDropdownClose?: () => void
} 