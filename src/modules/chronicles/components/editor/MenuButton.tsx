'use client'

interface MenuButtonProps {
  onClick: () => void
  isActive?: boolean
  children: React.ReactNode
}

export function MenuButton({ 
  onClick, 
  isActive = false, 
  children 
}: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        p-2 rounded-lg text-sm font-medium transition-colors
        ${isActive 
          ? 'bg-white/20 text-white' 
          : 'text-white/60 hover:bg-white/10 hover:text-white'
        }
      `}
    >
      {children}
    </button>
  )
}