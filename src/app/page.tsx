import Cta from "@/components/common/Cta";
import { About } from "@/components/home/About";
import { Categories } from "@/components/home/Categories";
import FeaturedStories from "@/components/home/FeaturedNews";
import { HeroSection } from "@/components/home/HeroSection";
import { HeroStats } from "@/components/home/HeroStats";
import { LatestBlogs } from "@/components/home/LatestBlogs";
import { Newsletter } from "@/components/home/Newsletter";
import { Navbar } from "@/components/navbar/Navbar";
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar/>
      <HeroSection />

      <HeroStats />
      <About />
      <FeaturedStories />
      <Categories />
      <LatestBlogs />
     <Cta/>
    </div>
  );
}
