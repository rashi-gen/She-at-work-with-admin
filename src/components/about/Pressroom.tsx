// /app/about/press-room/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import Cta from "@/components/common/Cta";
import { pressData } from "@/data/Press";

// Define types for press data
interface PressItem {
  ID: string;
  post_title: string;
  post_content: string;
  post_date: string;
  post_excerpt: string;
  post_name: string;
  post_modified?: string;
  post_author?: string;
  featured_image_url?: string | null;
  content_images?: string[] | null;
}

interface ProcessedPressItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: { name: string; role?: string };
  image: string;
  fullContent: string;
  modifiedDate?: string;
  slug: string;
  hasValidContent: boolean;
}

// Helper functions
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date unavailable';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return 'Date unavailable';
  }
};

// Clean HTML tags from text
const cleanText = (text: string): string => {
  if (!text) return '';
  
  // Remove HTML tags
  const clean = text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&amp;/g, '&') // Replace HTML entities
    .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
    .replace(/&\w+;/g, ' ') // Replace other HTML entities
    .trim();
  
  return clean;
};

const extractExcerpt = (content: string, maxLength: number = 150): string => {
  if (!content) return 'No excerpt available';
  
  // First clean the content
  const cleanContent = cleanText(content);
  
  // If content is just gallery shortcodes, provide a generic description
  if (cleanContent.length === 0 || cleanContent.length < 20) {
    return 'Press release with media gallery available';
  }
  
  return cleanContent.length <= maxLength ? cleanContent : cleanContent.substring(0, maxLength) + '...';
};

const calculateReadTime = (text: string): string => {
  if (!text) return '1 min read';
  
  // Clean the text first
  const cleanTextContent = cleanText(text);
  
  if (cleanTextContent.length === 0) return '1 min read';
  
  const wordCount = cleanTextContent.split(/\s+/).filter(word => word.length > 0).length;
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
};

// Helper to get image URL from press item
const getImageUrl = (item: PressItem): string => {
  // First, try featured image URL
  if (item.featured_image_url) {
    return item.featured_image_url;
  }
  
  // Then try content images array
  if (item.content_images && item.content_images.length > 0) {
    return item.content_images[0];
  }
  
  // Fallback to default placeholder
  return '/images/press-placeholder.jpg';
};

const isValidContent = (content: string, content_images?: string[] | null): boolean => {
  if (!content) return false;
  
  const cleanContent = cleanText(content);
  
  // Check if the content starts with a gallery shortcode and has no meaningful text
  const startsWithGallery = content.trim().startsWith('[gallery');
  const hasOnlyGallery = startsWithGallery && cleanContent.length === 0;
  
  // If it's just a gallery without any text, we don't want to show it
  if (hasOnlyGallery) {
    // Check if it has content images - if yes, we can show it as a gallery post
    if (content_images && content_images.length > 0) {
      return true; // Show gallery-only posts that have images
    }
    return false; // Don't show empty gallery posts
  }
  
  // For regular content, check if it has meaningful text
  return cleanContent.length > 50 || startsWithGallery;
};


const ITEMS_PER_PAGE = 12;

export default function PressRoomPage() {
  const [processedPress, setProcessedPress] = useState<ProcessedPressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPress, setFilteredPress] = useState<ProcessedPressItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
// Update the useEffect that processes the data
useEffect(() => {
  setIsLoading(true);
  const processed = pressData
    .map((item: PressItem) => {
      // Clean the title first
      const cleanTitle = cleanText(item.post_title) || 'Untitled Press Release';
      const excerpt = extractExcerpt(item.post_content);
      const date = formatDate(item.post_date);
      const readTime = calculateReadTime(item.post_content);
      
      // Extract author from content or use default
      let authorName = "She at Work";
      if (item.post_content) {
        const authorMatch = item.post_content.match(/by\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i) || 
                          item.post_content.match(/–\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i);
        if (authorMatch) authorName = authorMatch[1];
      }
      
      const image = getImageUrl(item);
      const hasValidContent = isValidContent(item.post_content, item.content_images);
      
      return {
        id: item.ID,
        title: cleanTitle,
        excerpt,
        date,
        readTime,
        author: { name: authorName, role: "Contributor" },
        image,
        fullContent: item.post_content,
        modifiedDate: item.post_modified ? formatDate(item.post_modified) : undefined,
        slug: item.post_name,
        hasValidContent,
      };
    })
    .filter(item => {
    // Check if it's the specific problematic gallery post
    const isProblematicGallery = item.fullContent.includes('ids="15304,15303,15302,15301,15311,15312,15313,15314,15315,15316,15317,15318,15319,15320,15321,15322,15323,15324,15325,15326,15327,15328,15329,15330,15331,15332"');
    
    if (isProblematicGallery) {
      return false; // Exclude this specific post
    }
    
    return item.hasValidContent;
  })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  setProcessedPress(processed);
  setFilteredPress(processed);
  setIsLoading(false);
}, []);
  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPress(processedPress);
      setCurrentPage(1);
    } else {
      const filtered = processedPress.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPress(filtered);
      setCurrentPage(1);
    }
  }, [searchQuery, processedPress]);

  const featuredPress = filteredPress.length > 0 ? filteredPress[0] : null;
  // const trendingPress = filteredPress.slice(0, 4);

  const totalPages = Math.ceil(filteredPress.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPosts = filteredPress.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <main className="bg-background min-h-screen">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-28 pb-2 overflow-hidden hero-gradient">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />

        <div className="relative w-full mx-auto text-center text-white px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 px-2 sm:px-0">
            Press Room
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 max-w-4xl mx-auto px-4 sm:px-8 lg:px-0">
            Latest press releases and news from Sheatwork
          </p>
        </div>
      </section>

      {/* Featured Press Section (only show if we have items) */}
      {featuredPress && (
        <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-screen-xl mx-auto">
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 sm:p-8 mb-8">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/2">
                  <div className="relative h-64 sm:h-72 lg:h-96 rounded-xl overflow-hidden">
                    <Image
                      src={featuredPress.image}
                      alt={featuredPress.title}
                      fill
                      className="object-cover"
                      unoptimized={featuredPress.image.startsWith('http')}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
                <div className="lg:w-1/2 flex flex-col justify-center">
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Featured
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4">
                    {featuredPress.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {featuredPress.excerpt}
                  </p>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{featuredPress.date}</span>
                      </div>
                      <div className="h-4 w-px bg-border" />
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{featuredPress.readTime}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/about/press-room/${featuredPress.slug}`}>
                    <Button className="w-full sm:w-auto">
                      Read Full Release
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

  

      {/* All Press Releases with Search */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
              All Press Releases
              <span className="text-muted-foreground text-sm font-normal ml-2">
                ({filteredPress.length} releases)
              </span>
            </h2>
            
            <div className="w-full sm:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search press releases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 pl-10 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {filteredPress.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No press releases found matching your search.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/about/press-room/${post.slug}`}
                    className="group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border flex flex-col h-full"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-muted to-secondary flex-shrink-0">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized={post.image.startsWith('http')}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-base font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t mt-auto">
                        <div className="flex flex-col text-xs text-muted-foreground">
                          <div className="flex items-center gap-1 mb-1">
                            <Calendar className="h-3 w-3" />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-1 text-sm text-primary group-hover:text-accent group-hover:gap-2 transition-all">
                          <span className="group-hover:underline">Read</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3"
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={i}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-10 h-10 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="flex items-center px-2">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                        className="w-10 h-10 p-0"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      <Cta />
    </main>
  );
}