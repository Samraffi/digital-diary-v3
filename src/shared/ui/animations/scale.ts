export const scaleUp = {
  initial: {
    opacity: 0,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.61, 1, 0.88, 1]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: [0.61, 1, 0.88, 1]
    }
  }
}

export const hoverScale = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeInOut'
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: 'easeInOut'
    }
  }
} 