"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 975, suffix: "+", label: "Articles & Resources" },
  { value: 121, suffix: "+", label: "Events & Webinars" },
  { value: 50, suffix: "k+", label: "Community Reach" },
  { value: 85, suffix: "+", label: "Countries Reached" },
];

const AnimatedNumber = ({ target, suffix, startAnimation }: { target: number; suffix: string; startAnimation: boolean }) => {
  const [count, setCount] = useState(100);

  useEffect(() => {
    if (!startAnimation) return;

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
  }, [startAnimation, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

export const HeroStats = () => {
  const sectionRef = useRef(null);
  const [startAnimation, setStartAnimation] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Trigger animation when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartAnimation(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Mobile slide logic
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stats.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-t border-border bg-background"
    >
      <div className="mx-auto max-w-screen-xl px-5 py-10 sm:py-14">

        {/* MOBILE */}
        <div className="sm:hidden flex justify-center items-center h-[120px] relative overflow-hidden">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`absolute flex flex-col items-center text-center
                transition-all duration-500 ease-in-out
                ${
                  index === activeIndex
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-6 pointer-events-none"
                }
              `}
            >
              <div className="text-4xl font-bold tracking-tight">
                <AnimatedNumber
                  target={stat.value}
                  suffix={stat.suffix}
                  startAnimation={startAnimation}
                />
              </div>

              <span className="mt-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* DESKTOP */}
        <div className="hidden sm:grid grid-cols-4 gap-1 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-3xl lg:text-5xl font-medium tracking-tight">
                <AnimatedNumber
                  target={stat.value}
                  suffix={stat.suffix}
                  startAnimation={startAnimation}
                />
              </div>

              <span className="mt-3 text-base font-medium text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
