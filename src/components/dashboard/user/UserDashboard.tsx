/*eslint-disable @typescript-eslint/no-explicit-any */
/*eslint-disable @typescript-eslint/no-unused-vars */
// src/components/dashboard/user/UserDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  Calendar,
  Bell,
  MessageSquare,
  Eye,
  Heart,
  TrendingUp,
  Clock
} from "lucide-react";

interface UserStats {
  bookmarksCount: number;
  upcomingEvents: number;
  unreadNotifications: number;
  commentsMade: number;
  contentViewed: number;
  likesGiven: number;
}

export default function UserDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch user stats from various endpoints
      const [bookmarksRes, eventsRes, notificationsRes] = await Promise.all([
        fetch("/api/bookmarks", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/events?registered=true&upcoming=true", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/notifications?read=false", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      const bookmarks = await bookmarksRes.json();
      const events = await eventsRes.json();
      const notifications = await notificationsRes.json();

      setStats({
        bookmarksCount: bookmarks.count || 0,
        upcomingEvents: events.count || 0,
        unreadNotifications: notifications.count || 0,
        commentsMade: 0, // You'll need to fetch this separately
        contentViewed: 0, // You'll need to fetch this separately
        likesGiven: 0, // You'll need to fetch this separately
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBookmarks = () => {
    router.push("/dashboard/user/bookmarks");
  };

  const handleViewEvents = () => {
    router.push("/dashboard/user/events");
  };

  const handleViewNotifications = () => {
    router.push("/dashboard/user/notifications");
  };

  const handleViewProfile = () => {
    router.push("/dashboard/user/profile");
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
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Welcome Back!</h1>
              <p className="text-gray-600">Here&apos;s what&apos;s happening with your account</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={handleViewProfile}>View Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
            <Bookmark className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.bookmarksCount || 0}</div>
            <p className="text-xs text-gray-500">
              Saved content pieces
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.upcomingEvents || 0}</div>
            <p className="text-xs text-gray-500">
              You&apos;re registered for
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.unreadNotifications || 0}</div>
            <p className="text-xs text-gray-500">
              Unread notifications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.commentsMade || 0}</div>
            <p className="text-xs text-gray-500">
              Total comments made
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Viewed</CardTitle>
            <Eye className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.contentViewed || 0}</div>
            <p className="text-xs text-gray-500">
              Articles read this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Likes Given</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.likesGiven || 0}</div>
            <p className="text-xs text-gray-500">
              Content you&apos;ve liked
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
              onClick={handleViewBookmarks}
              className="flex flex-col h-24 justify-center items-center gap-2"
            >
              <Bookmark className="h-8 w-8" />
              <span>View Bookmarks</span>
            </Button>

            <Button 
              variant="outline"
              onClick={handleViewEvents}
              className="flex flex-col h-24 justify-center items-center gap-2"
            >
              <Calendar className="h-8 w-8" />
              <span>My Events</span>
            </Button>

            <Button 
              variant="outline"
              onClick={handleViewNotifications}
              className="flex flex-col h-24 justify-center items-center gap-2"
            >
              <Bell className="h-8 w-8" />
              <span>Notifications</span>
            </Button>

            <Button 
              variant="outline"
              onClick={() => router.push("/newsletter")}
              className="flex flex-col h-24 justify-center items-center gap-2"
            >
              <TrendingUp className="h-8 w-8" />
              <span>Newsletter</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Your recent activities will appear here as you engage with the platform
              </p>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                  <span className="text-sm text-gray-400">{activity.time}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}