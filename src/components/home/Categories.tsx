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
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Explore Our Content
          </h2>
          <p className="text-foreground/80 text-base">
            Dive into a wealth of resources designed to inspire, educate and
            empower your entrepreneurial journey.
          </p>
        </div>

        {/* Categories Grid - 2x2 */}
        <div
          className="grid sm:grid-cols-2 gap-x-20 gap-y-5 max-w-3xl mx-auto"
        >
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative p-8 rounded-3xl bg-white hover:shadow-lg transition-all duration-300"
            >
              {/* Icon with beige circle background */}
              <div className="inline-flex p-4 rounded-full bg-[#E5D4C9] mb-4">
                <category.icon
                  className="h-7 w-7 text-foreground"
                  strokeWidth={2}
                />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {category.name}
              </h3>
              <p className="text-sm text-foreground/70 mb-6 leading-relaxed">
                {category.description}
              </p>

              {/* Count & Explore Link */}
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-foreground">
                  {category.count}
                </span>
                <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors flex items-center gap-1.5 font-medium">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
