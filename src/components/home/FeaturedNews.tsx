"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Eye, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Types matching your entrechat data structure
interface EntreChatItem {
  ID: string;
  post_title: string;
  post_content: string;
  post_date: string;
  post_excerpt: string;
  featured_image_url: string | null;
  section_name: string;
  post_name: string;
  post_modified?: string;
  post_author?: string;
}

// Import your entrechat data
import { entrechatData } from "@/data/Entrechat";

// Helper functions from your EntreChatPage
const getCategoryFromContent = (content: string): string => {
  const contentLower = content.toLowerCase();
  if (contentLower.includes("design") || contentLower.includes("interior") || contentLower.includes("architecture")) return "Design & Architecture";
  if (contentLower.includes("wellness") || contentLower.includes("health") || contentLower.includes("mindfulness") || contentLower.includes("yoga") || contentLower.includes("meditation")) return "Wellness & Health";
  if (contentLower.includes("funding") || contentLower.includes("finance") || contentLower.includes("investment") || contentLower.includes("capital") || contentLower.includes("$")) return "Funding & Finance";
  if (contentLower.includes("technology") || contentLower.includes("tech") || contentLower.includes("ai") || contentLower.includes("digital") || contentLower.includes("software")) return "Technology";
  if (contentLower.includes("leadership") || contentLower.includes("management") || contentLower.includes("ceo") || contentLower.includes("director")) return "Leadership";
  if (contentLower.includes("marketing") || contentLower.includes("brand") || contentLower.includes("social media") || contentLower.includes("advertising")) return "Marketing";
  if (contentLower.includes("product") || contentLower.includes("development") || contentLower.includes("innovation")) return "Product Development";
  if (contentLower.includes("balance") || contentLower.includes("family") || contentLower.includes("work-life") || contentLower.includes("parent")) return "Work-Life Balance";
  if (contentLower.includes("legal") || contentLower.includes("compliance") || contentLower.includes("regulation") || contentLower.includes("law")) return "Legal & Compliance";
  return "Entrepreneurship";
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Date unavailable';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.warn('Invalid date:', dateString, error);
    return 'Date unavailable';
  }
};

const extractExcerpt = (content: string, maxLength: number = 150): string => {
  if (!content) return 'No excerpt available';
  
  try {
    const plainText = content.replace(/<[^>]*>/g, '');
    const cleanText = plainText.replace(/\s+/g, ' ').trim();
    
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + '...';
  } catch (error) {
    console.warn('Error extracting excerpt:', error);
    return 'No excerpt available';
  }
};

const extractInterviewee = (title: string): string => {
  const cleaned = title.replace(/Entrechat\s+(?:With|with)\s+/i, '').trim();
  const finalName = cleaned.replace(/^(Ms\.|Mr\.)\s+/i, '').trim();
  return finalName || "Interviewee";
};

