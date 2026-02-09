"use client";

import Cta from "@/components/common/Cta";
import { Award, Briefcase, ChevronDown, ChevronUp, Globe, Linkedin, Mail, Twitter } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const coreTeam = [
  {
    id: "ruby-sinha",
    name: "Ruby Sinha",
    role: "Founder & President",
    summary: "Founder of sheatwork.com and President of BRICS CCI Women's Vertical. An entrepreneur and journalist dedicated to empowering women in business.",
    bullets: [
      "President of BRICS CCI Women's Vertical",
      "Jury member for Enactus World Cup",
      "Panel expert for National Institute of Electronics and Information Technology",
      "Founder of award-winning brand communications firm, Kommune",
      "Former journalist with Indian Express Group"
    ],
    image: "/core-team/RubySinha.png",
    linkedin: "#",
    twitter: "#",
    email: "#",
    featured: true
  },
  {
    id: "shree-lahiri",
    name: "Shree Lahiri",
    role: "Content Head",
    summary: "Seasoned professional with 20+ years in corporate communications and journalism. Believes in the transformative power of storytelling.",
    bullets: [
      "Group Manager: Advertising at NIIT",
      "Features Editor at Mid-Day",
      "Deputy Editor at exchange4media",
      "Senior Editor with Reputation Today",
      "Consulting Editor with The New Global Indian"
    ],
    image: "/core-team/ShreeLahiri.png",
    linkedin: "#",
    twitter: "#",
    email: "#"
  },
  {
    id: "poonam-sinha",
    name: "Poonam Sinha",
    role: "Content Manager",
    summary: "Former educator turned content specialist with expertise in simplifying complex concepts into engaging, accessible language.",
    bullets: [
      "Former educator and facilitator in Kolkata",
      "English language specialist",
      "Content writing and editing",
      "Freelance content writer and editor",
      "Expert in distilling complex thoughts into simple language"
    ],
    image: "/core-team/PoonamSinha.png",
    linkedin: "#",
    twitter: "#",
    email: "#"
  },
  {
    id: "himanshu-gupta",
    name: "Himanshu Gupta",
    role: "Digital Marketing Manager",
    summary: "Digital marketing expert with 8+ years experience in campaign development, branding strategies, and performance analytics.",
    bullets: [
      "Digital Marketing Strategy & Campaign Development",
      "Brand Communications & Ad Management",
      "Performance Analytics & Multi-channel Marketing",
      "App promotion & customer acquisition",
      "Tracking key internet marketing metrics"
    ],
    image: "/core-team/HimanshuGupta.png",
    linkedin: "#",
    twitter: "#",
    email: "#"
  },
  {
    id: "shweta-sharma",
    name: "Shweta Sharma",
    role: "Manager - Outreach",
    summary: "Seasoned Communications professional with expertise in strategic PR, marketing, and stakeholder engagement.",
    bullets: [
      "Strategic Communications & Public Relations",
      "Marketing Strategy & Corporate Outreach",
      "Stakeholder Engagement",
      "Masters Degree in Marketing & Public Relations",
      "Experience across various sectors"
    ],
    image: "/core-team/ShwetaSharma.png",
    linkedin: "#",
    twitter: "#",
    email: "#"
  }
];

const advisoryBoard = [
  {
    id: "bela-rajan",
    name: "Bela Rajan",
    role: "Advisory Board Member",
    summary: "Leading woman entrepreneur and Co-Founder of Ketchum Sampark, with extensive experience in communications and women's empowerment.",
    bullets: [
      "Co-Founder & Director, Ketchum Sampark",
      "Director, August One Partners LLP",
      "Independent Director, Lloyds Steel",
      "Former Chairperson, FICCI FLO Mumbai",
      "Active in philanthropic work for women and girl child"
    ],
    image: "/core-team/bela-rajan.png",
    linkedin: "#",
    twitter: "#"
  },
  {
    id: "sanjeeva-shivesh",
    name: "Sanjeeva Shivesh",
    role: "Advisory Board Member",
    summary: "Serial entrepreneur, angel investor, and former civil service officer passionate about entrepreneurship and innovation.",
    bullets: [
      "Co-Founder of ThinkStartup, The Entrepreneurship School",
      "Former civil service officer and strategy consultant",
      "Angel investor and mentor",
      "Faculty at IIT Delhi, IIM, and other universities",
      "B.Tech from IIT Delhi, MBA from Cranfield School of Management"
    ],
    image: "/core-team/sanjeeva-shivesh.png",
    linkedin: "#",
    twitter: "#"
  }
];

