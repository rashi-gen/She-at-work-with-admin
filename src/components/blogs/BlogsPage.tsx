"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Filter, Menu, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import Cta from "../common/Cta";
import { PageBanner } from "../PageBanner";

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
];

const trendingPosts = [
  {
    id: 1,
    title: "Mastering Work-Life Balance as an Entrepreneur",
    date: "3 hrs ago",
    category: "Wellness",
  },
  {
    id: 2,
    title: "Funding Strategies for Women-Led Startups",
    date: "5 hrs ago",
    category: "Finance",
  },
  {
    id: 3,
    title: "Building a Strong Personal Brand Online",
    date: "Yesterday",
    category: "Marketing",
  },
  {
    id: 4,
    title: "Tech Tools Every Entrepreneur Needs in 2025",
    date: "2 days ago",
    category: "Technology",
  },
];

const featuredPost = {
  id: 0,
  category: "Leadership",
  title: "The New Era of Women Leadership in Global Business",
  excerpt: "Exploring how women leaders are redefining corporate culture, driving innovation, and shaping the future landscape of business.",
  author: {
    name: "Sarah Mitchell",
    role: "CEO & Serial Entrepreneur",
    avatar: "/avatar.jpg",
  },
  date: "Jan 15",
  readTime: "8 min read",
};

