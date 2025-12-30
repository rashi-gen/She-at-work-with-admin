// src/components/dashboard/author/AuthorDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  PlusCircle,
  Edit,
  Archive
} from "lucide-react";

interface AuthorStats {
  draftCount: number;
  pendingCount: number;
  publishedCount: number;
  rejectedCount: number;
  archivedCount: number;
  engagementRate: number;
}

interface ContentItem {
  id: string;
  title: string;
  type: string;
  status: string;
  updatedAt: string;
}

export default function AuthorDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<AuthorStats | null>(null);
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuthorData();
  }, []);

  const fetchAuthorData = async () => {
    try {
      // Fetch author's content stats
      const response = await fetch("/api/analytics?scope=my", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const analytics = await response.json();
      setStats(analytics.stats);

      // Fetch recent content
      const contentResponse = await fetch("/api/content?myContent=true&limit=5", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const content = await contentResponse.json();
      setRecentContent(content);
    } catch (error) {
      console.error("Error fetching author data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContent = () => {
    router.push("/dashboard/author/content/new");
  };

  const handleEditContent = (id: string) => {
    router.push(`/dashboard/author/content/edit/${id}`);
  };

  const handleViewAnalytics = () => {
    router.push("/dashboard/author/analytics");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED": return "text-green-600 bg-green-100";
      case "PENDING": return "text-amber-600 bg-amber-100";
      case "DRAFT": return "text-blue-600 bg-blue-100";
      case "REJECTED": return "text-red-600 bg-red-100";
      case "ARCHIVED": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
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
          <h1 className="text-3xl font-bold">Author Dashboard</h1>
          <p className="text-gray-600">Manage your content and stories</p>
        </div>
        <Button onClick={handleCreateContent}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Create New Content
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.publishedCount || 0}</div>
            <p className="text-xs text-gray-500">
              Live content pieces
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingCount || 0}</div>
            <p className="text-xs text-gray-500">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Edit className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.draftCount || 0}</div>
            <p className="text-xs text-gray-500">
              In progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.rejectedCount || 0}</div>
            <p className="text-xs text-gray-500">
              Needs revision
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
            <Archive className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.archivedCount || 0}</div>
            <p className="text-xs text-gray-500">
              Archived content
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.engagementRate || 0}%</div>
            <p className="text-xs text-gray-500">
              Average engagement rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Content</CardTitle>
          <Button variant="outline" onClick={() => router.push("/dashboard/author/content")}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentContent.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No content yet. Create your first piece!</p>
            ) : (
              recentContent.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        {item.type} • {new Date(item.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditContent(item.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Success Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Share inspiring success stories</p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push("/dashboard/author/stories")}
            >
              Manage Stories
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Content Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Track your content performance</p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleViewAnalytics}
            >
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Update your author profile</p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push("/dashboard/author/profile")}
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}