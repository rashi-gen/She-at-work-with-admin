"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Award,
  Bookmark,
  ChevronRight,
  Clock,
  Filter,
  Heart,
  Menu,
  MessageSquare,
  Send,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
  X
} from "lucide-react";
import { useState } from "react";

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

const trendingTopics = [
  { title: "Best practices for pitch deck design", posts: 234, icon: Award },
  { title: "Navigating Series A funding", posts: 189, icon: TrendingUp },
  { title: "Building remote teams effectively", posts: 156, icon: Users },
  { title: "Social media strategies that work", posts: 142, icon: Sparkles },
];

const featuredDiscussion = {
  id: 1,
  author: {
    name: "Sarah Mitchell",
    role: "CEO & Founder",
    avatar: "/avatar1.jpg",
    verified: true,
  },
  category: "FUNDING",
  title: "How I Raised $2M in Seed Funding: My Complete Journey",
  content:
    "After 6 months of pitching to investors, I finally closed our seed round. Here's everything I learned about the fundraising process, what worked, what didn't, and my advice for first-time founders...",
  timestamp: "2 hours ago",
  likes: 142,
  comments: 38,
  shares: 24,
  bookmarked: false,
  tags: ["Fundraising", "Startup", "Advice"],
};

const discussions = [
  {
    id: 2,
    author: {
      name: "Emily Rodriguez",
      role: "Marketing Director",
      avatar: "/avatar2.jpg",
      verified: false,
    },
    category: "MARKETING",
    title: "What are your go-to tools for social media management?",
    content:
      "Looking to streamline our social media workflow. Currently using 3 different tools and it's getting messy. What's working for you?",
    timestamp: "5 hours ago",
    likes: 67,
    comments: 45,
    shares: 12,
    bookmarked: false,
    tags: ["Social Media", "Tools", "Productivity"],
  },
  {
    id: 3,
    author: {
      name: "Priya Sharma",
      role: "Tech Entrepreneur",
      avatar: "/avatar3.jpg",
      verified: true,
    },
    category: "TECHNOLOGY",
    title: "AI Tools Every Small Business Should Be Using in 2025",
    content:
      "I've compiled a list of 10 AI tools that have transformed how we operate. From customer service to content creation, these are game-changers...",
    timestamp: "8 hours ago",
    likes: 203,
    comments: 67,
    shares: 89,
    bookmarked: true,
    tags: ["AI", "Productivity", "Tools"],
  },
  {
    id: 4,
    author: {
      name: "Jessica Chen",
      role: "Serial Entrepreneur",
      avatar: "/avatar4.jpg",
      verified: true,
    },
    category: "LEADERSHIP",
    title: "Dealing with imposter syndrome as a first-time CEO",
    content:
      "It's been 6 months since I stepped into the CEO role, and imposter syndrome hits hard some days. How do you all deal with self-doubt?",
    timestamp: "12 hours ago",
    likes: 156,
    comments: 92,
    shares: 34,
    bookmarked: false,
    tags: ["Mental Health", "Leadership", "Support"],
  },
  {
    id: 5,
    author: {
      name: "Amanda Foster",
      role: "E-commerce Founder",
      avatar: "/avatar5.jpg",
      verified: false,
    },
    category: "WORK-LIFE",
    title: "How do you balance scaling a business with family life?",
    content:
      "My startup is growing fast, but I'm struggling to be present for my kids. Looking for practical advice from other founder moms...",
    timestamp: "1 day ago",
    likes: 89,
    comments: 56,
    shares: 18,
    bookmarked: true,
    tags: ["Work-Life Balance", "Parenting", "Advice"],
  },
  {
    id: 6,
    author: {
      name: "Lisa Park",
      role: "SaaS Founder",
      avatar: "/avatar6.jpg",
      verified: true,
    },
    category: "PRODUCT",
    title: "Should I pivot or persist? Need honest feedback",
    content:
      "We've been building our product for 18 months with slow traction. Considering a pivot. What metrics helped you decide?",
    timestamp: "1 day ago",
    likes: 124,
    comments: 78,
    shares: 23,
    bookmarked: false,
    tags: ["Strategy", "Product", "Advice"],
  },
];

const communityStats = [
  { value: "12K+", label: "Active Members" },
  { value: "3.5K+", label: "Discussions" },
  { value: "25K+", label: "Comments" },
  { value: "150+", label: "Topics Covered" },
];

