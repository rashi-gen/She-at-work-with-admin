"use client";

import { Button } from "@/components/ui/button";
import {
  Award,
  Bookmark,
  Clock,
  Eye,
  Heart,
  Menu,
  MessageSquare,
  TrendingUp,
  X
} from "lucide-react";
import { useState } from "react";
import Cta from "../common/Cta";
import { PageBanner } from "../PageBanner";

const categories = [
  "All Topics",
  "Funding & Finance",
  "Marketing",
  "Leadership",
  "Technology",
  "Work-Life Balance",
  "Legal & Compliance",
  "Product Development",
];

// Blog-style posts with images
const entrechatPosts = [
  {
    id: 1,
    author: {
      name: "Sarah Mitchell",
      verified: true,
    },
    category: "Funding & Finance",
    title: "How I Raised $2M in Seed Funding: My Complete Journey",
    excerpt:
      "After 6 months of pitching to investors, I finally closed our seed round. Here's everything I learned about the fundraising process, what worked, what didn't, and my advice for first-time founders...",
    image:
      "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=500&fit=crop",
    timestamp: "November 27, 2025",
    readTime: "8 minute read",
    views: 234,
    likes: 142,
    comments: 38,
    bookmarked: false,
  },
  {
    id: 2,
    author: {
      name: "Emily Rodriguez",
      verified: false,
    },
    category: "Marketing",
    title: "Social Media Strategies That Actually Work in 2025",
    excerpt:
      "Looking to streamline our social media workflow. Currently using 3 different tools and it's getting messy. What's working for you in the ever-changing landscape of social media?",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=500&fit=crop",
    timestamp: "November 25, 2025",
    readTime: "5 minute read",
    views: 189,
    likes: 67,
    comments: 45,
    bookmarked: false,
  },
  {
    id: 3,
    author: {
      name: "Priya Sharma",
      verified: true,
    },
    category: "Technology",
    title: "AI Tools Every Small Business Should Be Using",
    excerpt:
      "I've compiled a list of 10 AI tools that have transformed how we operate. From customer service to content creation, these are absolute game-changers for modern entrepreneurs...",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
    timestamp: "November 22, 2025",
    readTime: "6 minute read",
    views: 312,
    likes: 203,
    comments: 67,
    bookmarked: true,
  },
  {
    id: 4,
    author: {
      name: "Jessica Chen",
      verified: true,
    },
    category: "Leadership",
    title: "Dealing with Imposter Syndrome as a First-Time CEO",
    excerpt:
      "It's been 6 months since I stepped into the CEO role, and imposter syndrome hits hard some days. How do you all deal with self-doubt while leading a growing team?",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=500&fit=crop",
    timestamp: "November 20, 2025",
    readTime: "4 minute read",
    views: 276,
    likes: 156,
    comments: 92,
    bookmarked: false,
  },
  {
    id: 5,
    author: {
      name: "Amanda Foster",
      verified: false,
    },
    category: "Work-Life Balance",
    title: "Balancing Business Growth with Family Life",
    excerpt:
      "My startup is growing fast, but I'm struggling to be present for my kids. Looking for practical advice from other founder moms who've navigated this challenge...",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop",
    timestamp: "November 18, 2025",
    readTime: "5 minute read",
    views: 198,
    likes: 89,
    comments: 56,
    bookmarked: true,
  },
  {
    id: 6,
    author: {
      name: "Lisa Park",
      verified: true,
    },
    category: "Product Development",
    title: "Should I Pivot or Persist? A Founder's Dilemma",
    excerpt:
      "We've been building our product for 18 months with slow traction. Considering a pivot. What metrics helped you decide when it was time to change direction?",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
    timestamp: "November 15, 2025",
    readTime: "7 minute read",
    views: 245,
    likes: 124,
    comments: 78,
    bookmarked: false,
  },
  {
    id: 7,
    author: {
      name: "Maya Johnson",
      verified: true,
    },
    category: "Funding & Finance",
    title: "Understanding SAFE Notes vs Convertible Notes",
    excerpt:
      "For early-stage founders, which is better? Let's discuss the pros and cons of each funding instrument and when to use them in your fundraising journey.",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=500&fit=crop",
    timestamp: "November 12, 2025",
    readTime: "6 minute read",
    views: 167,
    likes: 98,
    comments: 45,
    bookmarked: false,
  },
  {
    id: 8,
    author: {
      name: "Sophia Williams",
      verified: false,
    },
    category: "Marketing",
    title: "Content Calendar Templates That Actually Work",
    excerpt:
      "Share your best content calendar templates and scheduling strategies that help maintain consistency across multiple platforms and channels.",
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=500&fit=crop",
    timestamp: "November 10, 2025",
    readTime: "4 minute read",
    views: 143,
    likes: 76,
    comments: 34,
    bookmarked: true,
  },
  {
    id: 9,
    author: {
      name: "Rachel Thompson",
      verified: true,
    },
    category: "Leadership",
    title: "Building Remote Teams That Actually Work Together",
    excerpt:
      "Three years into running a fully remote company, here are the systems and tools we use to maintain culture and productivity across time zones.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop",
    timestamp: "November 8, 2025",
    readTime: "8 minute read",
    views: 289,
    likes: 134,
    comments: 61,
    bookmarked: false,
  },
];

