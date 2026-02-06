// components/GettingStarted.tsx
"use client";

import { globalSchema } from "@/data/globalschema";
import { PageBanner } from "./PageBanner";
import Cta from "./common/Cta";
import { ChevronDown } from "lucide-react";
import { useState } from "react";



// ---------------- TYPES ---------------- //

type Scheme = {
  id: number;
  title: string;
  description: string;
  link: string;
};

type CountrySchema = {
  country: string;
  data: Scheme[];
};

// -------------------------------------- //

export default function GlobalschemeComponent() {
  const countries: CountrySchema[] = globalSchema.countries;

  // Default selection → first country (or change to "India" if exists)
  const [selectedCountry, setSelectedCountry] = useState<string>(
    countries[0]?.country || ""
  );

  const currentCountry = countries.find(
    (c) => c.country === selectedCountry
  );

  const currentSchemes = currentCountry?.data || [];

  return (
    <main className="bg-background min-h-screen flex flex-col">
      {/* ================= HERO BANNER ================= */}
      <PageBanner
        title="Global Scheme"
        description="Check out options in the country that can set you up as an independent entrepreneur…your journey starts now!"
        image="/finalGettingstartedbanner.png"
      />

      {/* ================= MAIN CONTENT ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-secondary/10">
        <div className="max-w-screen-xl mx-auto">
          {/* Header + Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-3">
                Women Entrepreneurship Schemes
              </h2>
              <p className="text-muted-foreground max-w-3xl">
                Discover government and institutional support available for women-led businesses
                {selectedCountry && ` in ${selectedCountry}`}
              </p>
            </div>

            {/* Dropdown */}
            <div className="relative w-full sm:w-72">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full appearance-none bg-card border border-border rounded-xl px-4 py-3 pr-10 
                           text-foreground font-medium shadow-sm focus:outline-none focus:ring-2 
                           focus:ring-primary focus:border-primary transition-all cursor-pointer"
              >
                {countries.map((country) => (
                  <option key={country.country} value={country.country}>
                    {country.country}
                  </option>
                ))}
              </select>

              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Schemes Grid */}
          {currentSchemes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentSchemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl 
                             transition-all duration-300 border border-border hover:border-primary/30 
                             flex flex-col h-full"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {scheme.title}
                    </h3>

                    <p className="text-muted-foreground mb-6 flex-1 leading-relaxed">
                      {scheme.description}
                    </p>

                    {scheme.link && scheme.link.trim() !== "" && (
                      <a
                        href={scheme.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors mt-auto"
                      >
                        Learn More →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <p className="text-lg text-muted-foreground">
                No schemes listed yet for this country.
              </p>
              <p className="text-sm mt-2 text-muted-foreground/80">
                Data will be updated soon.
              </p>
            </div>
          )}
        </div>
      </section>

      <Cta />
    </main>
  );
}
