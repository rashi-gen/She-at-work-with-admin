// src/components/dashboard/author/StoryManager.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Upload,
  Award
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Story {
  id: string;
  title: string;
  story: string;
  businessName?: string;
  industry?: string;
  images: string[];
  status: string;
  submittedAt: string;
  reviewedAt?: string;
}

export function StoryManager() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    story: "",
    businessName: "",
    industry: "",
    images: [] as string[]
  });

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch("/api/author/stories");
      const result = await response.json();
      setStories(result.data || []);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const url = editingStory ? `/api/stories/${editingStory.id}` : "/api/stories";
      const method = editingStory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchStories();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving story:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return;

    try {
      await fetch(`/api/stories/${id}`, {
        method: "DELETE",
      });
      fetchStories();
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      story: "",
      businessName: "",
      industry: "",
      images: []
    });
    setEditingStory(null);
    setShowForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-amber-100 text-amber-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PUBLISHED": return <CheckCircle className="h-4 w-4" />;
      case "PENDING": return <Clock className="h-4 w-4" />;
      case "REJECTED": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Success Stories</h1>
          <p className="text-muted-foreground">Share and manage your success stories</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Share Story
        </Button>
      </div>

      {/* Story Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingStory ? 'Edit Story' : 'Share Your Success Story'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Story Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What's your success story about?"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="businessName">Business/Project Name</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                placeholder="Your business or project name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry/Field</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                placeholder="e.g., Technology, Fashion, Food, etc."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="story">Your Story *</Label>
              <Textarea
                id="story"
                value={formData.story}
                onChange={(e) => setFormData(prev => ({ ...prev, story: e.target.value }))}
                placeholder="Share your journey, challenges, achievements..."
                rows={8}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Images</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center mt-1">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload images related to your story
                </p>
                <Button variant="outline" size="sm">
                  Choose Images
                </Button>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {editingStory ? 'Update Story' : 'Submit Story'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stories List */}
      <Card>
        <CardHeader>
          <CardTitle>My Stories</CardTitle>
        </CardHeader>
        <CardContent>
          {stories.length === 0 ? (
            <div className="text-center py-8">
              <Award className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No stories yet</h3>
              <p className="text-muted-foreground mb-4">
                Share your success story to inspire others
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Share Your First Story
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {stories.map(story => (
                <div
                  key={story.id}
                  className="border rounded-lg p-4 hover:bg-secondary/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{story.title}</h3>
                        <Badge className={getStatusColor(story.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(story.status)}
                            {story.status}
                          </span>
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        {(story.businessName || story.industry) && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {story.businessName && (
                              <span>Business: {story.businessName}</span>
                            )}
                            {story.industry && (
                              <span>Industry: {story.industry}</span>
                            )}
                          </div>
                        )}
                        
                        <p className="text-sm line-clamp-3">
                          {story.story}
                        </p>
                        
                        <div className="text-xs text-muted-foreground">
                          Submitted: {new Date(story.submittedAt).toLocaleDateString()}
                          {story.reviewedAt && (
                            <span className="ml-4">
                              Reviewed: {new Date(story.reviewedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingStory(story);
                          setFormData({
                            title: story.title,
                            story: story.story,
                            businessName: story.businessName || "",
                            industry: story.industry || "",
                            images: story.images
                          });
                          setShowForm(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(story.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}