// /components/events/EventsPage.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calendar,
  Clock,
  Filter,
  IndianRupee,
  MapPin,
  Menu,
  TrendingUp,
  Users,
  X
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cta from "../common/Cta";
import { PageBanner } from "../PageBanner";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Import your events data
import { eventsData } from "@/data/events";

// Define types for your events data
interface EventItem {
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
  external_url?: string | null;
}

// Extract categories from content
const getCategoryFromContent = (content: string): string => {
  const contentLower = content.toLowerCase();
  if (contentLower.includes("summit") || contentLower.includes("conference") || contentLower.includes("annual") || contentLower.includes("global")) return "Conferences";
  if (contentLower.includes("workshop") || contentLower.includes("masterclass") || contentLower.includes("training") || contentLower.includes("session")) return "Workshops";
  if (contentLower.includes("webinar") || contentLower.includes("online") || contentLower.includes("virtual") || contentLower.includes("zoom")) return "Webinars";
  if (contentLower.includes("networking") || contentLower.includes("meetup") || contentLower.includes("gathering") || contentLower.includes("meeting")) return "Networking";
  if (contentLower.includes("seminar") || contentLower.includes("talk") || contentLower.includes("lecture") || contentLower.includes("presentation")) return "Seminars";
  if (contentLower.includes("dialogue") || contentLower.includes("forum") || contentLower.includes("discussion") || contentLower.includes("panel")) return "Forums";
  if (contentLower.includes("launch") || contentLower.includes("inauguration") || contentLower.includes("unveil") || contentLower.includes("initiative")) return "Launches";
  if (contentLower.includes("award") || contentLower.includes("ceremony") || contentLower.includes("felicitation") || contentLower.includes("recognition")) return "Awards";
  if (contentLower.includes("festival") || contentLower.includes("celebration") || contentLower.includes("day") || contentLower.includes("international")) return "Festivals";
  return "Other Events";
};

const eventCategories = [
  "All Events",
  "Conferences",
  "Workshops", 
  "Webinars",
  "Networking",
  "Seminars",
  "Forums",
  "Launches",
  "Awards",
  "Festivals",
  "Other Events"
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
  if (!content) return 'No description available';
  
  try {
    // Remove HTML tags
    const plainText = content.replace(/<[^>]*>/g, '');
    // Remove newlines and extra spaces
    const cleanText = plainText.replace(/\s+/g, ' ').trim();
    
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + '...';
  } catch (error) {
    console.warn('Error extracting excerpt:', error);
    return 'No description available';
  }
};

// Extract location from content
const extractLocation = (content: string): string => {
  const locationPatterns = [
    /in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /at\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+conference/i,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+event/i,
  ];
  
  for (const pattern of locationPatterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      const location = match[1].trim();
      // Filter out common non-location words
      if (!['The', 'This', 'Our', 'Global', 'Annual', 'International'].includes(location.split(' ')[0])) {
        return location;
      }
    }
  }
  
  return 'Online / Location TBD';
};

// Extract date details from content
const extractDateDetails = (content: string, postDate: string): { date: string, time?: string } => {
  // Try to extract date ranges like "August 4 to 12, 2025"
  const dateRangeMatch = content.match(/([A-Za-z]+\s+\d+\s+(?:to\s+)?\d*(?:\s*,\s*\d{4})?)/i);
  if (dateRangeMatch) {
    return { date: dateRangeMatch[1] };
  }
  
  // Try to extract specific dates
  const dateMatch = content.match(/([A-Za-z]+\s+\d+(?:\s*,\s*\d{4})?)/i);
  if (dateMatch) {
    return { date: dateMatch[1] };
  }
  
  // Fallback to post date
  return { date: formatDate(postDate) };
};

// Determine format from content
const extractFormat = (content: string): string => {
  const contentLower = content.toLowerCase();
  if (contentLower.includes("online") || contentLower.includes("virtual") || contentLower.includes("zoom") || contentLower.includes("digital")) return "Virtual";
  if (contentLower.includes("in-person") || contentLower.includes("physical") || contentLower.includes("venue")) return "In-person";
  if (contentLower.includes("hybrid") || contentLower.includes("both online and in-person")) return "Hybrid";
  return "To be announced";
};