const blogPosts = [
  {
    id: 1,
    category: "Finance",
    title: "Smart Investment Strategies for Women Entrepreneurs",
    excerpt: "Learn how to make your money work for you with smart investment choices tailored for women in business.",
    date: "Jan 14",
    readTime: "5 min read",
  },
  {
    id: 2,
    category: "Marketing",
    title: "Social Media Marketing: A Complete Guide for Beginners",
    excerpt: "Master the art of social media marketing with proven strategies to grow your business online.",
    date: "Jan 13",
    readTime: "7 min read",
  },
  {
    id: 3,
    category: "Success Stories",
    title: "From Side Hustle to Million-Dollar Business",
    excerpt: "An inspiring journey of how one woman turned her passion project into a thriving enterprise.",
    date: "Jan 12",
    readTime: "6 min read",
  },
  {
    id: 4,
    category: "Technology",
    title: "AI Tools Transforming Small Business Operations",
    excerpt: "Discover how artificial intelligence can streamline your business and boost productivity.",
    date: "Jan 11",
    readTime: "6 min read",
  },
  {
    id: 5,
    category: "Wellness",
    title: "Mental Health Matters: Self-Care for Busy Entrepreneurs",
    excerpt: "Practical advice to maintain emotional well-being while managing the demands of entrepreneurship.",
    date: "Jan 10",
    readTime: "5 min read",
  },
  {
    id: 6,
    category: "Growth",
    title: "Scaling Your Business: When and How to Expand",
    excerpt: "Strategic insights on recognizing the right time and approach to scale your business successfully.",
    date: "Jan 9",
    readTime: "8 min read",
  },
  {
    id: 7,
    category: "Strategy",
    title: "Building a Resilient Business in Uncertain Times",
    excerpt: "Learn how to develop business strategies that withstand market volatility and economic challenges.",
    date: "Jan 8",
    readTime: "7 min read",
  },
  {
    id: 8,
    category: "Innovation",
    title: "Design Thinking for Problem Solving in Business",
    excerpt: "Apply human-centered design principles to tackle business challenges with innovative solutions.",
    date: "Jan 7",
    readTime: "6 min read",
  },
  {
    id: 9,
    category: "Leadership",
    title: "Inclusive Leadership: Building Diverse and Effective Teams",
    excerpt: "Learn how to foster an inclusive environment that empowers all team members to thrive.",
    date: "Jan 6",
    readTime: "7 min read",
  },
  {
    id: 10,
    category: "Finance",
    title: "Budgeting Strategies for First-Time Entrepreneurs",
    excerpt: "Essential budgeting techniques to keep your startup financially healthy from day one.",
    date: "Jan 5",
    readTime: "5 min read",
  },
  {
    id: 11,
    category: "Marketing",
    title: "Email Marketing Mastery: Convert Subscribers into Customers",
    excerpt: "Proven email marketing strategies to build relationships and drive sales for your business.",
    date: "Jan 4",
    readTime: "6 min read",
  },
  {
    id: 12,
    category: "Success Stories",
    title: "Breaking Barriers: How This Founder Built a Global Brand",
    excerpt: "Inspiring story of overcoming challenges to create an internationally recognized business.",
    date: "Jan 3",
    readTime: "8 min read",
  },
];

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Blogs");
  // const [email, setEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [visiblePosts, setVisiblePosts] = useState(8);

  // Function to filter blog posts based on selected category
  const getFilteredPosts = () => {
    if (selectedCategory === "All Blogs") {
      return blogPosts;
    }
    return blogPosts.filter(post => 
      post.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  };

  // Function to check if featured post should be shown
  const shouldShowFeaturedPost = () => {
    if (selectedCategory === "All Blogs") return true;
    return featuredPost.category.toLowerCase() === selectedCategory.toLowerCase();
  };

  const filteredPosts = getFilteredPosts();
  const showFeaturedPost = shouldShowFeaturedPost();

  // Get filtered trending posts
  const getFilteredTrendingPosts = () => {
    if (selectedCategory === "All Blogs") {
      return trendingPosts;
    }
    return trendingPosts.filter(post => 
      post.category.toLowerCase() === selectedCategory.toLowerCase()
    ).slice(0, 4);
  };

  const filteredTrendingPosts = getFilteredTrendingPosts();

  const loadMorePosts = () => {
    setVisiblePosts(prev => prev + 4);
  };

  return (
    <main className="bg-background min-h-screen ">
      {/* ================= HERO WITH GRADIENT ================= */}
<PageBanner
        title="Inspiring Blogs"
        description="Insights , tips and actionable content from experts and entrepreneurs worldwide"
        image="/blogs/Blogsbanner.png"
      >
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
          {blogCategories.map((cat) => (
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

      {/* ================= FEATURED POST + TRENDING ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-secondary/30">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* LEFT - FEATURED POST */}
          {showFeaturedPost && (
            <div className="lg:col-span-2">
              <div className="relative group bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-primary/10">
                {/* FEATURED BADGE */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                  <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-accent text-white text-xs font-bold uppercase shadow-lg">
                    Featured
                  </span>
                </div>

                {/* IMAGE */}
                <div className="relative bg-gradient-to-br from-muted to-secondary h-48 sm:h-60 lg:h-72">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 text-4xl sm:text-5xl lg:text-6xl font-display">
                    Featured
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* CONTENT */}
                <div className="p-4 sm:p-6 lg:p-8">
                  <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3 sm:mb-4 uppercase">
                    {featuredPost.category}
                  </span>

                  <h2 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-foreground mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>

                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  {/* AUTHOR INFO */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 sm:pt-6 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm sm:text-base lg:text-lg">
                        SM
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm sm:text-base">
                          {featuredPost.author.name}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {featuredPost.author.role}
                        </p>
                      </div>
                    </div>

                    <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto text-sm sm:text-base">
                      Read Article{" "}
                      <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT - TRENDING NOW */}
          <div className={`bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg sm:shadow-xl border-2 border-border lg:sticky lg:top-24 ${!showFeaturedPost ? 'lg:col-span-3' : ''}`}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                <h3 className="text-lg sm:text-xl font-display font-bold text-foreground">
                  Trending Now
                </h3>
              </div>
              {selectedCategory !== "All Blogs" && (
                <button 
                  onClick={() => setSelectedCategory("All Blogs")}
                  className="text-xs text-primary hover:text-accent transition-colors"
                >
                  Clear filter
                </button>
              )}
            </div>

            {showFilter ? (
              <div className="space-y-2 mb-4">
                {blogCategories.slice(1).map((cat) => (
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
              <div className="space-y-4 sm:space-y-5">
                {filteredTrendingPosts.length > 0 ? (
                  filteredTrendingPosts.map((post) => (
                    <div
                      key={post.id}
                      className="group cursor-pointer pb-4 sm:pb-5 border-b border-border last:border-0 last:pb-0"
                    >
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1.5 sm:mb-2 leading-snug text-sm sm:text-base">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span className="text-primary font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground text-sm">
                      No trending posts in this category
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full text-primary hover:bg-primary/10 text-sm flex items-center justify-between"
                onClick={() => setShowFilter(!showFilter)}
              >
                {showFilter ? "Hide Filters" : "Filter Categories"}
                <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LATEST ARTICLES GRID ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-1 sm:mb-2">
                {selectedCategory === "All Blogs" ? "Latest Articles" : `${selectedCategory} Articles`}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
                {selectedCategory !== "All Blogs" && ` in ${selectedCategory}`}
              </p>
            </div>

            {selectedCategory !== "All Blogs" && (
              <Button
                variant="outline"
                className="flex items-center gap-2 border-2 w-full sm:w-auto"
                onClick={() => setSelectedCategory("All Blogs")}
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                Clear Filter
              </Button>
            )}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-2">
                No articles found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                There are no blog posts in the &quot;{selectedCategory}&quot; category yet.
              </p>
              <Button
                onClick={() => setSelectedCategory("All Blogs")}
                className="bg-gradient-to-r from-primary to-accent text-white font-semibold"
              >
                View All Blogs
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredPosts.slice(0, visiblePosts).map((post) => (
                  <div
                    key={post.id}
                    className="group bg-card rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-border"
                  >
                    {/* IMAGE */}
                    <div className="relative bg-gradient-to-br from-muted to-secondary h-40 sm:h-48 lg:h-56">
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 text-3xl sm:text-4xl font-display">
                        {post.category.charAt(0)}
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 sm:p-6">
                      <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2 sm:mb-3 uppercase">
                        {post.category}
                      </span>

                      <h3 className="text-sm sm:text-base lg:text-lg font-display font-bold text-foreground mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-5 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          <span>{post.date}</span>
                          <span>•</span>
                          <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          <span>{post.readTime}</span>
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

              {/* LOAD MORE - Only show if there are more posts to load */}
              {selectedCategory === "All Blogs" && visiblePosts < filteredPosts.length && (
                <div className="text-center mt-8 sm:mt-12">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-6 sm:px-8 text-sm sm:text-base"
                    onClick={loadMorePosts}
                  >
                    Load More Articles
                  </Button>
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