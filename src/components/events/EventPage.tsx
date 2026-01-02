"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  ArrowRight,
  Bell,
  Menu,
  X,
} from "lucide-react";

const eventCategories = [
  "All Events",
  "Workshops",
  "Webinars",
  "Networking",
  "Conferences",
];

const upcomingEvents = [
  {
    id: 1,
    category: "CONFERENCE",
    title: "Global Women Entrepreneurship Summit 2026",
    description:
      "Join thousands of women entrepreneurs, investors, and industry leaders at the biggest gathering of the year.",
    date: "Dec 14-20 • 9-11:30 AM",
    location: "Dubai",
    format: "Hybrid (In-person + Virtual)",
    price: "$199 (Early Bird)",
    image: "/event-1.jpg",
    featured: true,
  },
  {
    id: 2,
    category: "SEMINAR",
    title: "Mastering Digital Marketing for Startups",
    date: "Jan 15 • 6:00 PM - 8:00 PM",
    location: "Online • Zoom",
    price: "Free",
  },
  {
    id: 3,
    category: "WORKSHOP",
    title: "Funding Strategies & Pitch Perfection",
    date: "Jan 18 • 2:00 PM - 5:00 PM",
    location: "Mumbai",
    price: "₹499 early",
  },
  {
    id: 4,
    category: "NETWORKING",
    title: "Women in Tech Networking Evening",
    date: "Jan 20 • 6:00 PM - 9:00 PM",
    location: "Bangalore",
    price: "₹299 early",
  },
  {
    id: 5,
    category: "WEBINAR",
    title: "Building a Sustainable Business Model",
    date: "Jan 22 • 7:00 PM - 8:30 PM",
    location: "Online • Zoom",
    price: "Free",
  },
  {
    id: 6,
    category: "CONFERENCE",
    title: "Women Leadership Summit 2026",
    date: "Jan 25 • 9:00 AM - 6:00 PM",
    location: "Noida",
    price: "₹1499 early",
  },
  {
    id: 7,
    category: "WORKSHOP",
    title: "Financial Planning for Entrepreneurs",
    date: "Jan 28 • 10:00 AM - 1:00 PM",
    location: "Online",
    price: "₹599 early",
  },
];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Events");
  const [email, setEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const featuredEvent = upcomingEvents.find((e) => e.featured);
  const regularEvents = upcomingEvents.filter((e) => !e.featured);

  return (
    <main className="bg-background min-h-screen pt-20 sm:pt-24">
      {/* ================= HERO SECTION WITH FIXED ASPECT RATIO ================= */}
      <section className="relative w-full">
        {/* Fixed aspect ratio container - same as NewsPage */}
        <div className="relative w-full aspect-[5/1] overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
          
          {/* Content container */}
          <div className="relative h-full w-full mx-auto flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center text-white">
            <div className="max-w-6xl w-full">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 px-2 sm:px-0">
                Upcoming Events
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 max-w-4xl mx-auto px-4 sm:px-8 lg:px-0">
                Join workshops, webinars and networking opportunities designed to empower and inspire
              </p>

              {/* MOBILE CATEGORY MENU TOGGLE */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  className="bg-white/20 text-white border-white/30"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                  Categories
                </Button>
              </div>

              {/* CATEGORY FILTERS */}
              <div
                className={`${
                  mobileMenuOpen ? "block" : "hidden lg:flex"
                } flex-col lg:flex-row flex-wrap justify-center gap-2 sm:gap-3 px-4 lg:px-0 mb-5`}
              >
                {eventCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                      selectedCategory === cat
                        ? "bg-white text-primary shadow-lg scale-105"
                        : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED EVENT ================= */}
      {featuredEvent && (
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 ">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl lg:shadow-2xl border border-primary/10">
              {/* LEFT IMAGE */}
              <div className="relative bg-gradient-to-br from-muted to-secondary min-h-48 sm:min-h-64 lg:min-h-80">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 text-4xl sm:text-5xl lg:text-6xl font-display">
                  Event Image
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
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-2 sm:mb-3">
              Upcoming Events
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
              Don&apos;t miss these 200+ exciting events that we have curated
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {regularEvents.map((event) => {
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
                  </div>

                  {/* CONTENT */}
                  <div className="p-4 sm:p-6">
                    <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-accent text-white text-xs sm:text-xs font-semibold mb-2  w-fit">
                      {event.category}
                    </span>

                    <h3 className="text-sm sm:text-base lg:text-lg font-display font-bold text-foreground mb-3 sm:mb-4 line-clamp-2 group-hover:text-primary transition-colors">
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
        </div>
      </section>

      {/* ================= NEWSLETTER CTA ================= */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 overflow-hidden hero-gradient">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

        <div className="relative max-w-screen-xl mx-auto text-center text-white px-4">
          <Bell className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 mx-auto mb-4 sm:mb-6 text-white/90" />
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold mb-3 sm:mb-4">
            Never Miss an Event
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto">
            Get event notifications delivered to your inbox
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
      </section>
    </main>
  );
}