// src/components/dashboard/layout/DashboardSidebar.tsx
"use client";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  Bell,
  Bookmark,
  Calendar,
  ChevronRight,
  FileCheck,
  FileText,
  Home,
  MessageSquare,
  Settings,
  Shield,
  TrendingUp,
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

interface DashboardSidebarProps {
  role: string;
}

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    // Common items
    {
      href: "/dashboard",
      label: "Overview",
      icon: <Home className="h-5 w-5" />,
      roles: ["USER", "AUTHOR", "ADMIN", "SUPER_ADMIN"],
    },
    {
      href: "/dashboard/profile",
      label: "Profile",
      icon: <Settings className="h-5 w-5" />,
      roles: ["USER", "AUTHOR", "ADMIN", "SUPER_ADMIN"],
    },

    // User specific
    {
      href: "/dashboard/user/bookmarks",
      label: "Bookmarks",
      icon: <Bookmark className="h-5 w-5" />,
      roles: ["USER", "AUTHOR", "ADMIN", "SUPER_ADMIN"],
    },
    {
      href: "/dashboard/user/events",
      label: "My Events",
      icon: <Calendar className="h-5 w-5" />,
      roles: ["USER", "AUTHOR", "ADMIN", "SUPER_ADMIN"],
    },
    {
      href: "/dashboard/user/notifications",
      label: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      roles: ["USER", "AUTHOR", "ADMIN", "SUPER_ADMIN"],
    },

    // Author specific
    {
      href: "/dashboard/author/content",
      label: "My Content",
      icon: <FileText className="h-5 w-5" />,
      roles: ["AUTHOR", "ADMIN", "SUPER_ADMIN"],
    },
    {
      href: "/dashboard/author/stories",
      label: "Success Stories",
      icon: <TrendingUp className="h-5 w-5" />,
      roles: ["AUTHOR", "ADMIN", "SUPER_ADMIN"],
    },
    {
      href: "/dashboard/author/analytics",
      label: "My Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      roles: ["AUTHOR", "ADMIN", "SUPER_ADMIN"],
    },

    // Admin specific
    {
      href: "/dashboard/admin/content",
      label: "Content Moderation",
      icon: <FileCheck className="h-5 w-5" />,
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      href: "/dashboard/admin/events",
      label: "Event Management",
      icon: <Calendar className="h-5 w-5" />,
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      href: "/dashboard/admin/comments",
      label: "Comment Moderation",
      icon: <MessageSquare className="h-5 w-5" />,
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      href: "/dashboard/admin/stories",
      label: "Story Review",
      icon: <TrendingUp className="h-5 w-5" />,
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      href: "/dashboard/admin/analytics",
      label: "Platform Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      href: "/dashboard/admin/contacts",
      label: "Contact Messages",
      icon: <MessageSquare className="h-5 w-5" />,
      roles: ["ADMIN", "SUPER_ADMIN"],
    },

    // Super Admin specific
    {
      href: "/dashboard/superadmin/users",
      label: "User Management",
      icon: <Users className="h-5 w-5" />,
      roles: ["SUPER_ADMIN"],
    },
    {
      href: "/dashboard/superadmin/audit-logs",
      label: "Audit Logs",
      icon: <Shield className="h-5 w-5" />,
      roles: ["SUPER_ADMIN"],
    },
    {
      href: "/dashboard/superadmin/system",
      label: "System Settings",
      icon: <Settings className="h-5 w-5" />,
      roles: ["SUPER_ADMIN"],
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <aside className="w-64 bg-card border-r border-border min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-1">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition-all duration-300",
                isActive
                  ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-l-4 border-primary"
                  : "text-muted-foreground hover:bg-secondary/20 hover:text-foreground hover:border-l-4 hover:border-secondary"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "transition-colors",
                  isActive ? "text-primary" : "group-hover:text-foreground"
                )}>
                  {item.icon}
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <ChevronRight className={cn(
                "h-4 w-4 transition-transform",
                isActive ? "text-primary translate-x-1" : "opacity-0 group-hover:opacity-100"
              )} />
            </Link>
          );
        })}
      </nav>
      
      {/* Footer section with gradient */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-2">
            Need help? <a href="/contact" className="text-primary hover:underline">Contact Support</a>
          </div>
          <div className="w-full h-1 rounded-full bg-gradient-to-r from-primary via-accent to-secondary"></div>
        </div>
      </div>
    </aside>
  );
}