// Extract price from content
const extractPrice = (content: string): string => {
  const pricePatterns = [
    /\$(\d+(?:\.\d{2})?)/,
    /₹(\d+(?:\.\d{2})?)/,
    /(\d+)\s*(?:USD|dollars?)/i,
    /(\d+)\s*(?:INR|rupees?)/i,
    /free/i,
    /complimentary/i,
    /no cost/i
  ];
  
  for (const pattern of pricePatterns) {
    const match = content.match(pattern);
    if (match) {
      if (pattern.toString().includes('free') || pattern.toString().includes('complimentary') || pattern.toString().includes('no cost')) {
        return 'Free';
      }
      if (pattern.toString().includes('₹')) {
        return `₹${match[1]}`;
      }
      if (pattern.toString().includes('$')) {
        return `$${match[1]}`;
      }
      return match[0];
    }
  }
  
  return 'Contact for details';
};

// Items per page for pagination
const ITEMS_PER_PAGE = 13;

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Events");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [processedEvents, setProcessedEvents] = useState<Array<{
    id: string;
    category: string;
    title: string;
    description: string;
    date: string;
    time?: string;
    location: string;
    format: string;
    price: string;
    image: string;
    fullContent: string;
    modifiedDate?: string;
    slug: string;
    featured: boolean;
    month: string;
    day: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Process events data on component mount
  useEffect(() => {
    try {
      setIsLoading(true);
      
      const processed = eventsData.map((item: EventItem, index: number) => {
        const category = getCategoryFromContent(item.post_content);
        const description = item.post_excerpt && item.post_excerpt.trim() !== '' 
          ? item.post_excerpt 
          : extractExcerpt(item.post_content);
        
        const title = item.post_title ? item.post_title.replace(/&amp;/g, '&') : 'Upcoming Event';
        const location = extractLocation(item.post_content);
        const format = extractFormat(item.post_content);
        const price = extractPrice(item.post_content);
        
        const { date, time } = extractDateDetails(item.post_content, item.post_date);
        
        const image = item.featured_image_url && item.featured_image_url.trim() !== '' 
          ? item.featured_image_url 
          : '/placeholder-event.jpg';
        
        // Parse date for month and day display
        let month = 'TBD';
        let day = '?';
        try {
          const dateObj = new Date(item.post_date);
          if (!isNaN(dateObj.getTime())) {
            month = dateObj.toLocaleDateString('en-US', { month: 'short' });
            day = dateObj.getDate().toString();
          }
        } catch (error) {
          console.log(error)
          // Use fallback values
        }
        
        // First event is featured
        const featured = index === 0;
        
        return {
          id: item.ID || Math.random().toString(),
          category,
          title,
          description,
          date,
          time,
          location,
          format,
          price,
          image,
          fullContent: item.post_content || '',
          modifiedDate: item.post_modified ? formatDate(item.post_modified) : undefined,
          slug: item.post_name || `event-${item.ID}`,
          featured,
          month,
          day
        };
      });
      
      // Sort by date (newest first)
      processed.sort((a, b) => {
        try {
          const dateA = new Date(a.date.includes('TBD') ? '2100-01-01' : a.date);
          const dateB = new Date(b.date.includes('TBD') ? '2100-01-01' : b.date);
          return dateB.getTime() - dateA.getTime();
        } catch (error) {
          console.log(error)
          return 0;
        }
      });
      
      setProcessedEvents(processed);
    } catch (error) {
      console.error('Error processing events data:', error);
      setProcessedEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get featured event (most recent)
  const featuredEvent = processedEvents.length > 0 ? processedEvents.find(e => e.featured) : null;

  // Get trending events (most recent 4)
  const trendingEvents = processedEvents.slice(0, 4);

  // Filter events based on selected category
  const getFilteredEvents = () => {
    if (selectedCategory === "All Events") {
      return processedEvents;
    }
    return processedEvents.filter(event => 
      event.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  };

  // Check if featured event should be shown
  const shouldShowFeaturedEvent = () => {
    if (!featuredEvent || selectedCategory === "All Events") return true;
    return featuredEvent.category.toLowerCase() === selectedCategory.toLowerCase();
  };

  const filteredEvents = getFilteredEvents();
  const showFeaturedEvent = shouldShowFeaturedEvent();

  // Get filtered trending events
  const getFilteredTrendingEvents = () => {
    if (selectedCategory === "All Events") {
      return trendingEvents;
    }
    return trendingEvents.filter(event => 
      event.category.toLowerCase() === selectedCategory.toLowerCase()
    ).slice(0, 4);
  };

  const filteredTrendingEvents = getFilteredTrendingEvents();

  // Pagination calculations
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle card click
  const handleCardClick = (slug: string) => {
    router.push(`/events/${slug}`);
  };

  if (isLoading) {
    return (
      <main className="bg-background min-h-screen">
        <PageBanner
          title="Events"
          description="Join workshops, webinars and networking opportunities designed to empower and inspire"
          image="/events/Eventsbanner.png"
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen flex flex-col">
      {/* ================= HERO BANNER ================= */}
      <PageBanner
        title="Events"
        description="Join workshops, webinars and networking opportunities designed to empower and inspire"
        image="/events/Eventsbanner.png"
      >
        {/* Active filter indicator */}
        {selectedCategory !== "All Events" && (
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
              <span>Filtering by:</span>
              <span className="font-semibold">{selectedCategory}</span>
              <button 
                onClick={() => {
                  setSelectedCategory("All Events");
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
          {eventCategories.map((cat) => (
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

      {/* ================= FEATURED EVENT ================= */}
      {showFeaturedEvent && featuredEvent && (
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1">
          <div className="max-w-screen-xl mx-auto">
            <div 
              onClick={() => handleCardClick(featuredEvent.slug)}
              className="grid lg:grid-cols-2 gap-6 bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl lg:shadow-2xl border border-primary/10 cursor-pointer group hover:shadow-2xl transition-shadow duration-300"
            >
              {/* LEFT IMAGE */}
              <div className="relative min-h-48 sm:min-h-64 lg:min-h-80 overflow-hidden bg-gradient-to-br from-muted to-secondary">
                {featuredEvent.image !== '/placeholder-event.jpg' ? (
                  <Image
                    src={featuredEvent.image}
                    alt={featuredEvent.title}
                    fill
                    // sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 50vw"
                    className="object-fit group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-white/40 text-6xl font-display">
                        {featuredEvent.title.charAt(0)}
                      </span>
                    </div>
                  </div>
                )}
                {/* <div className="absolute top-4 left-4 z-10">
                  <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-accent text-white text-xs sm:text-sm font-semibold shadow-lg">
                    Featured Event
                  </span>
                </div> */}
              </div>

              {/* RIGHT CONTENT */}
              <div className="p-4 sm:p-6 lg:p-8  flex flex-col justify-center">
                <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-3 sm:mb-4 w-fit">
                  {featuredEvent.category}
                </span>

                <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                  {featuredEvent.title}
                </h2>

                <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 leading-relaxed line-clamp-3">
                  {featuredEvent.description}
                </p>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 sm:gap-3 text-foreground">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <span className="font-medium text-sm sm:text-base">
                      {featuredEvent.date} {featuredEvent.time && `• ${featuredEvent.time}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-foreground">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <span className="font-medium text-sm sm:text-base">
                      {featuredEvent.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-foreground">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <span className="font-medium text-sm sm:text-base">
                      {featuredEvent.format}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-foreground">
                    <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                    <span className="font-semibold text-base sm:text-lg">
                      {featuredEvent.price}
                    </span>
                  </div>
                </div>

                <div className="w-full">
                  <Button className="w-full h-10 sm:h-12 bg-accent text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-sm sm:text-base">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= ALL EVENTS GRID ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-secondary/30 flex-1">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-6 sm:gap-8">
            {/* MAIN CONTENT - 3 COLUMNS */}
            <div className="lg:col-span-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-1 sm:mb-2">
                    {selectedCategory === "All Events" ? "All Events" : selectedCategory}
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
                    {selectedCategory !== "All Events" && ` in ${selectedCategory}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {selectedCategory !== "All Events" && (
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border-2 w-full sm:w-auto"
                      onClick={() => {
                        setSelectedCategory("All Events");
                        setCurrentPage(1);
                      }}
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                      Clear Filter
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-2 w-full sm:w-auto"
                    onClick={() => setShowFilter(!showFilter)}
                  >
                    <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                    Filter
                  </Button>
                </div>
              </div>

              {showFilter && (
                <div className="mb-6 p-4 bg-card rounded-xl shadow-lg border border-border">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {eventCategories.slice(1).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setShowFilter(false);
                          setCurrentPage(1);
                        }}
                        className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                          selectedCategory === cat
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-secondary text-muted-foreground"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredEvents.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-2">
                    No events found
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    There are no upcoming events in the &quot;{selectedCategory}&quot; category yet.
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedCategory("All Events");
                      setCurrentPage(1);
                    }}
                    className="bg-gradient-to-r from-primary to-accent text-white font-semibold"
                  >
                    View All Events
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {currentEvents
                      .filter(event => !event.featured)
                      .map((event) => (
                        <div
                          key={event.id}
                          onClick={() => handleCardClick(event.slug)}
                          className="group bg-card rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-border cursor-pointer"
                        >
                          {/* DATE BADGE + IMAGE */}
                          <div className="relative h-40 sm:h-48  overflow-hidden bg-gradient-to-br from-muted to-secondary">
                            {event.image !== '/placeholder-event.jpg' ? (
                              <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-fit group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                  <span className="text-white/40 text-5xl font-display">
                                    {event.title.charAt(0)}
                                  </span>
                                </div>
                              </div>
                            )}
                            {/* DATE BADGE */}
                            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 text-center shadow-lg">
                              <div className="text-xs text-muted-foreground font-medium uppercase">
                                {event.month}
                              </div>
                              <div className="text-xl sm:text-2xl font-bold text-foreground">
                                {event.day}
                              </div>
                            </div>
                            {/* FORMAT BADGE */}
                            <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                              <span className="px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-foreground">
                                {event.format.split(' ')[0]}
                              </span>
                            </div>
                          </div>

                          {/* CONTENT */}
                          <div className="p-4 sm:p-6">
                            <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2 sm:mb-3 uppercase">
                              {event.category}
                            </span>

                            <h3 className="text-sm sm:text-base lg:text-lg font-display font-bold text-foreground mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                              {event.title}
                            </h3>

                            <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-5">
                              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="line-clamp-1">{event.date} {event.time && `• ${event.time}`}</span>
                              </div>
                              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="line-clamp-1">{event.location}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border">
                              <span className="text-accent font-bold text-base sm:text-lg">
                                {event.price}
                              </span>
                              <div className="text-primary hover:text-accent group-hover:translate-x-1 transition-all text-xs sm:text-sm p-0 h-auto">
                                Details{" "}
                                <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 inline" />
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
                        Showing {startIndex + 1}-{Math.min(endIndex, filteredEvents.length)} of {filteredEvents.length} events
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

            {/* SIDEBAR - 1 COLUMN */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              {/* TRENDING EVENTS */}
              <div className="bg-card rounded-xl p-5 shadow-lg border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                    Upcoming Soon
                  </h3>
                </div>

                <div className="space-y-4">
                  {filteredTrendingEvents.length > 0 ? (
                    filteredTrendingEvents.map((event, index) => (
                      <div 
                        key={event.id} 
                        onClick={() => handleCardClick(event.slug)}
                        className="block group cursor-pointer pb-4 border-b border-border last:border-0 last:pb-0 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase">
                            {event.category.split(' ')[0]}
                          </span>
                        </div>
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1.5 leading-snug text-sm line-clamp-2">
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{event.month} {event.day}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-muted-foreground text-sm">
                        No upcoming events
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* EVENT CATEGORIES */}
              <div className="bg-gradient-to-br from-secondary/50 to-secondary rounded-xl p-5 border border-border">
                <h3 className="text-base font-display font-bold text-foreground mb-3">
                  Event Categories
                </h3>
                <div className="space-y-2">
                  {eventCategories.slice(1).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                        selectedCategory === cat
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-white/20 text-muted-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTIVE FILTER */}
              {selectedCategory !== "All Events" && (
                <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-display font-bold text-foreground">
                      Active Filter
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedCategory("All Events");
                        setCurrentPage(1);
                      }}
                      className="text-xs text-primary hover:text-accent transition-colors font-medium"
                    >
                      Clear
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Viewing events in:
                  </p>
                  <div className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-semibold text-center shadow-sm">
                    {selectedCategory}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    {filteredEvents.length}{" "}
                    {filteredEvents.length === 1 ? 'event' : 'events'} found
                  </p>
                </div>
              )}

              {/* EVENT TIPS */}
              <div className="bg-card rounded-xl p-5 shadow-lg border border-border">
                <h3 className="text-base font-display font-bold text-foreground mb-3">
                  Event Tips
                </h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Clock className="h-3 w-3 text-accent mt-0.5 flex-shrink-0" />
                    <span>Register early for best rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="h-3 w-3 text-accent mt-0.5 flex-shrink-0" />
                    <span>Network with fellow attendees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Calendar className="h-3 w-3 text-accent mt-0.5 flex-shrink-0" />
                    <span>Add events to your calendar</span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      
        <Cta/>

    </main>
  );
}