/*eslint-disable @typescript-eslint/no-explicit-any */
// src/components/dashboard/superadmin/SuperAdminDashboard.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Archive,
  Calendar,
  Download,
  FileText,
  Shield,
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalContent: number;
  publishedContent: number;
  pendingContent: number;
  totalEvents: number;
  upcomingEvents: number;
  auditLogs: number;
}

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchSystemStats();
    fetchRecentActivities();
  }, []);

  const fetchSystemStats = async () => {
    try {
      const response = await fetch("/api/analytics?scope=all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await fetch("/api/audit-logs?limit=5", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setRecentActivities(data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleExportData = async (entity: string) => {
    try {
      const response = await fetch("/api/system/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ entity, format: "csv" }),
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${entity}_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const handleUserManagement = () => {
    router.push("/dashboard/superadmin/users");
  };

  const handleAuditLogs = () => {
    router.push("/dashboard/superadmin/audit-logs");
  };

  const handleSystemExport = () => {
    router.push("/dashboard/superadmin/export");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-gray-600">Full system control and monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleSystemExport()}>
            <Download className="w-4 h-4 mr-2" />
            Export System Data
          </Button>
          <Button variant="outline" onClick={() => handleAuditLogs()}>
            <Shield className="w-4 h-4 mr-2" />
            View Audit Logs
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-gray-500">
              {stats?.activeUsers || 0} active • {stats?.suspendedUsers || 0} suspended
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalContent || 0}</div>
            <p className="text-xs text-gray-500">
              {stats?.publishedContent || 0} published • {stats?.pendingContent || 0} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEvents || 0}</div>
            <p className="text-xs text-gray-500">
              {stats?.upcomingEvents || 0} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audit Logs</CardTitle>
            <Shield className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.auditLogs || 0}</div>
            <p className="text-xs text-gray-500">
              System activities tracked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={handleUserManagement}
              className="flex flex-col h-24 justify-center items-center gap-2"
            >
              <Users className="h-8 w-8" />
              <span>User Management</span>
            </Button>

            <Button 
              variant="outline"
              onClick={() => router.push("/dashboard/admin/content?deleted=true")}
              className="flex flex-col h-24 justify-center items-center gap-2"
            >
              <Archive className="h-8 w-8" />
              <span>Deleted Content</span>
            </Button>

            <Button 
              variant="outline"
              onClick={() => handleExportData("users")}
              className="flex flex-col h-24 justify-center items-center gap-2"
            >
              <Download className="h-8 w-8" />
              <span>Export Users</span>
            </Button>

            <Button 
              variant="outline"
              onClick={() => handleExportData("content")}
              className="flex flex-col h-24 justify-center items-center gap-2"
            >
              <Download className="h-8 w-8" />
              <span>Export Content</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">
                    User ID: {activity.userId} • {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  IP: {activity.ipAddress}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}