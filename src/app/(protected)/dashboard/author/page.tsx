// src/app/(protected)/dashboard/user/page.tsx
import AuthorDashboard from "@/components/dashboard/author/AuthorDashboard";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";

export default function UserDashboardPage() {
  return (
    <DashboardLayout>
    <AuthorDashboard/>
    </DashboardLayout>
  );
}