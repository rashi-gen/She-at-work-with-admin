"use client";

import { useEffect, useState, createContext } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const IMAGES = ["/home/Homebanner1.png", "/home/Homebanner2.png"];

const HEADLINES = [
  {
    line1: "Turn Your Ambition",
    line2: "Into Action",
  },
  {
    line1: "Build Ideas",
    line2: "Create Impact",
  },
  {
    line1: "Empower Voices",
    line2: "Shape Futures",
  },
];

export const ImageVisibilityContext = createContext({
  isImageVisible: false,
});

export const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [headlineIndex, setHeadlineIndex] = useState(0);

  // Background carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length);
      setHeadlineIndex((prev) => (prev + 1) % HEADLINES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ImageVisibilityContext.Provider value={{ isImageVisible: true }}>
      <section className="relative min-h-screen lg:h-screen overflow-hidden pt-24">
        {/* Background Images */}
        <div
          className="absolute inset-0"
          style={{ top: "96px", height: "calc(100vh - 96px)" }}
        >
          {IMAGES.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                currentImageIndex === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image}
                alt="Hero background"
                fill
                priority={index === 0}
                className="object-cover object-top"
              />
            </div>
          ))}
        </div>

        {/* Content */}
        <div
          className="relative z-10 flex items-center"
          style={{ minHeight: "calc(100vh - 96px)" }}
        >
          <div className="container mx-auto px-6">
            <div className="max-w-3xl text-white">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm sm:text-lg"
              >
                Since 2017 • Trusted Global Community
              </motion.div>

              {/* Animated Heading */}
              <AnimatePresence mode="wait">
                <motion.h1
                  key={headlineIndex}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.7 }}
                  className="leading-tight"
                >
                  <span className="block text-3xl sm:text-7xl font-light">
                    {HEADLINES[headlineIndex].line1}
                  </span>

                  <span className="block text-4xl sm:text-7xl font-semibold mt-2">
                    {HEADLINES[headlineIndex].line2}
                  </span>
                </motion.h1>
              </AnimatePresence>

              {/* Paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-6 text-white/90 max-w-2xl"
              >
                A dynamic one-stop knowledge hub dedicated to amplifying the
                voices, achievements, and insights of women entrepreneurs
                globally — helping ideas grow into impactful journeys.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-10 flex flex-col sm:flex-row gap-4"
              >
                <Link href="/entrechat">
                  <Button
                    className="
  relative overflow-hidden
  bg-[#3B2E7E]
  text-white
  h-12
  transition-all duration-300
  before:absolute before:inset-0
  before:-translate-x-full
  before:bg-gradient-to-r
  before:from-transparent
  before:via-white/30
  before:to-transparent
  before:transition-transform
  before:duration-700
  hover:before:translate-x-full
"
                  >
                    Start your Journey →
                  </Button>
                </Link>

                <Link href="/about">
                  <Button
                    variant="outline"
                    className=" relative overflow-hidden
  
  text-black
  h-12
  transition-all duration-300
  before:absolute before:inset-0
  before:-translate-x-full
  before:bg-gradient-to-r
  before:from-transparent
  before:via-white/30
  before:to-transparent
  before:transition-transform
  before:duration-700
  hover:before:translate-x-full"
                  >
                    Know more →
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </ImageVisibilityContext.Provider>
  );
};
