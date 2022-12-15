import type { MotionProps } from "framer-motion";

export const fadeInFromBottom: MotionProps = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  transition: {
    duration: 0.4,
  },
};

export const elevateUp: MotionProps = {
  whileHover: {
    transform: "translateY(-4px)",
  },
};
