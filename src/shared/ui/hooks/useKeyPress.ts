'use client'

import { useEffect } from 'react'

type Handler = () => void

export function useKeyPress(key: string, handler: Handler) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === key) {
        handler()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [key, handler])
}
