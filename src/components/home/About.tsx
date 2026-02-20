// components/home/About.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Heart, Lightbulb, Target, Users } from "lucide-react";
import Link from "next/link";
import { easeOut, motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const values = [
  {
    icon: Heart,
    title: "Empowerment",
    description:
      `We believe in uplifting women by providing a "storehouse of information"—from government schemes to funding avenues—that unlocks their potential to succeed.`,
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We cultivate an ecosystem where women entrepreneurs connect to exchange best practices, share experiences, and widen their opportunities together.",
  },
  {
    icon: Target,
    title: "Impact",
    description:
      "We are committed to driving positive change, offering mentorship programs to support rural enterprises and amplify women's voices in the business landscape.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We embrace forward-thinking approaches, keeping our community updated with the latest industry trends, digital skills, and creative business solutions.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
};

export const About = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: 0.1,
  });

  useEffect(() => {
    if (isInView) {
      controls.start("show");
    } else {
      controls.start("hidden");
    }
  }, [controls, isInView]);

  return (
    <section ref={ref} className="py-10 px-4 sm:py-16 sm:px-8 lg:py-20 lg:px-20 bg-secondary">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={controls}
          >
            <motion.span
              variants={item}
              className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-md bg-[#3B2E7E] text-white text-xs sm:text-sm font-medium mb-3 sm:mb-4"
            >
              About She At Work
            </motion.span>

            <motion.h2
              variants={item}
              className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-4 sm:mb-6 leading-tight"
            >
              Championing Women&apos;s Voices in Business Since 2017
            </motion.h2>

            <motion.p
              variants={item}
              className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-4 sm:mb-6"
            >
              SheAtWork.com germinated with a singular objective: to support women who are looking to start an entrepreneurial venture that aligns with their abilities and skills. Launched in January 2017, our aim is to educate, train, support, and motivate women entrepreneurs globally.
            </motion.p>

            <motion.p
              variants={item}
              className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 sm:mb-8"
            >
              We provide a storehouse of information to increase awareness on all relevant areas of entrepreneurship—from innovative business ideas and startup funding avenues to legal support and mentor connections.
            </motion.p>

            <motion.div variants={item}>
              <Link href="/about">
                <Button className="text-[#3B2E7E] font-semibold bg-transparent border-white border-2 text-sm sm:text-base w-full sm:w-auto">
                  Learn More About Us
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT VALUES GRID */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 lg:mt-0"
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={item}
                className="
                  group p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-card border border-border/50
                  transition-all duration-300 ease-out
                  hover:-translate-y-2 hover:shadow-xl
                  hover:border-[#3B2E7E]/30
                "
              >
                <div className="inline-flex p-2 sm:p-3 rounded-lg sm:rounded-xl bg-[#e0bba8]/20 text-[#e0bba8] mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <value.icon className="h-4 w-4 sm:h-6 sm:w-6" />
                </div>

                <h3 className="text-base sm:text-xl font-display font-bold mb-1 sm:mb-2 group-hover:text-[#3B2E7E]">
                  {value.title}
                </h3>

                <p className="text-xs sm:text-sm lg:text-md text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};