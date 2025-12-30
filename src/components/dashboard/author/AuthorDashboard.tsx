// src/components/dashboard/author/AuthorDashboard.tsx
"use client";

import { AuthorContentList } from "./AuthorContentList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  TrendingUp,
  Users,
  BarChart3,
  PlusCircle,
  Award
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthorDashboard() {
  const router = useRouter();

  const handleCreateContent = () => {
    router.push("/dashboard/author/content/new");
  };

  const handleViewAnalytics = () => {
    router.push("/dashboard/author/analytics");
  };

  const handleViewStories = () => {
    router.push("/dashboard/author/stories");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Author Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Manage your content and stories</p>
        </div>
        <Button 
          onClick={handleCreateContent}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Create New Content
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Content</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Live articles and blogs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4K</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Users className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground">
              Average engagement rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stories</CardTitle>
            <Award className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Success stories shared
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content */}
      <AuthorContentList 
        showHeader={false}
        limit={5}
        onContentClick={(content) => router.push(`/dashboard/author/content/edit/${content.id}`)}
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Success Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Share inspiring success stories</p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleViewStories}
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
            <p className="text-muted-foreground mb-4">Track your content performance</p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleViewAnalytics}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Update your author profile</p>
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