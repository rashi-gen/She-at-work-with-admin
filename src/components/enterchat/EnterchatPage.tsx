"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { entrechatData } from "@/data/Entrechat";
import {
  ArrowRight,
  Building,
  Calendar,
  CalendarDays,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  Loader2,
  MapPin,
  Search,
  SlidersHorizontal,
  TrendingUp,
  User,
  Video,
  X
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Cta from "../common/Cta";
import {
  MultiSelectDropdown,
  getCategoryIcon
} from "../common/MultiSelectDropdown";

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

// Extended interface for processed entrechat
interface ProcessedEntreChatItem {
  slug: string;
  id: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  rawDate: Date;
  readTime: string;
  interviewee: string;
  image: string | null;
  fullContent: string;
  modifiedDate?: string;
  modifiedRawDate?: Date;
  state?: string;
  country?: string;
  industrySector: string;
  businessStage: string;
  interviewFormat: string;
  founderRegion: string;
  successFactor: string;
}

// Extract categories from content
const getCategoryFromContent = (content: string): string => {
  const contentLower = content.toLowerCase();
  if (
    contentLower.includes("design") ||
    contentLower.includes("interior") ||
    contentLower.includes("architecture")
  )
    return "Design & Architecture";
  if (
    contentLower.includes("wellness") ||
    contentLower.includes("health") ||
    contentLower.includes("mindfulness") ||
    contentLower.includes("yoga") ||
    contentLower.includes("meditation")
  )
    return "Wellness & Health";
  if (
    contentLower.includes("funding") ||
    contentLower.includes("finance") ||
    contentLower.includes("investment") ||
    contentLower.includes("capital") ||
    content.includes("$")
  )
    return "Funding & Finance";
  if (
    contentLower.includes("technology") ||
    contentLower.includes("tech") ||
    contentLower.includes("ai") ||
    contentLower.includes("digital") ||
    contentLower.includes("software")
  )
    return "Technology";
  if (
    contentLower.includes("leadership") ||
    contentLower.includes("management") ||
    contentLower.includes("ceo") ||
    contentLower.includes("director")
  )
    return "Leadership";
  if (
    contentLower.includes("marketing") ||
    contentLower.includes("brand") ||
    contentLower.includes("social media") ||
    contentLower.includes("advertising")
  )
    return "Marketing";
  if (
    contentLower.includes("product") ||
    contentLower.includes("development") ||
    contentLower.includes("innovation")
  )
    return "Product Development";
  if (
    contentLower.includes("balance") ||
    contentLower.includes("family") ||
    contentLower.includes("work-life") ||
    contentLower.includes("parent")
  )
    return "Work-Life Balance";
  if (
    contentLower.includes("legal") ||
    contentLower.includes("compliance") ||
    contentLower.includes("regulation") ||
    contentLower.includes("law")
  )
    return "Legal & Compliance";
  return "Entrepreneurship";
};

// Extract industry sector from content
const getIndustrySector = (content: string): string => {
  const contentLower = content.toLowerCase();
  if (contentLower.includes("fashion") || contentLower.includes("lifestyle") || contentLower.includes("clothing") || contentLower.includes("apparel")) 
    return "Fashion & Lifestyle";
  if (contentLower.includes("food") || contentLower.includes("beverage") || contentLower.includes("restaurant") || contentLower.includes("culinary")) 
    return "Food & Beverage";
  if (contentLower.includes("social") || contentLower.includes("impact") || contentLower.includes("nonprofit") || contentLower.includes("ngo")) 
    return "Social Impact";
  if (contentLower.includes("tech") || contentLower.includes("software") || contentLower.includes("ai") || contentLower.includes("digital")) 
    return "Technology";
  return "General Business";
};

// Determine business stage
const getBusinessStage = (content: string): string => {
  const contentLower = content.toLowerCase();
  const earlyKeywords = ["early stage", "startup", "ideation", "launching", "just started"];
  const growthKeywords = ["growth", "scaling", "expanding", "hiring", "funding round"];
  const establishedKeywords = ["established", "enterprise", "corporate", "mature", "years in business"];
  
  const earlyCount = earlyKeywords.filter(keyword => contentLower.includes(keyword)).length;
  const growthCount = growthKeywords.filter(keyword => contentLower.includes(keyword)).length;
  const establishedCount = establishedKeywords.filter(keyword => contentLower.includes(keyword)).length;
  
  if (establishedCount > growthCount && establishedCount > earlyCount) return "Established Enterprise";
  if (growthCount > earlyCount) return "Growth/Scaling";
  return "Early Stage/Ideation";
};

// Determine interview format
const getInterviewFormat = (content: string): string => {
  const contentLower = content.toLowerCase();
  if (contentLower.includes("video") || contentLower.includes("youtube") || contentLower.includes("watch")) 
    return "Video Interview";
  if (contentLower.includes("podcast") || contentLower.includes("audio") || contentLower.includes("listen")) 
    return "Podcast/Audio";
  return "Text Interview";
};

// Determine founder region
const getFounderRegion = (content: string): string => {
  const contentLower = content.toLowerCase();
  const asiaKeywords = ["india", "china", "japan", "singapore", "asia", "asian"];
  const europeKeywords = ["europe", "uk", "london", "germany", "france", "european"];
  const northAmericaKeywords = ["usa", "us", "america", "canada", "new york", "california", "silicon valley"];
  
  const asiaCount = asiaKeywords.filter(keyword => contentLower.includes(keyword)).length;
  const europeCount = europeKeywords.filter(keyword => contentLower.includes(keyword)).length;
  const northAmericaCount = northAmericaKeywords.filter(keyword => contentLower.includes(keyword)).length;
  
  if (northAmericaCount > europeCount && northAmericaCount > asiaCount) return "North America";
  if (europeCount > asiaCount) return "Europe";
  if (asiaCount > 0) return "Asia-Pacific";
  return "Global";
};

// Determine success factor
const getSuccessFactor = (content: string): string => {
  const contentLower = content.toLowerCase();
  if (contentLower.includes("bootstrapped") || contentLower.includes("self-funded") || contentLower.includes("no funding")) 
    return "Bootstrapped";
  if (contentLower.includes("vc") || contentLower.includes("venture capital") || contentLower.includes("funded")) 
    return "VC Funded";
  if (contentLower.includes("angel") || contentLower.includes("investor")) 
    return "Angel Backed";
  if (contentLower.includes("grant") || contentLower.includes("government")) 
    return "Grant Supported";
  return "Mixed Funding";
};

// Helper function to extract interviewee name from title
const extractInterviewee = (title: string): string => {
  const cleaned = title.replace(/Entrechat\s+(?:With|with)\s+/i, "").trim();
  const finalName = cleaned.replace(/^(Ms\.|Mr\.)\s+/i, "").trim();
  return finalName || "Interviewee";
};

// Mock location data
const mockLocationData: Record<string, { state?: string; country?: string }> = {
  // Add location data for your interviews here
};

// Get location from mock data or extract from content as fallback
const getLocationData = (
  id: string,
  content: string,
): { state?: string; country?: string } => {
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

// Interview categories
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
  "Entrepreneurship",
];

// Predefined date ranges
const predefinedDateRanges = [
  { value: "24h", label: "24 Hours" },
  { value: "week", label: "Past Week" },
  { value: "month", label: "Past Month" },
  { value: "3months", label: "Past 3 Months" },
  { value: "custom", label: "Custom Range" },
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
    interviewee: string;
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
  onClose,
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
                    {suggestion.interviewee}
                  </span>
                </div>

                <h4 className="font-medium text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                  {suggestion.title
                    .split(new RegExp(`(${searchQuery})`, "gi"))
                    .map((part, index) =>
                      part.toLowerCase() === searchQuery.toLowerCase() ? (
                        <span
                          key={index}
                          className="text-primary font-semibold bg-primary/10 px-0.5 rounded"
                        >
                          {part}
                        </span>
                      ) : (
                        <span key={index}>{part}</span>
                      ),
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
                    {suggestions.length} interviews found
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

export default function EntreChatPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All Interviews"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [processedInterviews, setProcessedInterviews] = useState<
    ProcessedEntreChatItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<
    Array<{
      id: string;
      title: string;
      category: string;
      interviewee: string;
      date: string;
      slug: string;
      relevance: number;
    }>
  >([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });
  const [selectedDateRange, setSelectedDateRange] = useState<string>("");
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedIndustrySectors, setSelectedIndustrySectors] = useState<string[]>(["All Industries"]);
  const [selectedBusinessStages, setSelectedBusinessStages] = useState<string[]>(["All Stages"]);
  const [selectedInterviewFormats, setSelectedInterviewFormats] = useState<string[]>(["All Formats"]);
  const [selectedFounderRegions, setSelectedFounderRegions] = useState<string[]>(["All Regions"]);
  const [selectedSuccessFactors, setSelectedSuccessFactors] = useState<string[]>(["All Funding Types"]);
  const [userLocation, setUserLocation] = useState<{
    country?: string;
    state?: string;
    city?: string;
    detected: boolean;
  }>({ detected: false });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const router = useRouter();

  // Function to detect user location
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

  // Process entrechat data on component mount
  useEffect(() => {
    const processInterviews = () => {
      try {
        setIsLoading(true);

        const processed = entrechatData.map((item: EntreChatItem) => {
          const category = getCategoryFromContent(item.post_content);
          const excerpt =
            item.post_excerpt && item.post_excerpt.trim() !== ""
              ? item.post_excerpt
              : extractExcerpt(item.post_content);

          const title = item.post_title
            ? item.post_title.replace(/&amp;/g, "&")
            : "EntreChat Interview";
          const rawDate = new Date(item.post_date);
          const date = formatDate(item.post_date);
          const readTime = calculateReadTime(item.post_content);
          const interviewee = extractInterviewee(title);
          const industrySector = getIndustrySector(item.post_content);
          const businessStage = getBusinessStage(item.post_content);
          const interviewFormat = getInterviewFormat(item.post_content);
          const founderRegion = getFounderRegion(item.post_content);
          const successFactor = getSuccessFactor(item.post_content);

          const image =
            item.featured_image_url && item.featured_image_url.trim() !== ""
              ? item.featured_image_url
              : null;

          const slug = item.post_name || `entrechat-${item.ID}`;

          const location = getLocationData(item.ID, item.post_content);

          return {
            id: item.ID || Math.random().toString(),
            category,
            title,
            excerpt,
            date,
            rawDate,
            readTime,
            interviewee,
            image,
            fullContent: item.post_content || "",
            modifiedDate: item.post_modified
              ? formatDate(item.post_modified)
              : undefined,
            modifiedRawDate: item.post_modified
              ? new Date(item.post_modified)
              : undefined,
            slug,
            state: location.state,
            country: location.country,
            industrySector,
            businessStage,
            interviewFormat,
            founderRegion,
            successFactor,
          };
        });

        // Sort by date descending
        processed.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

        setProcessedInterviews(processed);
      } catch (error) {
        console.error("Error processing entrechat data:", error);
        setProcessedInterviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    processInterviews();
    
    // Detect user location on mount
    detectUserLocation();
  }, []);

  // Apply date range filter
  const applyDateRangeFilter = (
    range: string,
    customFrom?: string,
    customTo?: string,
  ) => {
    const now = new Date();
    const from = new Date();

    switch (range) {
      case "24h":
        from.setDate(now.getDate() - 1);
        setDateRange({
          from: from.toISOString().split("T")[0],
          to: now.toISOString().split("T")[0],
        });
        setShowCustomDatePicker(false);
        break;
      case "week":
        from.setDate(now.getDate() - 7);
        setDateRange({
          from: from.toISOString().split("T")[0],
          to: now.toISOString().split("T")[0],
        });
        setShowCustomDatePicker(false);
        break;
      case "month":
        from.setMonth(now.getMonth() - 1);
        setDateRange({
          from: from.toISOString().split("T")[0],
          to: now.toISOString().split("T")[0],
        });
        setShowCustomDatePicker(false);
        break;
      case "3months":
        from.setMonth(now.getMonth() - 3);
        setDateRange({
          from: from.toISOString().split("T")[0],
          to: now.toISOString().split("T")[0],
        });
        setShowCustomDatePicker(false);
        break;
      case "custom":
        setShowCustomDatePicker(true);
        if (customFrom && customTo) {
          setDateRange({
            from: customFrom,
            to: customTo,
          });
        }
        break;
      default:
        setDateRange({ from: "", to: "" });
        setShowCustomDatePicker(false);
    }
    setSelectedDateRange(range);
  };

  // Get display label for date range
  const getDateRangeDisplayLabel = () => {
    if (selectedDateRange === "custom") {
      if (dateRange.from || dateRange.to) {
        const parts = [];
        if (dateRange.from) {
          parts.push(`From: ${new Date(dateRange.from).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`);
        }
        if (dateRange.to) {
          parts.push(`To: ${new Date(dateRange.to).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`);
        }
        return parts.join(" • ");
      }
      return "Custom Range";
    }
    if (selectedDateRange) {
      const range = predefinedDateRanges.find(r => r.value === selectedDateRange);
      return range?.label || "";
    }
    return "";
  };

  // Filter interviews based on all filter criteria
  const filteredInterviews = useMemo(() => {
    let filtered = [...processedInterviews];

    // Filter by categories
    if (selectedCategories.length > 0 && !selectedCategories.includes("All Interviews")) {
      filtered = filtered.filter(
        (interview) => selectedCategories.includes(interview.category),
      );
    }

    // Filter by date range
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter((interview) => interview.rawDate >= fromDate);
    }
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((interview) => interview.rawDate <= toDate);
    }

    // Filter by states
    if (selectedStates.length > 0) {
      filtered = filtered.filter(
        (interview) => interview.state && selectedStates.includes(interview.state),
      );
    }

    // Filter by countries
    if (selectedCountries.length > 0) {
      filtered = filtered.filter(
        (interview) =>
          interview.country && selectedCountries.includes(interview.country),
      );
    }

    // Filter by industry sectors
    if (selectedIndustrySectors.length > 0 && !selectedIndustrySectors.includes("All Industries")) {
      filtered = filtered.filter((interview) =>
        selectedIndustrySectors.includes(interview.industrySector),
      );
    }

    // Filter by business stages
    if (selectedBusinessStages.length > 0 && !selectedBusinessStages.includes("All Stages")) {
      filtered = filtered.filter((interview) =>
        selectedBusinessStages.includes(interview.businessStage),
      );
    }

    // Filter by interview formats
    if (selectedInterviewFormats.length > 0 && !selectedInterviewFormats.includes("All Formats")) {
      filtered = filtered.filter((interview) =>
        selectedInterviewFormats.includes(interview.interviewFormat),
      );
    }

    // Filter by founder regions
    if (selectedFounderRegions.length > 0 && !selectedFounderRegions.includes("All Regions")) {
      filtered = filtered.filter((interview) =>
        selectedFounderRegions.includes(interview.founderRegion),
      );
    }

    // Filter by success factors
    if (selectedSuccessFactors.length > 0 && !selectedSuccessFactors.includes("All Funding Types")) {
      filtered = filtered.filter((interview) =>
        selectedSuccessFactors.includes(interview.successFactor),
      );
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (interview) =>
          interview.title.toLowerCase().includes(query) ||
          interview.excerpt.toLowerCase().includes(query) ||
          interview.fullContent.toLowerCase().includes(query) ||
          interview.category.toLowerCase().includes(query) ||
          interview.interviewee.toLowerCase().includes(query) ||
          (interview.state && interview.state.toLowerCase().includes(query)) ||
          (interview.country &&
            interview.country.toLowerCase().includes(query)) ||
          interview.industrySector.toLowerCase().includes(query) ||
          interview.businessStage.toLowerCase().includes(query) ||
          interview.interviewFormat.toLowerCase().includes(query) ||
          interview.founderRegion.toLowerCase().includes(query) ||
          interview.successFactor.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [
    processedInterviews,
    selectedCategories,
    dateRange,
    selectedStates,
    selectedCountries,
    selectedIndustrySectors,
    selectedBusinessStages,
    selectedInterviewFormats,
    selectedFounderRegions,
    selectedSuccessFactors,
    searchQuery,
  ]);

  // Get featured interview (most recent)
  const featuredInterview =
    processedInterviews.length > 0 ? processedInterviews[0] : null;

  // Pagination calculations for All Interviews section
  const totalPages = Math.ceil(filteredInterviews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentInterviews = filteredInterviews.slice(startIndex, endIndex);

  // Get latest headlines (most recent 4 interviews)
  const latestHeadlines = useMemo(() => {
    return processedInterviews.slice(0, 4);
  }, [processedInterviews]);

  // Extract unique values for filters
  const uniqueStates = useMemo(() => {
    const states = processedInterviews
      .map((interview) => interview.state)
      .filter((state): state is string => !!state)
      .filter((state, index, self) => self.indexOf(state) === index)
      .sort();
    return states;
  }, [processedInterviews]);

  const uniqueCountries = useMemo(() => {
    const countries = processedInterviews
      .map((interview) => interview.country)
      .filter((country): country is string => !!country)
      .filter((country, index, self) => self.indexOf(country) === index)
      .sort();
    return countries;
  }, [processedInterviews]);

  const uniqueIndustrySectors = useMemo(() => {
    const sectors = processedInterviews
      .map((interview) => interview.industrySector)
      .filter((sector): sector is string => !!sector)
      .filter((sector, index, self) => self.indexOf(sector) === index)
      .sort();
    return sectors;
  }, [processedInterviews]);

  const uniqueBusinessStages = useMemo(() => {
    const stages = processedInterviews
      .map((interview) => interview.businessStage)
      .filter((stage): stage is string => !!stage)
      .filter((stage, index, self) => self.indexOf(stage) === index)
      .sort();
    return stages;
  }, [processedInterviews]);

  const uniqueInterviewFormats = useMemo(() => {
    const formats = processedInterviews
      .map((interview) => interview.interviewFormat)
      .filter((format): format is string => !!format)
      .filter((format, index, self) => self.indexOf(format) === index)
      .sort();
    return formats;
  }, [processedInterviews]);

  const uniqueFounderRegions = useMemo(() => {
    const regions = processedInterviews
      .map((interview) => interview.founderRegion)
      .filter((region): region is string => !!region)
      .filter((region, index, self) => self.indexOf(region) === index)
      .sort();
    return regions;
  }, [processedInterviews]);

  const uniqueSuccessFactors = useMemo(() => {
    const factors = processedInterviews
      .map((interview) => interview.successFactor)
      .filter((factor): factor is string => !!factor)
      .filter((factor, index, self) => self.indexOf(factor) === index)
      .sort();
    return factors;
  }, [processedInterviews]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategories,
    dateRange,
    selectedStates,
    selectedCountries,
    selectedIndustrySectors,
    selectedBusinessStages,
    selectedInterviewFormats,
    selectedFounderRegions,
    selectedSuccessFactors,
    searchQuery,
  ]);

  // Handle clicks outside search suggestions and filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Generate search suggestions based on query
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const query = searchQuery.toLowerCase().trim();

      const suggestions = processedInterviews
        .map((interview) => {
          let relevance = 0;

          if (interview.title.toLowerCase().includes(query)) relevance += 10;
          if (interview.excerpt.toLowerCase().includes(query)) relevance += 5;
          if (interview.fullContent.toLowerCase().includes(query))
            relevance += 3;
          if (interview.category.toLowerCase().includes(query)) relevance += 8;
          if (interview.interviewee.toLowerCase().includes(query))
            relevance += 2;
          if (interview.state && interview.state.toLowerCase().includes(query))
            relevance += 6;
          if (
            interview.country &&
            interview.country.toLowerCase().includes(query)
          )
            relevance += 6;

          if (interview.title.toLowerCase().startsWith(query)) relevance += 5;

          return {
            id: interview.id,
            title: interview.title,
            category: interview.category,
            interviewee: interview.interviewee,
            date: interview.date,
            slug: interview.slug,
            relevance,
          };
        })
        .filter((item) => item.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 8);

      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, processedInterviews]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle interview click
  const handleInterviewClick = (slug: string) => {
    router.push(`/entrechat/${slug}`);
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

    const searchInput = document.querySelector(
      'input[type="search"]',
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategories(["All Interviews"]);
    setDateRange({ from: "", to: "" });
    setSelectedDateRange("");
    setShowCustomDatePicker(false);
    setSelectedStates([]);
    setSelectedCountries([]);
    setSelectedIndustrySectors(["All Industries"]);
    setSelectedBusinessStages(["All Stages"]);
    setSelectedInterviewFormats(["All Formats"]);
    setSelectedFounderRegions(["All Regions"]);
    setSelectedSuccessFactors(["All Funding Types"]);
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
      (selectedCategories.length > 0 && !(selectedCategories.length === 1 && selectedCategories[0] === "All Interviews")) ||
      dateRange.from !== "" ||
      dateRange.to !== "" ||
      selectedStates.length > 0 ||
      selectedCountries.length > 0 ||
      (selectedIndustrySectors.length > 0 && !(selectedIndustrySectors.length === 1 && selectedIndustrySectors[0] === "All Industries")) ||
      (selectedBusinessStages.length > 0 && !(selectedBusinessStages.length === 1 && selectedBusinessStages[0] === "All Stages")) ||
      (selectedInterviewFormats.length > 0 && !(selectedInterviewFormats.length === 1 && selectedInterviewFormats[0] === "All Formats")) ||
      (selectedFounderRegions.length > 0 && !(selectedFounderRegions.length === 1 && selectedFounderRegions[0] === "All Regions")) ||
      (selectedSuccessFactors.length > 0 && !(selectedSuccessFactors.length === 1 && selectedSuccessFactors[0] === "All Funding Types")) ||
      searchQuery !== ""
    );
  };

  if (isLoading) {
    return (
      <main className="bg-background min-h-screen">
        <section className={`relative h-[470px] overflow-hidden pt-24`}>
          <div className="absolute inset-0" style={{ top: "96px" }}>
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(/FinalEntrechatbanner.png)`,
                backgroundPosition: "center center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>
        </section>
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
    <main className="bg-background min-h-screen">
      <section className={`relative h-[470px] overflow-hidden pt-24`}>
        {/* Background Image */}
        <div className="absolute inset-0" style={{ top: "96px" }}>
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(/FinalEntrechatbanner.png)`,
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
                  EntreChat Community
                </span>
              </h1>

              <p className="mt-4 mb-4 sm:mt-6 text-md sm:text-base md:text-xl text-white/90 leading-relaxed max-w-3xl">
                Candid conversations with inspiring women entrepreneurs sharing
                real journeys and experiences. Discover challenges, strategies,
                and lessons that inform, inspire, and empower your own path.
              </p>

 
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED INTERVIEW + SIDEBAR ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-secondary/30">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* LEFT - FEATURED INTERVIEW */}
          {featuredInterview && (
            <div className="lg:col-span-2">
              <div
                onClick={() => handleInterviewClick(featuredInterview.slug)}
                className="relative group bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-primary/10 cursor-pointer"
              >
                {/* FEATURED BADGE */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                  <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-white text-xs font-bold uppercase shadow-lg">
                    Featured Interview
                  </span>
                </div>

                {/* IMAGE */}
                <div className="relative h-48 sm:h-64 lg:h-[340px] overflow-hidden bg-gradient-to-br from-muted to-secondary">
                  {featuredInterview.image ? (
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
                <div className="p-4 ">
                  <h2 className="text-lg sm:text-xl font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {featuredInterview.title}
                  </h2>

                  <p className="text-sm sm:text-base text-muted-foreground mb-2 leading-relaxed line-clamp-3">
                    {featuredInterview.excerpt}
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1 border-t border-border">
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        {featuredInterview.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        {featuredInterview.readTime}
                      </div>
                      {featuredInterview.state && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{featuredInterview.state}</span>
                        </div>
                      )}
                    </div>

                    <Button className="bg-primary hover:bg-primary/90 group text-sm w-full sm:w-auto">
                      Read Interview
                      <ExternalLink className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT - TRENDING NOW */}
          <div
            className={`space-y-4 sm:space-y-6 ${!featuredInterview ? "lg:col-span-3" : ""}`}
          >
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
                  {latestHeadlines.map((interview, i) => (
                    <div
                      key={i}
                      onClick={() => handleInterviewClick(interview.slug)}
                      className="block cursor-pointer pb-3 sm:pb-4 border-b border-border last:border-0 last:pb-0 hover:bg-secondary/30 rounded-lg px-2 -mx-2 transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        {/* IMAGE */}
                        <div className="flex-shrink-0">
                          <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-lg overflow-hidden bg-gradient-to-br from-muted to-secondary">
                            {interview.image ? (
                              <Image
                                src={interview.image}
                                alt={interview.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 48px, 56px"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                                <div className="text-primary/40 text-lg font-display">
                                  {interview.interviewee.charAt(0)}
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
                              {getCategoryIcon(interview.category)}
                              <span className="truncate">{interview.category.split(" & ")[0]}</span>
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {interview.interviewee.split(" ")[0]}
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
                            {interview.state && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate max-w-[60px]">
                                  {interview.state}
                                </span>
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
                      top:
                        document.getElementById("all-interviews-section")
                          ?.offsetTop || 0,
                      behavior: "smooth",
                    });
                  }}
                >
                  View All Interviews
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ALL INTERVIEWS GRID ================= */}
      <section
        id="all-interviews-section"
        className="px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="max-w-screen-xl mx-auto">
          {/* HEADER WITH SEARCH AND FILTER */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-1 sm:mb-2">
                {selectedCategories.includes("All Interviews") || selectedCategories.length === 0
                  ? "All Interviews"
                  : `${selectedCategories.length} ${selectedCategories.length === 1 ? "Category" : "Categories"} Selected`}
                {searchQuery && (
                  <span className="text-lg sm:text-xl text-primary">
                    {" "}
                    - Search results for {searchQuery}
                  </span>
                )}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {filteredInterviews.length}{" "}
                {filteredInterviews.length === 1 ? "interview" : "interviews"}{" "}
                found
                {selectedCategories.length > 0 && !selectedCategories.includes("All Interviews") && 
                  ` in ${selectedCategories.length} ${selectedCategories.length === 1 ? 'category' : 'categories'}`
                }
                {searchQuery && ` matching "${searchQuery}"`}
                {getDateRangeDisplayLabel() && !searchQuery && !selectedCategories.length && ` • ${getDateRangeDisplayLabel()}`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64" ref={searchRef}>
                <form onSubmit={handleSearchSubmit}>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black z-10" />
                  <Input
                    type="search"
                    placeholder="Search interviews..."
                    className="pl-10 pr-10 w-full bg-white"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => {
                      if (
                        searchQuery.length >= 2 &&
                        searchSuggestions.length > 0
                      ) {
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

              {/* FILTER DROPDOWN - Using SlidersHorizontal icon instead of Filter */}
              <div className="relative w-full sm:w-auto" ref={filterRef}>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto flex items-center gap-2"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {isAnyFilterActive() && (
                    <span className="ml-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-white text-xs">
                      {(() => {
                        let count = 0;
                        if (selectedCategories.length > 0 && !selectedCategories.includes("All Interviews")) count++;
                        if (dateRange.from || dateRange.to) count++;
                        if (selectedStates.length > 0) count++;
                        if (selectedCountries.length > 0) count++;
                        if (selectedIndustrySectors.length > 0 && !selectedIndustrySectors.includes("All Industries")) count++;
                        if (selectedBusinessStages.length > 0 && !selectedBusinessStages.includes("All Stages")) count++;
                        if (selectedInterviewFormats.length > 0 && !selectedInterviewFormats.includes("All Formats")) count++;
                        if (selectedFounderRegions.length > 0 && !selectedFounderRegions.includes("All Regions")) count++;
                        if (selectedSuccessFactors.length > 0 && !selectedSuccessFactors.includes("All Funding Types")) count++;
                        if (searchQuery) count++;
                        return count;
                      })()}
                    </span>
                  )}
                </Button>

                {/* FILTER DROPDOWN MENU */}
                {isFilterOpen && (
                  <div className="absolute top-full right-0 mt-1 w-80 sm:w-96 bg-white border border-border rounded-lg shadow-xl z-50 max-h-[80vh] overflow-y-auto p-4">
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-foreground">
                          Filter Interviews
                        </h4>
                      </div>

                      {/* CATEGORY FILTER */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-foreground mb-2">
                          Category
                        </h5>
                        <MultiSelectDropdown
                          label="Categories"
                          icon={<CalendarDays className="h-4 w-4" />}
                          options={entrechatCategories.filter(cat => cat !== "All Interviews")}
                          selectedValues={selectedCategories.filter(cat => cat !== "All Interviews")}
                          onChange={(values) => setSelectedCategories(values)}
                          placeholder="Select categories"
                          allOptionLabel="All Categories"
                        />
                      </div>

                      {/* INDUSTRY SECTOR FILTER */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-foreground mb-2">
                          Industry/Sector
                        </h5>
                        <MultiSelectDropdown
                          label="Industries"
                          icon={<Building className="h-4 w-4" />}
                          options={uniqueIndustrySectors}
                          selectedValues={selectedIndustrySectors.filter(sector => sector !== "All Industries")}
                          onChange={(values) => setSelectedIndustrySectors(values)}
                          placeholder="Select industries"
                          allOptionLabel="All Industries"
                        />
                      </div>

                      {/* BUSINESS STAGE FILTER */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-foreground mb-2">
                          Business Stage
                        </h5>
                        <MultiSelectDropdown
                          label="Business Stages"
                          icon={<TrendingUp className="h-4 w-4" />}
                          options={uniqueBusinessStages}
                          selectedValues={selectedBusinessStages.filter(stage => stage !== "All Stages")}
                          onChange={(values) => setSelectedBusinessStages(values)}
                          placeholder="Select business stages"
                          allOptionLabel="All Stages"
                        />
                      </div>

                      {/* INTERVIEW FORMAT FILTER */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-foreground mb-2">
                          Interview Format
                        </h5>
                        <MultiSelectDropdown
                          label="Formats"
                          icon={<Video className="h-4 w-4" />}
                          options={uniqueInterviewFormats}
                          selectedValues={selectedInterviewFormats.filter(format => format !== "All Formats")}
                          onChange={(values) => setSelectedInterviewFormats(values)}
                          placeholder="Select formats"
                          allOptionLabel="All Formats"
                        />
                      </div>

                      {/* FOUNDER REGION FILTER */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-foreground mb-2">
                          Founder Region
                        </h5>
                        <MultiSelectDropdown
                          label="Regions"
                          icon={<Globe className="h-4 w-4" />}
                          options={uniqueFounderRegions}
                          selectedValues={selectedFounderRegions.filter(region => region !== "All Regions")}
                          onChange={(values) => setSelectedFounderRegions(values)}
                          placeholder="Select regions"
                          allOptionLabel="All Regions"
                        />
                      </div>

                      {/* SUCCESS FACTOR FILTER */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-foreground mb-2">
                          Success Factor (Funding)
                        </h5>
                        <MultiSelectDropdown
                          label="Funding Types"
                          icon={<FileText className="h-4 w-4" />}
                          options={uniqueSuccessFactors}
                          selectedValues={selectedSuccessFactors.filter(factor => factor !== "All Funding Types")}
                          onChange={(values) => setSelectedSuccessFactors(values)}
                          placeholder="Select funding types"
                          allOptionLabel="All Funding Types"
                        />
                      </div>

                      {/* DATE RANGE FILTER */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date Range
                        </h5>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                          {predefinedDateRanges.map((range) => (
                            <button
                              key={range.value}
                              onClick={() => {
                                setSelectedDateRange(range.value);
                                applyDateRangeFilter(range.value);
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

                        {/* CUSTOM DATE INPUTS - Only shown when Custom is selected */}
                        {showCustomDatePicker && (
                          <div className="grid grid-cols-2 gap-3 mt-3 p-3 bg-secondary/30 rounded-lg">
                            <div>
                              <label className="text-xs text-muted-foreground block mb-1">From</label>
                              <Input
                                type="date"
                                value={dateRange.from}
                                onChange={(e) => {
                                  setDateRange({
                                    ...dateRange,
                                    from: e.target.value,
                                  });
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
                                  setDateRange({
                                    ...dateRange,
                                    to: e.target.value,
                                  });
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
                              setShowCustomDatePicker(false);
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
                        {uniqueStates.length > 0 && (
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
                        )}
                      </div>

                      {/* LOCATION DETECTION - Simplified */}
                      <div className="p-3 bg-secondary/30 rounded-lg mb-4">
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
                            Showing interviews from{" "}
                            <span className="font-medium text-foreground">
                              {userLocation.country}
                              {userLocation.state && ` • ${userLocation.state}`}
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
                      <div className="pt-4 mt-4 border-t border-border">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium text-foreground">
                            Active Filters
                          </h5>
                          <button
                            onClick={clearAllFilters}
                            className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                          >
                            <X className="h-3 w-3" />
                            Clear All
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedCategories.length > 0 && !selectedCategories.includes("All Interviews") && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                              <CalendarDays className="h-3 w-3" />
                              {selectedCategories.length} category
                              {selectedCategories.length !== 1 ? "ies" : ""}
                              <button
                                onClick={() => setSelectedCategories(["All Interviews"])}
                                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          )}
                          {selectedIndustrySectors.length > 0 && !selectedIndustrySectors.includes("All Industries") && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                              <Building className="h-3 w-3" />
                              {selectedIndustrySectors.length} industry
                              {selectedIndustrySectors.length !== 1 ? "ies" : ""}
                              <button
                                onClick={() => setSelectedIndustrySectors(["All Industries"])}
                                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          )}
                          {selectedBusinessStages.length > 0 && !selectedBusinessStages.includes("All Stages") && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                              <TrendingUp className="h-3 w-3" />
                              {selectedBusinessStages.length} business stage
                              {selectedBusinessStages.length !== 1 ? "s" : ""}
                              <button
                                onClick={() => setSelectedBusinessStages(["All Stages"])}
                                className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          )}
                          {selectedInterviewFormats.length > 0 && !selectedInterviewFormats.includes("All Formats") && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs">
                              <Video className="h-3 w-3" />
                              {selectedInterviewFormats.length} format
                              {selectedInterviewFormats.length !== 1 ? "s" : ""}
                              <button
                                onClick={() => setSelectedInterviewFormats(["All Formats"])}
                                className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          )}
                          {selectedFounderRegions.length > 0 && !selectedFounderRegions.includes("All Regions") && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs">
                              <Globe className="h-3 w-3" />
                              {selectedFounderRegions.length} region
                              {selectedFounderRegions.length !== 1 ? "s" : ""}
                              <button
                                onClick={() => setSelectedFounderRegions(["All Regions"])}
                                className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          )}
                          {selectedSuccessFactors.length > 0 && !selectedSuccessFactors.includes("All Funding Types") && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs">
                              <FileText className="h-3 w-3" />
                              {selectedSuccessFactors.length} funding type
                              {selectedSuccessFactors.length !== 1 ? "s" : ""}
                              <button
                                onClick={() => setSelectedSuccessFactors(["All Funding Types"])}
                                className="ml-1 hover:bg-amber-200 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          )}
                          
                          {/* Only show date range in active filters for custom dates */}
                          {selectedDateRange === "custom" && dateRange.from && (
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
                          {selectedDateRange === "custom" && dateRange.to && (
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
                          
                          {/* Show preset date range label instead of dates */}
                          {selectedDateRange && selectedDateRange !== "custom" && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                              <Calendar className="h-3 w-3" />
                              {predefinedDateRanges.find(r => r.value === selectedDateRange)?.label}
                              <button
                                onClick={() => {
                                  setDateRange({ from: "", to: "" });
                                  setSelectedDateRange("");
                                  setShowCustomDatePicker(false);
                                }}
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
            </div>
          </div>

          {filteredInterviews.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-2">
                No interviews found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery
                  ? `No interviews found matching "${searchQuery}"${
                      selectedCategories.length > 0 && !selectedCategories.includes("All Interviews")
                        ? ` in the selected categories`
                        : ""
                    }`
                  : `There are no interviews with the current filters.`}
              </p>
              <Button
                onClick={clearAllFilters}
                className="bg-gradient-to-r from-primary to-accent text-white font-semibold"
              >
                View All Interviews
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {currentInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    onClick={() => handleInterviewClick(interview.slug)}
                    className="group bg-card rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-border cursor-pointer"
                  >
                    {/* IMAGE CONTAINER */}
                    <div className="relative h-40 sm:h-40 overflow-hidden bg-gradient-to-br from-muted to-secondary">
                      {interview.image ? (
                        <Image
                          src={interview.image}
                          alt={interview.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
                    <div className="p-4 sm:p-6 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase">
                          {getCategoryIcon(interview.category)}
                          {interview.category.split(" & ")[0]}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {interview.interviewee.split(" ")[0]}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base lg:text-lg font-display font-bold text-foreground mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {interview.title}
                      </h3>

                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs">
                          {interview.industrySector.split(" & ")[0]}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
                          {interview.businessStage.split("/")[0]}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-5 line-clamp-2 leading-relaxed flex-grow">
                        {interview.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border mt-auto">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            <span>{interview.date}</span>
                          </div>
                          {(interview.state || interview.country) && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              <span>
                                {interview.state || interview.country}
                              </span>
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
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 sm:mt-12 pt-8 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-
                    {Math.min(endIndex, filteredInterviews.length)} of{" "}
                    {filteredInterviews.length} interviews
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