/*eslint-disable  @typescript-eslint/no-explicit-any */
// src/components/dashboard/admin/ContentModeration.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CalendarIcon,
  Check,
  Eye,
  FileText,
  Filter,
  RefreshCw,
  Search,
  Trash2,
  X
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
// import { toast } from "@/components/ui/use-toast";

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  contentType: string;
  status: string;
  publishedAt: string | null;
  scheduledPublishAt: string | null
  featuredImage: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isFeatured: boolean;
  isTrending: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    slug: string;
    avatar: string | null;
  };
  category: {
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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface FilterParams {
  status: string;
  contentType: string;
  author: string;
  category: string;
  search: string;
  dateFrom: string;
  dateTo: string;
}

export default function ContentModeration() {
  // const router = useRouter();
  const searchParams = useSearchParams();
  
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  
  const [filters, setFilters] = useState<FilterParams>({
    status: searchParams.get('status') || 'PENDING',
    contentType: searchParams.get('type') || '',
    author: searchParams.get('author') || '',
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
  });
  
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);
  
  const [authors, setAuthors] = useState<Array<{id: string, name: string}>>([]);
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);
  
  useEffect(() => {
    fetchContent();
    fetchAuthors();
    fetchCategories();
  }, [filters, pagination.page]);
  
  const fetchContent = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters
      });
      
      const response = await fetch(`/api/content?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setContent(data.data || []);
        setPagination(data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        });
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      // toast({
      //   title: "Error",
      //   description: "Failed to load content",
      //   variant: "destructive",
      // });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAuthors = async () => {
    try {
      const response = await fetch('/api/authors');
      const data = await response.json();
      if (data.success) {
        setAuthors(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  const handleFilterChange = (key: keyof FilterParams, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };
  
  const handlePublish = async (contentId: string, publishNow: boolean = true, scheduledDate?: Date) => {
    try {
      setProcessing(contentId);
      const token = localStorage.getItem('token');
      
      const updateData: any = {
        status: 'PUBLISHED',
      };
      
      if (publishNow) {
        updateData.publishedAt = new Date().toISOString();
      } else if (scheduledDate) {
        updateData.scheduledPublishAt = scheduledDate.toISOString();
        updateData.status = 'PENDING'; // Keep as pending until scheduled time
      }
      
      const response = await fetch(`/api/content/${contentId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // toast({
        //   title: "Success",
        //   description: publishNow 
        //     ? "Content published successfully!" 
        //     : "Content scheduled for publishing!",
        // });
        fetchContent();
        setScheduleOpen(false);
        setSelectedDate(undefined);
      } else {
        // toast({
        //   title: "Error",
        //   description: data.error || "Failed to publish content",
        //   variant: "destructive",
        // });
        console.log(data.error)
      }
    } catch (error) {
      console.error('Error publishing content:', error);
      // toast({
      //   title: "Error",
      //   description: "An error occurred while publishing",
      //   variant: "destructive",
      // });
    } finally {
      setProcessing(null);
    }
  };
  
  const handleReject = async (contentId: string) => {
    if (!rejectReason.trim()) {
      // toast({
      //   title: "Validation Error",
      //   description: "Please provide a reason for rejection",
      //   variant: "destructive",
      // });
      return;
    }
    
    try {
      setProcessing(contentId);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/content/${contentId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'REJECTED',
          reviewNotes: rejectReason,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // toast({
        //   title: "Content Rejected",
        //   description: "The content has been rejected with your notes",
        // });
        fetchContent();
        setRejectOpen(false);
        setRejectReason('');
      }
    } catch (error) {
      console.error('Error rejecting content:', error);
      // toast({
      //   title: "Error",
      //   description: "Failed to reject content",
      //   variant: "destructive",
      // });
    } finally {
      setProcessing(null);
    }
  };
  
  const handleArchive = async (contentId: string) => {
    try {
      setProcessing(contentId);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/content/${contentId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'ARCHIVED',
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // toast({
        //   title: "Content Archived",
        //   description: "The content has been archived",
        // });
        fetchContent();
      }
    } catch (error) {
      console.error('Error archiving content:', error);
      // toast({
      //   title: "Error",
      //   description: "Failed to archive content",
      //   variant: "destructive",
      // });
    } finally {
      setProcessing(null);
    }
  };
  
  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'PENDING': 'bg-amber-100 text-amber-800',
      'PUBLISHED': 'bg-green-100 text-green-800',
      'ARCHIVED': 'bg-slate-100 text-slate-800',
      'REJECTED': 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge className={cn("capitalize", variants[status] || 'bg-gray-100 text-gray-800')}>
        {status.toLowerCase()}
      </Badge>
    );
  };
  
  const getTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      'NEWS': 'bg-blue-100 text-blue-800',
      'BLOG': 'bg-purple-100 text-purple-800',
      'ENTRECHAT': 'bg-pink-100 text-pink-800',
      'SUCCESS_STORY': 'bg-emerald-100 text-emerald-800',
      'RESOURCE': 'bg-indigo-100 text-indigo-800',
    };
    
    return (
      <Badge className={cn("capitalize", variants[type] || 'bg-gray-100 text-gray-800')}>
        {type.toLowerCase().replace('_', ' ')}
      </Badge>
    );
  };
  
  const handlePreview = async (contentId: string) => {
    const item = content.find(c => c.id === contentId);
    if (item) {
      setSelectedContent(item);
      setPreviewOpen(true);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Content Moderation</h1>
          <p className="text-gray-600">Review and publish content submitted by authors</p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchContent}
          disabled={loading}
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Filters</CardTitle>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {content.length} of {pagination.total} items
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Search by title, author, or content..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending Review</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Content Type */}
            <div>
              <Label htmlFor="contentType">Content Type</Label>
              <Select
                value={filters.contentType}
                onValueChange={(value) => handleFilterChange('contentType', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="BLOG">Blog</SelectItem>
                  <SelectItem value="NEWS">News</SelectItem>
                  <SelectItem value="ENTRECHAT">Entrechat</SelectItem>
                  <SelectItem value="SUCCESS_STORY">Success Story</SelectItem>
                  <SelectItem value="RESOURCE">Resource</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Author */}
            <div>
              <Label htmlFor="author">Author</Label>
              <Select
                value={filters.author}
                onValueChange={(value) => handleFilterChange('author', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All authors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Authors</SelectItem>
                  {authors.map(author => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Category */}
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Date Range */}
            <div className="lg:col-span-2">
              <Label>Date Range</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    placeholder="From"
                  />
                </div>
                <div>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    placeholder="To"
                  />
                </div>
              </div>
            </div>
            
            {/* Clear Filters */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    status: 'PENDING',
                    contentType: '',
                    author: '',
                    category: '',
                    search: '',
                    dateFrom: '',
                    dateTo: '',
                  });
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Content Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="mt-4 text-gray-600">Loading content...</p>
              </div>
            </div>
          ) : content.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No content found</h3>
              <p className="text-gray-600 text-center mt-2">
                {filters.status === 'PENDING' 
                  ? "No pending content to review. Authors will submit content here for approval."
                  : "Try changing your filters or check back later."
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Title</th>
                    <th className="text-left p-4 font-medium">Author</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Submitted</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {content.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/25">
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          {item.featuredImage && (
                            <img
                              src={item.featuredImage}
                              alt={item.title}
                              className="h-12 w-12 rounded object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {item.summary || 'No summary available'}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.tags.slice(0, 3).map(tag => (
                                <Badge key={tag.id} variant="outline" className="text-xs">
                                  {tag.name}
                                </Badge>
                              ))}
                              {item.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{item.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {item.author.avatar && (
                            <img
                              src={item.author.avatar}
                              alt={item.author.name}
                              className="h-8 w-8 rounded-full"
                            />
                          )}
                          <span>{item.author.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {getTypeBadge(item.contentType)}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(item.status)}
                        {item.isFeatured && (
                          <Badge className="ml-2 bg-purple-100 text-purple-800">
                            Featured
                          </Badge>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {format(new Date(item.createdAt), 'MMM d, yyyy')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.publishedAt 
                            ? `Published: ${format(new Date(item.publishedAt), 'MMM d, yyyy')}`
                            : item.scheduledPublishAt
                            ? `Scheduled: ${format(new Date(item.scheduledPublishAt), 'MMM d, yyyy')}`
                            : 'Not published'
                          }
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreview(item.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {item.status === 'PENDING' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedContent(item);
                                  setScheduleOpen(true);
                                }}
                                disabled={processing === item.id}
                              >
                                <Calendar className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePublish(item.id, true)}
                                disabled={processing === item.id}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                {processing === item.id ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedContent(item);
                                  setRejectOpen(true);
                                }}
                                disabled={processing === item.id}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleArchive(item.id)}
                            disabled={processing === item.id}
                            className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Content Preview</DialogTitle>
            <DialogDescription>
              Review content before publishing
            </DialogDescription>
          </DialogHeader>
          
          {selectedContent && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getStatusBadge(selectedContent.status)}
                  {getTypeBadge(selectedContent.contentType)}
                  {selectedContent.isFeatured && (
                    <Badge className="bg-purple-100 text-purple-800">
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Submitted: {format(new Date(selectedContent.createdAt), 'PPpp')}
                </div>
              </div>
              
              {selectedContent.featuredImage && (
                <img
                  src={selectedContent.featuredImage}
                  alt={selectedContent.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              
              <div>
                <h2 className="text-2xl font-bold">{selectedContent.title}</h2>
                <p className="text-gray-600 mt-2">{selectedContent.summary}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Author</h4>
                  <div className="flex items-center gap-2">
                    {selectedContent.author.avatar && (
                      <img
                        src={selectedContent.author.avatar}
                        alt={selectedContent.author.name}
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <span>{selectedContent.author.name}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Category</h4>
                  <Badge variant="outline">
                    {selectedContent.category?.name || 'Uncategorized'}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedContent.tags.map(tag => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Content</h4>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedContent.content }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Views:</span> {selectedContent.viewCount}
                </div>
                <div>
                  <span className="font-medium">Likes:</span> {selectedContent.likeCount}
                </div>
                <div>
                  <span className="font-medium">Comments:</span> {selectedContent.commentCount}
                </div>
                <div>
                  <span className="font-medium">Language:</span> English
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex gap-2">
            {selectedContent?.status === 'PENDING' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setPreviewOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setPreviewOpen(false);
                    setSelectedContent(selectedContent);
                    setRejectOpen(true);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    setPreviewOpen(false);
                    setSelectedContent(selectedContent);
                    setScheduleOpen(true);
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
                <Button
                  onClick={() => {
                    handlePublish(selectedContent!.id, true);
                    setPreviewOpen(false);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Publish Now
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Schedule Dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Publishing</DialogTitle>
            <DialogDescription>
              Choose a date and time to publish this content
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Select Date & Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP p")
                    ) : (
                      <span>Pick a date and time</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                  <div className="p-3 border-t">
                    <Input
                      type="time"
                      value={selectedDate ? format(selectedDate, 'HH:mm') : ''}
                      onChange={(e) => {
                        if (selectedDate) {
                          const [hours, minutes] = e.target.value.split(':');
                          const newDate = new Date(selectedDate);
                          newDate.setHours(parseInt(hours), parseInt(minutes));
                          setSelectedDate(newDate);
                        }
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Note about scheduling</p>
                  <p className="mt-1">
                    The content will remain in &quot;Pending &quot; status until the scheduled time, 
                    when it will automatically be published. You can also choose to publish it immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setScheduleOpen(false);
                setSelectedDate(undefined);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedDate) {
                  handlePublish(selectedContent!.id, false, selectedDate);
                }
              }}
              disabled={!selectedDate || processing === selectedContent?.id}
            >
              {processing === selectedContent?.id ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                handlePublish(selectedContent!.id, true);
                setScheduleOpen(false);
              }}
              disabled={processing === selectedContent?.id}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Publish Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Content</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this content submission
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedContent && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium">{selectedContent.title}</p>
                <p className="text-sm text-gray-600 truncate">
                  {selectedContent.summary || 'No summary'}
                </p>
              </div>
            )}
            
            <div>
              <Label htmlFor="rejectReason">Reason for rejection</Label>
              <Textarea
                id="rejectReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide specific feedback for the author..."
                className="mt-1"
                rows={4}
              />
              <p className="text-sm text-muted-foreground mt-1">
                This feedback will be sent to the author.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectOpen(false);
                setRejectReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleReject(selectedContent!.id)}
              disabled={!rejectReason.trim() || processing === selectedContent?.id}
            >
              {processing === selectedContent?.id ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Reject Content
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

