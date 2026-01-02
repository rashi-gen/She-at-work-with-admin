"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const blogs = [
  {
    id: 1,
    title:
      "Ready, Set, Lead: The Next Wave of Women Entrepreneurs is Already Here!",
    excerpt:
      "Discover how the next generation of women leaders are redefining entrepreneurship with innovation and purpose.",
    category: "Leadership",
    date: "November 19, 2025",
    readTime: "5 min",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80",
  },
  {
    id: 2,
    title: "Breaking Barriers: Women in Tech Startups Reshaping Industries",
    excerpt:
      "From AI to fintech, women founders are creating groundbreaking solutions that transform how we live and work.",
    category: "Technology",
    date: "November 15, 2025",
    readTime: "4 min",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80",
  },
  {
    id: 3,
    title:
      "The Art of Balancing: Entrepreneurship and Personal Well-being",
    excerpt:
      "Learn strategies from successful women entrepreneurs on maintaining wellness while building thriving businesses.",
    category: "Wellness",
    date: "November 10, 2025",
    readTime: "6 min",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
  },
  {
    id: 4,
    title: "Funding Strategies for Women-Led Startups",
    excerpt:
      "A comprehensive guide to securing venture capital and alternative funding sources for women entrepreneurs.",
    category: "Finance",
    date: "November 5, 2025",
    readTime: "7 min",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
  },
  {
    id: 5,
    title: "Building Inclusive Work Cultures",
    excerpt:
      "How women leaders are creating diverse and inclusive workplace environments that drive innovation.",
    category: "Leadership",
    date: "October 28, 2025",
    readTime: "5 min",
    image:
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80",
  },
  {
    id: 6,
    title: "Sustainable Business Practices",
    excerpt:
      "Women entrepreneurs leading the charge in creating environmentally conscious and sustainable business models.",
    category: "Sustainability",
    date: "October 20, 2025",
    readTime: "6 min",
    image:
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&q=80",
  },
  {
    id: 7,
    title: "Digital Marketing Strategies for 2025",
    excerpt:
      "Latest trends and effective digital marketing strategies for scaling your business online.",
    category: "Marketing",
    date: "October 15, 2025",
    readTime: "8 min",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
  },
  {
    id: 8,
    title: "Remote Team Management Best Practices",
    excerpt:
      "Leading distributed teams effectively while maintaining productivity and team morale.",
    category: "Management",
    date: "October 10, 2025",
    readTime: "6 min",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
  },
];

export const LatestBlogs = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (typeof window === 'undefined') return;
      
      const width = window.innerWidth;
      if (width < 640) setItemsPerView(1); // mobile
      else if (width < 768) setItemsPerView(2); // small tablet
      else if (width < 1024) setItemsPerView(3); // tablet
      else setItemsPerView(4); // desktop (lg, xl) - 4 cards visible by default
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const totalItems = blogs.length;
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  const next = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(prev => Math.min(prev + itemsPerView, maxIndex));
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => Math.max(prev - itemsPerView, 0));
    }
  };

  // Get visible blogs based on current index
  const getVisibleBlogs = () => {
    return blogs.slice(currentIndex, currentIndex + itemsPerView);
  };

  return (
    <section className="p-5 sm:p-20 bg-background">
      <div className="mx-auto max-w-screen-xl">
        {/* HEADER */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <Badge className="mb-3 text-sm bg-secondary text-primary rounded-xs">
              Fresh Insights
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Latest from Our Blog
            </h2>
          </div>

          <Button
            variant="ghost"
            className="hidden sm:flex text-primary"
          >
            View All Blogs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* ================= HORIZONTAL SCROLL CONTAINER ================= */}
        <div className="relative">
          {/* ARROW BUTTONS - DESKTOP/TABLET */}
          <div className="hidden sm:block">
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              className={`absolute left-[-60px] top-1/2 transform -translate-y-1/2 z-10 
                rounded-full p-3 bg-background text-foreground border border-border shadow-lg 
                hover:bg-accent transition-all duration-300 ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:shadow-xl'}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={next}
              disabled={currentIndex >= maxIndex}
              className={`absolute right-[-60px] top-1/2 transform -translate-y-1/2 z-10 
                rounded-full p-3 bg-background text-foreground border border-border shadow-lg 
                hover:bg-accent transition-all duration-300 ${currentIndex >= maxIndex ? 'opacity-30 cursor-not-allowed' : 'hover:shadow-xl'}`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* MOBILE ARROWS */}
          <div className="sm:hidden flex justify-between absolute top-1/2 left-0 right-0 z-10 px-2 -translate-y-1/2">
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              className={`rounded-full p-2 bg-background/80 backdrop-blur-sm text-foreground border border-border shadow 
                ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              disabled={currentIndex >= maxIndex}
              className={`rounded-full p-2 bg-background/80 backdrop-blur-sm text-foreground border border-border shadow 
                ${currentIndex >= maxIndex ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* VISIBLE BLOGS CONTAINER */}
          <div 
            ref={containerRef}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-500 ease-in-out">
              {getVisibleBlogs().map((blog) => (
                <article
                  key={blog.id}
                  className="group flex flex-col rounded-2xl bg-card border border-border overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* IMAGE - FIXED HEIGHT */}
                  <div className="h-64 w-full overflow-hidden relative">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105 duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>

                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {blog.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {blog.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                      {blog.title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {blog.excerpt}
                    </p>

                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        {blog.date}
                      </span>
                      <span className="text-sm font-medium text-primary flex items-center gap-1">
                        Read More <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* PAGINATION DOTS */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(totalItems / itemsPerView) }).map((_, i) => {
              const startIndex = i * itemsPerView;
              const endIndex = startIndex + itemsPerView;
              const isActive = currentIndex >= startIndex && currentIndex < endIndex;
              
              return (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(startIndex)}
                  className={`w-8 h-1.5 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary' 
                      : 'bg-muted hover:bg-muted-foreground'
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              );
            })}
          </div>
        </div>

        {/* MOBILE VIEW ALL */}
        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" className="font-semibold">
            View All Blogs
          </Button>
        </div>
      </div>
    </section>
  );
};