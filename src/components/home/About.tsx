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
    <section className="p-5 sm:p-20 sm:py-5 bg-secondary">
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
            <p className="text-xl text-muted-foreground mb-6">
              SheAtWork.com germinated with a singular objective: to support women who are looking to start an entrepreneurial venture that aligns with their abilities and skills. Launched in January 2017, our aim is to educate, train, support, and motivate women entrepreneurs globally.
            </p>
            <p className="text-muted-foreground text-lg mb-8">
              We provide a storehouse of information to increase awareness on all relevant areas of entrepreneurship—from innovative business ideas and startup funding avenues to legal support and mentor connections.
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
            {values.map((value) => (
         <div
  key={value.title}
  className="
    group
    p-6 rounded-2xl
    bg-card
    border border-border/50
    transition-all duration-300 ease-out
    hover:-translate-y-2
    hover:shadow-xl
    hover:border-[#3B2E7E]/30
  "
>
  {/* Icon */}
  <div
    className="
      inline-flex p-3 rounded-xl
      bg-[#e0bba8]/20 text-[#e0bba8]
      mb-4
      transition-all duration-300
      group-hover:scale-110
      group-hover:rotate-3
      group-hover:bg-[#3B2E7E]/10
    "
  >
    <value.icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
  </div>

  <h3 className="text-xl font-display font-bold text-foreground mb-2 transition-colors duration-300 group-hover:text-[#3B2E7E]">
    {value.title}
  </h3>

  <p className="text-md text-muted-foreground max-w-lg transition-colors duration-300 group-hover:text-foreground/80">
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
