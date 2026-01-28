/*eslint-disable @typescript-eslint/no-explicit-any */
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
  AlertCircle,
  PlusCircle,
  BookOpen,
  FileCheck
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
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      // Fetch all necessary data
      const [contentRes, eventsRes, contactsRes, storiesRes] = await Promise.all([
        fetch("/api/content", { headers }),
        fetch("/api/events", { headers }),
        fetch("/api/contact-submissions", { headers }),
        fetch("/api/stories?status=PENDING", { headers }).catch(() => ({ 
          ok: false, 
          json: async () => ({ success: false, data: [], count: 0 }) 
        })),
      ]);

      const contentData = await contentRes.json();
      const eventsData = await eventsRes.json();
      const contactsData = await contactsRes.json();
      const storiesData = storiesRes.ok ? await storiesRes.json() : { data: [], count: 0 };

      console.log("Stories Data:", storiesData); // Debug log

      // Count pending content from all content (all content types)
      const pendingContent = contentData.data?.filter((item: any) => 
        item.status === "PENDING"
      ).length || 0;

      // Count published content
      const publishedContent = contentData.data?.filter((item: any) => 
        item.status === "PUBLISHED"
      ).length || 0;

      // Count upcoming events
      const upcomingEvents = eventsData.data?.filter((item: any) => 
        item.status === "UPCOMING"
      ).length || 0;

      // Count unresolved contacts
      const unresolvedContacts = contactsData.data?.filter((item: any) => 
        !item.isResolved
      ).length || 0;

      // Count pending stories from /api/stories endpoint
      const pendingStories = storiesData.data?.length || storiesData.count || 0;

      setStats({
        pendingContent,
        publishedContent,
        upcomingEvents,
        pendingComments: 0, // You'll need to implement this endpoint
        pendingStories,
        unresolvedContacts,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Set default values on error
      setStats({
        pendingContent: 0,
        publishedContent: 0,
        upcomingEvents: 0,
        pendingComments: 0,
        pendingStories: 0,
        unresolvedContacts: 0,
      });
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

  const handleContactManagement = () => {
    router.push("/dashboard/admin/contacts");
  };

  const handleCreateContent = () => {
    router.push("/dashboard/author/content/new");
  };

  const handleManageContent = () => {
    router.push("/dashboard/author/content");
  };

  const handleStoryReview = () => {
    router.push("/dashboard/admin/stories?status=PENDING");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Content management and moderation</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleCreateContent}
            className="flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Create Content
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push("/dashboard/admin/analytics")}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={handleContentModeration}
        >
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

        <Card 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={handleEventManagement}
        >
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

        <Card 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={handleStoryReview}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Stories</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingStories || 0}</div>
            <p className="text-xs text-gray-500">
              Success stories to review
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={handleContactManagement}
        >
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

        <Card 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => router.push("/dashboard/author/content?status=PUBLISHED")}
        >
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

        <Card 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={handleCommentModeration}
        >
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={handleCreateContent}
                className="flex flex-col h-24 justify-center items-center gap-2"
              >
                <PlusCircle className="h-8 w-8" />
                <span>Create New Content</span>
              </Button>

              <Button 
                variant="outline"
                onClick={handleManageContent}
                className="flex flex-col h-24 justify-center items-center gap-2"
              >
                <FileText className="h-8 w-8" />
                <span>Manage My Content</span>
              </Button>

              <Button 
                variant="outline"
                onClick={handleContentModeration}
                className="flex flex-col h-24 justify-center items-center gap-2"
              >
                <FileCheck className="h-8 w-8" />
                <span>Moderate Content</span>
              </Button>

              <Button 
                variant="outline"
                onClick={handleCommentModeration}
                className="flex flex-col h-24 justify-center items-center gap-2"
              >
                <MessageSquare className="h-8 w-8" />
                <span>Moderate Comments</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                onClick={handleContactManagement}
                className="flex flex-col h-24 justify-center items-center gap-2"
              >
                <Users className="h-8 w-8" />
                <span>Contact Messages</span>
              </Button>

              <Button 
                variant="outline"
                onClick={handleStoryReview}
                className="flex flex-col h-24 justify-center items-center gap-2"
              >
                <BookOpen className="h-8 w-8" />
                <span>Review Stories</span>
              </Button>

              <Button 
                variant="outline"
                onClick={() => router.push("/dashboard/admin/categories")}
                className="flex flex-col h-24 justify-center items-center gap-2"
              >
                <BarChart3 className="h-8 w-8" />
                <span>Manage Categories</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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