export default function EntreChatPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [newPost, setNewPost] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                EntreChat Community
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 max-w-4xl mx-auto px-4 sm:px-8 lg:px-0">
                Connect, share insights, and get advice from fellow women entrepreneurs around the world
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
                } flex-col lg:flex-row flex-wrap justify-center gap-2 sm:gap-3 px-4 lg:px-0`}
              >
                {categories.map((cat) => (
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

      {/* ================= COMMUNITY STATS ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-secondary ">
        <div className="max-w-screen-xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
          {communityStats.map((stat, i) => (
            <div key={i} className="space-y-1">
              <div className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-black">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= MAIN CONTENT AREA ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* MAIN FEED - 2 COLUMNS */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* NEW POST INPUT */}
              <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-border">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm sm:text-base shrink-0">
                    YO
                  </div>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share your thoughts, ask a question, or start a discussion..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="mb-3 min-h-20 sm:min-h-25 border-2 focus:border-primary resize-none text-sm sm:text-base"
                    />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          Add Tags
                        </Button>
                        <Button variant="outline" size="sm">
                          <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                      <Button className="bg-primary hover:bg-primary/90 text-sm sm:text-base w-full sm:w-auto">
                        <Send className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* FEATURED DISCUSSION */}
              <div className="relative bg-card rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl border-2 border-accent/20">
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                  <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-accent text-white text-xs font-bold uppercase">
                    Featured
                  </span>
                </div>

                <div className="p-4 sm:p-6">
                  {/* AUTHOR INFO */}
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm sm:text-base shrink-0">
                      {featuredDiscussion.author.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="font-semibold text-foreground text-sm sm:text-base">
                          {featuredDiscussion.author.name}
                        </span>
                        {featuredDiscussion.author.verified && (
                          <Award className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <span>{featuredDiscussion.author.role}</span>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>{featuredDiscussion.timestamp}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Bookmark className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>

                  {/* CONTENT */}
                  <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2 sm:mb-3 uppercase">
                    {featuredDiscussion.category}
                  </span>

                  <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-2 sm:mb-3">
                    {featuredDiscussion.title}
                  </h3>

                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed line-clamp-3">
                    {featuredDiscussion.content}
                  </p>

                  {/* TAGS */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    {featuredDiscussion.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded bg-secondary text-xs text-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* ENGAGEMENT */}
                  <div className="flex items-center gap-4 sm:gap-6 pt-3 sm:pt-4 border-t border-border">
                    <button className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-accent transition-colors group">
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5 group-hover:fill-accent" />
                      <span className="text-xs sm:text-sm font-medium">
                        {featuredDiscussion.likes}
                      </span>
                    </button>
                    <button className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm font-medium">
                        {featuredDiscussion.comments}
                      </span>
                    </button>
                    <button className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-accent transition-colors">
                      <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm font-medium">
                        {featuredDiscussion.shares}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* REGULAR DISCUSSIONS */}
              {discussions.map((discussion) => (
                <div
                  key={discussion.id}
                  className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/30"
                >
                  {/* AUTHOR INFO */}
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-muted to-secondary flex items-center justify-center text-foreground font-bold text-sm sm:text-base shrink-0">
                      {discussion.author.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="font-semibold text-foreground text-sm sm:text-base">
                          {discussion.author.name}
                        </span>
                        {discussion.author.verified && (
                          <Award className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <span>{discussion.author.role}</span>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>{discussion.timestamp}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      {discussion.bookmarked ? (
                        <Bookmark className="h-3 w-3 sm:h-4 sm:w-4 fill-accent text-accent" />
                      ) : (
                        <Bookmark className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </Button>
                  </div>

                  {/* CONTENT */}
                  <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2 sm:mb-3 uppercase">
                    {discussion.category}
                  </span>

                  <h3 className="text-base sm:text-lg font-display font-bold text-foreground mb-2 sm:mb-3 hover:text-primary transition-colors cursor-pointer">
                    {discussion.title}
                  </h3>

                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed line-clamp-2">
                    {discussion.content}
                  </p>

                  {/* TAGS */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    {discussion.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded bg-secondary text-xs text-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* ENGAGEMENT */}
                  <div className="flex items-center gap-4 sm:gap-6 pt-3 sm:pt-4 border-t border-border">
                    <button className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-accent transition-colors group">
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5 group-hover:fill-accent" />
                      <span className="text-xs sm:text-sm font-medium">
                        {discussion.likes}
                      </span>
                    </button>
                    <button className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm font-medium">
                        {discussion.comments}
                      </span>
                    </button>
                    <button className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-accent transition-colors">
                      <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm font-medium">
                        {discussion.shares}
                      </span>
                    </button>
                  </div>
                </div>
              ))}

              {/* LOAD MORE */}
              <div className="text-center pt-4 sm:pt-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-6 sm:px-8 text-sm sm:text-base"
                >
                  Load More Discussions
                </Button>
              </div>
            </div>

            {/* SIDEBAR - 1 COLUMN */}
            <div className="space-y-4 sm:space-y-6">
              {/* TRENDING TOPICS */}
              <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl border-2 border-border lg:sticky lg:top-24">
                <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                  Trending Topics
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  {trendingTopics.map((topic, i) => (
                    <div
                      key={i}
                      className="group cursor-pointer pb-3 sm:pb-4 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shrink-0 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                          <topic.icon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1 leading-snug text-xs sm:text-sm">
                            {topic.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {topic.posts} discussions
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  className="w-full mt-3 sm:mt-4 text-primary hover:bg-primary/10 text-sm"
                >
                  View All Topics{" "}
                  <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>

              {/* COMMUNITY GUIDELINES */}
              <div className="bg-gradient-to-br from-secondary/50 to-secondary rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border">
                <h3 className="text-base sm:text-lg font-display font-bold text-foreground mb-2 sm:mb-3">
                  Community Guidelines
                </h3>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Be respectful and supportive</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Share authentic experiences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Keep discussions constructive</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>No spam or self-promotion</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 overflow-hidden hero-gradient">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

        <div className="relative w-full mx-auto text-center text-white px-4">
          <Users className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 mx-auto mb-4 sm:mb-6 text-white/90" />
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold mb-3 sm:mb-4">
            Join the Conversation
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto">
            Connect with thousands of women entrepreneurs and grow together
          </p>

          <Button className="h-10 sm:h-12 bg-white text-primary hover:bg-white/90 font-semibold px-6 sm:px-8 text-sm sm:text-base">
            Become a Member
            <ChevronRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </section>
    </main>
  );
}