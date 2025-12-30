"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Clock,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

const newsCategories = [
  "All News",
  "Funding",
  "Awards",
  "Launches",
  "Partnerships",
  "Success Stories",
  "Industry Trends",
  "Policy Updates",
];

const featuredNews = {
  category: "FUNDING",
  title: "Women-Led Startups Raise Record $2.5B in Q4 2024",
  excerpt:
    "Female entrepreneurs shattered funding records this quarter, with significant investments across tech, healthcare, and sustainable business sectors.",
  date: "Dec 27, 2024",
  readTime: "4 min read",
  image: "/news-featured.jpg",
  source: "TechCrunch",
};

const breakingNews = [
  {
    title: "New Government Initiative Supports Women Entrepreneurs",
    date: "2 hours ago",
    category: "Policy",
  },
  {
    title: "Forbes Announces Top 50 Women Leaders of 2024",
    date: "5 hours ago",
    category: "Awards",
  },
  {
    title: "Female-Founded Fintech Unicorn Goes Public",
    date: "1 day ago",
    category: "Funding",
  },
];

const newsArticles = [
  {
    id: 1,
    category: "AWARDS",
    title: "Celebrating Women Who Changed the Business Landscape in 2024",
    excerpt:
      "From breakthrough innovations to billion-dollar exits, these women entrepreneurs made history this year.",
    date: "Dec 26, 2024",
    readTime: "6 min read",
    source: "Forbes",
  },
  {
    id: 2,
    category: "LAUNCHES",
    title: "Revolutionary EdTech Platform by Women Founders Debuts",
    excerpt:
      "A game-changing education technology platform aims to democratize learning for millions globally.",
    date: "Dec 25, 2024",
    readTime: "5 min read",
    source: "VentureBeat",
  },
  {
    id: 3,
    category: "PARTNERSHIPS",
    title: "Major Corporations Commit to Supporting Women-Owned Businesses",
    excerpt:
      "Fortune 500 companies announce new initiatives to increase procurement from women entrepreneurs.",
    date: "Dec 24, 2024",
    readTime: "4 min read",
    source: "Bloomberg",
  },
  {
    id: 4,
    category: "SUCCESS STORY",
    title: "From Garage Startup to $100M Company: An Inspiring Journey",
    excerpt:
      "How one woman turned her side hustle into a thriving enterprise that's reshaping the beauty industry.",
    date: "Dec 23, 2024",
    readTime: "7 min read",
    source: "Entrepreneur",
  },
  {
    id: 5,
    category: "INDUSTRY TRENDS",
    title: "AI and Women Entrepreneurs: The Next Frontier",
    excerpt:
      "Female founders are leading the charge in artificial intelligence innovation and ethical AI development.",
    date: "Dec 22, 2024",
    readTime: "6 min read",
    source: "MIT Review",
  },
  {
    id: 6,
    category: "FUNDING",
    title: "Record Number of Women-Led Startups Secure Seed Funding",
    excerpt:
      "2024 sees unprecedented growth in early-stage funding for female entrepreneurs across all sectors.",
    date: "Dec 21, 2024",
    readTime: "5 min read",
    source: "Crunchbase",
  },
  {
    id: 7,
    category: "POLICY",
    title: "New Tax Incentives for Women-Owned Small Businesses",
    excerpt:
      "Government announces comprehensive support package to boost women entrepreneurship nationwide.",
    date: "Dec 20, 2024",
    readTime: "4 min read",
    source: "Reuters",
  },
  {
    id: 8,
    category: "LAUNCHES",
    title: "Sustainable Fashion Brand by Female Founders Breaks Records",
    excerpt:
      "Eco-conscious clothing line achieves $10M in first-year sales, proving sustainability sells.",
    date: "Dec 19, 2024",
    readTime: "5 min read",
    source: "WWD",
  },
  {
    id: 9,
    category: "PARTNERSHIPS",
    title: "Global Accelerator Program Opens for Women Entrepreneurs",
    excerpt:
      "Leading venture capital firms launch exclusive program to support high-potential female founders.",
    date: "Dec 18, 2024",
    readTime: "6 min read",
    source: "TechCrunch",
  },
];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All News");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="bg-background min-h-screen pt-20 sm:pt-14">
      {/* ================= HERO WITH GRADIENT ================= */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 overflow-hidden hero-gradient">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />

        <div className="relative w-full mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4 sm:mb-6">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
            Latest Updates
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 px-2 sm:px-0">
            Women in Business News
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 max-w-4xl mx-auto px-4 sm:px-8 lg:px-0">
            Stay informed with the latest news, insights, and success stories
            from women entrepreneurs worldwide
          </p>

          {/* SEARCH BAR */}
          <div className="w-full max-w-5xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-white/60" />
              <Input
                type="text"
                placeholder="Search news articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 sm:h-14 pl-10 sm:pl-12 pr-4 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 rounded-xl sm:rounded-2xl text-sm sm:text-lg w-full"
              />
            </div>
          </div>

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
            } flex-col lg:flex-row flex-wrap justify-center gap-2 sm:gap-3 px-4 lg:px-0`}
          >
            {newsCategories.map((cat) => (
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
      </section>

      {/* ================= BREAKING NEWS TICKER ================= */}
      <section className="bg-accent text-white py-2 sm:py-3 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
          <div className="flex items-center gap-2 shrink-0 font-bold uppercase text-xs sm:text-sm">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Breaking
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap">
              {breakingNews.map((news, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 sm:px-8 text-xs sm:text-sm"
                >
                  <span className="font-medium truncate max-w-50 sm:max-w-none">
                    {news.title}
                  </span>
                  <span className="text-white/70 hidden sm:inline">
                    • {news.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED NEWS + SIDEBAR ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 bg-secondary/30">
        <div className="w-full mx-auto grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* FEATURED - 2 COLUMNS */}
          <div className="lg:col-span-2">
            <div className="group bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-primary/10">
              {/* FEATURED BADGE */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-gradient-to-r from-accent to-accent/80 text-white text-xs font-bold uppercase shadow-lg">
                  Featured Story
                </span>
              </div>

              {/* IMAGE */}
              <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 h-48 sm:h-64 lg:h-80">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 text-4xl sm:text-5xl lg:text-6xl font-display">
                  Featured
                </div>
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

                <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-display font-bold text-foreground mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                  {featuredNews.title}
                </h2>

                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
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
                  </div>

                  <Button className="bg-primary hover:bg-primary/90 group text-sm sm:text-base w-full sm:w-auto">
                    Read Full Story
                    <ExternalLink className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR - LATEST HEADLINES */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 shadow-lg border border-border lg:sticky lg:top-24">
              <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                Latest Headlines
              </h3>

              <div className="space-y-3 sm:space-y-4">
                {newsArticles.slice(0, 5).map((news, i) => (
                  <div
                    key={i}
                    className="group cursor-pointer pb-3 sm:pb-4 border-b border-border last:border-0 last:pb-0"
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

              <Button
                variant="ghost"
                className="w-full mt-3 sm:mt-4 text-primary hover:bg-primary/10 text-sm"
              >
                View All News{" "}
                <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ALL NEWS GRID ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="w-full mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-1 sm:mb-2">
                All News Articles
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {newsArticles.length} articles found
              </p>
            </div>

            <Button
              variant="outline"
              className="flex items-center gap-2 border-2 w-full sm:w-auto"
            >
              <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
              Filter
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {newsArticles.map((news) => (
              <div
                key={news.id}
                className="group bg-card rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-border"
              >
                {/* IMAGE */}
                <div className="relative bg-gradient-to-br from-muted to-secondary h-40 sm:h-48 lg:h-56">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 text-3xl sm:text-4xl font-display">
                    News
                  </div>

                  {/* SOURCE BADGE */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                    <span className="px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-foreground">
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
                    <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span>{news.date}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-accent hover:bg-transparent group-hover:translate-x-1 transition-all p-0 h-auto text-xs sm:text-sm"
                    >
                      Read{" "}
                      <ArrowRight className="ml-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* LOAD MORE */}
          <div className="text-center mt-8 sm:mt-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all px-6 sm:px-8 text-sm sm:text-base"
            >
              Load More Articles
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ================= NEWSLETTER SECTION ================= */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 overflow-hidden hero-gradient">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

        <div className="relative w-full mx-auto text-center text-white px-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold mb-3 sm:mb-4">
            Get News Delivered Daily
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto">
            Subscribe to our newsletter for the latest updates on women in
            business
          </p>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-md mx-auto mb-4 sm:mb-6">
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-10 sm:h-12 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 text-sm sm:text-base"
            />
            <Button className="h-10 sm:h-12 bg-white text-primary hover:bg-white/90 font-semibold px-4 sm:px-8 whitespace-nowrap text-sm sm:text-base">
              Subscribe <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>

          <p className="text-white/70 text-xs sm:text-sm">
            Daily updates • Unsubscribe anytime
          </p>
        </div>
      </section>
    </main>
  );
}
