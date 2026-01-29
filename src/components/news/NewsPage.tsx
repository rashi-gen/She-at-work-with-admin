/*eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  ExternalLink,
  Filter,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import Cta from "../common/Cta";
import { PageBanner } from "@/components/PageBanner";
import { newsData } from "@/data/news";
import Link from "next/link";
import Image from "next/image"; // Import next/image

// Define types for your news data
interface NewsItem {
  ID: string;
  post_title: string;
  post_content: string;
  post_date: string;
  post_excerpt: string;
  featured_image_url: string;
  external_url: string | null;
  section_name: string;
  post_modified?: string;
  post_author?: string;
  post_date_gmt?: string;
  post_content_filtered?: string;
  post_parent?: string;
  guid?: string;
  menu_order?: string;
  post_type?: string;
  post_mime_type?: string;
  comment_count?: string;
  section_id?: string;
  post_name?: string;
}

// Helper function to safely extract domain from URL
const getSourceFromUrl = (url: string | null): string => {
  if (!url || url.trim() === '' || url === 'null') return 'She at Work';
  
  try {
    // Check if it looks like a valid URL
    const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\- .\/?%&=]*)?$/i;
    
    if (!urlPattern.test(url)) {
      return 'She at Work';
    }
    
    // Add https:// if the URL doesn't have a protocol
    const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
    const parsedUrl = new URL(urlWithProtocol);
    const hostname = parsedUrl.hostname.replace('www.', '');
    
    // Extract just the domain name (e.g., 'timesofindia.indiatimes.com' becomes 'Times of India')
    const domainParts = hostname.split('.');
    if (domainParts.length >= 2) {
      // Get the main domain (second to last part)
      const mainDomain = domainParts[domainParts.length - 2];
      
      // Format it nicely (e.g., 'timesofindia' -> 'Times of India')
      const formattedName = mainDomain
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .replace(/[_-]/g, ' ') // Replace underscores and hyphens with spaces
        .trim();
      
      return formattedName || hostname;
    }
    
    return hostname;
  } catch (error) {
    console.warn('Invalid URL, using default source:', url, error);
    return 'She at Work';
  }
};

// Map your categories from the data
const getCategoryFromContent = (content: string): string => {
  const contentLower = content.toLowerCase();
  if (contentLower.includes("funding") || content.includes("$") || contentLower.includes("investment") || contentLower.includes("raise")) return "Funding";
  if (contentLower.includes("award") || contentLower.includes("recognizing") || contentLower.includes("honor")) return "Awards";
  if (contentLower.includes("launch") || contentLower.includes("debut") || contentLower.includes("introduce")) return "Launches";
  if (contentLower.includes("partner") || contentLower.includes("collaboration") || contentLower.includes("joint")) return "Partnerships";
  if (contentLower.includes("success") || contentLower.includes("journey") || contentLower.includes("story") || contentLower.includes("empire")) return "Success Stories";
  if (contentLower.includes("trend") || contentLower.includes("growth") || contentLower.includes("industry") || contentLower.includes("market")) return "Industry Trends";
  if (contentLower.includes("policy") || contentLower.includes("government") || contentLower.includes("tax") || contentLower.includes("initiative")) return "Policy Updates";
  return "General News";
};

const newsCategories = [
  "All News",
  "Funding",
  "Awards",
  "Launches",
  "Partnerships",
  "Success Stories",
  "Industry Trends",
  "Policy Updates",
  "General News",
];

// Format date function
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

// Extract excerpt from content
const extractExcerpt = (content: string, maxLength: number = 150): string => {
  if (!content) return 'No excerpt available';
  
  try {
    // Remove HTML tags
    const plainText = content.replace(/<[^>]*>/g, '');
    // Remove newlines and extra spaces
    const cleanText = plainText.replace(/\s+/g, ' ').trim();
    
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + '...';
  } catch (error) {
    console.warn('Error extracting excerpt:', error);
    return 'No excerpt available';
  }
};

// Calculate read time
const calculateReadTime = (text: string): string => {
  if (!text) return '1 min read';
  
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
  return `${minutes} min read`;
};

// Items per page for pagination
const ITEMS_PER_PAGE = 12;

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All News");
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [processedNews, setProcessedNews] = useState<Array<{
    slug: any;
    id: string;
    category: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    source: string;
    image: string;
    externalUrl: string | null;
    fullContent: string;
    modifiedDate?: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Process news data on component mount
  useEffect(() => {
    try {
      setIsLoading(true);
      
      const processed = newsData.map((item: NewsItem) => {
        const category = getCategoryFromContent(item.post_content);
        const excerpt = item.post_excerpt && item.post_excerpt.trim() !== '' 
          ? item.post_excerpt 
          : extractExcerpt(item.post_content);
        
        const title = item.post_title ? item.post_title.replace(/&amp;/g, '&') : 'Untitled';
        const date = formatDate(item.post_date);
        const readTime = calculateReadTime(excerpt);
        const source = getSourceFromUrl(item.external_url);
        const image = item.featured_image_url && item.featured_image_url.trim() !== '' 
          ? item.featured_image_url 
          : '/placeholder-news.jpg';
        
        return {
          id: item.ID || Math.random().toString(),
          category,
          title,
          excerpt,
          date,
          readTime,
          source,
          image,
          externalUrl: item.external_url && item.external_url.trim() !== '' ? item.external_url : null,
          fullContent: item.post_content || '',
          modifiedDate: item.post_modified ? formatDate(item.post_modified) : undefined,
          slug: item.post_name || `event-${item.ID}`,
        };
      });
      
      // Sort by date (newest first), handle invalid dates
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
      
      setProcessedNews(processed);
    } catch (error) {
      console.error('Error processing news data:', error);
      setProcessedNews([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get featured news (most recent)
  const featuredNews = processedNews.length > 0 ? processedNews[0] : null;

  // Filter news articles based on selected category
  const getFilteredNews = () => {
    if (selectedCategory === "All News") {
      return processedNews;
    }
    return processedNews.filter(article => 
      article.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  };

  // Check if featured news should be shown
  const shouldShowFeaturedNews = () => {
    if (!featuredNews || selectedCategory === "All News") return true;
    return featuredNews.category.toLowerCase() === selectedCategory.toLowerCase();
  };

  const filteredNews = getFilteredNews();
  const showFeaturedNews = shouldShowFeaturedNews();

  // Pagination calculations
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNews = filteredNews.slice(startIndex, endIndex);

  // Get latest headlines (most recent 3 articles)
  const latestHeadlines = processedNews.slice(0, 3);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle external link click
  const handleExternalLink = (url: string | null, title: string) => {
    if (url && url.trim() !== '') {
      try {
        // Ensure URL has protocol
        const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
        window.open(urlWithProtocol, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('Error opening URL:', error);
        alert(`Could not open: ${title}`);
      }
    } else {
      // If no external URL, you could show a modal with the full content
      // For now, just show an alert
      alert(`Opening: ${title}\n\nThis article doesn't have an external link.`);
    }
  };

  if (isLoading) {
    return (
      <main className="bg-background min-h-screen">
        <PageBanner
          title="Women in Business News"
          description="Stay informed with the latest news, insights, and success stories from women entrepreneurs worldwide"
          image="/news/Newsbanner.png"
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading news articles...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen">
      {/* HERO BANNER */}
      <PageBanner
        title="Women in Business News"
        description="Stay informed with the latest news, insights, and success stories from women entrepreneurs worldwide"
        image="/news/Newsbanner.png"
      />

      {/* ================= FEATURED NEWS + SIDEBAR ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* FEATURED - 2 COLUMNS */}
          {showFeaturedNews && featuredNews && (
            <div className="lg:col-span-2">
              <div className="group bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-primary/10">
                {/* FEATURED BADGE */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                  <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-gradient-to-r from-accent to-accent/80 text-white text-xs font-bold uppercase shadow-lg">
                    Featured Story
                  </span>
                </div>

                {/* IMAGE CONTAINER */}
                <div className="relative h-48 sm:h-64 lg:h-80 bg-gradient-to-br from-primary/20 to-accent/20">
                  {featuredNews.image !== '/placeholder-news.jpg' ? (
                    <Image
                      src={featuredNews.image}
                      alt={featuredNews.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                      <div className="text-white/40 text-6xl font-display">
                        {featuredNews.title.charAt(0)}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* CONTENT */}
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <span className="inline-block px-2 sm:px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase w-fit">
                      {featuredNews.category}
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {featuredNews.source}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-display font-bold text-foreground mb-3 sm:mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {featuredNews.title}
                  </h2>

                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed line-clamp-3">
                    {featuredNews.excerpt}
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 sm:pt-6 border-t border-border">
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        {featuredNews.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        {featuredNews.readTime}
                      </div>
                      {featuredNews.modifiedDate && featuredNews.modifiedDate !== 'Date unavailable' && (
                        <div className="text-xs text-muted-foreground/70">
                          Updated: {featuredNews.modifiedDate}
                        </div>
                      )}
                    </div>

                    <Button 
                      className="bg-primary hover:bg-primary/90 group text-sm sm:text-base w-full sm:w-auto"
                      onClick={() => handleExternalLink(featuredNews.externalUrl, featuredNews.title)}
                    >
                      {featuredNews.externalUrl ? 'Read Full Story' : 'View Details'}
                      <ExternalLink className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SIDEBAR - LATEST HEADLINES */}
          <div className={`space-y-4 sm:space-y-6 ${!showFeaturedNews ? 'lg:col-span-3' : ''}`}>
            <div className="bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 shadow-lg border border-border lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-display font-bold text-foreground flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                  Latest Headlines
                </h3>
                {selectedCategory !== "All News" && (
                  <button 
                    onClick={() => {
                      setSelectedCategory("All News");
                      setCurrentPage(1);
                    }}
                    className="text-xs text-primary hover:text-accent transition-colors"
                  >
                    Clear filter
                  </button>
                )}
              </div>

              {showFilter ? (
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                  {newsCategories.slice(1).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowFilter(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-secondary text-muted-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {latestHeadlines.map((news, i) => (
                    <div
                      key={i}
                      className="group cursor-pointer pb-3 sm:pb-4 border-b border-border last:border-0 last:pb-0"
                      onClick={() => handleExternalLink(news.externalUrl, news.title)}
                    >
                      <span className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-semibold mb-1 sm:mb-2 uppercase">
                        {news.category}
                      </span>
                      <h4 className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors mb-1 sm:mb-2 leading-snug line-clamp-2">
                        {news.title}
                      </h4>
                      <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{news.readTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2 mt-4">
                <Button
                  variant="ghost"
                  className="w-full text-primary hover:bg-primary/10 text-sm flex items-center justify-between"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  {showFilter ? "Hide Filters" : "Filter by Category"}
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full text-primary hover:bg-primary/10 text-sm"
                  onClick={() => {
                    setSelectedCategory("All News");
                    setCurrentPage(1);
                  }}
                >
                  View All News{" "}
                  <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ALL NEWS GRID ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 ">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-1 sm:mb-2">
                {selectedCategory === "All News" ? "All News Articles" : `${selectedCategory} Articles`}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {filteredNews.length} {filteredNews.length === 1 ? 'article' : 'articles'} found
                {selectedCategory !== "All News" && ` in ${selectedCategory}`}
              </p>
            </div>

            {selectedCategory !== "All News" && (
              <Button
                variant="outline"
                className="flex items-center gap-2 border-2 w-full sm:w-auto"
                onClick={() => {
                  setSelectedCategory("All News");
                  setCurrentPage(1);
                }}
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                Clear Filter
              </Button>
            )}
          </div>

          {filteredNews.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-2">
                No articles found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                There are no news articles in the &quot;{selectedCategory}&quot; category yet.
              </p>
              <Button
                onClick={() => {
                  setSelectedCategory("All News");
                  setCurrentPage(1);
                }}
                className="bg-gradient-to-r from-primary to-accent text-white font-semibold"
              >
                View All News
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {currentNews.map((news) => (
                  <div
                    key={news.id}
                    className="group bg-card rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-border"
                  >
                    {/* IMAGE CONTAINER */}
                    <div className="relative h-40 sm:h-48 lg:h-56 bg-gradient-to-br from-muted to-secondary">
                      {news.image !== '/placeholder-news.jpg' ? (
                        <Image
                          src={news.image}
                          alt={news.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                          <div className="text-white/40 text-5xl font-display">
                            {news.title.charAt(0)}
                          </div>
                        </div>
                      )}
                      
                      {/* SOURCE BADGE */}
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                        <span className="px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-foreground truncate max-w-[120px]">
                          {news.source}
                        </span>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 sm:p-6">
                      <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-2 sm:mb-3 uppercase">
                        {news.category}
                      </span>

                      <h3 className="text-sm sm:text-base lg:text-lg font-display font-bold text-foreground mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {news.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-5 line-clamp-2 leading-relaxed">
                        {news.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            <span>{news.date}</span>
                          </div>
                          <div className="hidden sm:block">•</div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            <span>{news.readTime}</span>
                          </div>
                        </div>
                        <Link href={`/news/${news.slug}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-accent hover:bg-transparent group-hover:translate-x-1 transition-all p-0 h-auto text-xs sm:text-sm"
                        
                        >
                          Read{" "}
                          <ArrowRight className="ml-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 sm:mt-12 pt-8 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredNews.length)} of {filteredNews.length} articles
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="gap-1"
                    >
                      <ArrowRight className="h-3 w-3 rotate-180" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            className="w-10 h-10 p-0"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="px-2">...</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-10 h-10 p-0"
                            onClick={() => handlePageChange(totalPages)}
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="gap-1"
                    >
                      Next
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Cta/>
    </main>
  );
}