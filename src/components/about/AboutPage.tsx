"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Lightbulb,
  Linkedin,
  Sparkles,
  Target,
  Twitter,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

const stats = [
  { value: "975+", label: "Articles & Resources" },
  { value: "121+", label: "Events & Webinars" },
  { value: "50k+", label: "Community Reach" },
    { value: "85+", label: "Countries Reached" },
];

const coreValues = [
  {
    icon: Sparkles,
    title: "Empowerment",
    description: `We believe in uplifting women by providing a "storehouse of information"—from government schemes to funding avenues—that unlocks their potential to succeed.`,
  },
  {
    icon: Users,
    title: "Community",
    description: "We cultivate an ecosystem where women entrepreneurs connect to exchange best practices, share experiences, and widen their opportunities together.",
  },
  {
    icon: Target,
    title: "Impact",
    description: "We are committed to driving positive change, offering mentorship programs to support rural enterprises and amplify women's voices in the business landscape.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We embrace forward-thinking approaches, keeping our community updated with the latest industry trends, digital skills, and creative business solutions.",
  },
];

const teamMembers = [
  {
    name: "Ruby Sinha",
    role: "Founder & President (BRICS CCI WE)",
    image: "/team1.jpg",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Shree Lahiri",
    role: "Content Head",
    image: "/team2.jpg",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Poonam Sinha",
    role: "Content Manager",
    image: "/team3.jpg",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Himanshu Gupta",
    role: "Digital Marketing Manager",
    image: "/team4.jpg",
    linkedin: "#",
    twitter: "#",
  },
];

const journey = [
  {
    year: "2017",
    title: "The Beginning",
    description:
      "Launched in Jan 2017 as a comprehensive hub to educate and motivate women entrepreneurs globally.",
  },
  {
    year: "2020",
    title: "Digital Acceleration",
    description:
      `Expanded digital outreach with webinars and "She@Work TV" to support entrepreneurs during the pandemic.`,
  },
  {
    year: "2023",
    title: "Global Leadership",
    description:
      "Founder Ruby Sinha appointed as President of the BRICS CCI Women’s Vertical, strengthening international ties.",
  },
  {
    year: "2025",
    title: "Future Forward",
    description:
      `Launching "Ready, Set, Lead" initiatives to nurture the next generation of Gen Z and Millennial founders.`,
  },
];

export default function AboutPage() {
    const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stats.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  return (
    <main className="bg-background min-h-screen pt-24 sm:pt-24">
     

      
           <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-12  overflow-hidden hero-gradient">
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
      
              <div className="relative w-full mx-auto text-center text-white px-4">
                 <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 px-2 sm:px-0">
                Empowering Women{" "}
                <span className="text-transparent bg-clip-text bg-white">
                  Entrepreneurs
                </span>
                <br className="hidden sm:block" />
                Since 2017
              </h1>
               <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 max-w-4xl mx-auto px-4 sm:px-8 lg:px-0">
              A dynamic one-stop knowledge hub dedicated to amplifying the voices, achievements, and insights of women entrepreneurs globally.
              </p>
      
              </div>
            </section>

      {/* ================= OUR STORY ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-screen-xl mx-auto text-center px-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-4 sm:mb-6">
            Our Story
          </h2>
          <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-4xl mx-auto">
            <p>
           SheAtWork.com germinated with a singular objective: to support women who are looking to start an entrepreneurial venture that aligns with their abilities and skills. Launched in January 2017, our aim is to educate, train, support, and motivate women entrepreneurs globally. 
            </p>
            <p>
             We provide a storehouse of information to increase awareness on all relevant areas of entrepreneurship—from innovative business ideas and startup funding avenues to legal support and mentor connections.
            </p>
          
          </div>
        </div>
      </section>



{/* ================= STATS WITH GRADIENT ================= */}
<section className="relative px-4 sm:px-6 lg:px-8 py-3 sm:py-12 overflow-hidden hero-gradient">
  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />

  <div className="relative max-w-screen-xl mx-auto px-5">
    
    {/* ================= MOBILE PPT SLIDE ================= */}
    <div className="sm:hidden flex justify-center items-center h-[120px] relative overflow-hidden">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`absolute flex flex-col items-center text-center text-white
            transition-all duration-500 ease-in-out
            ${
              index === activeIndex
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-6 pointer-events-none"
            }
          `}
        >
          <div className="text-4xl font-bold tracking-tight">
            {stat.value}
          </div>
          <span className="mt-2 text-sm font-semibold text-white/90 uppercase tracking-wide">
            {stat.label}
          </span>
        </div>
      ))}
    </div>

    {/* ================= DESKTOP / TABLET ================= */}
    <div className="hidden sm:grid grid-cols-4 gap-1 text-center text-white">
      {stats.map((stat, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="text-3xl lg:text-5xl font-medium tracking-tight">
            {stat.value}
          </div>
          <span className="mt-3 text-base font-medium text-white/90 uppercase tracking-wide">
            {stat.label}
          </span>
        </div>
      ))}
    </div>

  </div>
