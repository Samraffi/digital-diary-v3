export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.61, 1, 0.88, 1],
    }
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.3,
      ease: [0.61, 1, 0.88, 1],
    }
  }
}

export const gradientVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.61, 1, 0.88, 1],
    }
  },
  exit: {
    opacity: 0,
    scale: 1.2,
    transition: {
      duration: 0.4,
      ease: [0.61, 1, 0.88, 1],
    }
  }
} 