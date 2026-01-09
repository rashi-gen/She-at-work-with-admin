import { Button } from "@/components/ui/button";
import { Heart, Lightbulb,  Target, Users } from "lucide-react";
import Link from "next/link";

const values = [
  {
    icon: Heart,
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

export const About = () => {
  return (
    <section className="p-5 sm:p-20 p bg-secondary">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-md bg-[#3B2E7E] text-white text-sm font-medium mb-4">
              About She At Work
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
              Championing Women &apos;s Voices in Business Since 2017
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              She At Work is a dynamic platform dedicated to amplifying the stories, achievements, and insights of women entrepreneurs across the globe. We believe that when women succeed in business, entire communities thrive.
            </p>
            <p className="text-muted-foreground mb-8">
              Through our curated content, interviews, and events, we create spaces where women can learn, connect, and grow together. Our mission is to inspire the next generation of women leaders and founders.
            </p>
            <Link href="/about">
            <Button className=" text-[#3B2E7E] font-semibold shadow-glow bg-transparent  border-white border-2">
              Learn More About Us
              {/* <ArrowRight className="ml-2 h-4 w-4" /> */}
            </Button>
            </Link>
          </div>

          {/* Values Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="p-6 rounded-2xl bg-card border border-border/50 hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex p-3 rounded-xl bg-[#e0bba8]/20 text-[#e0bba8] mb-4">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-md text-muted-foreground max-w-lg">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
