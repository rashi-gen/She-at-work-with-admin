"use client";

import {
  ArrowRight,
  BookOpen,
  Calendar,
  MessageCircle,
  Newspaper,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const categories = [
  {
    name: "Blogs",
    description: "Insights, tips and thought leadership from women...",
    count: 875,
    suffix: "+",
    icon: BookOpen,
    href: "/blogs",
  },
  {
    name: "News",
    description: "Latest updates on women entrepreneurship and...",
    count: 500,
    suffix: "+",
    icon: Newspaper,
    href: "/news",
  },
  {
    name: "Entrechat",
    description: "In-depth conversations with successful women founders",
    count: 121,
    suffix: "+",
    icon: MessageCircle,
    href: "/entrechat",
  },
  {
    name: "Events",
    description: "Workshops, Webinars and networking opportunities",
    count: 50,
    suffix: "+",
    icon: Calendar,
    href: "/events",
  },
];

// Animated Number Component
const AnimatedNumber = ({ 
  target, 
  suffix, 
  startAnimation,
  reset 
}: { 
  target: number; 
  suffix: string; 
  startAnimation: boolean;
  reset: boolean;
}) => {
  const [count, setCount] = useState(100);

  useEffect(() => {
    if (!startAnimation) {
      setCount(100); // Reset to initial value
      return;
    }

    const start = 100;
    const duration = 1800;
    const startTime = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const value = Math.floor(start + (target - start) * progress);

      setCount(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [startAnimation, target, reset]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

export const Categories = () => {
  const sectionRef = useRef(null);
  const [startAnimation, setStartAnimation] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const isInView = useInView(sectionRef, { 
    amount: 0.3,
    once: true, // Only trigger once
    margin: "0px 0px -100px 0px"
  });

  // Trigger animation when visible
  useEffect(() => {
    if (isInView && !startAnimation) {
      setStartAnimation(true);
      setAnimationKey(prev => prev + 1);
    } else if (!isInView && startAnimation) {
      setStartAnimation(false);
    }
  }, [isInView, startAnimation]);

  return (
    <section ref={sectionRef} className="py-10 bg-secondary" key={animationKey}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Explore Our Content
          </h2>
          <p className="text-foreground/80 text-base">
            Dive into a wealth of resources designed to inspire, educate and
            empower your entrepreneurial journey.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="flex gap-8 overflow-x-auto md:overflow-visible scrollbar-hide">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="
                group
                relative
                p-8
                rounded-3xl
                bg-white
                transition-all duration-300 ease-out
                flex-shrink-0
                w-[280px] md:w-[260px] lg:w-[280px]
                hover:-translate-y-2
                hover:scale-[1.02]
                hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]
                overflow-hidden
              "
            >
              {/* Hover background glow */}
              <div className="
                absolute inset-0 opacity-0
                bg-gradient-to-br from-[#3B2E7E]/5 to-transparent
                transition-opacity duration-300
                group-hover:opacity-100
              " />

              {/* Icon */}
              <div className="
                relative z-10
                inline-flex p-4 rounded-full
                bg-[#E5D4C9]
                mb-4
                transition-all duration-300
                group-hover:bg-[#3B2E7E]/10
                group-hover:scale-110
              ">
                <category.icon
                  className="h-7 w-7 text-foreground transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={2}
                />
              </div>

              {/* Content */}
              <h3 className="relative z-10 text-2xl font-bold text-foreground mb-3 transition-colors duration-300 group-hover:text-[#3B2E7E]">
                {category.name}
              </h3>

              <p className="relative z-10 text-sm text-foreground/70 mb-6 leading-relaxed">
                {category.description}
              </p>

              {/* Count & Explore */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-3xl font-bold text-foreground transition-transform duration-300 group-hover:scale-105">
                  <AnimatedNumber
                    target={category.count}
                    suffix={category.suffix}
                    startAnimation={startAnimation}
                    reset={!isInView}
                  />
                </span>

                <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors flex items-center gap-1.5 font-medium">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};