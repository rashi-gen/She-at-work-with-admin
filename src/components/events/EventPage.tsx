// /components/events/EventsPage.tsx
"use client";

import { Button } from "@/components/ui/button";
import { eventsData } from "@/data/events";
import { openEventRegistrationEmail } from "@/hooks/Emailutils";
import {
  ArrowRight,
  Calendar,
  Clock,
  Filter,
  IndianRupee,
  Mail,
  MapPin,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cta from "../common/Cta";
import { PageBanner } from "../PageBanner";

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

// Event categories
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
  "Other Events",
];

// Extract categories from content
const getCategoryFromContent = (content: string): string => {
  const contentLower = content.toLowerCase();
  if (
    contentLower.includes("summit") ||
    contentLower.includes("conference") ||
    contentLower.includes("annual") ||
    contentLower.includes("global")
  )
    return "Conferences";
  if (
    contentLower.includes("workshop") ||
    contentLower.includes("masterclass") ||
    contentLower.includes("training") ||
    contentLower.includes("session")
  )
    return "Workshops";
  if (
    contentLower.includes("webinar") ||
    contentLower.includes("online") ||
    contentLower.includes("virtual") ||
    contentLower.includes("zoom")
  )
    return "Webinars";
  if (
    contentLower.includes("networking") ||
    contentLower.includes("meetup") ||
    contentLower.includes("gathering") ||
    contentLower.includes("meeting")
  )
    return "Networking";
  if (
    contentLower.includes("seminar") ||
    contentLower.includes("talk") ||
    contentLower.includes("lecture") ||
    contentLower.includes("presentation")
  )
    return "Seminars";
  if (
    contentLower.includes("dialogue") ||
    contentLower.includes("forum") ||
    contentLower.includes("discussion") ||
    contentLower.includes("panel")
  )
    return "Forums";
  if (
    contentLower.includes("launch") ||
    contentLower.includes("inauguration") ||
    contentLower.includes("unveil") ||
    contentLower.includes("initiative")
  )
    return "Launches";
  if (
    contentLower.includes("award") ||
    contentLower.includes("ceremony") ||
    contentLower.includes("felicitation") ||
    contentLower.includes("recognition")
  )
    return "Awards";
  if (
    contentLower.includes("festival") ||
    contentLower.includes("celebration") ||
    contentLower.includes("day") ||
    contentLower.includes("international")
  )
    return "Festivals";
  return "Other Events";
};

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
  if (!content) return "No description available";

  try {
    // Remove HTML tags
    const plainText = content.replace(/<[^>]*>/g, "");
    // Remove newlines and extra spaces
    const cleanText = plainText.replace(/\s+/g, " ").trim();

    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + "...";
  } catch (error) {
    console.warn("Error extracting excerpt:", error);
    return "No description available";
  }
};

// Improved location extraction
const extractLocation = (content: string): string => {
  const contentLower = content.toLowerCase();

  const knownLocations = [
    { keyword: "rio de janeiro", location: "Rio de Janeiro, Brazil" },
    { keyword: "iit delhi", location: "IIT Delhi, India" },
    { keyword: "india", location: "India" },
    { keyword: "brazil", location: "Brazil" },
    { keyword: "haryana", location: "Haryana, India" },
    { keyword: "punjab", location: "Punjab, India" },
    { keyword: "rajasthan", location: "Rajasthan, India" },
    { keyword: "delhi", location: "Delhi, India" },
  ];

  for (const knownLoc of knownLocations) {
    if (contentLower.includes(knownLoc.keyword)) {
      return knownLoc.location;
    }
  }

  const locationPatterns = [
    /in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
    /at\s+(?:the\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
    /([A-Z][a-z]+\s+[A-Z][a-z]+),\s+[A-Z][a-z]+/g,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Conference|Summit|Dialogue|Event)/gi,
  ];

  for (const pattern of locationPatterns) {
    const matches = [...content.matchAll(pattern)];
    for (const match of matches) {
      if (match[1]) {
        const location = match[1].trim();
        const falsePositives = [
          "The",
          "This",
          "Our",
          "Global",
          "Annual",
          "International",
          "Flagship",
          "Third",
          "3rd",
          "Second",
          "2nd",
          "First",
          "Finale",
          "Grand",
          "Youth",
          "College",
          "Programme",
        ];
        if (
          !falsePositives.some((fp) =>
            location.toLowerCase().startsWith(fp.toLowerCase()),
          )
        ) {
          if (location.toLowerCase().includes("rio"))
            return "Rio de Janeiro, Brazil";
          if (location.toLowerCase().includes("delhi")) return "Delhi, India";
          return location;
        }
      }
    }
  }

  if (
    contentLower.includes("online") ||
    contentLower.includes("virtual") ||
    contentLower.includes("zoom") ||
    contentLower.includes("webinar") ||
    contentLower.includes("digital")
  ) {
    return "Online";
  }

  if (contentLower.includes("apply") && contentLower.includes("link")) {
    return "Online / Application-based";
  }

  return "Location TBD";
};

