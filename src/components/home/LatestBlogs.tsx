// components/home/LatestBlogs.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, Clock, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Import your blogs data
import { blogsData } from "@/data/Blogs";

// Types matching your blog data structure
interface BlogItem {
  post_name: string;
  ID: string;
  post_title: string;
  post_content: string;
  post_date: string;
  post_excerpt: string;
  featured_image_url: string | null;
  external_url: string | null;
  section_name: string;
  post_modified?: string;
  post_author?: string;
}

// Helper functions from your BlogsPage
const getCategoryFromContent = (content: string): string => {
  const contentLower = content.toLowerCase();
  if (contentLower.includes("leadership") || contentLower.includes("leader") || contentLower.includes("ceo") || contentLower.includes("management")) return "Leadership";
  if (contentLower.includes("finance") || contentLower.includes("funding") || contentLower.includes("$") || contentLower.includes("investment") || contentLower.includes("budget") || contentLower.includes("financial")) return "Finance";
  if (contentLower.includes("marketing") || contentLower.includes("brand") || contentLower.includes("social media") || contentLower.includes("promotion") || contentLower.includes("sales")) return "Marketing";
  if (contentLower.includes("technology") || contentLower.includes("tech") || contentLower.includes("digital") || contentLower.includes("ai") || contentLower.includes("software") || contentLower.includes("app")) return "Technology";
  if (contentLower.includes("wellness") || contentLower.includes("health") || contentLower.includes("self-care") || contentLower.includes("mental health") || contentLower.includes("balance")) return "Wellness";
  if (contentLower.includes("growth") || contentLower.includes("scale") || contentLower.includes("expand") || contentLower.includes("development") || contentLower.includes("progress")) return "Growth";
  if (contentLower.includes("strategy") || contentLower.includes("planning") || contentLower.includes("tactics") || contentLower.includes("business plan") || contentLower.includes("roadmap")) return "Strategy";
  if (contentLower.includes("innovation") || contentLower.includes("innovate") || contentLower.includes("creative") || contentLower.includes("disrupt") || contentLower.includes("new ideas")) return "Innovation";
  if (contentLower.includes("success") || contentLower.includes("story") || contentLower.includes("journey") || contentLower.includes("experience") || contentLower.includes("testimonial")) return "Success Stories";
  return "General";
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

const calculateReadTime = (text: string): string => {
  if (!text) return '1 min read';
  
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
};

export const LatestBlogs = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [blogs, setBlogs] = useState<Array<{
    id: string;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    slug: string;
    author: {
      name: string;
      role?: string;
    };
  }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Process blogs data on component mount
  useEffect(() => {
    const processBlogs = () => {
      const processed = blogsData.slice(0, 8).map((item: BlogItem) => {
        const category = getCategoryFromContent(item.post_content);
        const excerpt = item.post_excerpt && item.post_excerpt.trim() !== '' 
          ? item.post_excerpt 
          : extractExcerpt(item.post_content, 100);
        
        const title = item.post_title ? item.post_title.replace(/&amp;/g, '&') : 'Untitled';
        const date = formatDate(item.post_date);
        const readTime = calculateReadTime(excerpt);
        
        // Extract author from content or use default
        let authorName = "She at Work";
        const authorMatch = item.post_content.match(/by\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i) || 
                           item.post_content.match(/Written by\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i);
        if (authorMatch) {
          authorName = authorMatch[1];
        }
        
        const image = item.featured_image_url && item.featured_image_url.trim() !== '' 
          ? item.featured_image_url 
          : '/placeholder-blog.jpg';
        
        return {
          id: item.ID || Math.random().toString(),
          title,
          excerpt,
          category,
          date,
          readTime,
          image,
          slug: item.post_name || `blog-${item.ID}`,
          author: {
            name: authorName,
            role: "Contributor"
          }
        };
      });
      
      // Sort by date (newest first)
      processed.sort((a, b) => {
        try {
          const dateA = new Date(a.date === 'Date unavailable' ? '1970-01-01' : a.date);
          const dateB = new Date(b.date === 'Date unavailable' ? '1970-01-01' : b.date);
          return dateB.getTime() - dateA.getTime();
        } catch (error) {
          console.log(error)
          return 0;
        }
      });
      
      setBlogs(processed);
    };

    processBlogs();
  }, []);

  // Fallback to hardcoded blogs if no data
  const displayBlogs = blogs.length > 0 ? blogs : [
    {
      id: "1",
      title: "Ready, Set, Lead: The Next Wave of Women Entrepreneurs is Already Here!",
      excerpt: "Discover how the next generation of women leaders are redefining entrepreneurship with innovation and purpose.",
      category: "Leadership",
      date: "November 19, 2025",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80",
      slug: "ready-set-lead-next-wave-women-entrepreneurs",
      author: { name: "She at Work", role: "Editor" }
    },
    // ... (keep the rest of your fallback blogs)
  ];

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

  const totalItems = displayBlogs.length;
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
    return displayBlogs.slice(currentIndex, currentIndex + itemsPerView);
  };

  return (
    <section className="p-5 sm:p-20 bg-background">
      <div className="mx-auto max-w-screen-xl">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <Badge className="mb-3 text-sm bg-secondary text-primary rounded-xs">
              Fresh Insights
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Latest from Our Blog
            </h2>
          </div>

          <Link href="/blogs">
            <Button variant="ghost" className="hidden sm:flex text-primary">
              View All Blogs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

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
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-500 ease-in-out"
            >
              {getVisibleBlogs().map((blog, index) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="
                    group
                    flex flex-col
                    rounded-2xl
                    bg-card
                    border border-border
                    overflow-hidden
                    transition-all duration-300 ease-out
                    hover:-translate-y-2
                    hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]
                  "
                >
                  {/* IMAGE */}
                  <div className="h-44 w-full overflow-hidden relative">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />

                    {/* Image hover overlay */}
                    <div className="
                      absolute inset-0
                      bg-gradient-to-t from-black/20 to-transparent
                      opacity-0
                      transition-opacity duration-300
                      group-hover:opacity-100
                    " />
                  </div>

                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge
                        variant="secondary"
                        className="text-xs transition-colors duration-300 group-hover:bg-primary/10 group-hover:text-primary"
                      >
                        {blog.category}
                      </Badge>

                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {blog.readTime}
                      </span>
                    </div>

                    <h3 className="
                      text-lg font-bold mb-2 line-clamp-2
                      text-foreground
                      transition-colors duration-300
                      group-hover:text-primary
                    ">
                      {blog.title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {blog.excerpt}
                    </p>

                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {blog.date}
                      </span>

                      <Link href={`/blogs/${blog.slug}`}>
                        <span className="
                          text-sm font-medium text-primary
                          flex items-center gap-1
                          transition-all duration-300
                          group-hover:gap-2
                        ">
                          Read More
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>

          {/* PAGINATION DOTS */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center gap-2 mt-8"
          >
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
          </motion.div>
        </div>

        {/* MOBILE VIEW ALL */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center sm:hidden"
        >
          <Link href="/blogs">
            <Button variant="outline" className="font-semibold">
              View All Blogs
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};