import {
  ArrowRight,
  BookOpen,
  Calendar,
  MessageCircle,
  Newspaper,
} from "lucide-react";
import Link from "next/link";

const categories = [
  {
    name: "Blogs",
    description: "Insights, tips and thought leadership from women...",
    count: "875+",
    icon: BookOpen,
    href: "/blogs",
  },
  {
    name: "News",
    description: "Latest updates on women entrepreneurship and...",
    count: "500+",
    icon: Newspaper,
    href: "/news",
  },
  {
    name: "Entrechat",
    description: "In-depth conversations with successful women founders",
    count: "121+",
    icon: MessageCircle,
    href: "/entrechat",
  },
  {
    name: "Events",
    description: "Workshops, Webinars and networking opportunities",
    count: "50+",
    icon: Calendar,
    href: "/events",
  },
];

export const Categories = () => {
  return (
    <section className="py-10 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Explore Our Content
          </h2>
          <p className="text-foreground/80 text-base">
            Dive into a wealth of resources designed to inspire, educate and
            empower your entrepreneurial journey.
          </p>
        </div>

        {/* Horizontal scroll on mobile, 1 row on desktop */}
        <div className="flex gap-8 overflow-x-auto md:overflow-visible scrollbar-hide">
          {categories.map((category) => (
        <Link
  key={category.name}
  href={category.href}
  className="
    group
    relative
    p-8
    rounded-3xl
    bg-white
    transition-all duration-300 ease-out
    flex-shrink-0
    w-[280px] md:w-[260px] lg:w-[280px]
    hover:-translate-y-2
    hover:scale-[1.02]
    hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]
    overflow-hidden
  "
>
  {/* Hover background glow */}
  <div className="
    absolute inset-0 opacity-0
    bg-gradient-to-br from-[#3B2E7E]/5 to-transparent
    transition-opacity duration-300
    group-hover:opacity-100
  " />

  {/* Icon */}
  <div className="
    relative z-10
    inline-flex p-4 rounded-full
    bg-[#E5D4C9]
    mb-4
    transition-all duration-300
    group-hover:bg-[#3B2E7E]/10
    group-hover:scale-110
  ">
    <category.icon
      className="h-7 w-7 text-foreground transition-transform duration-300 group-hover:scale-110"
      strokeWidth={2}
    />
  </div>

  {/* Content */}
  <h3 className="relative z-10 text-2xl font-bold text-foreground mb-3 transition-colors duration-300 group-hover:text-[#3B2E7E]">
    {category.name}
  </h3>

  <p className="relative z-10 text-sm text-foreground/70 mb-6 leading-relaxed">
    {category.description}
  </p>

  {/* Count & Explore */}
  <div className="relative z-10 flex items-center justify-between">
    <span className="text-3xl font-bold text-foreground transition-transform duration-300 group-hover:scale-105">
      {category.count}
    </span>

    <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors flex items-center gap-1.5 font-medium">
      Explore
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
    </span>
  </div>
</Link>

          ))}
        </div>
      </div>
    </section>
  );
};

