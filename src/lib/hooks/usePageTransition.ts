'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function usePageTransition() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [currentPath, setCurrentPath] = useState(pathname)

  useEffect(() => {
    if (pathname !== currentPath) {
      setIsLoading(true)
      
      // Имитируем загрузку для плавного перехода
      const timer = setTimeout(() => {
        setIsLoading(false)
        setCurrentPath(pathname)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [pathname, currentPath])

  return {
    isLoading,
    currentPath,
    isChangingPage: isLoading || pathname !== currentPath
  }
}

export function useLoadingState<T>(
  loadingFn: () => Promise<T>,
  initialState?: T,
  delay = 300
) {
  const [data, setData] = useState<T | undefined>(initialState)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true
    let timer: NodeJS.Timeout

    const load = async () => {
      try {
        const result = await loadingFn()
        
        // Добавляем минимальную задержку для плавной анимации
        timer = setTimeout(() => {
          if (mounted) {
            setData(result)
            setIsLoading(false)
          }
        }, delay)
      } catch (err) {
        if (mounted) {
          setError(err as Error)
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      mounted = false
      if (timer) clearTimeout(timer)
    }
  }, [loadingFn, delay])

  return { data, isLoading, error }
}

export function withPageTransition<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithPageTransition(props: P) {
    const { isChangingPage } = usePageTransition()
    
    if (isChangingPage) {
      return React.createElement('div',
        { className: "min-h-screen flex items-center justify-center" },
        React.createElement('div', {
          className: "w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"
        })
      )
    }

    return React.createElement(WrappedComponent, props)
  }
}
