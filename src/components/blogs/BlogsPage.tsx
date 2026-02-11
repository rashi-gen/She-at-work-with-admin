"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { blogsData } from "@/data/Blogs";
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  ExternalLink,
  Filter,
  Globe,
  Loader2,
  MapPin,
  Search,
  X,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Cta from "../common/Cta";
import { PageBanner } from "../PageBanner";
import { 
  MultiSelectDropdown,
  getCategoryIcon 
} from "../common/MultiSelectDropdown";

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

// Extended interface for processed blogs
// Extended interface for processed blogs
interface ProcessedBlogItem {
  slug: string;
  id: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  rawDate: Date;
  readTime: string;
  readingTimeCategory: string; // New: Categorizes as "Quick Reads" or "Deep Dives"
  proficiencyLevel: string; // New: Categorizes as "Beginner" or "Advanced"
  author: string;
  image: string | null;
  fullContent: string;
  modifiedDate?: string;
  modifiedRawDate?: Date;
  state?: string;
  country?: string;
}

// Extract categories from content
const getCategoryFromContent = (content: string): string => {
  const contentLower = content.toLowerCase();
  if (contentLower.includes("digital") || contentLower.includes("marketing")) return "Digital Marketing";
  if (contentLower.includes("leadership") || contentLower.includes("mindset")) return "Leadership & Mindset";
  if (contentLower.includes("legal") || contentLower.includes("compliance")) return "Legal & Compliance";
  if (contentLower.includes("finance") || contentLower.includes("financial") || contentLower.includes("management")) return "Financial Management";
  if (contentLower.includes("e-commerce") || contentLower.includes("ecommerce")) return "E-commerce";
  if (contentLower.includes("edtech") || contentLower.includes("education")) return "EdTech";
  if (contentLower.includes("health") || contentLower.includes("wellness")) return "Health & Wellness";
  if (contentLower.includes("growth") || contentLower.includes("scale")) return "Growth & Scaling";
  if (contentLower.includes("innovation") || contentLower.includes("tech")) return "Technology & Innovation";
  if (contentLower.includes("success") || contentLower.includes("story")) return "Success Stories";
  if (contentLower.includes("strategy") || contentLower.includes("planning")) return "Business Strategy";
  if (contentLower.includes("brand") || contentLower.includes("social")) return "Brand Building";
  return "General";
};

// Calculate reading time category
const getReadingTimeCategory = (text: string): string => {
  if (!text) return "Quick Reads";
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return minutes < 5 ? "Quick Reads (<5 mins)" : "Deep Dives (5+ mins)";
};

// Determine proficiency level
const getProficiencyLevel = (content: string): string => {
  const contentLower = content.toLowerCase();
  const beginnerKeywords = ["beginner", "starting", "basic", "fundamental", "intro", "guide"];
  const advancedKeywords = ["advanced", "scaling", "expert", "master", "optimize", "scale"];
  
  const beginnerCount = beginnerKeywords.filter(keyword => contentLower.includes(keyword)).length;
  const advancedCount = advancedKeywords.filter(keyword => contentLower.includes(keyword)).length;
  
  return advancedCount > beginnerCount ? "Advanced (Scaling Up)" : "Beginner (Starting Up)";
};

// Helper function to extract author from content
const extractAuthor = (content: string): string => {
  const authorMatch = content.match(/by\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i) || 
                     content.match(/Written by\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i) ||
                     content.match(/Author:\s*([A-Z][a-z]+\s+[A-Z][a-z]+)/i);
  return authorMatch ? authorMatch[1] : "She at Work Team";
};

// Mock location data
const mockLocationData: Record<string, { state?: string; country?: string }> = {
  // Add location data for your blogs here
};

// Get location from mock data or extract from content as fallback
const getLocationData = (id: string, content: string): { state?: string; country?: string } => {
  if (mockLocationData[id]) {
    return mockLocationData[id];
  }
  
  const contentLower = content.toLowerCase();
  let state: string | undefined;
  let country: string | undefined;
  
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

// Blog categories based on your requirements
const blogCategories = [
  "All Blogs",
  "Digital Marketing",
  "Leadership & Mindset",
  "Legal & Compliance",
  "Financial Management",
  "E-commerce",
  "EdTech",
  "Health & Wellness",
  "Growth & Scaling",
  "Technology & Innovation",
  "Success Stories",
  "Business Strategy",
  "Brand Building",
  "General",
];

// Reading time categories
// const readingTimeCategories = [
//   "All Reading Times",
//   "Quick Reads (<5 mins)",
//   "Deep Dives (5+ mins)"
// ];

// // Proficiency levels
// const proficiencyLevels = [
//   "All Levels",
//   "Beginner (Starting Up)",
//   "Advanced (Scaling Up)"
// ];

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
    const plainText = content.replace(/<[^>]*>/g, '');
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
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
};

