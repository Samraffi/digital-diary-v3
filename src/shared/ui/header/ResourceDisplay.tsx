'use client'

import { AnimatePresence } from 'framer-motion'
import { Card } from '../card'
import { Dropdown } from './Dropdown'
import { ResourceDisplayProps } from './types'

const formatNumber = (num: number, decimals: number = 0) => {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num)
}

export function ResourceDisplay({
  icon,
  value,
  onClick,
  buttonRef,
  showDropdown,
  onDropdownClose
}: ResourceDisplayProps) {
  const baseClasses = "rounded-lg bg-slate-800 px-3 py-1.5"
  const buttonClasses = onClick 
    ? `${baseClasses} flex items-center gap-2 text-sm text-white transition-colors hover:bg-slate-700`
    : baseClasses

  const content = (
    <span className="text-sm font-medium text-white">
      {icon} {formatNumber(value)}
    </span>
  )

  if (!onClick) {
    return <div className={buttonClasses}>{content}</div>
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={onClick}
        className={buttonClasses}
      >
        {content}
      </button>

      <AnimatePresence>
        {showDropdown && onDropdownClose && buttonRef && (
          <Dropdown onClose={onDropdownClose} buttonRef={buttonRef}>
            <div className="p-1">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <Card
                noBg
                gradient="from-indigo-800 via-indigo-900 to-indigo-950"
                className="w-80 p-4"
              >
                <h3 className="text-white font-medium mb-3">Влияние</h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-200">
                    Влияние - это мера вашего могущества и власти. Оно необходимо для:
                  </div>
                  <ul className="list-disc list-inside text-sm text-gray-200 space-y-1">
                    <li>Повышения ранга</li>
                    <li>Расширения территорий</li>
                    <li>Найма советников</li>
                  </ul>
                </div>
              </Card>
            </div>
          </Dropdown>
        )}
      </AnimatePresence>
    </div>
  )
} 