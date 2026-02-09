/*eslint-disable @typescript-eslint/no-explicit-any */
// components/common/ScrollFade.tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode, JSX } from "react";

interface ScrollFadeProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const ScrollFade = ({ children, delay = 0, className = "" }: ScrollFadeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};



interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
}

export const StaggerChildren = ({ children, className = "" }: StaggerChildrenProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};



interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  delay?: number;
}

export const AnimatedText = ({
  children,
  className = "",
  as: Component = "p",
  delay = 0,
}: AnimatedTextProps) => {
  const MotionComponent = (motion as any)[Component] as typeof motion.div;

  return (
    <MotionComponent
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};