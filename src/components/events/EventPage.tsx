"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calendar,
  DollarSign,
  Filter,
  MapPin,
  Menu,
  Users,
  X
} from "lucide-react";
import { useState } from "react";
import Cta from "../common/Cta";
import { PageBanner } from "../PageBanner";

const eventCategories = [
  "All Events",
  "Workshops",
  "Webinars",
  "Networking",
  "Conferences",
  "Seminars",
];

const upcomingEvents = [
  {
    id: 1,
    category: "Conferences",
    title: "Global Women Entrepreneurship Summit 2026",
    description: "Join thousands of women entrepreneurs, investors, and industry leaders at the biggest gathering of the year.",
    date: "Dec 14-20 • 9-11:30 AM",
    location: "Dubai",
    format: "Hybrid (In-person + Virtual)",
    price: "$199 (Early Bird)",
    image: "/event-1.jpg",
    featured: true,
  },
  {
    id: 2,
    category: "Seminars",
    title: "Mastering Digital Marketing for Startups",
    date: "Jan 15 • 6:00 PM - 8:00 PM",
    location: "Online • Zoom",
    format: "Virtual",
    price: "Free",
    featured: false,
  },
  {
    id: 3,
    category: "Workshops",
    title: "Funding Strategies & Pitch Perfection",
    date: "Jan 18 • 2:00 PM - 5:00 PM",
    location: "Mumbai",
    format: "In-person",
    price: "₹499 early",
    featured: false,
  },
  {
    id: 4,
    category: "Networking",
    title: "Women in Tech Networking Evening",
    date: "Jan 20 • 6:00 PM - 9:00 PM",
    location: "Bangalore",
    format: "In-person",
    price: "₹299 early",
    featured: false,
  },
  {
    id: 5,
    category: "Webinars",
    title: "Building a Sustainable Business Model",
    date: "Jan 22 • 7:00 PM - 8:30 PM",
    location: "Online • Zoom",
    format: "Virtual",
    price: "Free",
    featured: false,
  },
  {
    id: 6,
    category: "Conferences",
    title: "Women Leadership Summit 2026",
    date: "Jan 25 • 9:00 AM - 6:00 PM",
    location: "Noida",
    format: "In-person",
    price: "₹1499 early",
    featured: false,
  },
  {
    id: 7,
    category: "Workshops",
    title: "Financial Planning for Entrepreneurs",
    date: "Jan 28 • 10:00 AM - 1:00 PM",
    location: "Online",
    format: "Virtual",
    price: "₹599 early",
    featured: false,
  },
  {
    id: 8,
    category: "Networking",
    title: "Founders & Investors Meetup",
    date: "Feb 1 • 4:00 PM - 7:00 PM",
    location: "Delhi",
    format: "In-person",
    price: "₹399 early",
    featured: false,
  },
  {
    id: 9,
    category: "Seminars",
    title: "Legal Essentials for Startups",
    date: "Feb 5 • 3:00 PM - 5:00 PM",
    location: "Online",
    format: "Virtual",
    price: "Free",
    featured: false,
  },
  {
    id: 10,
    category: "Webinars",
    title: "AI Tools for Small Businesses",
    date: "Feb 8 • 11:00 AM - 12:30 PM",
    location: "Online",
    format: "Virtual",
    price: "Free",
    featured: false,
  },
  {
    id: 11,
    category: "Workshops",
    title: "Brand Building Masterclass",
    date: "Feb 12 • 10:00 AM - 1:00 PM",
    location: "Hyderabad",
    format: "In-person",
    price: "₹699 early",
    featured: false,
  },
  {
    id: 12,
    category: "Conferences",
    title: "Tech Innovation Summit 2026",
    date: "Feb 15 • 9:00 AM - 6:00 PM",
    location: "Bangalore",
    format: "In-person",
    price: "₹1999 early",
    featured: false,
  },
];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Events");
  // const [email, setEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [visibleEvents, setVisibleEvents] = useState(8);

  // Function to filter events based on selected category
  const getFilteredEvents = () => {
    if (selectedCategory === "All Events") {
      return upcomingEvents;
    }
    return upcomingEvents.filter(event => 
      event.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  };

  // Function to check if featured event should be shown
  const shouldShowFeaturedEvent = () => {
    if (selectedCategory === "All Events") return true;
    const featuredEvent = upcomingEvents.find(e => e.featured);
    return featuredEvent && featuredEvent.category.toLowerCase() === selectedCategory.toLowerCase();
  };

  const filteredEvents = getFilteredEvents();
  const showFeaturedEvent = shouldShowFeaturedEvent();
  const featuredEvent = upcomingEvents.find(e => e.featured);

  const loadMoreEvents = () => {
    setVisibleEvents(prev => prev + 4);
  };

  return (
    <main className="bg-background min-h-screen ">
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
                 onClick={() => setSelectedCategory("All News")}
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
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl lg:shadow-2xl border border-primary/10">
              {/* LEFT IMAGE */}
              <div className="relative bg-gradient-to-br from-muted to-secondary min-h-48 sm:min-h-64 lg:min-h-80">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 text-4xl sm:text-5xl lg:text-6xl font-display">
                  Featured
                </div>
              </div>

              {/* RIGHT CONTENT */}
              <div className="p-4 sm:p-6 lg:p-8 xl:p-12 flex flex-col justify-center">
                <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-accent text-white text-xs sm:text-sm font-semibold mb-3 sm:mb-4 w-fit">
                  {featuredEvent.category}
                </span>

                <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-3 sm:mb-4">
                  {featuredEvent.title}
                </h2>

                <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                  {featuredEvent.description}
                </p>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 sm:gap-3 text-foreground">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <span className="font-medium text-sm sm:text-base">
                      {featuredEvent.date}
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
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                    <span className="font-semibold text-base sm:text-lg">
                      {featuredEvent.price}
                    </span>
                  </div>
                </div>

                <Button className="w-full h-10 sm:h-12 bg-accent text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-sm sm:text-base">
                  Register Now
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= ALL EVENTS GRID ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-secondary/30">
        <div className="max-w-screen-xl mx-auto">
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
                  onClick={() => setSelectedCategory("All Events")}
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
                onClick={() => setSelectedCategory("All Events")}
                className="bg-gradient-to-r from-primary to-accent text-white font-semibold"
              >
                View All Events
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredEvents
                  .filter(event => !event.featured)
                  .slice(0, visibleEvents)
                  .map((event) => {
                    const month = event.date.split(" ")[0];
                    const day = event.date.split(" ")[1]?.replace("•", "").trim();

                    return (
                      <div
                        key={event.id}
                        className="group bg-card rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-border"
                      >
                        {/* DATE BADGE + IMAGE */}
                        <div className="relative bg-gradient-to-br from-muted to-secondary h-40 sm:h-48 lg:h-56">
                          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 text-center shadow-lg">
                            <div className="text-xs text-muted-foreground font-medium uppercase">
                              {month}
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-foreground">
                              {day}
                            </div>
                          </div>
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
                              <span>{event.date}</span>
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
                            <Button
                              variant="ghost"
                              className="text-primary hover:text-accent hover:bg-transparent group-hover:translate-x-1 transition-all text-xs sm:text-sm p-0 h-auto"
                            >
                              Register{" "}
                              <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* LOAD MORE - Only show if there are more events to load */}
              {selectedCategory === "All Events" && visibleEvents < filteredEvents.filter(e => !e.featured).length && (
                <div className="text-center mt-8 sm:mt-12">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-6 sm:px-8 text-sm sm:text-base"
                    onClick={loadMoreEvents}
                  >
                    Load More Events
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ================= NEWSLETTER CTA ================= */}
      {/* <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 overflow-hidden hero-gradient">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

        <div className="relative max-w-screen-xl mx-auto text-center text-white px-4">
          <Bell className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 mx-auto mb-4 sm:mb-6 text-white/90" />
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold mb-3 sm:mb-4">
            Never Miss an Event
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto">
            Get event notifications delivered to your inbox
            {selectedCategory !== "All Events" && ` about ${selectedCategory}`}
          </p>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 sm:h-12 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 text-sm sm:text-base"
            />
            <Button className="h-10 sm:h-12 bg-white text-primary hover:bg-white/90 font-semibold px-4 sm:px-8 whitespace-nowrap text-sm sm:text-base">
              Subscribe <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>

          <p className="text-white/70 text-xs sm:text-sm mt-3 sm:mt-4">
            We respect your inbox. Unsubscribe anytime.
          </p>
        </div>
      </section> */}
      <Cta/>
    </main>
  );
}