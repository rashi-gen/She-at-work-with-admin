/*eslint-disable @typescript-eslint/no-explicit-any  */
// components/home/FeaturedNews.tsx
"use client";

import { motion, Variants } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { entrechatData } from "@/data/Entrechat";

/* ================= ANIMATION VARIANTS ================= */

const containerVariant = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

/* ================= TYPES ================= */


/* ================= HELPERS ================= */

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const extractExcerpt = (content: string, maxLength = 120) => {
  const plain = content.replace(/<[^>]*>/g, "");
  return plain.length > maxLength
    ? plain.substring(0, maxLength) + "..."
    : plain;
};

/* ================= COMPONENT ================= */

export default function FeaturedStories() {
  const [index, setIndex] = useState(0);
  const [stories, setStories] = useState<any[]>([]);

  useEffect(() => {
    const processed = entrechatData.slice(0, 5).map((item) => ({
      id: item.ID,
      title: item.post_title,
      description:
        item.post_excerpt ||
        extractExcerpt(item.post_content ?? "", 100),
      date: formatDate(item.post_date),
      views: Math.floor(Math.random() * 300) + 50,
      image:
        item.featured_image_url || "/placeholder-interview.jpg",
      slug: item.post_name,
    }));

    setStories(processed);
  }, []);

  if (!stories.length) return null;

  const total = stories.length;
  const large = stories[index];
  const small = stories[(index + 1) % total];

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  return (
    <section className="py-16 bg-background">
      <motion.div
        className="mx-auto px-5 sm:px-20"
        variants={containerVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-between mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Featured Stories
          </h2>

          <Link
            href="/entrechat"
            className="text-sm text-primary font-medium hover:underline"
          >
            View All Stories →
          </Link>
        </motion.div>

        {/* ================= MOBILE ================= */}
        <motion.div variants={fadeUp} className="lg:hidden">
          <div className="bg-card rounded-3xl border border-border overflow-hidden">
            <div className="relative h-56">
              <Image
                src={large.image}
                alt={large.title}
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

            <div className="p-5">
              <h3 className="font-bold text-lg mb-2">
                {large.title}
              </h3>

              <p className="text-sm text-muted-foreground mb-4">
                {large.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ================= DESKTOP ================= */}
        <div className="hidden lg:grid grid-cols-3 gap-8">
          {/* Large Card */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="col-span-2 bg-card rounded-3xl border border-border overflow-hidden"
          >
            <div className="relative h-72">
              <Image
                src={large.image}
                alt={large.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">
                {large.title}
              </h3>

              <p className="text-muted-foreground mb-4">
                {large.description}
              </p>
            </div>
          </motion.div>

          {/* Small Card */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="bg-card rounded-3xl border border-border overflow-hidden"
          >
            <div className="relative h-48">
              <Image
                src={small.image}
                alt={small.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-6">
              <h4 className="font-bold text-lg mb-2">
                {small.title}
              </h4>

              <p className="text-muted-foreground mb-4">
                {small.description}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}