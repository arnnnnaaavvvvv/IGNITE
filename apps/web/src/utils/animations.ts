import { type Variants } from 'framer-motion';

// Common Easing Curves (Linear / Vercel style)
export const transitionStandard = {
  duration: 0.5,
  ease: [0.25, 0.1, 0.25, 1],
};

export const transitionSpring = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
};

export const transitionFast = {
  duration: 0.25,
  ease: [0.16, 1, 0.3, 1],
};

// Fade Up Reveal for Sections and Headers
export const fadeUpVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Staggered Container for Lists / Grids
export const staggerContainerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

// Stagger Item (used inside staggerContainer)
export const staggerItemVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Scale In (for Badges, Pills, Buttons)
export const scaleInVariant: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.175, 0.885, 0.32, 1.275],
    },
  },
};

// Card Hover Lift & Border Glow
export const cardHoverVariant = {
  rest: {
    y: 0,
    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  hover: {
    y: -5,
    boxShadow: '0 20px 40px -15px rgba(16, 185, 129, 0.2)',
    borderColor: 'rgba(52, 211, 153, 0.4)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

// SVG Path Drawing for Animated Route / Map Trails
export const pathDrawVariant: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.8, ease: [0.43, 0.13, 0.23, 0.96] },
      opacity: { duration: 0.4 },
    },
  },
};

// Slide In Toast / Alert Notification
export const slideInToastVariant: Variants = {
  hidden: {
    opacity: 0,
    y: -30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.25,
    },
  },
};

// Pulse Ring Beacon for Live Status
export const pulseBeaconVariant: Variants = {
  animate: {
    scale: [1, 1.8, 1],
    opacity: [0.8, 0, 0.8],
    transition: {
      duration: 2.2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};
