import { useCallback, useEffect, useRef, useState } from 'react'
import { Territory } from '../types/territory'
import { useTerritoryContext } from '../providers/TerritoryProvider'

interface VirtualizedTerritoriesOptions {
  territories: Territory[]
  itemHeight?: number
  overscan?: number
  containerHeight?: number
}

/**
 * Хук для виртуализации списка территорий
 * Оптимизирует рендеринг больших списков, отображая только видимые элементы
 */
export function useVirtualizedTerritories({
  territories,
  itemHeight = 200,
  overscan = 3,
  containerHeight = 800
}: VirtualizedTerritoriesOptions) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 })
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { isPerformant } = useTerritoryContext()
  
  // Определяем оптимальный размер партии элементов
  // Вычисляем общую высоту контейнера
  const totalHeight = territories.length * itemHeight
  
  // Обработчик прокрутки
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return
    
    const scrollTop = containerRef.current.scrollTop
    setScrollTop(scrollTop)
    
    // Вычисляем видимый диапазон
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const end = Math.min(
      territories.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )
    
    setVisibleRange({ start, end })
  }, [territories.length, itemHeight, containerHeight, overscan])
  
  // Инициализация и обновление при изменении зависимостей
  useEffect(() => {
    if (!containerRef.current) return
    
    // Устанавливаем начальный диапазон
    handleScroll()
    
    // Добавляем обработчик прокрутки
    containerRef.current.addEventListener('scroll', handleScroll)
    
    return () => {
      containerRef.current?.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, territories.length])
  
  // Используем IntersectionObserver для оптимизации, если поддерживается
  useEffect(() => {
    
    const options = {
      root: containerRef.current,
      rootMargin: `${overscan * itemHeight}px 0px`,
      threshold: 0
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Обновляем видимость элементов
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index') || '0')
          
          // Расширяем диапазон, чтобы включить этот элемент
          setVisibleRange(prev => ({
            start: Math.min(prev.start, Math.max(0, index - overscan)),
            end: Math.max(prev.end, Math.min(territories.length, index + overscan))
          }))
        }
      })
    }, options)
    
    return () => {
      observer.disconnect()
    }
  }, [territories.length, itemHeight, overscan])
  
  // Получаем видимые территории
  const visibleTerritories = territories.slice(
    visibleRange.start,
    isPerformant ? visibleRange.end : Math.min(visibleRange.start, territories.length)
  )
  
  // Вычисляем смещение для правильного позиционирования
  const offsetY = visibleRange.start * itemHeight
  
  return {
    containerRef,
    visibleTerritories,
    totalHeight,
    offsetY,
    scrollTop,
    visibleRange,
    handleScroll
  }
}
