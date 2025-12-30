"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HeroWaves } from "./HeroWaves";

const IMAGE_SLIDE = "/hero-banner.jpg"; // Your image path

// Create a context to share the image state with navbar
import { createContext } from "react";

export const ImageVisibilityContext = createContext({
  isImageVisible: false,
});

export const HeroSection = () => {
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    // After 2 seconds, show the image
    const initialTimeout = setTimeout(() => {
      setShowImage(true);
    }, 2000);

    // Set up the carousel interval
    const interval = setInterval(() => {
      // Hide image (show waves)
      setShowImage(false);
      
      // After 2 seconds, show image again
      setTimeout(() => {
        setShowImage(true);
      }, 2000);
    }, 8000); // 6s image + 2s waves = 8s total

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <ImageVisibilityContext.Provider value={{ isImageVisible: showImage }}>
      <section className="relative min-h-screen overflow-hidden py-16 px-5 sm:px-20">
        {/* Image Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${IMAGE_SLIDE})`,
            opacity: showImage ? 1 : 0,
          }}
        />

        {/* Base Gradient */}
        <div className={`absolute inset-0 hero-gradient transition-opacity duration-1000 ${
          showImage ? 'opacity-40' : 'opacity-100'
        }`} />

        {/* Wave Overlay */}
        <HeroWaves />

        {/* Content */}
        <div className="relative z-10 mx-auto pt-24 sm:pt-28">
          {/* Badge */}
          <div className="inline-flex border border-white/40 px-4 py-2 text-sm sm:text-md font-medium text-white backdrop-blur">
            Empowering Women Entrepreneurs Since 2018
          </div>

          {/* Heading */}
          <h1 className="mt-6 font-normal text-white leading-tight">
            <span className="block text-3xl sm:text-5xl">
              Shaping the Future of
            </span>

            <span className="block font-bold text-4xl sm:text-[70px]">
              Women
            </span>

            <span className="block font-bold text-3xl sm:text-[60px]">
              Entrepreneurship
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-3xl text-base sm:text-2xl text-white/90">
            Join the vibrant community of visionary women leaders, founders, and
            changemakers. Discover inspiring stories, insights and resources to
            fuel your entrepreneurial journey.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-5">
            <Button className="bg-[#3B2E7E] hover:bg-[#33276A] text-white text-base sm:text-xl h-12 w-full sm:w-60">
              Explore Stories →
            </Button>

            <Button
              variant="outline"
              className="border-white bg-white text-[#3B2E7E] hover:bg-white/90 text-base sm:text-xl h-12 w-full sm:w-60"
            >
              Join the Community
            </Button>
          </div>
        </div>
      </section>
    </ImageVisibilityContext.Provider>
  );
};