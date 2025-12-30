// src/components/dashboard/layout/DashboardLayout.tsx
"use client";

import { ReactNode } from "react";
import { useCurrentRole, useCurrentUser } from "@/hooks/auth";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const role = useCurrentRole();
  const user = useCurrentUser();

  if (!role || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center text-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} role={role} />
      <div className="flex">
        <DashboardSidebar role={role} />
        <main className="flex-1 p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}