// /app/blogs/[id]/page.tsx
"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Mail, ArrowRight, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { blogsData } from "@/data/Blogs";
import { Navbar } from "@/components/navbar/Navbar";

interface BlogItem {
  ID: string;
  post_title: string;
  post_content: string;
  post_date: string;
  post_excerpt: string;
  featured_image_url: string | null;
  section_name: string;
  post_modified?: string;
  post_author?: string;
  post_date_gmt?: string;
  guid?: string;
  post_name: string;
}

// Helper functions - defined outside component
const extractCategory = (content: string) => {
  const contentLower = content.toLowerCase();
  if (contentLower.includes("leadership")) return "Leadership";
  if (contentLower.includes("finance") || contentLower.includes("funding")) return "Finance";
  if (contentLower.includes("marketing")) return "Marketing";
  if (contentLower.includes("technology") || contentLower.includes("tech")) return "Technology";
  if (contentLower.includes("wellness") || contentLower.includes("health")) return "Wellness";
  if (contentLower.includes("growth")) return "Growth";
  if (contentLower.includes("strategy")) return "Strategy";
  if (contentLower.includes("innovation")) return "Innovation";
  if (contentLower.includes("success")) return "Success Stories";
  return "General";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const calculateReadTime = (content: string) => {
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min read`;
};

const extractAuthor = (content: string) => {
  const authorMatch = content.match(/by\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i) || 
                     content.match(/Written by\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i);
  return authorMatch ? authorMatch[1] : "She at Work";
};

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Unwrap params (Next.js 15 compatibility)
  useEffect(() => {
    async function unwrapParams() {
      const unwrapped = await params;
      setUnwrappedParams(unwrapped);
    }
    unwrapParams();
  }, [params]);

  // Load blog data when params are unwrapped
  useEffect(() => {
    if (!unwrappedParams) return;

    // Find the blog by slug/ID
    const foundBlog = blogsData.find(
      (item) => item.post_name === unwrappedParams.id || item.ID === unwrappedParams.id
    );

    if (foundBlog) {
      setBlog(foundBlog);
      
      // Get related blogs (same category, exclude current)
      const category = extractCategory(foundBlog.post_content);
      const related = blogsData
        .filter(item => 
          item.ID !== foundBlog.ID && 
          extractCategory(item.post_content) === category
        )
        .slice(0, 3);
      
      setRelatedBlogs(related);
    }
    
    setIsLoading(false);
  }, [unwrappedParams]);

  if (isLoading) {
    return (
      <>
        <Navbar/>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading blog post...</p>
          </div>
        </div>
      </>
    );
  }

  if (!blog || !unwrappedParams) {
    notFound();
  }

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blog.post_title;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this blog post: ${url}`)}`;
        break;
    }
  };

  // Helper function to extract excerpt (copied from blogs page)
const extractExcerpt = (content: string, maxLength: number = 150): string => {
  if (!content) return 'No excerpt available';
  
  try {
    const plainText = content.replace(/<[^>]*>/g, '');
    const cleanText = plainText.replace(/\s+/g, ' ').trim();
    
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + '...';
  } catch (error) {
    console.warn('Error extracting excerpt:', error);
    return 'No excerpt available';
  }
};

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-background">
        {/* Navigation */}
        <div className="border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/blogs">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Blogs
              </Button>
            </Link>
          </div>
        </div>

        {/* Blog Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold uppercase">
                {extractCategory(blog.post_content)}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
              {blog.post_title.replace(/&amp;/g, '&')}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(blog.post_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{calculateReadTime(blog.post_content)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">By {extractAuthor(blog.post_content)}</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {blog.featured_image_url && (
            <div className="mb-8 rounded-2xl overflow-hidden">
              <img
                src={blog.featured_image_url}
                alt={blog.post_title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* Share Buttons */}
          <div className="flex items-center justify-between mb-8 p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Share this article:</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('facebook')}
                className="h-8 w-8 p-0"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('twitter')}
                className="h-8 w-8 p-0"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('linkedin')}
                className="h-8 w-8 p-0"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('email')}
                className="h-8 w-8 p-0"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Blog Content */}
          <div 
            className="prose prose-lg max-w-none 
                      prose-headings:font-display prose-headings:font-bold
                      prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:my-6
                      prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                      prose-strong:font-bold prose-strong:text-foreground
                      prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6
                      prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6
                      prose-li:my-2 prose-li:marker:text-foreground/60
                      prose-blockquote:border-l-4 prose-blockquote:border-primary 
                      prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-8
                      prose-img:rounded-lg prose-img:my-8
                      prose-hr:my-8
                      prose-pre:my-8
                      prose-table:my-8
                      prose-figure:my-8
                      prose-embed:my-8
                      mb-12"
            dangerouslySetInnerHTML={{ __html: blog.post_content }}
          />

          {/* Related Articles */}
     {/* Related Articles */}
{relatedBlogs.length > 0 && (
  <div className="mt-16 pt-8 border-t">
    <h2 className="text-2xl font-display font-bold text-foreground mb-6">
      Related Articles
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {relatedBlogs.map((relatedBlog) => (
        <Link 
          key={relatedBlog.ID} 
          href={`/blogs/${relatedBlog.post_name}`}
          className="group bg-card rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-border flex flex-col h-full"
        >
          {/* IMAGE CONTAINER - Exact same as blogs page */}
          <div className="relative h-40 sm:h-44 bg-gradient-to-br from-muted to-secondary flex-shrink-0">
            {relatedBlog.featured_image_url ? (
              <img
                src={relatedBlog.featured_image_url}
                alt={relatedBlog.post_title}
                className="absolute inset-0 w-full h-full object-fit"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <div className="text-white/40 text-5xl font-display">
                  {relatedBlog.post_title.charAt(0)}
                </div>
              </div>
            )}
          </div>

          {/* CONTENT - Exact same as blogs page */}
          <div className="p-4 sm:p-6 flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" />
                {extractAuthor(relatedBlog.post_content).split(' ')[0]}
              </span>
            </div>

            <h3 className="text-sm sm:text-base lg:text-lg font-display font-bold text-foreground mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition-colors">
              {relatedBlog.post_title.replace(/&amp;/g, '&')}
            </h3>

            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-5 line-clamp-2 leading-relaxed flex-grow">
              {relatedBlog.post_excerpt || extractExcerpt(relatedBlog.post_content, 120)}
            </p>

            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border mt-auto">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>{formatDate(relatedBlog.post_date)}</span>
                </div>
                {/* Optional: Add location if available */}
                {(() => {
                  const content = relatedBlog.post_content.toLowerCase();
                  if (content.includes('california') || content.includes('new york') || content.includes('texas')) {
                    return (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span>
                          {content.includes('california') && 'California'}
                          {content.includes('new york') && 'New York'}
                          {content.includes('texas') && 'Texas'}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
              <div className="inline-flex items-center gap-1 px-2 py-1 -mx-2 -my-1 rounded-md text-primary group-hover:text-accent group-hover:bg-primary/5 transition-colors">
                Read
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
)}

          {/* Back to Blogs Button */}
          <div className="mt-12 text-center">
            <Link href="/blogs">
              <Button variant="outline" size="lg" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to All Blogs
              </Button>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}