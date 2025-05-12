import { useCallback, useEffect, useRef, useState } from 'react'
import { useTerritoryContext } from '../providers/TerritoryProvider'

interface AnimationOptions {
  duration?: number
  delay?: number
  easing?: string
  iterations?: number
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  fill?: 'none' | 'forwards' | 'backwards' | 'both'
}

interface AnimationConfig {
  keyframes: Keyframe[]
  options: AnimationOptions
}

/**
 * Хук для оптимизированных анимаций территорий
 */
export function useTerritoryAnimations() {
  const { isPerformant } = useTerritoryContext()
  const animationsRef = useRef<Map<string, Animation>>(new Map())
  const [hasAnimationSupport, setHasAnimationSupport] = useState(true)
  

  // Очищаем анимации при размонтировании
  useEffect(() => {
    return () => {
      animationsRef.current.forEach(animation => {
        animation.cancel()
      })
      animationsRef.current.clear()
    }
  }, [])

  /**
   * Создает и запускает анимацию для элемента
   */
  const animate = useCallback((
    element: HTMLElement | null,
    animationId: string,
    config: AnimationConfig
  ) => {
    if (!element || !hasAnimationSupport || !isPerformant) return null

    // Отменяем предыдущую анимацию с таким же ID
    if (animationsRef.current.has(animationId)) {
      animationsRef.current.get(animationId)?.cancel()
    }

    // Создаем новую анимацию
    try {
      const animation = element.animate(config.keyframes, {
        duration: config.options.duration || 900,
        delay: config.options.delay || 0,
        easing: config.options.easing || 'ease-in-out',
        iterations: config.options.iterations || 1,
        direction: config.options.direction || 'normal',
        fill: config.options.fill || 'forwards'
      })

      // Сохраняем анимацию для возможности управления
      animationsRef.current.set(animationId, animation)

      return animation
    } catch (error) {
      console.error('Animation error:', error)
      return null
    }
  }, [hasAnimationSupport, isPerformant])

  /**
   * Останавливает анимацию по ID
   */
  const stopAnimation = useCallback((animationId: string) => {
    if (animationsRef.current.has(animationId)) {
      animationsRef.current.get(animationId)?.cancel()
      animationsRef.current.delete(animationId)
    }
  }, [])

  /**
   * Приостанавливает анимацию по ID
   */
  const pauseAnimation = useCallback((animationId: string) => {
    if (animationsRef.current.has(animationId)) {
      animationsRef.current.get(animationId)?.pause()
    }
  }, [])

  /**
   * Возобновляет анимацию по ID
   */
  const resumeAnimation = useCallback((animationId: string) => {
    if (animationsRef.current.has(animationId)) {
      animationsRef.current.get(animationId)?.play()
    }
  }, [])

  /**
   * Останавливает все анимации
   */
  const stopAllAnimations = useCallback(() => {
    animationsRef.current.forEach(animation => {
      animation.cancel()
    })
    animationsRef.current.clear()
  }, [])

  /**
   * Создает анимацию появления элемента
   */
  const fadeIn = useCallback((
    element: HTMLElement | null,
    animationId: string,
    duration = 300
  ) => {
    return animate(element, animationId, {
      keyframes: [
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      options: {
        duration,
        easing: 'ease-out',
        fill: 'forwards'
      }
    })
  }, [animate])

  /**
   * Создает анимацию исчезновения элемента
   */
  const fadeOut = useCallback((
    element: HTMLElement | null,
    animationId: string,
    duration = 300
  ) => {
    return animate(element, animationId, {
      keyframes: [
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(10px)' }
      ],
      options: {
        duration,
        easing: 'ease-in',
        fill: 'forwards'
      }
    })
  }, [animate])

  /**
   * Создает анимацию пульсации элемента
   */
  const pulse = useCallback((
    element: HTMLElement | null,
    animationId: string,
    duration = 900,
    iterations = 1
  ) => {
    return animate(element, animationId, {
      keyframes: [
        { transform: 'scale(1)' },
        { transform: 'scale(1.05)' },
        { transform: 'scale(1)' }
      ],
      options: {
        duration,
        iterations,
        easing: 'ease-in-out'
      }
    })
  }, [animate])

  /**
   * Создает анимацию подпрыгивания элемента
   */
  const bounce = useCallback((
    element: HTMLElement | null,
    animationId: string,
    duration = 800,
    iterations = 1
  ) => {
    return animate(element, animationId, {
      keyframes: [
        { transform: 'translateY(0)' },
        { transform: 'translateY(-15px)' },
        { transform: 'translateY(0)' }
      ],
      options: {
        duration,
        iterations,
        easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
      }
    })
  }, [animate])

  return {
    animate,
    stopAnimation,
    pauseAnimation,
    resumeAnimation,
    stopAllAnimations,
    fadeIn,
    fadeOut,
    pulse,
    bounce,
    hasAnimationSupport,
    isAnimationEnabled: hasAnimationSupport && isPerformant
  }
}