export default function CoreTeamPage() {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const memberId = searchParams.get("member");
  const memberRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Function to handle scrolling to member
  const scrollToMember = (id: string) => {
    const element = memberRefs.current[id];
    if (element) {
      // Add a highlight animation
      element.style.transition = "all 0.3s ease";
      element.style.backgroundColor = "rgba(var(--primary), 0.05)";
      element.style.borderColor = "rgba(var(--primary), 0.5)";
      
      // Scroll to element
      element.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      
      // Remove highlight after animation
      setTimeout(() => {
        if (element) {
          element.style.backgroundColor = "";
          element.style.borderColor = "";
        }
      }, 2000);

      // Auto-expand the member
      setExpandedMember(id);
    }
  };

  // Handle URL parameter on component mount
  useEffect(() => {
    if (memberId) {
      // Wait a bit for the page to load
      const timer = setTimeout(() => {
        scrollToMember(memberId);
        
        // Update URL to remove the parameter after scrolling
        const url = new URL(window.location.href);
        url.searchParams.delete("member");
        window.history.replaceState({}, document.title, url.toString());
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [memberId]);

  const toggleExpand = (name: string) => {
    setExpandedMember(expandedMember === name ? null : name);
  };

  return (
    <main className="bg-background min-h-screen">
      {/* HERO BANNER */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-28 pb-2 overflow-hidden hero-gradient">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        <div className="relative w-full mx-auto text-center text-white px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 px-2 sm:px-0">
            Our Core Team
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 max-w-4xl mx-auto px-4 sm:px-8 lg:px-0">
            Meet the passionate individuals and advisors who drive our mission to empower women entrepreneurs through knowledge, community, and innovation.
          </p>
        </div>
      </section>

      {/* CORE TEAM */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-secondary/10">
        <div className="max-w-screen-xl mx-auto">
          <div className="space-y-8">
            {coreTeam.map((member, index) => (
              <div
                key={index}
                ref={(el) => { memberRefs.current[member.id] = el; }}
                className={`group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border ${
                  member.featured ? 'border-primary/30' : ''
                }`}
              >
                <div className="lg:flex">
                  {/* Image section - Fixed height */}
                  <div className="lg:w-1/4 relative h-64 lg:h-auto min-h-[256px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 25vw"
                      priority={member.featured}
                    />
                    {member.featured && (
                      <div className="absolute top-4 left-4">
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                          <Award className="h-3 w-3" />
                          Founder
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content section */}
                  <div className="lg:w-3/4 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-display font-bold text-foreground mb-1">
                          {member.name}
                        </h3>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium mb-4">
                          <Briefcase className="h-3 w-3" />
                          {member.role}
                        </div>
                        <p className="text-foreground mb-4 leading-relaxed">
                          {member.summary}
                        </p>
                      </div>
                      
                      {/* Social links */}
                      <div className="flex gap-2 mt-4 sm:mt-0">
                        <a
                          href={member.linkedin}
                          className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                          title="LinkedIn"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                        <a
                          href={member.twitter}
                          className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                          title="Twitter"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                        <a
                          href={`mailto:${member.email}`}
                          className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                          title="Email"
                        >
                          <Mail className="h-5 w-5" />
                        </a>
                      </div>
                    </div>

                    {/* Expandable bullet points */}
                    <div className="border-t border-border pt-6">
                      <button
                        onClick={() => toggleExpand(member.id)}
                        className="flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors mb-4"
                      >
                        {expandedMember === member.id ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            Show Less Details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            View Key Achievements & Expertise
                          </>
                        )}
                      </button>
                      
                      {expandedMember === member.id && (
                        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-3 animate-fadeIn">
                          {member.bullets.map((bullet, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <span className="text-muted-foreground">{bullet}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADVISORY BOARD */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium mb-4">
              <Globe className="h-4 w-4" />
              Advisory Board
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
              Guiding Voices
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Industry leaders and experts who provide strategic guidance and mentorship
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {advisoryBoard.map((advisor, index) => (
              <div
                key={index}
                ref={(el) => { memberRefs.current[advisor.id] = el; }}
                className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-border"
              >
                <div className="flex flex-col h-full">
                  <div className="p-6 sm:p-8 flex-1">
                    <div className="flex items-start gap-6 mb-6">
                      {/* Fixed height image */}
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={advisor.image}
                          alt={advisor.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-display font-bold text-foreground mb-1">
                          {advisor.name}
                        </h3>
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-3">
                          {advisor.role}
                        </div>
                        <p className="text-foreground">
                          {advisor.summary}
                        </p>
                      </div>
                    </div>

                    {/* Bullet points - always visible for advisors */}
                    <div className="space-y-2 mt-4">
                      {advisor.bullets.slice(0, 4).map((bullet, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground text-sm">{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <div className="flex gap-2">
                      <a
                        href={advisor.linkedin}
                        className="w-10 h-10 rounded-lg bg-secondary hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a
                        href={advisor.twitter}
                        className="w-10 h-10 rounded-lg bg-secondary hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add custom animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes highlightPulse {
          0%, 100% {
            background-color: transparent;
            border-color: var(--border);
          }
          50% {
            background-color: rgba(var(--primary), 0.05);
            border-color: rgba(var(--primary), 0.5);
          }
        }
        
        .highlight-member {
          animation: highlightPulse 2s ease-in-out;
        }
      `}</style>

      <Cta />
    </main>
  );
}