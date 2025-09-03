import { Variants } from "framer-motion";

// Animation variants for different movement patterns
export const moveVertical: Variants = {
  animate: {
    y: ["-50%", "50%", "-50%"],
    transition: {
      duration: 30,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const moveInCircle: Variants = {
  animate: {
    rotate: [0, 360],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export const moveInCircleReverse: Variants = {
  animate: {
    rotate: [360, 0],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export const moveInCircleSlow: Variants = {
  animate: {
    rotate: [0, 360],
    transition: {
      duration: 40,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export const moveHorizontal: Variants = {
  animate: {
    x: ["-50%", "50%", "-50%"],
    y: ["-10%", "10%", "-10%"],
    transition: {
      duration: 40,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const moveInCircleLarge: Variants = {
  animate: {
    rotate: [0, 360],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
