"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { blogsData } from "@/data/Blogs";
import { ArrowRight, Calendar, ChevronRight, Clock, Filter, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Cta from "../common/Cta";
import { PageBanner } from "../PageBanner";

// Define types for your blog data
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
  post_date_gmt?: string;
  post_content_filtered?: string;
  post_parent?: string;
  guid?: string;
  menu_order?: string;
  post_type?: string;
  post_mime_type?: string;
  comment_count?: string;
  section_id?: string;
}

// Extract categories from content
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

const blogCategories = [
  "All Blogs",
  "Leadership",
  "Finance",
  "Marketing",
  "Technology",
  "Wellness",
  "Growth",
  "Strategy",
  "Innovation",
  "Success Stories",
  "General",
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

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Blogs");
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [processedBlogs, setProcessedBlogs] = useState<Array<{
    id: string;
    category: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    author: {
      name: string;
      role?: string;
    };
    image: string;
    fullContent: string;
    modifiedDate?: string;
    slug: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Process blogs data on component mount
  useEffect(() => {
    try {
      setIsLoading(true);
      
      const processed = blogsData.map((item: BlogItem) => {
        const category = getCategoryFromContent(item.post_content);
        const excerpt = item.post_excerpt && item.post_excerpt.trim() !== '' 
          ? item.post_excerpt 
          : extractExcerpt(item.post_content);
        
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
          category,
          title,
          excerpt,
          date,
          readTime,
          author: {
            name: authorName,
            role: "Contributor"
          },
          image,
          fullContent: item.post_content || '',
          modifiedDate: item.post_modified ? formatDate(item.post_modified) : undefined,
          slug: item.post_name || `blog-${item.ID}`
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
      
      setProcessedBlogs(processed);
    } catch (error) {
      console.error('Error processing blogs data:', error);
      setProcessedBlogs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get featured blog (most recent)
  const featuredBlog = processedBlogs.length > 0 ? processedBlogs[0] : null;

  // Get trending posts (most recent 4 articles)
  const trendingPosts = useMemo(() => {
    let posts = processedBlogs;
    // If featured blog is shown, exclude it from trending
    if (featuredBlog) {
      posts = posts.filter(blog => blog.id !== featuredBlog.id);
    }
    return posts.slice(0, 4);
  }, [processedBlogs, featuredBlog]);

  // Filter blog posts based on selected category and search query
  const getFilteredPosts = () => {
    let filtered = processedBlogs;

    // Filter by category
    if (selectedCategory !== "All Blogs") {
      filtered = filtered.filter(post => 
        post.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.fullContent.toLowerCase().includes(query) ||
          post.category.toLowerCase().includes(query) ||
          post.author.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  // Check if featured post should be shown
  const shouldShowFeaturedPost = () => {
    if (!featuredBlog) return false;
    
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      const isFeaturedInSearchResults =
        featuredBlog.title.toLowerCase().includes(query) ||
        featuredBlog.excerpt.toLowerCase().includes(query) ||
        featuredBlog.fullContent.toLowerCase().includes(query) ||
        featuredBlog.category.toLowerCase().includes(query) ||
        featuredBlog.author.name.toLowerCase().includes(query);
      return isFeaturedInSearchResults;
    }
    
    if (selectedCategory === "All Blogs") return true;
    return featuredBlog.category.toLowerCase() === selectedCategory.toLowerCase();
  };

  const filteredPosts = getFilteredPosts();
  const showFeaturedPost = shouldShowFeaturedPost();

  // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Clear search query
  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <main className="bg-background min-h-screen">
        <PageBanner
          title="Inspiring Blogs"
          description="Insights, tips and actionable content from experts and entrepreneurs worldwide"
          image="/finalBlogsbanner.png"
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading blog articles...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen">
      {/* ================= HERO BANNER ================= */}
      <PageBanner
        title="Inspiring Blogs"
        description="Insights, tips and actionable content from experts and entrepreneurs worldwide"
        image="/finalBlogsbanner.png"
      >
 
      </PageBanner>

      {/* ================= FEATURED POST + TRENDING ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-secondary/30">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* LEFT - FEATURED POST */}
          {showFeaturedPost && featuredBlog && (
            <div className="lg:col-span-2">
              <Link 
                href={`/blogs/${featuredBlog.slug}`}
                className="block relative group bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-primary/10"
              >
                {/* FEATURED BADGE */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                  <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-white text-xs font-bold uppercase shadow-lg">
                    Featured Story
                  </span>
                </div>

                {/* IMAGE */}
                <div className="relative h-40 sm:h-64 lg:h-[400px] bg-gradient-to-br from-muted to-secondary">
                  {featuredBlog.image !== '/placeholder-blog.jpg' ? (
                    <Image
                      src={featuredBlog.image}
                      alt={featuredBlog.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                      <div className="text-white/40 text-6xl font-display">
                        {featuredBlog.title.charAt(0)}
                      </div>
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-4 sm:p-6 lg:p-6">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {featuredBlog.title}
                  </h2>

                  <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                    {featuredBlog.excerpt}
                  </p>

                  {/* AUTHOR INFO */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm sm:text-base lg:text-md">
                        {featuredBlog.author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm sm:text-base">
                          {featuredBlog.author.name}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {featuredBlog.author.role}
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:text-accent transition-all duration-200 w-full sm:w-auto justify-center sm:justify-start">
                      <span className="group-hover:underline decoration-accent/30 decoration-2 underline-offset-3">
                        Read Article
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* RIGHT - TRENDING NOW (UPDATED TO MATCH NEWS PAGE) */}
          <div className={`space-y-4 sm:space-y-6 ${!showFeaturedPost ? 'lg:col-span-3' : ''}`}>
            <div className="bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 shadow-lg border border-border lg:sticky lg:top-24">
              {/* HEADER WITH FILTER TOGGLE */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-display font-bold text-foreground flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                  {showFilter ? "Filter by Category" : "Trending Now"}
                </h3>
                <div className="flex items-center gap-2">
                  {selectedCategory !== "All Blogs" && !showFilter && (
                    <button
                      onClick={() => {
                        setSelectedCategory("All Blogs");
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
                      {blogCategories.map((cat) => (
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
                  {selectedCategory !== "All Blogs" && (
                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Filtering: <span className="font-medium text-primary">{selectedCategory}</span>
                      </span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                // TRENDING POSTS VIEW - Always visible
                <div className="max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="space-y-3 sm:space-y-4">
                    {trendingPosts.map((post, i) => (
                      <Link
                        key={i}
                        href={`/blogs/${post.slug}`}
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
                                {post.category}
                              </span>
                              <span className="text-[10px] text-muted-foreground truncate">
                                {post.author.name}
                              </span>
                            </div>
                            <h4 className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors mb-1.5 leading-snug line-clamp-2">
                              {post.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{post.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{post.readTime}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* ARROW INDICATOR */}
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary/60 transition-colors flex-shrink-0 mt-1" />
                        </div>
                      </Link>
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
                    Filter Articles
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
                    setSelectedCategory("All Blogs");
                    setCurrentPage(1);
                    setShowFilter(false);
                  }}
                >
                  View All Blogs
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
                
                {selectedCategory !== "All Blogs" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-sm border-primary/20 hover:border-primary hover:bg-primary/5 text-primary"
                    onClick={() => {
                      setSelectedCategory("All Blogs");
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

      {/* ================= LATEST ARTICLES GRID ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-1 sm:mb-2">
                {selectedCategory === "All Blogs" ? "Latest Articles" : `${selectedCategory} Articles`}
                {searchQuery && (
                  <span className="text-lg sm:text-xl text-primary">
                    {" "}
                    - Search results for {searchQuery}
                  </span>
                )}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
                {selectedCategory !== "All Blogs" && ` in ${selectedCategory}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full sm:w-auto">
              {/* SEARCH BAR */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black z-10" />
                <Input
                  type="search"
                  placeholder="Search blogs..."
                  className="pl-10 pr-10 w-full"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {(selectedCategory !== "All Blogs" || searchQuery) && (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-2 w-full sm:w-auto"
                  onClick={() => {
                    setSelectedCategory("All Blogs");
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-2">
                No articles found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery
                  ? `No articles found matching "${searchQuery}"${
                      selectedCategory !== "All Blogs"
                        ? ` in the "${selectedCategory}" category`
                        : ""
                    }`
                  : `There are no blog posts in the "${selectedCategory}" category yet.`}
              </p>
              <Button
                onClick={() => {
                  setSelectedCategory("All Blogs");
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="bg-gradient-to-r from-primary to-accent text-white font-semibold"
              >
                View All Blogs
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {currentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blogs/${post.slug}`}
                    className="group bg-card rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-border flex flex-col h-full"
                  >
                    {/* IMAGE */}
                    <div className="relative h-40 sm:h-44 bg-gradient-to-br from-muted to-secondary flex-shrink-0">
                      {post.image !== '/placeholder-blog.jpg' ? (
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                          <div className="text-white/40 text-5xl font-display">
                            {post.title.charAt(0)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 sm:p-6 flex flex-col flex-grow">
                      <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2 sm:mb-3 uppercase">
                        {post.category}
                      </span>

                      <h3 className="text-sm sm:text-base lg:text-lg font-display font-bold text-foreground mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-5 line-clamp-2 leading-relaxed flex-grow">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border mt-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            <span>{post.date}</span>
                          </div>
                          <div className="hidden sm:block">•</div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:text-accent transition-all duration-200">
                          <span className="group-hover:underline decoration-accent/30 decoration-2 underline-offset-3">
                            Read
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 sm:mt-12 pt-8 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)} of {filteredPosts.length} articles
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