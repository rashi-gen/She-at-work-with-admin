"use client";

import { useEffect, useState } from "react";

const stats = [
  { value: "975+", label: "Articles & Resources" },
  { value: "121+", label: "Events & Webinars" },
  { value: "50k+", label: "Community Reach" },
    { value: "85+", label: "Countries Reached" },
];

export const HeroStats = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stats.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-screen-xl px-5 py-10 sm:py-14">

        {/* ================= MOBILE PPT SLIDE ================= */}
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
              <div className="text-4xl font-bold tracking-tight text-foreground">
                {stat.value}
              </div>
              <span className="mt-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* ================= DESKTOP / TABLET ================= */}
        <div className="hidden sm:grid grid-cols-4 gap-1 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-3xl lg:text-5xl font-medium tracking-tight">
                {stat.value}
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
