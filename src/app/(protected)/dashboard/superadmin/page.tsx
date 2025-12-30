// src/app/(protected)/dashboard/user/page.tsx
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import SuperAdminDashboard from "@/components/dashboard/superadmin/SuperAdminDashboard";

export default function UserDashboardPage() {
  return (
    <DashboardLayout>
  <SuperAdminDashboard/>
    </DashboardLayout>
  );
}