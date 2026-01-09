"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  ExternalLink,
  Filter,
  Menu,
  TrendingUp,
  X
} from "lucide-react";
import { useState } from "react";

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
  id: 0,
  category: "FUNDING",
  title: "Women-Led Startups Raise Record $2.5B in Q4 2024",
  excerpt: "Female entrepreneurs shattered funding records this quarter, with significant investments across tech, healthcare, and sustainable business sectors.",
  date: "Dec 27, 2024",
  readTime: "4 min read",
  image: "/news-featured.jpg",
  source: "TechCrunch",
};

const newsArticles = [
  {
    id: 1,
    category: "AWARDS",
    title: "Celebrating Women Who Changed the Business Landscape in 2024",
    excerpt: "From breakthrough innovations to billion-dollar exits, these women entrepreneurs made history this year.",
    date: "Dec 26, 2024",
    readTime: "6 min read",
    source: "Forbes",
  },
  {
    id: 2,
    category: "LAUNCHES",
    title: "Revolutionary EdTech Platform by Women Founders Debuts",
    excerpt: "A game-changing education technology platform aims to democratize learning for millions globally.",
    date: "Dec 25, 2024",
    readTime: "5 min read",
    source: "VentureBeat",
  },
  {
    id: 3,
    category: "PARTNERSHIPS",
    title: "Major Corporations Commit to Supporting Women-Owned Businesses",
    excerpt: "Fortune 500 companies announce new initiatives to increase procurement from women entrepreneurs.",
    date: "Dec 24, 2024",
    readTime: "4 min read",
    source: "Bloomberg",
  },
  {
    id: 4,
    category: "SUCCESS STORIES",
    title: "From Garage Startup to $100M Company: An Inspiring Journey",
    excerpt: "How one woman turned her side hustle into a thriving enterprise that's reshaping the beauty industry.",
    date: "Dec 23, 2024",
    readTime: "7 min read",
    source: "Entrepreneur",
  },
  {
    id: 5,
    category: "INDUSTRY TRENDS",
    title: "AI and Women Entrepreneurs: The Next Frontier",
    excerpt: "Female founders are leading the charge in artificial intelligence innovation and ethical AI development.",
    date: "Dec 22, 2024",
    readTime: "6 min read",
    source: "MIT Review",
  },
  {
    id: 6,
    category: "FUNDING",
    title: "Record Number of Women-Led Startups Secure Seed Funding",
    excerpt: "2024 sees unprecedented growth in early-stage funding for female entrepreneurs across all sectors.",
    date: "Dec 21, 2024",
    readTime: "5 min read",
    source: "Crunchbase",
  },
  {
    id: 7,
    category: "POLICY UPDATES",
    title: "New Tax Incentives for Women-Owned Small Businesses",
    excerpt: "Government announces comprehensive support package to boost women entrepreneurship nationwide.",
    date: "Dec 20, 2024",
    readTime: "4 min read",
    source: "Reuters",
  },
  {
    id: 8,
    category: "LAUNCHES",
    title: "Sustainable Fashion Brand by Female Founders Breaks Records",
    excerpt: "Eco-conscious clothing line achieves $10M in first-year sales, proving sustainability sells.",
    date: "Dec 19, 2024",
    readTime: "5 min read",
    source: "WWD",
  },
  {
    id: 9,
    category: "AWARDS",
    title: "Women in Tech Awards 2024: Recognizing Innovation and Leadership",
    excerpt: "Annual awards ceremony honors exceptional women driving technological innovation across industries.",
    date: "Dec 18, 2024",
    readTime: "5 min read",
    source: "Tech Times",
  },
  {
    id: 10,
    category: "FUNDING",
    title: "Female-Led FinTech Startup Secures $50M Series B Funding",
    excerpt: "Innovative financial technology company led by women entrepreneurs receives major investment round.",
    date: "Dec 17, 2024",
    readTime: "4 min read",
    source: "Financial Times",
  },
  {
    id: 11,
    category: "SUCCESS STORIES",
    title: "Single Mother Builds Multi-Million Dollar E-commerce Empire",
    excerpt: "Inspirational story of perseverance and innovation in the competitive world of online retail.",
    date: "Dec 16, 2024",
    readTime: "6 min read",
    source: "Business Insider",
  },
  {
    id: 12,
    category: "INDUSTRY TRENDS",
    title: "Remote Work Revolution Benefits Women Entrepreneurs",
    excerpt: "Study shows flexible work arrangements are creating new opportunities for female business owners.",
    date: "Dec 15, 2024",
    readTime: "5 min read",
    source: "Harvard Business Review",
  },
];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All News");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // Function to filter news articles based on selected category
  const getFilteredNews = () => {
    if (selectedCategory === "All News") {
      return newsArticles;
    }
    return newsArticles.filter(article => 
      article.category.toUpperCase() === selectedCategory.toUpperCase()
    );
  };

  // Function to check if featured news should be shown
  const shouldShowFeaturedNews = () => {
    if (selectedCategory === "All News") return true;
    return featuredNews.category.toUpperCase() === selectedCategory.toUpperCase();
  };

  const filteredNews = getFilteredNews();
  const showFeaturedNews = shouldShowFeaturedNews();

  // Get only "FUNDING" category articles for Latest Headlines sidebar
  const fundingNews = newsArticles.filter(article => 
    article.category.toUpperCase() === "FUNDING"
  ).slice(0, 3);

  return (
    <main className="bg-background min-h-screen pt-20 sm:pt-24">
      {/* ================= HERO SECTION WITH FIXED ASPECT RATIO ================= */}
<section className="relative w-full">
  {/* Remove aspect ratio and use min-height instead */}
  <div className="relative w-full min-h-[50vh] sm:min-h-[40vh] md:min-h-[30vh] lg:aspect-[5/1] overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
          
          {/* Content container */}
          <div className="relative h-full w-full mx-auto flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center text-white">
            <div className="max-w-6xl w-full">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 px-2 sm:px-0">
                Women in Business News
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 max-w-4xl mx-auto px-4 sm:px-8 lg:px-0">
                Stay informed with the latest news, insights, and success stories
                from women entrepreneurs worldwide
              </p>

              {/* Active filter indicator */}
              {selectedCategory !== "All News" && (
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
          </div>
        </div>
      </section>

      {/* ================= FEATURED NEWS + SIDEBAR ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* FEATURED - 2 COLUMNS */}
          {showFeaturedNews && (
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
          )}

          {/* SIDEBAR - LATEST HEADLINES */}
          <div className={`space-y-4 sm:space-y-6 ${!showFeaturedNews ? 'lg:col-span-3' : ''}`}>
            <div className="bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 shadow-lg border border-border lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-display font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                  Latest Headlines
                </h3>
                {selectedCategory !== "All News" && (
                  <button 
                    onClick={() => setSelectedCategory("All News")}
                    className="text-xs text-primary hover:text-accent transition-colors"
                  >
                    Clear filter
                  </button>
                )}
              </div>

              {showFilter ? (
                <div className="space-y-3 mb-4">
                  {newsCategories.slice(1).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowFilter(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-secondary text-muted-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {selectedCategory === "All News" 
                    ? fundingNews.map((news, i) => (
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
                      ))
                    : filteredNews.slice(0, 3).map((news, i) => (
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
                      ))
                  }
                </div>
              )}

              <div className="space-y-2 mt-4">
                <Button
                  variant="ghost"
                  className="w-full text-primary hover:bg-primary/10 text-sm flex items-center justify-between"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  {showFilter ? "Hide Filters" : "Filter by Category"}
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full text-primary hover:bg-primary/10 text-sm"
                >
                  View All News{" "}
                  <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ALL NEWS GRID ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-1 sm:mb-2">
                {selectedCategory === "All News" ? "All News Articles" : `${selectedCategory} Articles`}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {filteredNews.length} {filteredNews.length === 1 ? 'article' : 'articles'} found
                {selectedCategory !== "All News" && ` in ${selectedCategory}`}
              </p>
            </div>

            <Button
              variant="outline"
              className="flex items-center gap-2 border-2 w-full sm:w-auto"
              onClick={() => setSelectedCategory("All News")}
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
              Clear Filter
            </Button>
          </div>

          {filteredNews.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-2">
                No articles found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                There are no news articles in the &qout;{selectedCategory}&quot; category yet.
              </p>
              <Button
                onClick={() => setSelectedCategory("All News")}
                className="bg-gradient-to-r from-primary to-accent text-white font-semibold"
              >
                View All News
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredNews.map((news) => (
                  <div
                    key={news.id}
                    className="group bg-card rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-border"
                  >
                    {/* IMAGE */}
                    <div className="relative bg-gradient-to-br from-muted to-secondary h-40 sm:h-48 lg:h-56">
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 text-3xl sm:text-4xl font-display">
                        {news.category.charAt(0)}
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

              {/* LOAD MORE - Only show if there are more articles to load */}
              {selectedCategory === "All News" && filteredNews.length > 8 && (
                <div className="text-center mt-8 sm:mt-12">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all px-6 sm:px-8 text-sm sm:text-base"
                  >
                    Load More Articles
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              )}
            </>
          )}
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
            Subscribe to our newsletter for the latest updates on women in business
            {selectedCategory !== "All News" && `, especially in ${selectedCategory}`}
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