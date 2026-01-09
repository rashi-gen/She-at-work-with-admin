"use client";

import { useEffect, useState, createContext } from "react";
import { Button } from "@/components/ui/button";

const IMAGES = ["/banner1.png", "/banner2.png","hero-banner.jpg"];

export const ImageVisibilityContext = createContext({
  isImageVisible: false,
});

export const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Carousel logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ImageVisibilityContext.Provider value={{ isImageVisible: true }}>
      {/* Add pt-24 to account for navbar height (96px = 24 * 4px) */}
      <section className="relative min-h-screen lg:h-screen overflow-hidden pt-24">
        {/* Background Images - Start after navbar */}
        {IMAGES.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentImageIndex === index ? "opacity-100 z-0" : "opacity-0 z-[-1]"
            }`}
            style={{ top: "96px" }} // Start images after navbar (6rem = 96px)
          >
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${image})`,
                backgroundPosition: "top center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                height: "calc(100vh - 96px)", // Subtract navbar height
              }}
            />
          </div>
        ))}

        {/* Content - Adjusted for navbar */}
        <div className="relative z-10 min-h-screen flex items-center" style={{ minHeight: "calc(100vh - 96px)" }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6"> {/* Reduced top padding */}
              {/* Badge */}
              <div className="inline-flex border border-white/50 px-4 sm:px-5 py-2 text-xs sm:text-sm md:text-base text-white mb-4 sm:mb-5 md:mb-6">
                Dummy Text
              </div>

              {/* Heading */}
              <h1 className="text-white leading-tight">
                <span className="block text-3xl sm:text-5xl font-light">
                  Empowering
                </span>

                <span className="block text-4xl sm:text-6xl font-bold sm:font-extrabold mt-1 sm:mt-2">
                  Women
                </span>

                 <span className="block text-4xl sm:text-6xl  font-bold sm:font-extrabold mt-1 sm:mt-2">
                  Entrepreneurs
                </span>
              </h1>
              
              <h2 className="mt-3 sm:mt-4 text-lg sm:text-3xl  text-white/90 font-semibold">
                Since 2017
              </h2>

              {/* Description */}
              <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg  text-white/90 leading-relaxed max-w-3xl">
                A dynamic one-stop knowledge hub dedicated to amplifying the voices,
                achievements, and insights of women entrepreneurs globally.
              </p>

              {/* Buttons */}
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5">
                <Button className="bg-[#3B2E7E] hover:bg-[#33276A] text-white h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base md:text-lg w-full sm:w-auto">
                  Explore Stories →
                </Button>

                <Button
                  variant="outline"
                  className="border-white bg-white text-[#3B2E7E] hover:bg-white/90  hover:text-black h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base md:text-lg w-full sm:w-auto"
                >
                  Join the Community
                </Button>
              </div>

          
            </div>
          </div>
        </div>
      </section>
    </ImageVisibilityContext.Provider>
  );
};