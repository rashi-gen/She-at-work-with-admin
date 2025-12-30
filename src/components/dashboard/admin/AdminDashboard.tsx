// src/components/dashboard/admin/AdminDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Calendar,
  MessageSquare,
  Users,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

interface AdminStats {
  pendingContent: number;
  publishedContent: number;
  upcomingEvents: number;
  pendingComments: number;
  pendingStories: number;
  unresolvedContacts: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const responses = await Promise.all([
        fetch("/api/content?status=PENDING", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/content?status=PUBLISHED", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/events?type=UPCOMING", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/stories?status=PENDING", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/contacts?resolved=false", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      const data = await Promise.all(responses.map(r => r.json()));
      setStats({
        pendingContent: data[0].count || 0,
        publishedContent: data[1].count || 0,
        upcomingEvents: data[2].count || 0,
        pendingComments: 0, // You'll need to implement this endpoint
        pendingStories: data[3].count || 0,
        unresolvedContacts: data[4].count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentModeration = () => {
    router.push("/dashboard/admin/content?status=PENDING");
  };

  const handleEventManagement = () => {
    router.push("/dashboard/admin/events");
  };

  const handleCommentModeration = () => {
    router.push("/dashboard/admin/comments");
  };

  // const handleStoryReview = () => {
  //   router.push("/dashboard/admin/stories?status=PENDING");
  // };

  const handleContactManagement = () => {
    router.push("/dashboard/admin/contacts");
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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Content management and moderation</p>
        </div>
        <Button onClick={() => router.push("/dashboard/admin/analytics")}>
          <BarChart3 className="w-4 h-4 mr-2" />
          View Analytics
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Content</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingContent || 0}</div>
            <p className="text-xs text-gray-500">
              Awaiting moderation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.upcomingEvents || 0}</div>
            <p className="text-xs text-gray-500">
              Events to manage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Stories</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingStories || 0}</div>
            <p className="text-xs text-gray-500">
              Success stories to review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unresolved Contacts</CardTitle>
            <MessageSquare className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.unresolvedContacts || 0}</div>
            <p className="text-xs text-gray-500">
              Contact messages to respond
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Content</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.publishedContent || 0}</div>
            <p className="text-xs text-gray-500">
              Live on platform
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Comments</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingComments || 0}</div>
            <p className="text-xs text-gray-500">
              Comments to moderate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={handleContentModeration}
              className="flex flex-col h-24 justify-center items-center gap-2"
            >
              <FileText className="h-8 w-8" />
              <span>Moderate Content</span>
            </Button>

            <Button 
              variant="outline"
              onClick={handleEventManagement}
              className="flex flex-col h-24 justify-center items-center gap-2"
            >
              <Calendar className="h-8 w-8" />
              <span>Manage Events</span>
            </Button>

            <Button 
              variant="outline"
              onClick={handleCommentModeration}
              className="flex flex-col h-24 justify-center items-center gap-2"
            >
              <MessageSquare className="h-8 w-8" />
              <span>Moderate Comments</span>
            </Button>

            <Button 
              variant="outline"
              onClick={handleContactManagement}
              className="flex flex-col h-24 justify-center items-center gap-2"
            >
              <Users className="h-8 w-8" />
              <span>Contact Messages</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-gray-500 text-center">Your recent moderation activities will appear here</p>
            {/* Add recent activities component */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}