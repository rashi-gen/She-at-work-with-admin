// src/components/dashboard/author/ContentEditor.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Save,
  Eye,
  Send,
  Calendar,
  Tag,
  X,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface ContentEditorProps {
  contentId?: string;
  onSuccess?: () => void;
}

export function ContentEditor({ contentId, onSuccess }: ContentEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    contentType: "BLOG",
    categoryId: "",
    featuredImage: "",
    status: "DRAFT",
    language: "ENGLISH",
    isFeatured: false,
    scheduledPublishAt: ""
  });

  useEffect(() => {
    fetchCategories();
    fetchTags();
    if (contentId) {
      fetchContent();
    } else {
      generateSlug();
    }
  }, [contentId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/tags");
      const data = await response.json();
      setTags(data.data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/content/${contentId}`);
      const result = await response.json();
      
      if (result.success) {
        const content = result.data;
        setFormData({
          title: content.title,
          slug: content.slug,
          summary: content.summary || "",
          content: content.content,
          contentType: content.contentType,
          categoryId: content.category?.id || "",
          featuredImage: content.featuredImage || "",
          status: content.status,
          language: content.language || "ENGLISH",
          isFeatured: content.isFeatured || false,
          scheduledPublishAt: content.scheduledPublishAt || ""
        });
        setSelectedTags(content.tags?.map((t: Tag) => t.id) || []);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      setError("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'title') {
      setTimeout(generateSlug, 300);
    }
  };

  const handleAddTag = (tagId: string) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags(prev => [...prev, tagId]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(prev => prev.filter(id => id !== tagId));
  };

  const handleCreateTag = async () => {
    if (!tagInput.trim()) return;

    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: tagInput.trim(),
          slug: tagInput.trim().toLowerCase().replace(/\s+/g, '-')
        })
      });

      const result = await response.json();
      if (result.success) {
        setTags(prev => [...prev, result.data]);
        handleAddTag(result.data.id);
      }
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

  const handleSubmit = async (status: string) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const data = {
        ...formData,
        status,
        tags: selectedTags,
        scheduledPublishAt: formData.scheduledPublishAt || null
      };

      const url = contentId ? `/api/content/${contentId}` : "/api/content";
      const method = contentId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(`Content ${contentId ? 'updated' : 'created'} successfully!`);
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/dashboard/author/content");
          }
        }, 1500);
      } else {
        setError(result.error?.message || "Failed to save content");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      setError("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card className="border-border bg-card">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle>
              {contentId ? 'Edit Content' : 'Create New Content'}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/author/content")}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSubmit("DRAFT")}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSubmit("PENDING")}
                disabled={saving}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit for Review
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter content title"
                  className="mt-1"
                />
              </div>

              {/* Slug */}
              <div>
                <Label htmlFor="slug">Slug *</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="url-slug"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateSlug}
                  >
                    Generate
                  </Button>
                </div>
              </div>

              {/* Summary */}
              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => handleInputChange("summary", e.target.value)}
                  placeholder="Brief summary of your content"
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Write your content here..."
                  className="mt-1 font-mono"
                  rows={12}
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Content Type */}
              <div>
                <Label htmlFor="contentType">Content Type</Label>
                <Select
                  value={formData.contentType}
                  onValueChange={(value) => handleInputChange("contentType", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEWS">News</SelectItem>
                    <SelectItem value="BLOG">Blog</SelectItem>
                    <SelectItem value="ENTRECHAT">Entrechat</SelectItem>
                    <SelectItem value="SUCCESS_STORY">Success Story</SelectItem>
                    <SelectItem value="RESOURCE">Resource</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => handleInputChange("categoryId", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="mt-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tags..."
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCreateTag}
                    >
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map(tagId => {
                      const tag = tags.find(t => t.id === tagId);
                      return tag ? (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag.name}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag.id)}
                            className="hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ) : null;
                    })}
                  </div>

                  {tags.length > 0 && (
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground mb-2">Suggestions:</p>
                      <div className="flex flex-wrap gap-1">
                        {tags
                          .filter(tag => !selectedTags.includes(tag.id))
                          .slice(0, 10)
                          .map(tag => (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              className="cursor-pointer hover:bg-secondary"
                              onClick={() => handleAddTag(tag.id)}
                            >
                              {tag.name}
                            </Badge>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Featured Image */}
              <div>
                <Label>Featured Image</Label>
                <div className="mt-1">
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag & drop or click to upload
                    </p>
                    <Button variant="outline" size="sm">
                      Choose Image
                    </Button>
                  </div>
                  {formData.featuredImage && (
                    <div className="mt-2">
                      <img
                        src={formData.featuredImage}
                        alt="Featured"
                        className="h-32 w-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Language */}
              <div>
                <Label htmlFor="language">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => handleInputChange("language", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENGLISH">English</SelectItem>
                    <SelectItem value="HINDI">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Schedule Publishing */}
              <div>
                <Label htmlFor="scheduledPublishAt">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Schedule Publishing
                </Label>
                <Input
                  id="scheduledPublishAt"
                  type="datetime-local"
                  value={formData.scheduledPublishAt}
                  onChange={(e) => handleInputChange("scheduledPublishAt", e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Featured */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => handleInputChange("isFeatured", e.target.checked)}
                  className="rounded border-border"
                />
                <Label htmlFor="isFeatured" className="font-normal">
                  Mark as Featured Content
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);