// src/app/(protected)/dashboard/admin/page.tsx
import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";

export default function AdminDashboardPage() {
  return (
    <DashboardLayout>
      <AdminDashboard />
    </DashboardLayout>
  );
}