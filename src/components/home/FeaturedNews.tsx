"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Eye, Calendar } from "lucide-react";
import Link from "next/link";

const stories = [
  {
    id: 1,
    title: "Explore WISE with She at Work",
    description: "Sara McNally, EVA Leasing: Empowering Women in Africa",
    date: "25 September 2025",
    views: 162,
    image:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&q=80",
  },
  {
    id: 2,
    title: "Women Entrepreneurs Ripple India's Value Chain",
    description:
      "How innovative women leaders are transforming India's startup ecosystem.",
    date: "19 September 2025",
    views: 217,
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80",
  },
  {
    id: 3,
    title: "Viksit Bharat 2047 & Women Leadership",
    description: "Driving inclusive growth through policy and innovation.",
    date: "10 September 2025",
    views: 104,
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80",
  },
];

export default function FeaturedStories() {
  const [index, setIndex] = useState(0);
  const total = stories.length;

  const large = stories[index];
  const small = stories[(index + 1) % total];

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  return (
    <section className="py-16 bg-background">
      <div className="mx-auto px-5 sm:px-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Featured Stories
          </h2>
          <Link
            href="#"
            className="text-sm text-primary font-medium hover:underline"
          >
            View All Stories →
          </Link>
        </div>

        {/* ================= MOBILE VIEW ================= */}
        <div className="lg:hidden">
          <div className="bg-card rounded-3xl border border-border overflow-hidden">
            {/* Image */}
            <div className="relative h-56">
              <Image
                src={large.image}
                alt={large.title}
                fill
                className="object-cover"
              />

              <span className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-semibold px-4 py-1.5 rounded-full">
                Featured
              </span>

              {/* Arrows */}
              <button
                onClick={prev}
                className="absolute left-3 bottom-3 bg-white rounded-full shadow p-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 bottom-3 bg-white rounded-full shadow p-2"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-bold text-lg mb-2">{large.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {large.description}
              </p>

              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {large.date}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {large.views}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= DESKTOP VIEW ================= */}
        <div className="hidden lg:grid grid-cols-3 gap-8">
          {/* Large Card */}
          <div className="col-span-2 bg-card rounded-3xl border border-border overflow-hidden flex flex-col">
            <div className="relative h-72">
              <Image
                src={large.image}
                alt={large.title}
                fill
                priority
                className="object-cover"
              />
              <span className="absolute top-5 left-5 bg-yellow-400 text-black text-xs font-semibold px-4 py-1.5 rounded-full">
                Featured
              </span>
            </div>

            <div className="p-6 flex-1">
              <h3 className="text-2xl font-bold mb-2">{large.title}</h3>
              <p className="text-muted-foreground mb-4">
                {large.description}
              </p>

              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {large.date}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {large.views}
                </span>
              </div>
            </div>
          </div>

          {/* Small Card */}
          <div className="bg-card rounded-3xl border border-border overflow-hidden flex flex-col">
            <div className="relative h-48">
              <Image
                src={small.image}
                alt={small.title}
                fill
                className="object-cover"
              />

              <button
                onClick={prev}
                className="absolute left-3 bottom-3 bg-white rounded-full shadow p-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 bottom-3 bg-white rounded-full shadow p-2"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <h4 className="font-bold text-lg mb-2 line-clamp-2">
                {small.title}
              </h4>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {small.description}
              </p>

              <div className="flex gap-3 text-sm text-muted-foreground mt-auto">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {small.date}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {small.views}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