export default function FeaturedStories() {
  const [index, setIndex] = useState(0);
  const [featuredStories, setFeaturedStories] = useState<Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    views: number; // You might want to calculate this differently
    image: string;
    slug: string;
    category: string;
    interviewee: string;
  }>>([]);

  useEffect(() => {
    // Process entrechat data for featured stories
    const processStories = () => {
      const processed = entrechatData.slice(0, 5).map((item: EntreChatItem) => {
        const category = getCategoryFromContent(item.post_content);
        const excerpt = item.post_excerpt && item.post_excerpt.trim() !== '' 
          ? item.post_excerpt 
          : extractExcerpt(item.post_content, 100);
        
        const title = item.post_title ? item.post_title.replace(/&amp;/g, '&') : 'EntreChat Interview';
        const date = formatDate(item.post_date);
        const interviewee = extractInterviewee(title);
        
        const image = item.featured_image_url && item.featured_image_url.trim() !== '' 
          ? item.featured_image_url 
          : '/placeholder-interview.jpg';
        
        // Calculate a random view count for demo purposes
        // In production, you might want to get this from your analytics
        const views = Math.floor(Math.random() * 300) + 50;
        
        return {
          id: item.ID || Math.random().toString(),
          title,
          description: excerpt,
          date,
          views,
          image,
          slug: item.post_name || `entrechat-${item.ID}`,
          category,
          interviewee
        };
      });
      
      // Sort by date (newest first)
      processed.sort((a, b) => {
        try {
          const dateA = new Date(a.date === 'Date unavailable' ? '1970-01-01' : a.date);
          const dateB = new Date(b.date === 'Date unavailable' ? '1970-01-01' : b.date);
          return dateB.getTime() - dateA.getTime();
        } catch (error) {
          return 0;
        }
      });
      
      setFeaturedStories(processed);
    };

    processStories();
  }, []);

  // Fallback to hardcoded stories if no entrechat data
  const stories = featuredStories.length > 0 ? featuredStories : [
    {
      id: "1",
      title: "Explore WISE with She at Work",
      description: "Sara McNally, EVA Leasing: Empowering Women in Africa",
      date: "25 September 2025",
      views: 162,
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&q=80",
      slug: "explore-wise-with-she-at-work",
      category: "Leadership",
      interviewee: "Sara McNally"
    },
    {
      id: "2",
      title: "Women Entrepreneurs Ripple India's Value Chain",
      description: "How innovative women leaders are transforming India's startup ecosystem.",
      date: "19 September 2025",
      views: 217,
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80",
      slug: "women-entrepreneurs-ripple-india-value-chain",
      category: "Entrepreneurship",
      interviewee: "Various Leaders"
    },
    {
      id: "3",
      title: "Viksit Bharat 2047 & Women Leadership",
      description: "Driving inclusive growth through policy and innovation.",
      date: "10 September 2025",
      views: 104,
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80",
      slug: "viksit-bharat-2047-women-leadership",
      category: "Leadership",
      interviewee: "Policy Makers"
    },
  ];

  const total = stories.length;
  const large = stories[index];
  const small = stories[(index + 1) % total];

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  return (
    <section className="py-16 bg-background">
      <div className="mx-auto px-5 sm:px-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Featured Stories
          </h2>
          <Link
            href="/entrechat"
            className="text-sm text-primary font-medium hover:underline"
          >
            View All Stories →
          </Link>
        </div>

        {/* ================= MOBILE VIEW ================= */}
        <div className="lg:hidden">
          <div className="bg-card rounded-3xl border border-border overflow-hidden">
            {/* Image */}
            <div className="relative h-56">
              <Image
                src={large.image}
                alt={large.title}
                fill
                className="object-cover"
              />

              <span className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-semibold px-4 py-1.5 rounded-full">
                Featured
              </span>

              {/* Arrows */}
              <button
                onClick={prev}
                className="absolute left-3 bottom-3 bg-white rounded-full shadow p-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 bottom-3 bg-white rounded-full shadow p-2"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-bold text-lg mb-2">{large.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {large.description}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {large.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {large.views}
                  </span>
                </div>
                
                <Link href={`/entrechat/${large.slug}`} className="w-full sm:w-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-accent hover:bg-transparent w-full sm:w-auto text-xs"
                  >
                    Read More
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ================= DESKTOP VIEW ================= */}
        <div className="hidden lg:grid grid-cols-3 gap-8">
          {/* Large Card */}
          <div className="col-span-2 bg-card rounded-3xl border border-border overflow-hidden flex flex-col">
            <div className="relative h-72">
              <Image
                src={large.image}
                alt={large.title}
                fill
                priority
                className="object-cover"
              />
              <span className="absolute top-5 left-5 bg-yellow-400 text-black text-xs font-semibold px-4 py-1.5 rounded-full">
                Featured
              </span>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-2xl font-bold mb-2">{large.title}</h3>
              <p className="text-muted-foreground mb-4">
                {large.description}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {large.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {large.views}
                  </span>
                </div>
                
                <Link href={`/entrechat/${large.slug}`}>
                  <Button
                    variant="ghost"
                    className="text-primary hover:text-accent hover:bg-transparent"
                  >
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Small Card */}
          <div className="bg-card rounded-3xl border border-border overflow-hidden flex flex-col">
            <div className="relative h-48">
              <Image
                src={small.image}
                alt={small.title}
                fill
                className="object-cover"
              />

              <button
                onClick={prev}
                className="absolute left-3 bottom-3 bg-white rounded-full shadow p-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 bottom-3 bg-white rounded-full shadow p-2"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <h4 className="font-bold text-lg mb-2 line-clamp-2">
                {small.title}
              </h4>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {small.description}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                <div className="flex gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {small.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {small.views}
                  </span>
                </div>
                
                <Link href={`/entrechat/${small.slug}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-accent hover:bg-transparent p-0"
                  >
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}