// Improved date extraction
const extractDateDetails = (
  content: string,
  postDate: string,
): { date: string; time?: string } => {
  const datePatterns = [
    /([A-Z][a-z]+(?:\s+\d+)?(?:\s+to\s+\d+)?(?:\s*,\s*\d{4})?)/gi,
    /(\d+(?:\s+to\s+\d+)?\s+[A-Z][a-z]+\s+\d{4})/gi,
    /(\d+(?:st|nd|rd|th)?\s+[A-Z][a-z]+\s+\d{4})/gi,
    /([A-Z][a-z]+\s+\d{4})/gi,
    /apply\s+by\s+(\d+(?:st|nd|rd|th)?\s+[A-Z][a-z]+\s+\d{4})/gi,
  ];

  const cleanOrdinals = (dateStr: string): string => {
    return dateStr.replace(/(\d+)(?:st|nd|rd|th)\b/gi, "$1");
  };

  for (const pattern of datePatterns) {
    const matches = [...content.matchAll(pattern)];
    for (const match of matches) {
      if (match[1]) {
        let dateStr = match[1].trim();
        if (/^[A-Z][a-z]+$/.test(dateStr)) continue;

        if (dateStr.includes("to")) {
          const startDateMatch = dateStr.match(/([A-Z][a-z]+(?:\s+\d+)?)/);
          if (startDateMatch && startDateMatch[1]) {
            dateStr = startDateMatch[1] + (dateStr.match(/(\d{4})/)?.[0] || "");
          }
        }

        dateStr = cleanOrdinals(dateStr);

        if (!dateStr.match(/\d{4}/)) {
          const year = postDate.substring(0, 4);
          dateStr += `, ${year}`;
        }

        return { date: dateStr };
      }
    }
  }

  try {
    const date = new Date(postDate);
    if (!isNaN(date.getTime())) {
      return {
        date: date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };
    }
  } catch (error) {
    console.log("Error parsing fallback date:", error);
  }

  return { date: "Date TBD" };
};

// Improved price extraction
const extractPrice = (content: string): string => {
  const contentLower = content.toLowerCase();

  if (
    contentLower.includes("free") ||
    contentLower.includes("complimentary") ||
    contentLower.includes("no cost") ||
    contentLower.includes("no charge") ||
    contentLower.includes("fully funded") ||
    contentLower.includes("fully sponsored") ||
    contentLower.includes("merit certificates") ||
    contentLower.includes("participation certificate")
  ) {
    return "Free";
  }

  const pricePatterns = [
    /₹\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
    /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:INR|rupees?)/gi,
    /Rs\.?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
    /₹\s*(\d+)/gi,
    /Rs\.?\s*(\d+)/gi,
    /\$\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
    /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:USD|dollars?)/gi,
    /entry\s+fee[:\s]*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
    /price[:\s]*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
    /cost[:\s]*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
    /fee[:\s]*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
  ];

  for (const pattern of pricePatterns) {
    const matches = [...content.matchAll(pattern)];
    for (const match of matches) {
      if (match[1]) {
        const amount = match[1];
        if (
          pattern.toString().includes("₹") ||
          pattern.toString().includes("INR") ||
          pattern.toString().includes("Rs")
        ) {
          return `₹${amount}`;
        } else if (
          pattern.toString().includes("$") ||
          pattern.toString().includes("USD")
        ) {
          return `$${amount}`;
        }
        return amount;
      }
    }
  }

  const prizePattern =
    /prize\s+of\s+(?:Rs\.?\s*)?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi;
  const prizeMatch = prizePattern.exec(content);
  if (prizeMatch && prizeMatch[1]) {
    return `₹${prizeMatch[1]} (Prize)`;
  }

  const lakhPattern = /(\d+)\s+lakh/gi;
  const lakhMatch = lakhPattern.exec(content);
  if (lakhMatch && lakhMatch[1]) {
    const lakhs = parseInt(lakhMatch[1]);
    const amount = lakhs * 100000;
    return `₹${amount.toLocaleString()}`;
  }

  return "Contact for details";
};

