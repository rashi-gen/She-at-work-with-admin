import { About } from "@/components/home/About";
import { Categories } from "@/components/home/Categories";
import FeaturedStories from "@/components/home/FeaturedNews";
import { HeroSection } from "@/components/home/HeroSection";
import { HeroStats } from "@/components/home/HeroStats";
import { LatestBlogs } from "@/components/home/LatestBlogs";
import { Newsletter } from "@/components/home/Newsletter";
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <HeroStats />
      <About />
      <FeaturedStories />
      <Categories />
      <LatestBlogs />
      <Newsletter />
    </div>
  );
}