// Items per page for pagination
const ITEMS_PER_PAGE = 12;

// Predefined date ranges
const predefinedDateRanges = [
  { value: "24h", label: "24 Hours" },
  { value: "week", label: "Past Week" },
  { value: "month", label: "Past Month" },
  { value: "3months", label: "Past 3 Months" },
  { value: "custom", label: "Custom Range" },
];

// Search Suggestions Component
interface SearchSuggestionProps {
  suggestions: Array<{
    id: string;
    title: string;
    category: string;
    author: string;
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
                  <span className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {suggestion.author}
                  </span>
                </div>
                
                <h4 className="font-medium text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
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

export default function BlogsPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All Blogs"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [processedBlogs, setProcessedBlogs] = useState<ProcessedBlogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<
    Array<{
      id: string;
      title: string;
      category: string;
      author: string;
      date: string;
      slug: string;
      relevance: number;
    }>
  >([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });
  const [selectedDateRange, setSelectedDateRange] = useState<string>("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedReadingTimes, setSelectedReadingTimes] = useState<string[]>(["All Reading Times"]);
  const [selectedProficiencyLevels, setSelectedProficiencyLevels] = useState<string[]>(["All Levels"]);
  const [userLocation, setUserLocation] = useState<{
    country?: string;
    state?: string;
    city?: string;
    detected: boolean;
  }>({ detected: false });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Function to detect user location (same as news page)
  const detectUserLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      setUserLocation({
        country: data.country_name,
        state: data.region,
        city: data.city,
        detected: true,
      });

      // Auto-set country filter if location detected
      if (data.country_name && !selectedCountries.includes(data.country_name)) {
        setSelectedCountries([data.country_name]);
      }

      return data;
    } catch (error) {
      console.error("Error detecting location:", error);
      setUserLocation({ detected: false });
      return null;
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Process blog data on component mount
  useEffect(() => {
    const processBlogData = () => {
      try {
        setIsLoading(true);

        const processed = blogsData.map((item: BlogItem) => {
          const category = getCategoryFromContent(item.post_content);
          const excerpt = item.post_excerpt && item.post_excerpt.trim() !== '' 
            ? item.post_excerpt 
            : extractExcerpt(item.post_content);
          
          const title = item.post_title ? item.post_title.replace(/&amp;/g, '&') : 'Untitled';
          const rawDate = new Date(item.post_date);
          const date = formatDate(item.post_date);
          const readTime = calculateReadTime(item.post_content);
          const readingTimeCategory = getReadingTimeCategory(item.post_content);
          const proficiencyLevel = getProficiencyLevel(item.post_content);
          const author = extractAuthor(item.post_content);
          const image = item.featured_image_url && item.featured_image_url.trim() !== '' 
            ? item.featured_image_url 
            : null;
          const slug = item.post_name || `blog-${item.ID}`;
          
          const location = getLocationData(item.ID, item.post_content);

          return {
            id: item.ID || Math.random().toString(),
            category,
            title,
            excerpt,
            date,
            rawDate,
            readTime,
            readingTimeCategory,
            proficiencyLevel,
            author,
            image,
            fullContent: item.post_content || '',
            modifiedDate: item.post_modified ? formatDate(item.post_modified) : undefined,
            modifiedRawDate: item.post_modified ? new Date(item.post_modified) : undefined,
            slug,
            state: location.state,
            country: location.country,
          };
        });

        // Sort by date descending
        processed.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
        
        setProcessedBlogs(processed);
      } catch (error) {
        console.error('Error processing blog data:', error);
        setProcessedBlogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    processBlogData();
    
    // Detect user location on mount
    detectUserLocation();
  }, []);

  // Apply date range filter
  const applyDateRangeFilter = (range: string, customFrom?: string, customTo?: string) => {
    const now = new Date();
    const from = new Date();

    switch (range) {
      case "24h":
        from.setDate(now.getDate() - 1);
        setDateRange({
          from: from.toISOString().split("T")[0],
          to: now.toISOString().split("T")[0],
        });
        break;
      case "week":
        from.setDate(now.getDate() - 7);
        setDateRange({
          from: from.toISOString().split("T")[0],
          to: now.toISOString().split("T")[0],
        });
        break;
      case "month":
        from.setMonth(now.getMonth() - 1);
        setDateRange({
          from: from.toISOString().split("T")[0],
          to: now.toISOString().split("T")[0],
        });
        break;
      case "3months":
        from.setMonth(now.getMonth() - 3);
        setDateRange({
          from: from.toISOString().split("T")[0],
          to: now.toISOString().split("T")[0],
        });
        break;
      case "custom":
        if (customFrom && customTo) {
          setDateRange({
            from: customFrom,
            to: customTo,
          });
        }
        break;
      default:
        setDateRange({ from: "", to: "" });
    }
    setSelectedDateRange(range);
  };

  // Filter blogs based on all filter criteria
  const filteredBlogs = useMemo(() => {
    let filtered = [...processedBlogs];

    // Filter by categories
    if (selectedCategories.length > 0 && !selectedCategories.includes("All Blogs")) {
      filtered = filtered.filter((article) =>
        selectedCategories.includes(article.category),
      );
    }

    // Filter by date range
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(article => article.rawDate >= fromDate);
    }
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(article => article.rawDate <= toDate);
    }

    // Filter by states
    if (selectedStates.length > 0) {
      filtered = filtered.filter(
        (article) => article.state && selectedStates.includes(article.state),
      );
    }

    // Filter by countries
    if (selectedCountries.length > 0) {
      filtered = filtered.filter(
        (article) =>
          article.country && selectedCountries.includes(article.country),
      );
    }

    // Filter by reading time
    if (selectedReadingTimes.length > 0 && !selectedReadingTimes.includes("All Reading Times")) {
      filtered = filtered.filter((article) =>
        selectedReadingTimes.includes(article.readingTimeCategory),
      );
    }

    // Filter by proficiency level
    if (selectedProficiencyLevels.length > 0 && !selectedProficiencyLevels.includes("All Levels")) {
      filtered = filtered.filter((article) =>
        selectedProficiencyLevels.includes(article.proficiencyLevel),
      );
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
          article.author.toLowerCase().includes(query) ||
          (article.state && article.state.toLowerCase().includes(query)) ||
          (article.country && article.country.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [
    processedBlogs, 
    selectedCategories, 
    dateRange, 
    selectedStates, 
    selectedCountries, 
    selectedReadingTimes, 
    selectedProficiencyLevels, 
    searchQuery
  ]);

  // Get featured blog (most recent)
  const featuredBlog = processedBlogs.length > 0 ? processedBlogs[0] : null;

  // Pagination calculations for All Blogs section
  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

  // Get latest headlines (most recent 4 articles)
  const latestHeadlines = useMemo(() => {
    return processedBlogs.slice(0, 4);
  }, [processedBlogs]);

  // Extract unique states, countries, reading times, and proficiency levels
  // const uniqueStates = useMemo(() => {
  //   const states = processedBlogs
  //     .map(blog => blog.state)
  //     .filter((state): state is string => !!state)
  //     .filter((state, index, self) => self.indexOf(state) === index)
  //     .sort();
  //   return states;
  // }, [processedBlogs]);

  const uniqueCountries = useMemo(() => {
    const countries = processedBlogs
      .map(blog => blog.country)
      .filter((country): country is string => !!country)
      .filter((country, index, self) => self.indexOf(country) === index)
      .sort();
    return countries;
  }, [processedBlogs]);

  const uniqueReadingTimes = useMemo(() => {
    const times = processedBlogs
      .map(blog => blog.readingTimeCategory)
      .filter((time): time is string => !!time)
      .filter((time, index, self) => self.indexOf(time) === index)
      .sort();
    return times;
  }, [processedBlogs]);

  const uniqueProficiencyLevels = useMemo(() => {
    const levels = processedBlogs
      .map(blog => blog.proficiencyLevel)
      .filter((level): level is string => !!level)
      .filter((level, index, self) => self.indexOf(level) === index)
      .sort();
    return levels;
  }, [processedBlogs]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategories, 
    dateRange, 
    selectedStates, 
    selectedCountries, 
    selectedReadingTimes, 
    selectedProficiencyLevels, 
    searchQuery
  ]);

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
      
      const suggestions = processedBlogs
        .map((blog) => {
          let relevance = 0;
          
          if (blog.title.toLowerCase().includes(query)) relevance += 10;
          if (blog.excerpt.toLowerCase().includes(query)) relevance += 5;
          if (blog.fullContent.toLowerCase().includes(query)) relevance += 3;
          if (blog.category.toLowerCase().includes(query)) relevance += 8;
          if (blog.author.toLowerCase().includes(query)) relevance += 2;
          if (blog.state && blog.state.toLowerCase().includes(query)) relevance += 6;
          if (blog.country && blog.country.toLowerCase().includes(query)) relevance += 6;
          
          if (blog.title.toLowerCase().startsWith(query)) relevance += 5;
          
          return {
            id: blog.id,
            title: blog.title,
            category: blog.category,
            author: blog.author,
            date: blog.date,
            slug: blog.slug,
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
  }, [searchQuery, processedBlogs]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setSelectedCategories(["All Blogs"]);
    setDateRange({ from: "", to: "" });
    setSelectedDateRange("");
    setSelectedStates([]);
    setSelectedCountries([]);
    setSelectedReadingTimes(["All Reading Times"]);
    setSelectedProficiencyLevels(["All Levels"]);
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
      (selectedCategories.length > 0 && !(selectedCategories.length === 1 && selectedCategories[0] === "All Blogs")) ||
      dateRange.from !== "" ||
      dateRange.to !== "" ||
      selectedStates.length > 0 ||
      selectedCountries.length > 0 ||
      (selectedReadingTimes.length > 0 && !(selectedReadingTimes.length === 1 && selectedReadingTimes[0] === "All Reading Times")) ||
      (selectedProficiencyLevels.length > 0 && !(selectedProficiencyLevels.length === 1 && selectedProficiencyLevels[0] === "All Levels")) ||
      searchQuery !== ""
    );
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
        description="Explore real insights, bold conversations, and practical guidance for women entrepreneurs.
From funding and strategy to inspiring journeys, discover ideas that help you start, scale, and grow."
        image="/finalBlogsbanner.png"
      />

      {/* ================= FEATURED BLOG + SIDEBAR ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-secondary/30">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* LEFT - FEATURED BLOG */}
          {featuredBlog && (
            <div className="lg:col-span-2">
              <Link 
                href={`/blogs/${featuredBlog.slug}`}
                className="block relative group bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-primary/10"
              >
                {/* FEATURED BADGE */}
                <div className="absolute top-4 right-4 sm:top-4 sm:right-4 z-10">
                  <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-white text-xs font-bold uppercase shadow-lg">
                    Featured Story
                  </span>
                </div>

                {/* IMAGE */}
                <div className="relative h-40 sm:h-64 lg:h-[340px] bg-gradient-to-br from-muted to-secondary">
                  {featuredBlog.image ? (
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
                <div className="p-4 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1 px-2 sm:px-3 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase">
                      {getCategoryIcon(featuredBlog.category)}
                      {featuredBlog.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {featuredBlog.author.split(' ')[0]}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {featuredBlog.title}
                  </h2>

                  <p className="text-sm sm:text-base text-muted-foreground mb-2 leading-relaxed line-clamp-3">
                    {featuredBlog.excerpt}
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-border mt-auto">
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        {featuredBlog.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        {featuredBlog.readTime}
                      </div>
                      {featuredBlog.state && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{featuredBlog.state}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      className="bg-primary hover:bg-primary/90 group text-sm sm:text-base w-full sm:w-auto"
                    >
                      Read Full Article
                      <ExternalLink className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* RIGHT - TRENDING NOW */}
          <div className={`space-y-4 sm:space-y-6 ${!featuredBlog ? 'lg:col-span-3' : ''}`}>
            <div className="bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 shadow-lg border border-border lg:sticky lg:top-24">
              {/* HEADER */}
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                <h3 className="text-lg sm:text-xl font-display font-bold text-foreground">
                  Trending Now
                </h3>
              </div>

              {/* TRENDING NOW VIEW WITH IMAGES */}
              <div className="max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-3 sm:space-y-4">
                  {latestHeadlines.map((blog, i) => (
                    <Link
                      key={i}
                      href={`/blogs/${blog.slug}`}
                      className="block cursor-pointer pb-3 sm:pb-4 border-b border-border last:border-0 last:pb-0 hover:bg-secondary/30 rounded-lg px-2 -mx-2 transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        {/* IMAGE */}
                        <div className="flex-shrink-0">
                          <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-lg overflow-hidden bg-gradient-to-br from-muted to-secondary">
                            {blog.image ? (
                              <Image
                                src={blog.image}
                                alt={blog.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 48px, 56px"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                                <div className="text-primary/40 text-lg font-display">
                                  {blog.title.charAt(0)}
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
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-semibold uppercase tracking-wide truncate max-w-[80px]">
                              {getCategoryIcon(blog.category)}
                              <span className="truncate">{blog.category.split(' ')[0]}</span>
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {blog.author.split(' ')[0]}
                            </span>
                          </div>
                          <h4 className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors mb-1.5 leading-snug line-clamp-2">
                            {blog.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{blog.date}</span>
                            </div>
                            {blog.state && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate max-w-[60px]">{blog.state}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ARROW INDICATOR */}
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary/60 transition-colors flex-shrink-0 mt-1" />
                      </div>
                    </Link>
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
                      top: document.getElementById('all-blogs-section')?.offsetTop || 0,
                      behavior: 'smooth'
                    });
                  }}
                >
                  View All Blogs
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ALL BLOGS GRID ================= */}
      <section id="all-blogs-section" className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-screen-xl mx-auto">
          {/* HEADER WITH SEARCH AND FILTER */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-1 sm:mb-2">
                {selectedCategories.includes("All Blogs") || selectedCategories.length === 0
                  ? "All Blog Articles"
                  : `${selectedCategories.length} ${selectedCategories.length === 1 ? "Category" : "Categories"} Selected`}
                {searchQuery && (
                  <span className="text-lg sm:text-xl text-primary">
                    {" "}
                    - Search results for {searchQuery}
                  </span>
                )}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {filteredBlogs.length}{" "}
                {filteredBlogs.length === 1 ? "article" : "articles"} found
                {selectedCategories.length > 0 && !selectedCategories.includes("All Blogs") && 
                  ` in ${selectedCategories.length} ${selectedCategories.length === 1 ? 'category' : 'categories'}`
                }
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64" ref={searchRef}>
                <form onSubmit={handleSearchSubmit}>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black z-10" />
                  <Input
                    type="search"
                    placeholder="Search blogs..."
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
                      !
                    </span>
                  )}
                </Button>

                {/* FILTER DROPDOWN MENU */}
                {isFilterOpen && (
                  <div className="absolute top-full right-0 mt-1 w-80 sm:w-96 bg-white border border-border rounded-lg shadow-xl z-50 max-h-[80vh] overflow-y-auto p-4">
                    <div className="mb-2">
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

                      {/* CATEGORY FILTER */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-foreground mb-2">
                          Category / Topic
                        </h5>
                        <MultiSelectDropdown
                          label="Categories"
                          icon={<Filter className="h-4 w-4" />}
                          options={blogCategories.filter(cat => cat !== "All Blogs")}
                          selectedValues={selectedCategories.filter(cat => cat !== "All Blogs")}
                          onChange={(values) => setSelectedCategories(values)}
                          placeholder="Select categories"
                          allOptionLabel="All Categories"
                        />
                      </div>

                      {/* READING TIME FILTER */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-foreground mb-2">
                          Reading Time
                        </h5>
                        <MultiSelectDropdown
                          label="Reading Times"
                          icon={<Clock className="h-4 w-4" />}
                          options={uniqueReadingTimes}
                          selectedValues={selectedReadingTimes.filter(time => time !== "All Reading Times")}
                          onChange={(values) => setSelectedReadingTimes(values)}
                          placeholder="Select reading times"
                          allOptionLabel="All Reading Times"
                        />
                      </div>

                      {/* PROFICIENCY LEVEL FILTER */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-foreground mb-2">
                          Proficiency Level
                        </h5>
                        <MultiSelectDropdown
                          label="Proficiency Levels"
                          icon={<User className="h-4 w-4" />}
                          options={uniqueProficiencyLevels}
                          selectedValues={selectedProficiencyLevels.filter(level => level !== "All Levels")}
                          onChange={(values) => setSelectedProficiencyLevels(values)}
                          placeholder="Select proficiency levels"
                          allOptionLabel="All Levels"
                        />
                      </div>

                      {/* DATE RANGE FILTER */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-foreground mb-2">
                          Date Range
                        </h5>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                          {predefinedDateRanges.map((range) => (
                            <button
                              key={range.value}
                              onClick={() => {
                                setSelectedDateRange(range.value);
                                if (range.value === "custom") {
                                  // Show custom date inputs
                                } else {
                                  applyDateRangeFilter(range.value);
                                }
                              }}
                              className={`px-3 py-2 text-xs rounded-lg border ${
                                selectedDateRange === range.value
                                  ? "bg-primary text-white border-primary"
                                  : "bg-secondary/50 border-border hover:bg-secondary"
                              }`}
                            >
                              {range.label}
                            </button>
                          ))}
                        </div>

                        {/* CUSTOM DATE INPUTS */}
                        {(selectedDateRange === "custom" || dateRange.from || dateRange.to) && (
                          <div className="grid grid-cols-2 gap-3 mt-3 p-3 bg-secondary/30 rounded-lg">
                            <div>
                              <label className="text-xs text-muted-foreground block mb-1">From</label>
                              <Input
                                type="date"
                                value={dateRange.from}
                                onChange={(e) => {
                                  setDateRange({ ...dateRange, from: e.target.value });
                                  setSelectedDateRange("custom");
                                }}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground block mb-1">To</label>
                              <Input
                                type="date"
                                value={dateRange.to}
                                onChange={(e) => {
                                  setDateRange({ ...dateRange, to: e.target.value });
                                  setSelectedDateRange("custom");
                                }}
                                className="w-full"
                              />
                            </div>
                          </div>
                        )}

                        {(dateRange.from || dateRange.to) && (
                          <button
                            onClick={() => {
                              setDateRange({ from: "", to: "" });
                              setSelectedDateRange("");
                            }}
                            className="text-xs text-primary hover:text-primary/80 mt-2"
                          >
                            Clear date range
                          </button>
                        )}
                      </div>

                      {/* LOCATION FILTERS */}
                      <div className="grid grid-cols-1 gap-3 mb-2">
                        {/* COUNTRY FILTER */}
                        <div>
                          <h5 className="text-sm font-medium text-foreground mb-2">
                            Country
                          </h5>
                          <MultiSelectDropdown
                            label="Countries"
                            icon={<Globe className="h-4 w-4" />}
                            options={uniqueCountries}
                            selectedValues={selectedCountries}
                            onChange={setSelectedCountries}
                            placeholder="Select countries"
                            allOptionLabel="All Countries"
                          />
                        </div>

                        {/* STATE FILTER */}
                        {/* {uniqueStates.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-foreground mb-2">
                              State/Region
                            </h5>
                            <MultiSelectDropdown
                              label="States"
                              icon={<MapPin className="h-4 w-4" />}
                              options={uniqueStates}
                              selectedValues={selectedStates}
                              onChange={setSelectedStates}
                              placeholder="Select states"
                              allOptionLabel="All States"
                            />
                          </div>
                        )} */}
                      </div>

                      {/* LOCATION DETECTION */}
                      <div className="p-3 bg-secondary/30 rounded-lg pb-0 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium text-foreground flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Your Location
                          </h5>
                          <button
                            onClick={detectUserLocation}
                            disabled={isDetectingLocation}
                            className="text-xs text-primary hover:text-primary/80"
                          >
                            {isDetectingLocation ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              "Refresh"
                            )}
                          </button>
                        </div>
                        {userLocation.detected ? (
                          <div className="text-xs text-muted-foreground">
                            Detected:{" "}
                            <span className="font-medium text-foreground">
                              {userLocation.city && `${userLocation.city}, `}
                              {userLocation.state && `${userLocation.state}, `}
                              {userLocation.country}
                            </span>
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">
                            Location not detected. Click refresh to try again.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ACTIVE FILTERS SUMMARY */}
                    {isAnyFilterActive() && (
                      <div className="pt-4 ">
                        <h5 className="text-sm font-medium text-foreground mb-2">
                          Active Filters
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedCategories.length > 0 && !selectedCategories.includes("All Blogs") && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                              <Filter className="h-3 w-3" />
                              {selectedCategories.length} category
                              {selectedCategories.length !== 1 ? "ies" : ""}
                              <button
                                onClick={() => setSelectedCategories(["All Blogs"])}
                                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          )}
                          {selectedReadingTimes.length > 0 && !selectedReadingTimes.includes("All Reading Times") && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                              <Clock className="h-3 w-3" />
                              {selectedReadingTimes.length} reading time
                              {selectedReadingTimes.length !== 1 ? "s" : ""}
                              <button
                                onClick={() => setSelectedReadingTimes(["All Reading Times"])}
                                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          )}
                          {selectedProficiencyLevels.length > 0 && !selectedProficiencyLevels.includes("All Levels") && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                              <User className="h-3 w-3" />
                              {selectedProficiencyLevels.length} proficiency level
                              {selectedProficiencyLevels.length !== 1 ? "s" : ""}
                              <button
                                onClick={() => setSelectedProficiencyLevels(["All Levels"])}
                                className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          )}
                          {dateRange.from && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                              <Calendar className="h-3 w-3" />
                              From:{" "}
                              {new Date(dateRange.from).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                              <button
                                onClick={() =>
                                  setDateRange({ ...dateRange, from: "" })
                                }
                                className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          )}
                          {dateRange.to && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                              <Calendar className="h-3 w-3" />
                              To:{" "}
                              {new Date(dateRange.to).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                              <button
                                onClick={() =>
                                  setDateRange({ ...dateRange, to: "" })
                                }
                                className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          )}
                          {selectedCountries.length > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs">
                              <Globe className="h-3 w-3" />
                              {selectedCountries.length} country
                              {selectedCountries.length !== 1 ? "ies" : ""}
                              <button
                                onClick={() => setSelectedCountries([])}
                                className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          )}
                          {selectedStates.length > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs">
                              <MapPin className="h-3 w-3" />
                              {selectedStates.length} state
                              {selectedStates.length !== 1 ? "s" : ""}
                              <button
                                onClick={() => setSelectedStates([])}
                                className="ml-1 hover:bg-amber-200 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          )}
                          {searchQuery && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs">
                              <Search className="h-3 w-3" />
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

          {filteredBlogs.length === 0 ? (
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
                      selectedCategories.length > 0 && !selectedCategories.includes("All Blogs")
                        ? ` in the selected categories`
                        : ""
                    }`
                  : `There are no blog articles with the current filters.`}
              </p>
              <Button
                onClick={clearAllFilters}
                className="bg-gradient-to-r from-primary to-accent text-white font-semibold"
              >
                View All Blogs
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {currentBlogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blogs/${blog.slug}`}
                    className="group bg-card rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-border flex flex-col h-full"
                  >
                    {/* IMAGE CONTAINER */}
                    <div className="relative h-40 sm:h-44 bg-gradient-to-br from-muted to-secondary flex-shrink-0">
                      {blog.image ? (
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          className="object-fit"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                          <div className="text-white/40 text-5xl font-display">
                            {blog.title.charAt(0)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 sm:p-6 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase">
                          {getCategoryIcon(blog.category)}
                          {blog.category.split(' & ')[0]}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {blog.author.split(' ')[0]}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base lg:text-lg font-display font-bold text-foreground mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {blog.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-5 line-clamp-2 leading-relaxed flex-grow">
                        {blog.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border mt-auto">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            <span>{blog.date}</span>
                          </div>
                          {(blog.state || blog.country) && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              <span>{blog.state || blog.country}</span>
                            </div>
                          )}
                        </div>
                        <div className="inline-flex items-center gap-1 px-2 py-1 -mx-2 -my-1 rounded-md text-primary group-hover:text-accent group-hover:bg-primary/5 transition-colors">
                          Read
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
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
                    Showing {startIndex + 1}-
                    {Math.min(endIndex, filteredBlogs.length)} of{" "}
                    {filteredBlogs.length} articles
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

      <Cta/>
    </main>
  );
}