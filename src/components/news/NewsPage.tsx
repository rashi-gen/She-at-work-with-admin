/*eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PageBanner } from "@/components/PageBanner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { newsData } from "@/data/news";
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  ExternalLink,
  Filter,
  Globe,
  MapPin,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Cta from "../common/Cta";

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

// Extended interface for processed news with location data
interface ProcessedNewsItem {
  slug: any;
  id: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  rawDate: Date;
  readTime: string;
  source: string;
  image: string;
  externalUrl: string | null;
  fullContent: string;
  modifiedDate?: string;
  modifiedRawDate?: Date;
  state?: string;
  country?: string;
}

// Helper function to safely extract domain from URL
const getSourceFromUrl = (url: string | null): string => {
  if (!url || url.trim() === "" || url === "null") return "She at Work";

  try {
    const urlPattern =
      /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\- .\/?%&=]*)?$/i;

    if (!urlPattern.test(url)) {
      return "She at Work";
    }

    const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`;
    const parsedUrl = new URL(urlWithProtocol);
    const hostname = parsedUrl.hostname.replace("www.", "");

    const domainParts = hostname.split(".");
    if (domainParts.length >= 2) {
      const mainDomain = domainParts[domainParts.length - 2];
      const formattedName = mainDomain
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .replace(/[_-]/g, " ")
        .trim();

      return formattedName || hostname;
    }

    return hostname;
  } catch (error) {
    console.warn("Invalid URL, using default source:", url, error);
    return "She at Work";
  }
};

// Map your categories from the content
const getCategoryFromContent = (content: string): string => {
  const contentLower = content.toLowerCase();
  if (
    contentLower.includes("funding") ||
    content.includes("$") ||
    contentLower.includes("investment") ||
    contentLower.includes("raise")
  )
    return "Funding";
  if (
    contentLower.includes("award") ||
    contentLower.includes("recognizing") ||
    contentLower.includes("honor")
  )
    return "Awards";
  if (
    contentLower.includes("launch") ||
    contentLower.includes("debut") ||
    contentLower.includes("introduce")
  )
    return "Launches";
  if (
    contentLower.includes("partner") ||
    contentLower.includes("collaboration") ||
    contentLower.includes("joint")
  )
    return "Partnerships";
  if (
    contentLower.includes("success") ||
    contentLower.includes("journey") ||
    contentLower.includes("story") ||
    contentLower.includes("empire")
  )
    return "Success Stories";
  if (
    contentLower.includes("trend") ||
    contentLower.includes("growth") ||
    contentLower.includes("industry") ||
    contentLower.includes("market")
  )
    return "Industry Trends";
  if (
    contentLower.includes("policy") ||
    contentLower.includes("government") ||
    contentLower.includes("tax") ||
    contentLower.includes("initiative")
  )
    return "Policy Updates";
  return "General News";
};

// Mock location data - In real app, you would have this data from your database
const mockLocationData: Record<string, { state?: string; country?: string }> = {
  // This is a mock - you should replace with actual location data
  // Format: "news-id": { state: "California", country: "USA" }
};

// Get location from mock data or extract from content as fallback
const getLocationData = (id: string, content: string): { state?: string; country?: string } => {
  // First try to get from mock data
  if (mockLocationData[id]) {
    return mockLocationData[id];
  }
  
  // Fallback to extracting from content
  const contentLower = content.toLowerCase();
  let state: string | undefined;
  let country: string | undefined;
  
  // Simple extraction logic - you should improve this based on your actual data
  const statePatterns = [
    { pattern: /\bcalifornia\b/i, value: "California" },
    { pattern: /\bnew york\b/i, value: "New York" },
    { pattern: /\btexas\b/i, value: "Texas" },
    { pattern: /\bflorida\b/i, value: "Florida" },
    { pattern: /\bontario\b/i, value: "Ontario" },
    { pattern: /\blondon\b/i, value: "London" },
  ];
  
  const countryPatterns = [
    { pattern: /\bus(a)?\b/i, value: "USA" },
    { pattern: /\bunited states\b/i, value: "USA" },
    { pattern: /\bcanada\b/i, value: "Canada" },
    { pattern: /\buk\b/i, value: "UK" },
    { pattern: /\baustralia\b/i, value: "Australia" },
    { pattern: /\bindia\b/i, value: "India" },
    { pattern: /\bgermany\b/i, value: "Germany" },
  ];
  
  for (const statePattern of statePatterns) {
    if (statePattern.pattern.test(contentLower)) {
      state = statePattern.value;
      break;
    }
  }
  
  for (const countryPattern of countryPatterns) {
    if (countryPattern.pattern.test(contentLower)) {
      country = countryPattern.value;
      break;
    }
  }
  
  return { state, country };
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
      return "Date unavailable";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.warn("Invalid date:", dateString, error);
    return "Date unavailable";
  }
};

// Extract excerpt from content
const extractExcerpt = (content: string, maxLength: number = 150): string => {
  if (!content) return "No excerpt available";

  try {
    const plainText = content.replace(/<[^>]*>/g, "");
    const cleanText = plainText.replace(/\s+/g, " ").trim();

    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + "...";
  } catch (error) {
    console.warn("Error extracting excerpt:", error);
    return "No excerpt available";
  }
};

// Calculate read time
const calculateReadTime = (text: string): string => {
  if (!text) return "1 min read";

  const wordCount = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
};

// Items per page for pagination
const ITEMS_PER_PAGE = 12;

// Search Suggestions Component
interface SearchSuggestionProps {
  suggestions: Array<{
    id: string;
    title: string;
    category: string;
    source: string;
    date: string;
    slug: string;
    relevance: number;
  }>;
  onSelect: (title: string) => void;
  searchQuery: string;
  isVisible: boolean;
  onClose: () => void;
}

const SearchSuggestions = ({ 
  suggestions, 
  onSelect, 
  searchQuery, 
  isVisible,
  onClose
}: SearchSuggestionProps) => {
  if (!isVisible || suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-xl z-50 max-h-[400px] overflow-y-auto">
      <div className="p-2">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="text-xs font-semibold text-muted-foreground">
            Suggestions ({suggestions.length})
          </div>
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
        </div>
        
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion.title)}
            className="w-full text-left p-3 hover:bg-secondary/50 rounded-lg transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Search className="h-4 w-4 text-muted-foreground mt-0.5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-semibold uppercase">
                    {suggestion.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate">
                    {suggestion.source}
                  </span>
                </div>
                
                <h4 className="font-medium text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                  {/* Highlight matching text */}
                  {suggestion.title.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, index) => 
                    part.toLowerCase() === searchQuery.toLowerCase() ? (
                      <span key={index} className="text-primary font-semibold bg-primary/10 px-0.5 rounded">
                        {part}
                      </span>
                    ) : (
                      <span key={index}>{part}</span>
                    )
                  )}
                </h4>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{suggestion.date}</span>
                </div>
              </div>
              
              <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors flex-shrink-0" />
            </div>
          </button>
        ))}
        
        {/* Show all results option */}
        <div className="border-t border-border mt-2 pt-2">
          <button
            onClick={() => onSelect(searchQuery)}
            className="w-full text-left p-3 hover:bg-secondary/50 rounded-lg transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm text-foreground">
                    View all results for {searchQuery}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {suggestions.length} articles found
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// Iframe Modal Component
const ExternalLinkModal = ({ 
  isOpen, 
  onClose, 
  url,
  title 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  url: string;
  title: string;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="truncate">{title}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {url ? (
            <iframe
              src={url}
              title={title}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No external link available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All News");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [processedNews, setProcessedNews] = useState<ProcessedNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<
    Array<{
      id: string;
      title: string;
      category: string;
      source: string;
      date: string;
      slug: string;
      relevance: number;
    }>
  >([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExternalLink, setSelectedExternalLink] = useState<{ url: string; title: string } | null>(null);
  
  // Extract unique states and countries from processed news
  const uniqueStates = useMemo(() => {
    const states = processedNews
      .map(news => news.state)
      .filter((state): state is string => !!state)
      .filter((state, index, self) => self.indexOf(state) === index)
      .sort();
    return ["All States", ...states];
  }, [processedNews]);

  const uniqueCountries = useMemo(() => {
    const countries = processedNews
      .map(news => news.country)
      .filter((country): country is string => !!country)
      .filter((country, index, self) => self.indexOf(country) === index)
      .sort();
    return ["All Countries", ...countries];
  }, [processedNews]);

  // Process news data on component mount
  useEffect(() => {
    try {
      setIsLoading(true);

      const processed = newsData.map((item: NewsItem) => {
        const category = getCategoryFromContent(item.post_content);
        const excerpt =
          item.post_excerpt && item.post_excerpt.trim() !== ""
            ? item.post_excerpt
            : extractExcerpt(item.post_content);

        const title = item.post_title
          ? item.post_title.replace(/&amp;/g, "&")
          : "Untitled";
        const rawDate = new Date(item.post_date);
        const date = formatDate(item.post_date);
        const readTime = calculateReadTime(excerpt);
        const source = getSourceFromUrl(item.external_url);
        const image =
          item.featured_image_url && item.featured_image_url.trim() !== ""
            ? item.featured_image_url
            : "/placeholder-news.jpg";
        
        const location = getLocationData(item.ID, item.post_content);

        return {
          id: item.ID || Math.random().toString(),
          category,
          title,
          excerpt,
          date,
          rawDate,
          readTime,
          source,
          image,
          externalUrl:
            item.external_url && item.external_url.trim() !== ""
              ? item.external_url
              : null,
          fullContent: item.post_content || "",
          modifiedDate: item.post_modified
            ? formatDate(item.post_modified)
            : undefined,
          modifiedRawDate: item.post_modified ? new Date(item.post_modified) : undefined,
          slug: item.post_name || `news-${item.ID}`,
          state: location.state,
          country: location.country,
        };
      });

      // Sort by date descending
      processed.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
      
      setProcessedNews(processed);
    } catch (error) {
      console.error("Error processing news data:", error);
      setProcessedNews([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get featured news (most recent)
  const featuredNews = processedNews.length > 0 ? processedNews[0] : null;

  // Filter news articles based on all filter criteria - ONLY FOR ALL NEWS SECTION
  const filteredNews = useMemo(() => {
    let filtered = [...processedNews];

    // Filter by category
    if (selectedCategory !== "All News") {
      filtered = filtered.filter(
        (article) => article.category === selectedCategory
      );
    }

    // Filter by date range
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0); // Start of the day
      filtered = filtered.filter(article => article.rawDate >= fromDate);
    }
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // End of the day
      filtered = filtered.filter(article => article.rawDate <= toDate);
    }

    // Filter by state
    if (selectedState && selectedState !== "All States") {
      filtered = filtered.filter(article => article.state === selectedState);
    }

    // Filter by country
    if (selectedCountry && selectedCountry !== "All Countries") {
      filtered = filtered.filter(article => article.country === selectedCountry);
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.fullContent.toLowerCase().includes(query) ||
          article.category.toLowerCase().includes(query) ||
          article.source.toLowerCase().includes(query) ||
          (article.state && article.state.toLowerCase().includes(query)) ||
          (article.country && article.country.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [processedNews, selectedCategory, dateRange, selectedState, selectedCountry, searchQuery]);



  // Pagination calculations for All News section
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNews = filteredNews.slice(startIndex, endIndex);

  // Get latest headlines (most recent 4 articles, always shows most recent regardless of filters)
  const latestHeadlines = useMemo(() => {
    return processedNews.slice(0, 4);
  }, [processedNews]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, dateRange, selectedState, selectedCountry, searchQuery]);

  // Handle clicks outside search suggestions and filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate search suggestions based on query
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const query = searchQuery.toLowerCase().trim();
      
      const suggestions = processedNews
        .map((article) => {
          let relevance = 0;
          
          // Calculate relevance score
          if (article.title.toLowerCase().includes(query)) relevance += 10;
          if (article.excerpt.toLowerCase().includes(query)) relevance += 5;
          if (article.fullContent.toLowerCase().includes(query)) relevance += 3;
          if (article.category.toLowerCase().includes(query)) relevance += 8;
          if (article.source.toLowerCase().includes(query)) relevance += 2;
          if (article.state && article.state.toLowerCase().includes(query)) relevance += 6;
          if (article.country && article.country.toLowerCase().includes(query)) relevance += 6;
          
          // Bonus for exact match at start of title
          if (article.title.toLowerCase().startsWith(query)) relevance += 5;
          
          return {
            id: article.id,
            title: article.title,
            category: article.category,
            source: article.source,
            date: article.date,
            slug: article.slug,
            relevance
          };
        })
        .filter(item => item.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 8);
      
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, processedNews]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle external link click for featured news
  const handleFeaturedExternalLink = (
    e: React.MouseEvent,
    url: string | null,
    title: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (url && url.trim() !== "") {
      try {
        const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`;
        setSelectedExternalLink({ url: urlWithProtocol, title });
        setModalOpen(true);
      } catch (error) {
        console.error("Error opening URL:", error);
        alert(`Could not open: ${title}`);
      }
    } else {
      // Redirect to internal page for featured news
      window.location.href = `/news/${featuredNews?.slug}`;
    }
  };

  // Handle external link click for regular news items
  const handleExternalLink = (
    e: React.MouseEvent,
    url: string | null,
    title: string,
    slug: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (url && url.trim() !== "") {
      try {
        const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`;
        setSelectedExternalLink({ url: urlWithProtocol, title });
        setModalOpen(true);
      } catch (error) {
        console.error("Error opening URL:", error);
        // Fallback to internal page
        window.location.href = `/news/${slug}`;
      }
    } else {
      // Redirect to internal page
      window.location.href = `/news/${slug}`;
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  // Handle search suggestion selection
  const handleSuggestionSelect = (title: string) => {
    setSearchQuery(title);
    setShowSuggestions(false);
    
    const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategory("All News");
    setDateRange({ from: "", to: "" });
    setSelectedState("");
    setSelectedCountry("");
    setSearchQuery("");
    setSearchSuggestions([]);
    setShowSuggestions(false);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
  };

  // Check if any filter is active
  const isAnyFilterActive = () => {
    return (
      selectedCategory !== "All News" ||
      dateRange.from !== "" ||
      dateRange.to !== "" ||
      (selectedState !== "" && selectedState !== "All States") ||
      (selectedCountry !== "" && selectedCountry !== "All Countries") ||
      searchQuery !== ""
    );
  };

  if (isLoading) {
    return (
      <main className="bg-background min-h-screen">
        <PageBanner
          title="Women in Business News"
          description="Stay informed with the latest news, insights, and success stories from women entrepreneurs worldwide"
          image="/finalNewsbanner.png"
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
      {/* External Link Modal */}
      <ExternalLinkModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedExternalLink(null);
        }}
        url={selectedExternalLink?.url || ""}
        title={selectedExternalLink?.title || ""}
      />

      <section className={`relative h-[470px] overflow-hidden pt-24`}>
        {/* Background Image */}
        <div className="absolute inset-0" style={{ top: "96px" }}>
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(/finalNewsbanner.png)`,
              backgroundPosition: "center center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>

        {/* Content - Left aligned */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl px-4 sm:px-6 lg:px-8">
              {/* Title */}
              <h1 className="text-white leading-tight">
                <span className="block text-3xl sm:text-4xl lg:text-6xl font-bold sm:font-bold ">
                  Women in<br/> Business News
                </span>
              </h1>

              <p className="mt-4 sm:mt-6 text-md sm:text-base md:text-xl text-white/90 leading-relaxed max-w-3xl">
                Stay informed with the latest news, insights, and success
                stories <br /> from women entrepreneurs worldwide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED NEWS + SIDEBAR ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 ">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* FEATURED - 2 COLUMNS */}
          {/* Featured news section - Always shows most recent news */}
          {featuredNews && (
            <div className="lg:col-span-2">
              <div
                onClick={(e) => handleFeaturedExternalLink(e, featuredNews.externalUrl, featuredNews.title)}
                className="block group bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-primary/10 cursor-pointer"
              >
                {/* FEATURED BADGE */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                  <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-gradient-to-r from-accent to-accent/80 text-white text-xs font-bold uppercase shadow-lg">
                    Featured Story
                  </span>
                </div>

                {/* IMAGE CONTAINER */}
                <div className="relative h-48 sm:h-64 lg:h-[340px]">
                  {featuredNews.image !== "/placeholder-news.jpg" ? (
                    <Image
                      src={featuredNews.image}
                      alt={featuredNews.title}
                      fill
                      className="object-cover "
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                      <div className="text-white/40 text-6xl font-display">
                        {featuredNews.title.charAt(0)}
                      </div>
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-4 sm:px-6 sm:py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2 mb-2">
                    <span className="inline-block px-2 sm:px-3  rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase w-fit">
                      {featuredNews.category}
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {featuredNews.source}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {featuredNews.title}
                  </h2>


                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4  border-t border-border mt-auto">
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        {featuredNews.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        {featuredNews.readTime}
                      </div>
                      {featuredNews.state && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{featuredNews.state}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      className="bg-primary hover:bg-primary/90 group text-sm sm:text-base w-full sm:w-auto"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFeaturedExternalLink(e, featuredNews.externalUrl, featuredNews.title);
                      }}
                    >
                      {featuredNews.externalUrl
                        ? "Read Full Story"
                        : "View Details"}
                      <ExternalLink className="ml-2 h-3 w-3  sm:w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SIDEBAR - LATEST HEADLINES */}
          <div
            className={`space-y-4 sm:space-y-6 ${!featuredNews ? "lg:col-span-3" : ""}`}
          >
            <div className="bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 shadow-lg border border-border lg:sticky lg:top-24">
              {/* HEADER */}
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                <h3 className="text-lg sm:text-xl font-display font-bold text-foreground">
                  Latest Headlines
                </h3>
              </div>

              {/* LATEST HEADLINES VIEW WITH IMAGES */}
              <div className="max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-3 sm:space-y-4">
                  {latestHeadlines.map((news, i) => (
                    <div
                      key={i}
                      onClick={(e) => handleExternalLink(e, news.externalUrl, news.title, news.slug)}
                      className="block cursor-pointer pb-3 sm:pb-4 border-b border-border last:border-0 last:pb-0 hover:bg-secondary/30 rounded-lg px-2 -mx-2 transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        {/* IMAGE */}
                        <div className="flex-shrink-0">
                          <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-lg overflow-hidden bg-gradient-to-br from-muted to-secondary">
                            {news.image !== "/placeholder-news.jpg" ? (
                              <Image
                                src={news.image}
                                alt={news.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 48px, 56px"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                                <div className="text-primary/40 text-lg font-display">
                                  {news.title.charAt(0)}
                                </div>
                              </div>
                            )}
                            {/* NUMBER OVERLAY */}
                            <div className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-gradient-to-br from-primary to-accent text-white text-xs font-bold">
                              {i + 1}
                            </div>
                          </div>
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                            <span className="inline-block px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-semibold uppercase tracking-wide truncate max-w-[80px]">
                              {news.category}
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate">
                              {news.source}
                            </span>
                          </div>
                          <h4 className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors mb-1.5 leading-snug line-clamp-2">
                            {news.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{news.date}</span>
                            </div>
                            {news.state && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate max-w-[60px]">{news.state}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ARROW INDICATOR */}
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary/60 transition-colors flex-shrink-0 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* QUICK ACTION BUTTON */}
              <div className="mt-4 pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  className="w-full text-accent hover:bg-accent/10 hover:text-accent text-sm flex items-center justify-center gap-2 group"
                  onClick={() => {
                    clearAllFilters();
                    window.scrollTo({
                      top: document.getElementById('all-news-section')?.offsetTop || 0,
                      behavior: 'smooth'
                    });
                  }}
                >
                  View All News
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ALL NEWS GRID ================= */}
      <section id="all-news-section" className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-screen-xl mx-auto">
          {/* HEADER WITH SEARCH AND FILTER */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-1 sm:mb-2">
                {selectedCategory === "All News"
                  ? "All News Articles"
                  : `${selectedCategory} Articles`}
                {searchQuery && (
                  <span className="text-lg sm:text-xl text-primary">
                    {" "}
                    - Search results for {searchQuery}
                  </span>
                )}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {filteredNews.length}{" "}
                {filteredNews.length === 1 ? "article" : "articles"} found
                {selectedCategory !== "All News" && ` in ${selectedCategory}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64" ref={searchRef}>
                <form onSubmit={handleSearchSubmit}>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black z-10" />
                  <Input
                    type="search"
                    placeholder="Search news..."
                    className="pl-10 pr-10 w-full bg-white"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => {
                      if (searchQuery.length >= 2 && searchSuggestions.length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground hover:text-foreground z-10"
                    >
                      <X className="h-4 w-4 text-black" />
                    </button>
                  )}
                </form>
                
                {/* SEARCH SUGGESTIONS DROPDOWN */}
                <SearchSuggestions
                  suggestions={searchSuggestions}
                  onSelect={handleSuggestionSelect}
                  searchQuery={searchQuery}
                  isVisible={showSuggestions}
                  onClose={() => setShowSuggestions(false)}
                />
              </div>
              
              {/* FILTER DROPDOWN */}
              <div className="relative w-full sm:w-auto" ref={searchRef}>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto flex items-center gap-2"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="h-4 w-4" />
                  
                  {isAnyFilterActive() && (
                    <span className="ml-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-white text-xs">
                      {isAnyFilterActive() ? "!" : ""}
                    </span>
                  )}
                </Button>

                {/* FILTER DROPDOWN MENU */}
                {isFilterOpen && (
                  <div className="absolute top-full right-0 mt-1 w-80 sm:w-96 bg-white border border-border rounded-lg shadow-xl z-50 max-h-[80vh] overflow-y-auto">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-foreground">
                          Filter Articles
                        </h4>
                        {isAnyFilterActive() && (
                          <button
                            onClick={clearAllFilters}
                            className="text-sm text-primary hover:text-primary/80"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                      
                      {/* CATEGORY FILTER - DROPDOWN */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          Category
                        </h5>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm mb-3"
                        >
                          {newsCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      {/* DATE RANGE FILTER */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date Range
                        </h5>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-muted-foreground block mb-1">From</label>
                            <Input
                              type="date"
                              value={dateRange.from}
                              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground block mb-1">To</label>
                            <Input
                              type="date"
                              value={dateRange.to}
                              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                              className="w-full"
                            />
                          </div>
                        </div>
                        {(dateRange.from || dateRange.to) && (
                          <button
                            onClick={() => setDateRange({ from: "", to: "" })}
                            className="text-xs text-primary hover:text-primary/80 mt-2"
                          >
                            Clear date range
                          </button>
                        )}
                      </div>

                      {/* LOCATION FILTERS */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {/* STATE FILTER */}
                        <div>
                          <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            State/Region
                          </h5>
                          <select
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                          >
                            {uniqueStates.map(state => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </select>
                        </div>

                        {/* COUNTRY FILTER */}
                        <div>
                          <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Country
                          </h5>
                          <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                          >
                            {uniqueCountries.map(country => (
                              <option key={country} value={country}>{country}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* ACTIVE FILTERS SUMMARY */}
                      {isAnyFilterActive() && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <h5 className="text-sm font-medium text-foreground mb-2">
                            Active Filters
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {selectedCategory !== "All News" && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                                {selectedCategory}
                                <button
                                  onClick={() => setSelectedCategory("All News")}
                                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            )}
                            {dateRange.from && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                                From: {new Date(dateRange.from).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                <button
                                  onClick={() => setDateRange({ ...dateRange, from: "" })}
                                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            )}
                            {dateRange.to && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                                To: {new Date(dateRange.to).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                <button
                                  onClick={() => setDateRange({ ...dateRange, to: "" })}
                                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            )}
                            {selectedState && selectedState !== "All States" && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                                {selectedState}
                                <button
                                  onClick={() => setSelectedState("")}
                                  className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            )}
                            {selectedCountry && selectedCountry !== "All Countries" && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs">
                                {selectedCountry}
                                <button
                                  onClick={() => setSelectedCountry("")}
                                  className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            )}
                            {searchQuery && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs">
                                Search: {searchQuery}
                                <button
                                  onClick={() => setSearchQuery("")}
                                  className="ml-1 hover:bg-amber-200 rounded-full p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            )}
                          </div>
                        </div>
                      )}

           
                    </div>
                  </div>
                )}
              </div>

              {isAnyFilterActive() && (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-2 w-full sm:w-auto"
                  onClick={clearAllFilters}
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {filteredNews.length === 0 ? (
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
                      selectedCategory !== "All News"
                        ? ` in the "${selectedCategory}" category`
                        : ""
                    }`
                  : `There are no news articles in the "${selectedCategory}" category yet.`}
              </p>
              <Button
                onClick={clearAllFilters}
                className="bg-gradient-to-r from-primary to-accent text-white font-semibold"
              >
                View All News
              </Button>
            </div>
          ) : (
            <>
         

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {currentNews.map((news) => {
                  // Skip featured news if it's already shown at the top
               
                  
                  return (
                    <div
                      key={news.id}
                      onClick={(e) => handleExternalLink(e, news.externalUrl, news.title, news.slug)}
                      className="group bg-card rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-border flex flex-col h-full cursor-pointer"
                    >
                      {/* IMAGE CONTAINER */}
                      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-muted to-secondary flex-shrink-0">
                        {news.image !== "/placeholder-news.jpg" ? (
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
                      </div>

                      {/* CONTENT */}
                      <div className="p-4 sm:p-6 flex flex-col flex-grow">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase">
                            {news.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {news.source}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base lg:text-lg font-display font-bold text-foreground mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {news.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-5 line-clamp-2 leading-relaxed flex-grow">
                          {news.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border mt-auto">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              <span>{news.date}</span>
                            </div>
                            {(news.state || news.country) && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span>{news.state || news.country}</span>
                              </div>
                            )}
                          </div>
                          <div className="inline-flex items-center gap-1 px-2 py-1 -mx-2 -my-1 rounded-md text-primary group-hover:text-accent group-hover:bg-primary/5 transition-colors">
                            Read
                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 sm:mt-12 pt-8 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-
                    {Math.min(endIndex, filteredNews.length)} of{" "}
                    {filteredNews.length} articles
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
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
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
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              className="w-10 h-10 p-0"
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        },
                      )}

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

      <Cta />
    </main>
  );
}