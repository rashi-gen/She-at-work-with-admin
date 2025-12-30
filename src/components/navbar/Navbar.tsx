'use client'

import { Button } from "@/components/ui/button";
import { Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useContext } from "react";
import { ImageVisibilityContext } from "@/components/home/HeroSection";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "News", href: "/news" },
  { name: "Blogs", href: "/blogs" },
  { name: "Entrechat", href: "/entrechat" },
  { name: "Events", href: "/events" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isImageVisible } = useContext(ImageVisibilityContext);

  return (
    <nav
      className={`
        fixed top-0 inset-x-0 z-50 transition-all duration-500 
        ${isImageVisible ? "bg-transparent" : "bg-background border-b border-border"}
      `}
    >
      <div className="mx-auto px-6 ">
        {/* TOP BAR */}
        <div className="flex items-center justify-between h-24">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="She At Work"
              width={140}
              height={50}
              priority
              className={`transition-all duration-500 ${
                isImageVisible ? "brightness-0 invert" : ""
              }`}
            />
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  text-sm font-medium transition-colors duration-300
                  ${isImageVisible
                    ? "text-primary-foreground/90 hover:text-primary-foreground"
                    : "text-foreground hover:text-primary"
                  }
                `}
              >
                {link.name}
              </Link>
            ))}

            {/* SEARCH */}
            <button
              className={`
                transition-colors
                ${isImageVisible
                  ? "text-primary-foreground/80 hover:text-primary-foreground"
                  : "text-muted-foreground hover:text-primary"
                }
              `}
            >
              <Search className="h-5 w-5" />
            </button>

            {/* CTA */}
            <Button
              className={`
                px-6 py-2.5 rounded-xl font-semibold transition-all
                ${isImageVisible
                  ? "bg-primary/90 text-primary-foreground hover:bg-primary"
                  : "bg-accent text-accent-foreground hover:bg-accent/90"
                }
              `}
            >
              Share Your Story
            </Button>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
              lg:hidden p-2 transition-colors
              ${isImageVisible
                ? "text-primary-foreground"
                : "text-foreground"
              }
            `}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div
            className={`
              lg:hidden mt-2 rounded-2xl shadow-lg transition-all
              ${isImageVisible
                ? "bg-background/90 backdrop-blur-md border border-border"
                : "bg-card border border-border"
              }
            `}
          >
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    py-2 text-base font-medium transition-colors
                    ${isImageVisible
                      ? "text-foreground hover:text-primary"
                      : "text-foreground hover:text-primary"
                    }
                  `}
                >
                  {link.name}
                </Link>
              ))}

              <Button
                className={`
                  mt-4 transition-all
                  ${isImageVisible
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-accent text-accent-foreground hover:bg-accent/90"
                  }
                `}
              >
                Share Your Story
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
