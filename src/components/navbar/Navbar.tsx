"use client";

import { Button } from "@/components/ui/button";
import { Menu, Search, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "News", href: "/news" },
  { name: "Blogs", href: "/blogs" },
  { name: "Entrechat", href: "/entrechat" },
  { name: "Events", href: "/events" },
  { name: "Contact", href: "/contact" },
];

const aboutDropdownItems = [
  { name: "About Us", href: "/about" },
  { name: "Core Team", href: "/about/core-team" },
  // { name: "Press Room", href: "/about/press-room" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAboutDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsAboutDropdownOpen(false);
  }, [pathname]);

  // Check if current path is under about section
  const isAboutActive = pathname.startsWith("/about");

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-background border-b border-border transition-all duration-500">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-0">
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
              className="transition-all duration-500"
            />
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    text-sm font-medium transition-colors duration-300
                    ${
                      isActive
                        ? "text-accent"
                        : "text-foreground hover:text-accent"
                    }
                  `}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* ABOUT US DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
                className={`
                  flex items-center gap-1 text-sm font-medium transition-colors duration-300
                  ${
                    isAboutActive
                      ? "text-accent"
                      : "text-foreground hover:text-accent"
                  }
                `}
              >
                About Us
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isAboutDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* DROPDOWN MENU */}
              {isAboutDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 rounded-lg shadow-lg bg-card border border-border py-2 animate-in slide-in-from-top-5">
                  {aboutDropdownItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`
                          block px-4 py-2 text-sm transition-colors
                          ${
                            isActive
                              ? "bg-accent/10 text-accent"
                              : "text-foreground hover:bg-accent/5 hover:text-accent"
                          }
                        `}
                        onClick={() => setIsAboutDropdownOpen(false)}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SEARCH */}
            <button className="text-muted-foreground hover:text-accent transition-colors">
              <Search className="h-5 w-5" />
            </button>

            {/* CTA */}
            <Button className="px-6 py-2.5 rounded-xl font-semibold bg-accent text-accent-foreground hover:bg-accent/90 transition-all">
              <Link href="/share-your-story">Share Your Story</Link>
            </Button>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="lg:hidden mt-2 rounded-2xl shadow-lg bg-card border border-border">
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      py-2 text-base font-medium transition-colors
                      ${
                        isActive
                          ? "text-accent"
                          : "text-foreground hover:text-accent"
                      }
                    `}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* MOBILE ABOUT DROPDOWN */}
              <div className="flex flex-col">
                <button
                  onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
                  className={`
                    flex items-center justify-between py-2 text-base font-medium transition-colors text-left
                    ${
                      isAboutActive
                        ? "text-accent"
                        : "text-foreground hover:text-accent"
                    }
                  `}
                >
                  About Us
                  <ChevronDown 
                    className={`h-5 w-5 transition-transform duration-300 ${
                      isAboutDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* MOBILE DROPDOWN ITEMS */}
                {isAboutDropdownOpen && (
                  <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-border pl-4">
                    {aboutDropdownItems.map((item) => {
                      const isActive = pathname === item.href;

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => {
                            setIsOpen(false);
                            setIsAboutDropdownOpen(false);
                          }}
                          className={`
                            py-2 text-base font-medium transition-colors
                            ${
                              isActive
                                ? "text-accent"
                                : "text-foreground hover:text-accent"
                            }
                          `}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <Button className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-all">
                <Link href="/share-your-story">Share Your Story</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};