// Improved format detection
const extractFormat = (content: string): string => {
  const contentLower = content.toLowerCase();

  if (
    (contentLower.includes("online") ||
      contentLower.includes("virtual") ||
      contentLower.includes("zoom") ||
      contentLower.includes("webinar") ||
      contentLower.includes("digital conference")) &&
    !contentLower.includes("in-person") &&
    !contentLower.includes("physical venue")
  ) {
    return "Virtual";
  }

  if (
    (contentLower.includes("in-person") ||
      contentLower.includes("physical") ||
      contentLower.includes("venue") ||
      contentLower.includes("attended") ||
      contentLower.includes("hosted at") ||
      contentLower.includes("held at") ||
      contentLower.includes("gathering") ||
      contentLower.includes("summit") ||
      contentLower.includes("conference") ||
      contentLower.includes("dialogue")) &&
    !contentLower.includes("online") &&
    !contentLower.includes("virtual")
  ) {
    return "In-person";
  }

  if (
    contentLower.includes("hybrid") ||
    (contentLower.includes("online") && contentLower.includes("in-person")) ||
    (contentLower.includes("virtual") && contentLower.includes("physical"))
  ) {
    return "Hybrid";
  }

  if (
    contentLower.includes("summit") ||
    contentLower.includes("conference") ||
    contentLower.includes("annual plenary") ||
    contentLower.includes("dialogue")
  ) {
    return "In-person";
  }

  if (
    contentLower.includes("webinar") ||
    contentLower.includes("online session") ||
    contentLower.includes("virtual workshop") ||
    contentLower.includes("digital")
  ) {
    return "Virtual";
  }

  if (
    contentLower.includes("application") ||
    contentLower.includes("apply") ||
    contentLower.includes("programme") ||
    contentLower.includes("program")
  ) {
    return "Application-based";
  }

  return "Format TBD";
};

// Helper function to parse dates for month/day display
const parseDateForDisplay = (
  dateString: string,
  fallbackDate?: string,
): { month: string; day: string } => {
  try {
    let dateToParse = dateString;

    if (dateString.includes("TBD") || dateString.includes("unavailable")) {
      dateToParse = fallbackDate || new Date().toISOString();
    }

    dateToParse = dateToParse
      .replace(/(\d+)(?:st|nd|rd|th)\b/gi, "$1")
      .replace(/\s+to\s+\d+/gi, "")
      .replace(/apply by\s+/gi, "")
      .replace(/,\s*(\d{4})/gi, "")
      .trim();

    let parsedDate: Date;

    const monthNames = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    const monthMatch = monthNames.find((month) =>
      dateToParse.toLowerCase().includes(month),
    );

    if (monthMatch) {
      const monthIndex = monthNames.indexOf(monthMatch);
      parsedDate = new Date();
      parsedDate.setMonth(monthIndex);
      parsedDate.setDate(15);
    } else {
      parsedDate = new Date(dateToParse);
      if (isNaN(parsedDate.getTime())) {
        parsedDate = new Date();
      }
    }

    return {
      month: parsedDate.toLocaleDateString("en-US", { month: "short" }),
      day: parsedDate.getDate().toString(),
    };
  } catch (error) {
    console.log("Error parsing date for display:", error);
    return { month: "TBD", day: "?" };
  }
};

const ITEMS_PER_PAGE = 12;

