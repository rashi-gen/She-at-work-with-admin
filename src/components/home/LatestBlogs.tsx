"use client";

import { useState } from "react";
import { ArrowRight, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const blogs = [
  {
    id: 1,
    title:
      "Ready, Set, Lead: The Next Wave of Women Entrepreneurs is Already Here!",
    excerpt:
      "Discover how the next generation of women leaders are redefining entrepreneurship with innovation and purpose.",
    category: "Leadership",
    date: "November 19, 2025",
    readTime: "5 min",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80",
  },
  {
    id: 2,
    title: "Breaking Barriers: Women in Tech Startups Reshaping Industries",
    excerpt:
      "From AI to fintech, women founders are creating groundbreaking solutions that transform how we live and work.",
    category: "Technology",
    date: "November 15, 2025",
    readTime: "4 min",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80",
  },
  {
    id: 3,
    title:
      "The Art of Balancing: Entrepreneurship and Personal Well-being",
    excerpt:
      "Learn strategies from successful women entrepreneurs on maintaining wellness while building thriving businesses.",
    category: "Wellness",
    date: "November 10, 2025",
    readTime: "6 min",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
  },
];

export const LatestBlogs = () => {
  const [index, setIndex] = useState(0);
  const total = blogs.length;

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  return (
    <section className="p-5 sm:p-20 bg-background">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <Badge  className="mb-3 text-sm bg-secondary text-primary rounded-xs">
              Fresh Insights
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Latest from Our Blog
            </h2>
          </div>

          <Button
            variant="ghost"
            className="hidden sm:flex text-primary"
          >
            View All Blogs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* ================= MOBILE SLIDER ================= */}
        <div className="md:hidden relative">
          <article className="rounded-2xl bg-card border border-border overflow-hidden">
            {/* IMAGE */}
            <div className="relative aspect-16/10">
              <Image
                src={blogs[index].image}
                alt={blogs[index].title}
                fill
                className="object-cover"
              />

              {/* ARROWS */}
              <button
                onClick={prev}
                className="absolute left-3 bottom-3 rounded-full p-2
                  bg-background text-foreground border border-border shadow"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={next}
                className="absolute right-3 bottom-3 rounded-full p-2
                  bg-background text-foreground border border-border shadow"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="secondary" className="text-xs">
                  {blogs[index].category}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {blogs[index].readTime}
                </span>
              </div>

              <h3 className="text-lg font-bold mb-2 line-clamp-2 text-foreground">
                {blogs[index].title}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {blogs[index].excerpt}
              </p>

              <div className="flex justify-between items-center pt-4 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  {blogs[index].date}
                </span>
                <span className="text-sm text-primary font-medium flex items-center gap-1">
                  Read More <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </article>
        </div>

        {/* ================= DESKTOP GRID ================= */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="group flex flex-col rounded-2xl bg-card border border-border overflow-hidden hover:shadow-lg transition"
            >
              <div className="aspect-16/10 overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={600}
                  height={375}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {blog.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {blog.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                  {blog.title}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {blog.excerpt}
                </p>

                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {blog.date}
                  </span>
                  <span className="text-sm font-medium text-primary flex items-center gap-1">
                    Read More <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* MOBILE VIEW ALL */}
        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" className="font-semibold">
            View All Blogs
          </Button>
        </div>
      </div>
    </section>
  );
};