const latestPosts = [
  {
    id: 10,
    title: "Ready, Set, Lead: The Next Wave of Women Entrepreneurs",
    image:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=200&h=200&fit=crop",
    date: "November 19, 2025",
  },
  {
    id: 11,
    title: "The Female Force Transforming Global SME Sector",
    image:
      "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=200&h=200&fit=crop",
    date: "November 17, 2025",
  },
  {
    id: 12,
    title: "Women Weaving Dreams into Businesses",
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=200&h=200&fit=crop",
    date: "November 11, 2025",
  },
];

// const communityStats = [
//   { value: "12K+", label: "Active Members" },
//   { value: "119", label: "Posts" },
//   { value: "25K+", label: "Total Views" },
//   { value: "150+", label: "Topics Covered" },
// ];

export default function EntreChatPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visiblePosts, setVisiblePosts] = useState(6);

  // Function to filter posts based on selected category and search
  const getFilteredPosts = () => {
    let filtered = entrechatPosts;

    if (selectedCategory !== "All Topics") {
      filtered = filtered.filter(
        (post) =>
          post.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  };

  const filteredPosts = getFilteredPosts();

  const loadMorePosts = () => {
    setVisiblePosts((prev) => prev + 3);
  };

  return (
    <main className="bg-background min-h-screen">
 <PageBanner
         title="EntreChat Community"
         description="Connect,share insights, and get advice from fellow women entrepreneurs around the world"
         image="/entrechat/Entrechatbanner.png"
       >
         {/* Active filter indicator */}
         {selectedCategory !== "All Topics" && (
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
           {categories.map((cat) => (
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

      {/* MAIN CONTENT AREA */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-6 sm:gap-8">
            {/* MAIN FEED - 3 COLUMNS */}
            <div className="lg:col-span-3">
              {filteredPosts.length === 0 ? (
                <div className="bg-card rounded-2xl p-8 sm:p-12 shadow-lg border-2 border-border text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                    <MessageSquare className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-3">
                    No posts found
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {searchQuery
                      ? `No results for "${searchQuery}". Try a different search term.`
                      : `There are no posts in "${selectedCategory}" yet.`}
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedCategory("All Topics");
                      setSearchQuery("");
                    }}
                    className="bg-gradient-to-r from-primary to-accent text-white font-semibold"
                  >
                    View All Posts
                  </Button>
                </div>
              ) : (
                <>
                  {/* FEATURED POST - First Post */}
                  {filteredPosts.length > 0 && (
                    <article className="mb-8 bg-card rounded-2xl overflow-hidden shadow-xl border border-border hover:shadow-2xl transition-all duration-300 group">
                      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
                        <img
                          src={filteredPosts[0].image}
                          alt={filteredPosts[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 z-10">
                          <span className="inline-block px-3 py-1 rounded-full bg-accent text-white text-xs font-bold uppercase shadow-lg">
                            Featured
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 z-10">
                          <span className="inline-block px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold uppercase shadow-lg">
                            {filteredPosts[0].category}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      </div>

                      <div className="p-6 sm:p-8">
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4 hover:text-primary transition-colors cursor-pointer leading-tight">
                          {filteredPosts[0].title}
                        </h2>

                        <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                          {filteredPosts[0].excerpt}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-md">
                              {filteredPosts[0].author.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-foreground text-sm">
                                  {filteredPosts[0].author.name}
                                </span>
                                {filteredPosts[0].author.verified && (
                                  <Award className="h-4 w-4 text-accent" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{filteredPosts[0].timestamp}</span>
                                <span>•</span>
                                <span>{filteredPosts[0].readTime}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {filteredPosts[0].views}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1.5 text-muted-foreground hover:text-accent transition-colors group">
                              <Heart className="h-5 w-5 group-hover:fill-accent" />
                              <span className="text-sm font-medium">
                                {filteredPosts[0].likes}
                              </span>
                            </button>
                            <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                              <MessageSquare className="h-5 w-5" />
                              <span className="text-sm font-medium">
                                {filteredPosts[0].comments}
                              </span>
                            </button>
                            <button className="text-muted-foreground hover:text-accent transition-colors">
                              <Bookmark
                                className={`h-5 w-5 ${filteredPosts[0].bookmarked ? "fill-accent text-accent" : ""}`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  )}

                  {/* REGULAR POSTS GRID */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.slice(1, visiblePosts).map((post) => (
                      <article
                        key={post.id}
                        className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/30 flex flex-col group"
                      >
                        {/* Post Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="inline-block px-2.5 py-1 rounded-full bg-primary text-white text-xs font-semibold uppercase shadow-md">
                              {post.category}
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Post Content */}
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.readTime}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {post.views}
                            </span>
                          </div>

                          <h3 className="text-lg font-display font-bold text-foreground mb-3 hover:text-primary transition-colors cursor-pointer leading-tight line-clamp-2 flex-shrink-0">
                            {post.title}
                          </h3>

                          <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3 flex-1">
                            {post.excerpt}
                          </p>

                          {/* Author & Stats */}
                          <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-muted to-secondary flex items-center justify-center text-foreground font-bold text-xs shadow-sm">
                                {post.author.name.charAt(0)}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium text-foreground text-xs">
                                  {post.author.name.split(" ")[0]}
                                </span>
                                {post.author.verified && (
                                  <Award className="h-3 w-3 text-accent" />
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <button className="text-muted-foreground hover:text-accent transition-colors group">
                                <Heart className="h-4 w-4 group-hover:fill-accent" />
                              </button>
                              <button className="text-muted-foreground hover:text-accent transition-colors">
                                <Bookmark
                                  className={
                                    post.bookmarked
                                      ? "h-4 w-4 fill-accent text-accent"
                                      : "h-4 w-4"
                                  }
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* LOAD MORE */}
                  {visiblePosts < filteredPosts.length && (
                    <div className="text-center pt-8">
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-8 transition-all"
                        onClick={loadMorePosts}
                      >
                        Load More Posts
                      </Button>
                    </div>
                  )}

                  {/* PAGINATION INFO */}
                  <div className="text-center pt-6 text-sm text-muted-foreground">
                    Showing {Math.min(visiblePosts, filteredPosts.length)} of{" "}
                    {filteredPosts.length} posts
                  </div>
                </>
              )}
            </div>

            {/* SIDEBAR - 1 COLUMN */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              {/* LATEST BLOG POSTS */}
              <div className="bg-card rounded-xl p-5 shadow-lg border border-border">
                <h3 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Latest Posts
                </h3>

                <div className="space-y-4">
                  {latestPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="flex gap-3 group cursor-pointer"
                    >
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden shadow-sm">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
                            {index + 1}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2 mb-1">
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {post.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COMMUNITY GUIDELINES */}
              <div className="bg-gradient-to-br from-secondary/50 to-secondary rounded-xl p-5 border border-border">
                <h3 className="text-base font-display font-bold text-foreground mb-3">
                  Community Guidelines
                </h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5 flex-shrink-0">•</span>
                    <span>Be respectful and supportive</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5 flex-shrink-0">•</span>
                    <span>Share authentic experiences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5 flex-shrink-0">•</span>
                    <span>Keep discussions constructive</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5 flex-shrink-0">•</span>
                    <span>No spam or self-promotion</span>
                  </li>
                </ul>
              </div>

              {/* SOCIAL LINKS */}
              <div className="bg-card rounded-xl p-5 shadow-lg border border-border">
                <h3 className="text-base font-display font-bold text-foreground mb-4">
                  Connect With Us
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="#"
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs font-medium shadow-sm"
                  >
                    Facebook
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors text-xs font-medium shadow-sm"
                  >
                    Twitter
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors text-xs font-medium shadow-sm"
                  >
                    Instagram
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors text-xs font-medium shadow-sm"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>

              {/* ACTIVE FILTER CARD */}
              {selectedCategory !== "All Topics" && (
                <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-display font-bold text-foreground">
                      Active Filter
                    </h3>
                    <button
                      onClick={() => setSelectedCategory("All Topics")}
                      className="text-xs text-primary hover:text-accent transition-colors font-medium"
                    >
                      Clear
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Viewing posts in:
                  </p>
                  <div className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-semibold text-center shadow-sm">
                    {selectedCategory}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    {filteredPosts.length}{" "}
                    {filteredPosts.length === 1 ? "post" : "posts"} found
                  </p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      <Cta />
    </main>
  );
}
