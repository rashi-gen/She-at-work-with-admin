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

// animation variants
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
    amount: 0.3,
    margin: "0px 0px -100px 0px" // Trigger when 100px before entering viewport
  });

  useEffect(() => {
    if (isInView) {
      controls.start("show");
    } else {
      controls.start("hidden");
    }
  }, [controls, isInView]);

  return (
    <section ref={ref} className="p-5 sm:p-20 bg-secondary">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={controls}
          >
            <motion.span
              variants={item}
              className="inline-block px-4 py-1.5 rounded-md bg-[#3B2E7E] text-white text-sm font-medium mb-4"
            >
              About She At Work
            </motion.span>

            <motion.h2
              variants={item}
              className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6"
            >
              Championing Women&apos;s Voices in Business Since 2017
            </motion.h2>

            <motion.p
              variants={item}
              className="text-xl text-muted-foreground mb-6"
            >
             SheAtWork.com germinated with a singular objective: to support women who are looking to start an entrepreneurial venture that aligns with their abilities and skills. Launched in January 2017, our aim is to educate, train, support, and motivate women entrepreneurs globally.
            </motion.p>

            <motion.p
              variants={item}
              className="text-muted-foreground text-lg mb-8"
            >
              We provide a storehouse of information to increase awareness on all relevant areas of entrepreneurship—from innovative business ideas and startup funding avenues to legal support and mentor connections.
            </motion.p>

            <motion.div variants={item}>
              <Link href="/about">
                <Button className="text-[#3B2E7E] font-semibold bg-transparent border-white border-2">
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
            className="grid sm:grid-cols-2 gap-4"
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={item}
                className="
                  group p-6 rounded-2xl bg-card border border-border/50
                  transition-all duration-300 ease-out
                  hover:-translate-y-2 hover:shadow-xl
                  hover:border-[#3B2E7E]/30
                "
              >
                <div className="inline-flex p-3 rounded-xl bg-[#e0bba8]/20 text-[#e0bba8] mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <value.icon className="h-6 w-6" />
                </div>

                <h3 className="text-xl font-display font-bold mb-2 group-hover:text-[#3B2E7E]">
                  {value.title}
                </h3>

                <p className="text-md text-muted-foreground">
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