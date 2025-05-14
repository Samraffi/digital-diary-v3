'use client'

import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { useOutsideClick } from '../hooks/useOutsideClick'
import { DropdownProps } from './types'

export function Dropdown({ onClose, children, buttonRef }: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  useOutsideClick([dropdownRef, buttonRef], onClose)

  return createPortal(
    <div
      ref={dropdownRef}
      className="fixed right-0 top-16 z-50 animate-in fade-in slide-in-from-top-5 duration-200"
    >
      {children}
    </div>,
    document.body
  )
} 