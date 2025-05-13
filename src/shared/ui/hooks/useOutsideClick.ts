'use client'

import { useEffect, RefObject } from 'react'

type Handler = () => void

export function useOutsideClick(ref: RefObject<HTMLElement>, handler: Handler) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler()
      }
    }

    // Подключаем обработчик при монтировании
    document.addEventListener('mousedown', handleClick)

    // Отключаем обработчик при размонтировании
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [ref, handler])
}
