// /components/entrechat/EntreChatPage.tsx
"use client";

import { Button } from "@/components/ui/button";
import { entrechatData } from "@/data/Entrechat";
import { ArrowRight, Calendar, ChevronRight, Clock, Filter, Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cta from "../common/Cta";
import { PageBanner } from "../PageBanner";

// Define types for your entrechat data
interface EntreChatItem {
  ID: string;
  post_title: string;
  post_content: string;
  post_date: string;
  post_excerpt: string;
  featured_image_url: string | null;
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
  post_name: string;
}

// Extract categories from content
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

const entrechatCategories = [
  "All Interviews",
  "Design & Architecture",
  "Wellness & Health", 
  "Funding & Finance",
  "Technology",
  "Leadership",
  "Marketing",
  "Product Development",
  "Work-Life Balance",
  "Legal & Compliance",
  "Entrepreneurship"
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

// Extract interviewee name from title
const extractInterviewee = (title: string): string => {
  // Remove "Entrechat With" or "Entrechat with" prefix
  const cleaned = title.replace(/Entrechat\s+(?:With|with)\s+/i, '').trim();
  // Remove any trailing "Ms." or "Mr."
  const finalName = cleaned.replace(/^(Ms\.|Mr\.)\s+/i, '').trim();
  return finalName || "Interviewee";
};

// Calculate read time
const calculateReadTime = (text: string): string => {
  if (!text) return '1 min read';
  
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
};

// Items per page for pagination
const ITEMS_PER_PAGE = 12;

export default function EntreChatPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Interviews");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [processedInterviews, setProcessedInterviews] = useState<Array<{
    id: string;
    category: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    interviewee: string;
    image: string;
    fullContent: string;
    modifiedDate?: string;
    slug: string;
    authorInfo?: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Process entrechat data on component mount
  useEffect(() => {
    try {
      setIsLoading(true);
      
      const processed = entrechatData.map((item: EntreChatItem) => {
        const category = getCategoryFromContent(item.post_content);
        const excerpt = item.post_excerpt && item.post_excerpt.trim() !== '' 
          ? item.post_excerpt 
          : extractExcerpt(item.post_content);
        
        const title = item.post_title ? item.post_title.replace(/&amp;/g, '&') : 'EntreChat Interview';
        const date = formatDate(item.post_date);
        const readTime = calculateReadTime(excerpt);
        const interviewee = extractInterviewee(title);
        
        const image = item.featured_image_url && item.featured_image_url.trim() !== '' 
          ? item.featured_image_url 
          : '/placeholder-interview.jpg';
        
        // Extract author info from content (first paragraph)
        const authorInfo = extractExcerpt(item.post_content.replace(/<[^>]*>/g, ''), 100);
        
        return {
          id: item.ID || Math.random().toString(),
          category,
          title,
          excerpt,
          date,
          readTime,
          interviewee,
          image,
          fullContent: item.post_content || '',
          modifiedDate: item.post_modified ? formatDate(item.post_modified) : undefined,
          slug: item.post_name || `entrechat-${item.ID}`,
          authorInfo
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
      
      setProcessedInterviews(processed);
    } catch (error) {
      console.error('Error processing entrechat data:', error);
      setProcessedInterviews([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get featured interview (most recent)
  const featuredInterview = processedInterviews.length > 0 ? processedInterviews[0] : null;

  // Get trending interviews (most recent 4)
  const trendingInterviews = processedInterviews.slice(0, 4);

  // Filter interviews based on selected category
  const getFilteredInterviews = () => {
    if (selectedCategory === "All Interviews") {
      return processedInterviews;
    }
    return processedInterviews.filter(interview => 
      interview.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  };

  // Check if featured interview should be shown
  const shouldShowFeaturedInterview = () => {
    if (!featuredInterview || selectedCategory === "All Interviews") return true;
    return featuredInterview.category.toLowerCase() === selectedCategory.toLowerCase();
  };

  const filteredInterviews = getFilteredInterviews();
  const showFeaturedInterview = shouldShowFeaturedInterview();

  // Get filtered trending interviews
  // const getFilteredTrendingInterviews = () => {
  //   if (selectedCategory === "All Interviews") {
  //     return trendingInterviews;
  //   }
  //   return trendingInterviews.filter(interview => 
  //     interview.category.toLowerCase() === selectedCategory.toLowerCase()
  //   ).slice(0, 4);
  // };

  // const filteredTrendingInterviews = getFilteredTrendingInterviews();

  // Pagination calculations
  const totalPages = Math.ceil(filteredInterviews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentInterviews = filteredInterviews.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle card click
  const handleCardClick = (slug: string) => {
    router.push(`/entrechat/${slug}`);
  };

  if (isLoading) {
    return (
      <main className="bg-background min-h-screen">
        <PageBanner
          title="EntreChat Community"
          description="Exclusive interviews with inspiring women entrepreneurs sharing their journeys, insights, and advice"
          image="/FinalEntrechatbanner.png"
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading interviews...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen flex flex-col">
      {/* ================= HERO BANNER ================= */}
      <PageBanner
        title="EntreChat Community"
        description="Exclusive interviews with inspiring women entrepreneurs sharing their journeys, insights, and advice"
        image="/FinalEntrechatbanner.png"
      >
        {/* Active filter indicator */}
        {selectedCategory !== "All Interviews" && (
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
              <span>Filtering by:</span>
              <span className="font-semibold">{selectedCategory}</span>
              <button 
                onClick={() => {
                  setSelectedCategory("All Interviews");
                  setCurrentPage(1);
                }}
                className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* MOBILE CATEGORY MENU TOGGLE */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            className="bg-white/20 text-white border-white/30 w-full hover:bg-white/30"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4 mr-2" />
            ) : (
              <Menu className="h-4 w-4 mr-2" />
            )}
            Categories
          </Button>
        </div>

        {/* CATEGORY FILTERS */}
        <div
          className={`${
            mobileMenuOpen ? "block" : "hidden lg:flex"
          } flex-col lg:flex-row flex-wrap gap-2 sm:gap-3`}
        >
          {entrechatCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setMobileMenuOpen(false);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-white text-primary shadow-lg scale-105"
                  : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </PageBanner>

      {/* ================= FEATURED INTERVIEW + TRENDING ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-secondary/30 flex-1">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* LEFT - FEATURED INTERVIEW */}
          {showFeaturedInterview && featuredInterview && (
            <div className="lg:col-span-2">
              <div 
                onClick={() => handleCardClick(featuredInterview.slug)}
                className="relative group bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-primary/10 cursor-pointer"
              >
                {/* IMAGE */}
                <div className="relative h-48 sm:h-60 lg:h-[450px] overflow-hidden bg-gradient-to-br from-muted to-secondary">
                  {featuredInterview.image !== '/placeholder-interview.jpg' ? (
                    <Image
                      src={featuredInterview.image}
                      alt={featuredInterview.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-white/40 text-6xl font-display">
                          {featuredInterview.interviewee.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-4 sm:p-6 lg:p-6">
              

                  <h2 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {featuredInterview.title}
                  </h2>

                  <p className="text-sm sm:text-base text-muted-foreground mb-4  leading-relaxed line-clamp-3">
                    {featuredInterview.excerpt}
                  </p>

                  {/* INTERVIEWEE INFO */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4  border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm sm:text-base lg:text-lg">
                        {featuredInterview.interviewee.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm sm:text-base">
                          {featuredInterview.interviewee}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Featured Interview
                        </p>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto">
                      <Button className="bg-primary hover:bg-primary/90 w-full text-sm sm:text-base">
                        Read Interview{" "}
                        <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT - TRENDING INTERVIEWS (UPDATED TO MATCH NEWS PAGE) */}
          <div className={`space-y-4 sm:space-y-6 ${!showFeaturedInterview ? 'lg:col-span-3' : ''}`}>
            <div className="bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 shadow-lg border border-border lg:sticky lg:top-24">
              {/* HEADER WITH FILTER TOGGLE */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-display font-bold text-foreground flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                  {showFilter ? "Filter by Category" : "Trending Interviews"}
                </h3>
                <div className="flex items-center gap-2">
                  {selectedCategory !== "All Interviews" && !showFilter && (
                    <button
                      onClick={() => {
                        setSelectedCategory("All Interviews");
                        setCurrentPage(1);
                      }}
                      className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                    aria-label={showFilter ? "Show trending" : "Show filters"}
                  >
                    <Filter className={`h-4 w-4 ${showFilter ? "text-primary" : "text-muted-foreground"}`} />
                  </button>
                </div>
              </div>

              {/* CONDITIONAL CONTENT */}
              {showFilter ? (
                // FILTER VIEW - Compact with custom scrollbar
                <div className="mb-4">
                  <div className="max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-1">
                      {entrechatCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setShowFilter(false);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                            selectedCategory === cat
                              ? "bg-primary/10 text-primary font-medium border-l-4 border-primary"
                              : "hover:bg-secondary/50 text-muted-foreground border-l-4 border-transparent hover:border-primary/20"
                          }`}
                        >
                          <span className="truncate">{cat}</span>
                          {selectedCategory === cat ? (
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                Active
                              </span>
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            </div>
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary/50 transition-colors flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* FILTER STATUS */}
                  {selectedCategory !== "All Interviews" && (
                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Filtering: <span className="font-medium text-primary">{selectedCategory}</span>
                      </span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {filteredInterviews.length} {filteredInterviews.length === 1 ? 'interview' : 'interviews'}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                // TRENDING INTERVIEWS VIEW - Always visible
                <div className="max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="space-y-3 sm:space-y-4">
                    {trendingInterviews.map((interview, i) => (
                      <div 
                        key={i}
                        onClick={() => handleCardClick(interview.slug)}
                        className="block group cursor-pointer pb-3 sm:pb-4 border-b border-border last:border-0 last:pb-0 hover:bg-secondary/30 rounded-lg px-2 -mx-2 transition-all duration-200"
                      >
                        <div className="flex items-start gap-3">
                          {/* NUMBER BADGE */}
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-primary text-xs font-bold">
                              {i + 1}
                            </div>
                          </div>
                          
                          {/* CONTENT */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                              <span className="inline-block px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-semibold uppercase tracking-wide truncate max-w-[80px]">
                                {interview.category.split(' & ')[0]}
                              </span>
                              <span className="text-[10px] text-muted-foreground truncate">
                                {interview.interviewee.split(' ')[0]}
                              </span>
                            </div>
                            <h4 className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors mb-1.5 leading-snug line-clamp-2">
                              {interview.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{interview.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{interview.readTime}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* ARROW INDICATOR */}
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary/60 transition-colors flex-shrink-0 mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* QUICK ACTION BUTTONS - Always visible */}
              <div className="space-y-2 mt-4 pt-4 border-t border-border">
                {!showFilter ? (
                  <Button
                    variant="ghost"
                    className="w-full text-primary hover:bg-primary/10 hover:text-primary text-sm flex items-center justify-center gap-2 group"
                    onClick={() => setShowFilter(true)}
                  >
                    <Filter className="h-3.5 w-3.5" />
                    Filter Interviews
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full text-muted-foreground hover:bg-secondary hover:text-foreground text-sm flex items-center justify-center gap-2 group"
                    onClick={() => setShowFilter(false)}
                  >
                    <ChevronRight className="h-3.5 w-3.5 rotate-180" />
                    Back to Trending
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  className="w-full text-accent hover:bg-accent/10 hover:text-accent text-sm flex items-center justify-center gap-2 group"
                  onClick={() => {
                    setSelectedCategory("All Interviews");
                    setCurrentPage(1);
                    setShowFilter(false);
                  }}
                >
                  View All Interviews
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
                
                {selectedCategory !== "All Interviews" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-sm border-primary/20 hover:border-primary hover:bg-primary/5 text-primary"
                    onClick={() => {
                      setSelectedCategory("All Interviews");
                      setCurrentPage(1);
                      setShowFilter(false);
                    }}
                  >
                    <X className="h-3.5 w-3.5 mr-1.5" />
                    Clear {selectedCategory} Filter
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ALL INTERVIEWS GRID ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 flex-1">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-1 sm:mb-2">
                {selectedCategory === "All Interviews" ? "All Interviews" : `${selectedCategory} Interviews`}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {filteredInterviews.length} {filteredInterviews.length === 1 ? 'interview' : 'interviews'} found
                {selectedCategory !== "All Interviews" && ` in ${selectedCategory}`}
              </p>
            </div>

            {selectedCategory !== "All Interviews" && (
              <Button
                variant="outline"
                className="flex items-center gap-2 border-2 w-full sm:w-auto"
                onClick={() => {
                  setSelectedCategory("All Interviews");
                  setCurrentPage(1);
                }}
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                Clear Filter
              </Button>
            )}
          </div>

          {filteredInterviews.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-2">
                No interviews found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                There are no interviews in the &quot;{selectedCategory}&quot; category yet.
              </p>
              <Button
                onClick={() => {
                  setSelectedCategory("All Interviews");
                  setCurrentPage(1);
                }}
                className="bg-gradient-to-r from-primary to-accent text-white font-semibold"
              >
                View All Interviews
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {currentInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    onClick={() => handleCardClick(interview.slug)}
                    className="group bg-card rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-border cursor-pointer"
                  >
                    {/* IMAGE */}
                    <div className="relative h-40 sm:h-40 overflow-hidden bg-gradient-to-br from-muted to-secondary">
                      {interview.image !== '/placeholder-interview.jpg' ? (
                        <Image
                          src={interview.image}
                          alt={interview.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <span className="text-white/40 text-5xl font-display">
                              {interview.interviewee.charAt(0)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 sm:p-6">
                      <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-2 sm:mb-3 uppercase">
                        Interview
                      </span>

                      <h3 className="text-sm sm:text-base lg:text-lg font-display font-bold text-foreground mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {interview.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-5 line-clamp-2 leading-relaxed">
                        {interview.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            <span>{interview.date}</span>
                          </div>
                          <div className="hidden sm:block">•</div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            <span>{interview.readTime}</span>
                          </div>
                        </div>
                        <div className="text-primary hover:text-accent group-hover:translate-x-1 transition-all p-0 h-auto text-xs sm:text-sm">
                          Read{" "}
                          <ArrowRight className="ml-1 h-3 w-3 sm:h-3.5 sm:w-3.5 inline" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 sm:mt-12 pt-8 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredInterviews.length)} of {filteredInterviews.length} interviews
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