</section>

      {/* ================= CORE VALUES ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-secondary/30">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-2 sm:mb-3">
              Our Core Values
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {coreValues.map((value, i) => (
              <div
                key={i}
                className="group relative bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border-2 border-border hover:border-primary/30"
              >
                <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <value.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
                </div>

                <div className="mt-8 sm:mt-10 lg:mt-12">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-foreground mb-2 sm:mb-3">
                    {value.title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= OUR MISSION ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-8 sm:gap-12 items-center px-4">
          {/* LEFT TEXT */}
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-4 sm:mb-6">
              Our Mission
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              <p>
                To create a one-stop knowledge hub for any woman aspiring to be an entrepreneur or aiming to move to the next level. We hope to help all women entrepreneurs expand their frontiers and enhance their skills to achieve their true potential.
              </p>
              <p>
               We strive to provide a friendly forum for growth through the right knowledge and professional networking. By giving visibility to women entrepreneurs and running mentoring programs, we generate peer support across both urban and rural sectors.
              </p>
            </div>
          </div>

          {/* RIGHT IMAGE/PLACEHOLDER */}
          <div className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg sm:shadow-2xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary blur-2xl opacity-30" />
            <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 h-48 sm:h-64 lg:h-80 xl:h-96 flex items-center justify-center text-muted-foreground/30 text-4xl sm:text-5xl lg:text-6xl font-display">
              Mission
            </div>
          </div>
        </div>
      </section>

      {/* ================= MEET OUR TEAM ================= */}
      <section className="  bg-secondary/30">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-2 sm:mb-3">
              Meet Our Team
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto">
              The passionate individuals behind She At Work
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className="group bg-card rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-border"
              >
                {/* AVATAR */}
                <div className="relative bg-gradient-to-br from-primary to-accent h-48 sm:h-56 lg:h-64 flex items-center justify-center">
                  <div className="text-white text-4xl sm:text-5xl lg:text-6xl font-display opacity-20">
                    {member.name.charAt(0)}
                  </div>
                </div>

                {/* INFO */}
                <div className="p-4 sm:p-6 text-center">
                  <h3 className="text-base sm:text-lg lg:text-xl font-display font-bold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    {member.role}
                  </p>

                  {/* SOCIAL LINKS */}
                  <div className="flex justify-center gap-2">
                    <a
                      href={member.linkedin}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-secondary hover:bg-primary flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                    >
                      <Linkedin className="h-3 w-3 sm:h-4 sm:w-4" />
                    </a>
                    <a
                      href={member.twitter}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-secondary hover:bg-primary flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                    >
                      <Twitter className="h-3 w-3 sm:h-4 sm:w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= OUR JOURNEY - TIMELINE ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-2 sm:mb-3">
              Our Journey
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto">
              Milestones that shaped who we are today
            </p>
          </div>

          {/* TIMELINE */}
          <div className="relative">
            {/* CENTER LINE */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary via-accent to-primary hidden md:block" />

            <div className="space-y-8 sm:space-y-12">
              {journey.map((item, i) => (
                <div
                  key={i}
                  className={`relative flex items-start md:items-center ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } flex-col gap-4 sm:gap-6 md:gap-8`}
                >
                  {/* CONTENT */}
                  <div className="flex-1 w-full md:w-1/2">
                    <div
                      className={`bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-border ${
                        i % 2 === 0 ? "md:mr-8" : "md:ml-8"
                      }`}
                    >
                      <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* CENTER DOT */}
                  <div className="relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg z-10">
                    {item.year}
                  </div>

                  {/* SPACER */}
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 overflow-hidden hero-gradient">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

        <div className="relative max-w-screen-xl mx-auto text-center text-white px-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold mb-3 sm:mb-4">
            Join Our Mission
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto">
            Be part of a community that&apos;s shaping the future of women
            entrepreneurship
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button className="h-10 sm:h-12 bg-white text-primary hover:bg-white/90 font-semibold px-6 sm:px-8 text-sm sm:text-base">
              Become a Member
            </Button>
            <Button
              variant="outline"
              className="h-10 sm:h-12 border-2 border-white text-primary hover:bg-white/10 font-semibold px-6 sm:px-8 text-sm sm:text-base"
            >
              Partner With Us
              <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}