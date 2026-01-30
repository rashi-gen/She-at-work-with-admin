"use client";

import { Linkedin, Twitter, Award, Briefcase, Mail, Globe } from "lucide-react";
import { PageBanner } from "@/components/PageBanner";
import Cta from "@/components/common/Cta";
import Image from "next/image";

const coreTeam = [
  {
    name: "Ruby Sinha",
    role: "Founder & President",
    description: "Ruby Sinha is the founder of sheatwork.com, a one-stop knowledge hub for women entrepreneurs. She is also the President of the Women's Wing of the BRICS Chamber of Commerce and Industry (BRICS-CCI WE). Founded in 2012, BRICS CCI is empanelled with NITI Aayog and recognized by the United Nations. The objective of BRICS CCI is to create an enabling support system especially for the MSME segment of businesses and young entrepreneurs from across all geographies.",
    achievements: [
      "President of BRICS CCI Women's Vertical",
      "Jury member for Enactus World Cup",
      "Panel expert for National Institute of Electronics and Information Technology",
      "Founder of award-winning brand communications firm, Kommune"
    ],
    image: "/core-team/RubySinha.png",
    linkedin: "#",
    twitter: "#",
    email: "#",
    featured: true
  },
  {
    name: "Shree Lahiri",
    role: "Content Head",
    description: "Playing with words is her favourite pastime, and for her 'The pen is mightier than the sword', as she believes the power of the pen is all-pervasive. Her varied experience spans Image Management and Journalism. Currently, she is also Senior Editor with Reputation Today and Consulting Editor with The New Global Indian.",
    experience: [
      "Group Manager: Advertising at NIIT",
      "Features Editor at Mid-Day",
      "Deputy Editor at exchange4media",
      "20+ years in corporate communications and journalism"
    ],
    image: "/core-team/ShreeLahiri.png",
    linkedin: "#",
    twitter: "#",
    email: "#"
  },
  {
    name: "Poonam Sinha",
    role: "Content Manager",
    description: "There is no greater agony than bearing an untold story inside you.' Her thoughts are in resonance with this and this is what inspires her to write; distilling complex thoughts into simple language, easily understood by all.",
    expertise: [
      "Former educator and facilitator",
      "English language specialist",
      "Content writing and editing",
      "Simplifying complex concepts"
    ],
    image: "/core-team/PoonamSinha.png",
    linkedin: "#",
    twitter: "#",
    email: "#"
  },
  {
    name: "Himanshu Gupta",
    role: "Digital Marketing Manager",
    description: "A digital marketing manager with over 8 years experience in campaign development, branding strategies, brand communications and ad management. Creating and implemented external and internal communications strategies for key company initiatives.",
    skills: [
      "Digital Marketing Strategy",
      "Campaign Development",
      "Brand Communications",
      "Performance Analytics",
      "Multi-channel Marketing"
    ],
    image: "/core-team/HimanshuGupta.png",
    linkedin: "#",
    twitter: "#",
    email: "#"
  },
  {
    name: "Shweta Sharma",
    role: "Manager - Outreach",
    description: "Shweta is a seasoned Communications professional with years of experience across various sectors. She holds a Masters Degree in Marketing & Public Relations.",
    expertise: [
      "Strategic Communications",
      "Public Relations",
      "Marketing Strategy",
      "Stakeholder Engagement",
      "Corporate Outreach"
    ],
    image: "/core-team/ShwetaSharma.png",
    linkedin: "#",
    twitter: "#",
    email: "#"
  }
];

const advisoryBoard = [
  {
    name: "Bela Rajan",
    role: "Advisory Board Member",
    description: "A leading woman entrepreneur, Bela Rajan was the Co-Founder and Director of Ketchum Sampark a leading communications firm. Bela, along with her husband also incubated the School of Communications and Reputation (SCoRE).",
    achievements: [
      "Co-Founder & Director, Ketchum Sampark",
      "Director, August One Partners LLP",
      "Independent Director, Lloyds Steel",
      "Former Chairperson, FICCI FLO Mumbai"
    ],
    image: "/core-team/bela-rajan.png",
    linkedin: "#",
    twitter: "#"
  },
  {
    name: "Sanjeeva Shivesh",
    role: "Advisory Board Member",
    description: "A former civil service officer, strategy consultant and private equity fund manager, Sanjeeva Shivesh is a serial entrepreneur and angel investor. He is a CoFounder of ThinkStartup, The Entrepreneurship School, Predict Technologies, Xclerator Venture Partners and Shatadree ThinkTank. His passion lies in Entrepreneurship, Innovation, Economics, Public Policy and Constitutional developments. ",
    expertise: [
      "Co-Founder of ThinkStartup, The Entrepreneurship School",
      "Former civil service officer",
      "Angel investor and mentor",
      "Faculty at multiple universities including IIT Delhi, IIM"
    ],
    image: "/core-team/sanjeeva-shivesh.png",
    linkedin: "#",
    twitter: "#"
  }
];

export default function CoreTeamPage() {
  return (
    <main className="bg-background min-h-screen">
      {/* HERO BANNER */}
      <PageBanner
        title="Our Core Team"
        description="Meet the passionate individuals and advisors who drive our mission to empower women entrepreneurs through knowledge, community, and innovation."
       image="/aboutus/Aboutusbanner.png"
      />

      {/* INTRODUCTION */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-6">
            The Driving Force Behind Our Mission
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our team combines diverse expertise with a shared passion for empowering women entrepreneurs. 
            From strategic leadership to content creation and digital innovation, each member plays a 
            crucial role in building a supportive ecosystem for women in business.
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
                className={`group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border ${
                  member.featured ? 'border-primary/30' : ''
                }`}
              >
                <div className="lg:flex">
                  {/* Image section */}
                  <div className="lg:w-1/4 relative h-56 lg:h-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 33vw"
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
                  <div className="lg:w-2/3 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-display font-bold text-foreground mb-1">
                          {member.name}
                        </h3>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                          <Briefcase className="h-3 w-3" />
                          {member.role}
                        </div>
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

                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {member.description}
                    </p>

                 
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
                className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-border"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={advisor.image}
                        alt={advisor.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-foreground mb-1">
                        {advisor.name}
                      </h3>
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                        {advisor.role}
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    {advisor.description}
                  </p>

               

                  <div className="flex gap-2 mt-6 pt-6 border-t border-border">
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
            ))}
          </div>
        </div>
      </section>

  

      <Cta />
    </main>
  );
}