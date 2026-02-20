// components/common/ScrollReveal.tsx
"use client";

import { motion, useAnimation, useInView, Variants } from "framer-motion";
import { useEffect, useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  className?: string;
  staggerChildren?: number;
  threshold?: number;
  once?: boolean;
}

export const ScrollReveal = ({
  children,
  delay = 0,
  direction = "up",
  duration = 0.8,
  className = "",
  staggerChildren = 0,
  threshold = 0.1,
  // once = false, // Changed to false for re-animation
}: ScrollRevealProps) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    amount: threshold,
    margin: "0px 0px -5px 0px" // Negative margin to trigger earlier
  });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, isInView]);

  const directionOffset = {
    up: { y: 50 },
    down: { y: -50 },
    left: { x: 50 },
    right: { x: -50 },
  };



  const containerVariants: Variants = {
  hidden: { opacity: 0, ...directionOffset[direction] },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      duration,
      delay,
      staggerChildren,
      ease: [0.22, 1, 0.36, 1] as const, // ✅ FIX
    },
  },
};


  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};