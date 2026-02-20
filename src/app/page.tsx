// app/page.tsx
"use client";

import { ScrollReveal } from "@/components/common/ScrollReveal";
import Cta from "@/components/common/Cta";
import { About } from "@/components/home/About";
import { Categories } from "@/components/home/Categories";
import FeaturedStories from "@/components/home/FeaturedNews";
import { HeroSection } from "@/components/home/HeroSection";
import { HeroStats } from "@/components/home/HeroStats";
import { LatestBlogs } from "@/components/home/LatestBlogs";
import { Navbar } from "@/components/navbar/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      <HeroSection />

      {/* HeroStats has its own animation logic, no need for ScrollReveal wrapper */}
      <HeroStats />

      {/* About has its own animation logic, no need for ScrollReveal wrapper */}
      <About />

      {/* Other sections use ScrollReveal with once={false} */}
      <ScrollReveal direction="up" threshold={0.1} delay={0} once={false}>
        <FeaturedStories />
      </ScrollReveal>
      <ScrollReveal direction="up" threshold={0.1} delay={0} once={false}>
        <Categories />
      </ScrollReveal>
      <ScrollReveal direction="up" threshold={0.1} delay={0} once={false}>
        <LatestBlogs />
      </ScrollReveal>

      <ScrollReveal direction="up" threshold={0.1} delay={0} once={false}>
        <Cta />
      </ScrollReveal>
    </div>
  );
}