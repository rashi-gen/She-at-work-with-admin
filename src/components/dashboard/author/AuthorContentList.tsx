// src/components/dashboard/author/AuthorContentList.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  Clock,
  FileEdit,
  XCircle,
  Archive,
  PlusCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  contentType: string;
  status: string;
  featuredImage?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt?: string;
  createdAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface AuthorContentListProps {
  showActions?: boolean;
  limit?: number;
  showHeader?: boolean;
  onContentClick?: (content: ContentItem) => void;
}

export function AuthorContentList({
  showActions = true,
  limit = 10,
  showHeader = true,
  onContentClick
}: AuthorContentListProps) {
  const router = useRouter();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "ALL",
    type: "ALL"
  });

  const fetchContent = async (pageNum = 1, filterUpdates?: any) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: limit.toString(),
        ...(filterUpdates || filters)
      });

      const response = await fetch(`/api/author/content?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch content');
      }

      if (pageNum === 1) {
        setContent(result.data || []);
      } else {
        setContent(prev => [...prev, ...(result.data || [])]);
      }
      
      setTotalPages(result.pagination?.totalPages || 1);
      setHasMore(pageNum < (result.pagination?.totalPages || 1));
    } catch (error: any) {
      console.error("Error fetching content:", error);
      toast.error("Failed to load content", {
        description: error.message || "Please try again later"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [filters]);

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({ ...prev, status }));
    setPage(1);
  };

  const handleTypeFilter = (type: string) => {
    setFilters(prev => ({ ...prev, type }));
    setPage(1);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchContent(nextPage);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/author/content/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content? This action cannot be undone.")) return;

    try {
      const response = await fetch(`/api/content/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setContent(prev => prev.filter(item => item.id !== id));
        toast.success("Content deleted successfully");
      } else {
        toast.error("Failed to delete content", {
          description: result.error?.message || "Please try again"
        });
      }
    } catch (error: any) {
      console.error("Error deleting content:", error);
      toast.error("Failed to delete content", {
        description: "Please try again later"
      });
    }
  };

  const handleView = (slug: string) => {
    window.open(`/content/${slug}`, "_blank");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "DRAFT":
        return <FileEdit className="h-4 w-4 text-blue-500" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "ARCHIVED":
        return <Archive className="h-4 w-4 text-gray-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED": return "bg-green-100 text-green-800 border-green-200";
      case "PENDING": return "bg-amber-100 text-amber-800 border-amber-200";
      case "DRAFT": return "bg-blue-100 text-blue-800 border-blue-200";
      case "REJECTED": return "bg-red-100 text-red-800 border-red-200";
      case "ARCHIVED": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case "NEWS": return "bg-purple-100 text-purple-800 border-purple-200";
      case "BLOG": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "ENTRECHAT": return "bg-pink-100 text-pink-800 border-pink-200";
      case "SUCCESS_STORY": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "RESOURCE": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  if (loading && content.length === 0) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Card className="border-border bg-card">
      {showHeader && (
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle>My Content</CardTitle>
            <Button
              onClick={() => router.push("/dashboard/author/content/new")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Content
            </Button>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              <div className="flex gap-1">
                {["ALL", "DRAFT", "PENDING", "PUBLISHED", "REJECTED", "ARCHIVED"].map((status) => (
                  <Button
                    key={status}
                    variant={filters.status === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusFilter(status)}
                    className="h-8 text-xs"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Type:</span>
              <div className="flex gap-1">
                {["ALL", "NEWS", "BLOG", "ENTRECHAT", "SUCCESS_STORY", "RESOURCE"].map((type) => (
                  <Button
                    key={type}
                    variant={filters.type === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTypeFilter(type)}
                    className="h-8 text-xs"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className="p-0">
        {content.length === 0 && !loading ? (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No content yet</h3>
            <p className="text-muted-foreground mb-6">
              Start creating your first piece of content
            </p>
            <Button
              onClick={() => router.push("/dashboard/author/content/new")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Content
            </Button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-border">
              {content.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-secondary/10 transition-colors cursor-pointer group"
                  onClick={() => onContentClick ? onContentClick(item) : handleEdit(item.id)}
                >
                  <div className="flex items-start gap-4">
                    {item.featuredImage && (
                      <div className="flex-shrink-0">
                        <div className="h-16 w-24 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={item.featuredImage}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(item.status)}
                            <h4 className="font-medium text-foreground truncate">
                              {item.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <Badge 
                              variant="outline" 
                              className={getContentTypeColor(item.contentType)}
                            >
                              {item.contentType.replace("_", " ")}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={getStatusColor(item.status)}
                            >
                              {item.status}
                            </Badge>
                            {item.category && (
                              <Badge variant="outline" className="bg-background">
                                {item.category.name}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatDate(item.createdAt)}
                            </span>
                          </div>
                        </div>
                        
                        {showActions && (
                          <div className="flex-shrink-0 flex items-center gap-2">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {item.viewCount || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                {item.likeCount || 0}
                              </span>
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  handleView(item.slug);
                                }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(item.id);
                                }}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(item.id);
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </div>
                      
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          {item.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag.id}
                              className="inline-block px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                            >
                              {tag.name}
                            </span>
                          ))}
                          {item.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{item.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && content.length > 0 && (
              <div className="p-4 border-t border-border text-center">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}