interface ProcessedEvent {
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
  postDate: string;
}

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Events");
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [processedEvents, setProcessedEvents] = useState<ProcessedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const processEvents = () => {
      try {
        setIsLoading(true);

        const processed = eventsData.map((item: EventItem, index: number) => {
          const category = getCategoryFromContent(item.post_content);
          const description =
            item.post_excerpt && item.post_excerpt.trim() !== ""
              ? item.post_excerpt
              : extractExcerpt(item.post_content);

          const title = item.post_title
            ? item.post_title.replace(/&amp;/g, "&")
            : "Upcoming Event";
          const location = extractLocation(item.post_content);
          const format = extractFormat(item.post_content);
          const price = extractPrice(item.post_content);

          const { date, time } = extractDateDetails(
            item.post_content,
            item.post_date,
          );

          const { month, day } = parseDateForDisplay(date, item.post_date);

          const image =
            item.featured_image_url && item.featured_image_url.trim() !== ""
              ? item.featured_image_url
              : "/placeholder-event.jpg";

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
            fullContent: item.post_content || "",
            modifiedDate: item.post_modified
              ? formatDate(item.post_modified)
              : undefined,
            slug: item.post_name || `event-${item.ID}`,
            featured,
            month,
            day,
            postDate: item.post_date,
          };
        });

        processed.sort((a, b) => {
          try {
            const parseForComparison = (dateStr: string): Date => {
              if (dateStr.includes("TBD") || dateStr.includes("unavailable")) {
                return new Date("2100-01-01");
              }

              const yearMatch = dateStr.match(/(\d{4})/);
              if (yearMatch) {
                const year = parseInt(yearMatch[1]);
                const monthMatch = dateStr.match(/[A-Z][a-z]+/);
                if (monthMatch) {
                  const monthStr = monthMatch[0].toLowerCase();
                  const months = [
                    "january",
                    "february",
                    "march",
                    "april",
                    "may",
                    "june",
                    "july",
                    "august",
                    "september",
                    "october",
                    "november",
                    "december",
                  ];
                  const monthIndex = months.findIndex((m) =>
                    monthStr.includes(m),
                  );
                  if (monthIndex !== -1) {
                    return new Date(year, monthIndex, 15);
                  }
                }
              }

              return new Date(a.postDate) || new Date("2100-01-01");
            };

            const dateA = parseForComparison(a.date);
            const dateB = parseForComparison(b.date);

            return dateB.getTime() - dateA.getTime();
          } catch (error) {
            console.log(error);
            return 0;
          }
        });

        if (processed.length > 0) {
          processed.forEach((event, index) => {
            event.featured = index === 0;
          });
        }

        setProcessedEvents(processed);
      } catch (error) {
        console.error("Error processing events data:", error);
        setProcessedEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    processEvents();
  }, []);

  const featuredEvent =
    processedEvents.length > 0 ? processedEvents.find((e) => e.featured) : null;
  const trendingEvents = processedEvents.slice(0, 4);

  const getFilteredEvents = () => {
    if (selectedCategory === "All Events") return processedEvents;
    return processedEvents.filter(
      (event) =>
        event.category.toLowerCase() === selectedCategory.toLowerCase(),
    );
  };

  const shouldShowFeaturedEvent = () => {
    if (!featuredEvent || selectedCategory === "All Events") return true;
    return (
      featuredEvent.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  };

  const filteredEvents = getFilteredEvents();
  const showFeaturedEvent = shouldShowFeaturedEvent();

  const getFilteredTrendingEvents = () => {
    if (selectedCategory === "All Events") return trendingEvents;
    return trendingEvents
      .filter(
        (event) =>
          event.category.toLowerCase() === selectedCategory.toLowerCase(),
      )
      .slice(0, 4);
  };

  const filteredTrendingEvents = getFilteredTrendingEvents();

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCardClick = (slug: string) => {
    router.push(`/events/${slug}`);
  };

  const handleContactClick = (event: ProcessedEvent, e: React.MouseEvent) => {
    e.stopPropagation();

    openEventRegistrationEmail({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      format: event.format,
      price: event.price,
      category: event.category,
    });
  };

  if (isLoading) {
    return (
      <main className="bg-background min-h-screen">
        <PageBanner
          title="Events"
          description="Join workshops, webinars and networking opportunities designed to empower and inspire"
          image="/FinalEventsbanner.png"
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
      <section className={`relative h-[470px] overflow-hidden pt-24`}>
        {/* Background Image */}
        <div className="absolute inset-0" style={{ top: "96px" }}>
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(/FinalEventsbanner.png)`,
              backgroundPosition: "center center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          />
          {/* Overlay for better text readability */}
          {/* <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" /> */}
        </div>

        {/* Content - Left aligned */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl px-4 sm:px-6 lg:px-8">
              {/* Title */}
              <h1 className="text-white leading-tight">
                <span className="block text-3xl sm:text-4xl lg:text-6xl font-bold sm:font-bold ">
                  Events
                </span>
              </h1>

              {/* Description */}

              <p className="mt-4 mb-4 sm:mt-6 text-md sm:text-base md:text-xl text-white/90 leading-relaxed max-w-3xl">
                Stay updated on workshops, webinars, conferences, and networking
                events designed to support women entrepreneurs at every stage.
                Discover opportunities for learning, mentoring, funding access,
                and meaningful connections that help you grow your business and
                become part of a stronger women-led ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED EVENT ================= */}
      {showFeaturedEvent && featuredEvent && (
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid lg:grid-cols-[65%_35%] bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl lg:shadow-2xl border border-primary/10 hover:shadow-2xl transition-shadow duration-300">
              <div className="relative min-h-48 sm:min-h-64 overflow-hidden bg-gradient-to-br from-muted to-secondary">
                {featuredEvent.image !== "/placeholder-event.jpg" ? (
                  <Image
                    src="/Evventssmallbanner.png"
                    alt={featuredEvent.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
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
              </div>

              <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
                <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-3 sm:mb-4 w-fit">
                  {featuredEvent.category}
                </span>

                <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-3 sm:mb-4">
                  {featuredEvent.title}
                </h2>

                <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 leading-relaxed line-clamp-3">
                  {featuredEvent.description}
                </p>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 sm:gap-3 text-foreground">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <span className="font-medium text-sm sm:text-base">
                      {featuredEvent.date}{" "}
                      {featuredEvent.time && `• ${featuredEvent.time}`}
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

                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button
                    onClick={() => handleCardClick(featuredEvent.slug)}
                    variant="outline"
                    className="h-10 sm:h-12 border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all text-sm sm:text-base"
                  >
                    View Details
                  </Button>
                  <Button
                    onClick={(e) => handleContactClick(featuredEvent, e)}
                    className="h-10 sm:h-12 bg-accent text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-sm sm:text-base"
                  >
                    <Mail className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Contact
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
            <div className="lg:col-span-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-1 sm:mb-2">
                    {selectedCategory === "All Events"
                      ? "All Events"
                      : selectedCategory}
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {filteredEvents.length}{" "}
                    {filteredEvents.length === 1 ? "event" : "events"} found
                    {selectedCategory !== "All Events" &&
                      ` in ${selectedCategory}`}
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
                    There are no upcoming events in the &quot;{selectedCategory}
                    &quot; category yet.
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
                      .filter((event) => !event.featured)
                      .map((event) => (
                        <div
                          key={event.id}
                          className="group bg-card rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-border"
                        >
                          <div
                            onClick={() => handleCardClick(event.slug)}
                            className="relative h-40 sm:h-44 overflow-hidden bg-gradient-to-br from-muted to-secondary cursor-pointer"
                          >
                            {event.image !== "/placeholder-event.jpg" ? (
                              <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
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
                            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 text-center shadow-lg">
                              <div className="text-xs text-muted-foreground font-medium uppercase">
                                {event.month}
                              </div>
                              <div className="text-xl sm:text-2xl font-bold text-foreground">
                                {event.day}
                              </div>
                            </div>
                            <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                              <span className="px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-foreground">
                                {event.format.split(" ")[0]}
                              </span>
                            </div>
                          </div>

                          <div className="p-4 sm:p-6">
                            <div
                              onClick={() => handleCardClick(event.slug)}
                              className="cursor-pointer"
                            >
                              <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2 sm:mb-3 uppercase">
                                {event.category}
                              </span>

                              <h3 className="text-sm sm:text-base lg:text-lg font-display font-bold text-foreground mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                {event.title}
                              </h3>
                            </div>

                            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border">
                              <div className="flex gap-2">
                                <Button
                                  onClick={(e) => handleContactClick(event, e)}
                                  size="sm"
                                  variant="outline"
                                  className="border-primary text-primary hover:bg-primary hover:text-white"
                                >
                                  <Mail className="mr-1 h-3 w-3" />
                                  Contact
                                </Button>
                                <Button
                                  onClick={() => handleCardClick(event.slug)}
                                  size="sm"
                                  className="bg-primary hover:bg-primary/90 text-white"
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 sm:mt-12 pt-8 border-t border-border">
                      <div className="text-sm text-muted-foreground">
                        Showing {startIndex + 1}-
                        {Math.min(endIndex, filteredEvents.length)} of{" "}
                        {filteredEvents.length} events
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
                                    currentPage === pageNum
                                      ? "default"
                                      : "outline"
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

            {/* SIDEBAR */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
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
                            {event.category.split(" ")[0]}
                          </span>
                        </div>
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1.5 leading-snug text-sm line-clamp-2">
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {event.month} {event.day}
                          </span>
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
                    {filteredEvents.length === 1 ? "event" : "events"} found
                  </p>
                </div>
              )}

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

      <Cta />
    </main>
  );
}
