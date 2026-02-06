"use client";

import { useEffect, useState, createContext } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const IMAGES = ["/home/Homebanner1.png", "/home/Homebanner2.png"];

export const ImageVisibilityContext = createContext({
  isImageVisible: false,
});

export const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Carousel logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length);
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
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentImageIndex === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image}
                alt="Hero background"
                fill
                priority={index === 0}
                className="object-cover object-top"
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        {/* Content */}
        <div
          className="relative z-10 flex items-center"
          style={{ minHeight: "calc(100vh - 96px)" }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl px-4 sm:px-6 lg:px-8">

              {/* Trust Badge (Moved from headline hierarchy) */}
              <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm sm:text-lg font-medium">
                Since 2017 • Trusted Global Community
              </div>

              {/* Primary Headline (Action Driven) */}
              <h1 className="text-white leading-tight">
                <span className="block text-3xl sm:text-7xl font-light">
                  Turn Your Ambition
                </span>

                <span className="block text-4xl sm:text-7xl font-bold sm:font-semibold mt-1 sm:mt-2">
                  Into Action
                </span>
              </h1>

              {/* Supporting Statement */}
              <p className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-2xl">
                A dynamic one-stop knowledge hub dedicated to amplifying the
                voices, achievements, and insights of women entrepreneurs
                globally - helping ideas grow into impactful journeys.
              </p>

              {/* Buttons */}
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5">
                <Link href="/entrechat">
                  <Button className="bg-[#3B2E7E] hover:bg-[#33276A] text-white h-10 sm:h-12 text-sm sm:text-base md:text-lg w-full sm:w-auto">
                    Start your Journey →
                  </Button>
                </Link>

                <Link href="/about">
                  <Button
                    variant="outline"
                    className="border-white bg-white text-[#3B2E7E] hover:bg-white/90 hover:text-black h-10 sm:h-12 text-sm sm:text-base md:text-lg w-full sm:w-auto"
                  >
                    Know more →
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>
    </ImageVisibilityContext.Provider>
  );
};
