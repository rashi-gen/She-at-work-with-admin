// app/page.tsx
import { About } from '@/components/home/About';
import { HeroSection } from '@/components/home/HeroSection';
import { HeroStats } from '@/components/home/HeroStats';
import { Navbar } from '@/components/navbar/Navbar';
import dynamic from 'next/dynamic';

// Lazy load below-fold components
const FeaturedStories = dynamic(() => import('@/components/home/FeaturedNews'));
const Categories = dynamic(() => import('@/components/home/Categories').then(mod => ({ default: mod.Categories })));
const LatestBlogs = dynamic(() => import('@/components/home/LatestBlogs').then(mod => ({ default: mod.LatestBlogs })));
const Cta = dynamic(() => import('@/components/common/Cta'));

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HeroStats />
      <About />
      
      {/* Lazy loaded */}
      <FeaturedStories />
      <Categories />
      <LatestBlogs />
      <Cta />
    </div>
  );
}