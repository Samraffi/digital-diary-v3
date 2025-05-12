'use client'

import { useEffect, useState } from 'react'
import { Notification } from './NotificationsProvider'

export interface NotificationToastProps {
  notification: Notification
  onClose: () => void
}

export function NotificationToast({ notification, onClose }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const { type, title, message, duration = 5000 } = notification

  // Автоматически закрываем уведомление через указанное время
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    return () => {
      clearTimeout(timer)
    }
  }, [duration])

  // Анимация исчезновения перед удалением
  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 300)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [isVisible, onClose])

  // Определяем цвет в зависимости от типа уведомления
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-800'
      case 'error':
        return 'bg-red-100 border-red-500 text-red-800'
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800'
      case 'info':
      default:
        return 'bg-blue-100 border-blue-500 text-blue-800'
    }
  }

  // Определяем иконку в зависимости от типа уведомления
  const getTypeIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
      default:
        return 'ℹ️'
    }
  }

  return (
    <div
      className={`
        border-l-4 p-4 rounded shadow-md transition-all duration-300
        ${getTypeStyles()}
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
      `}
      role="alert"
    >
      <div className="flex items-start">
        <div className="mr-2">{getTypeIcon()}</div>
        <div className="flex-1">
          <div className="font-bold">{title}</div>
          <div>{message}</div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  )
}
