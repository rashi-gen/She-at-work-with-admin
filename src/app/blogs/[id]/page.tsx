// /app/blogs/[id]/page.tsx
"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Mail } from "lucide-react";
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
                      prose-p:text-foreground/80 prose-p:leading-relaxed
                      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                      prose-strong:font-bold prose-strong:text-foreground
                      prose-ul:list-disc prose-ul:pl-6
                      prose-ol:list-decimal prose-ol:pl-6
                      prose-li:my-2
                      prose-blockquote:border-l-4 prose-blockquote:border-primary 
                      prose-blockquote:pl-4 prose-blockquote:italic
                      mb-12"
            dangerouslySetInnerHTML={{ __html: blog.post_content }}
          />

          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <div className="mt-16 pt-8 border-t">
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <Link 
                    key={relatedBlog.ID} 
                    href={`/blogs/${relatedBlog.post_name}`}
                    className="group"
                  >
                    <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border">
                      <div className="h-48 bg-gradient-to-br from-muted to-secondary bg-cover bg-center"
                          style={{ backgroundImage: relatedBlog.featured_image_url ? `url(${relatedBlog.featured_image_url})` : undefined }}>
                        {!relatedBlog.featured_image_url && (
                          <div className="h-full flex items-center justify-center text-white/40 text-4xl font-display">
                            {relatedBlog.post_title.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2 uppercase">
                          {extractCategory(relatedBlog.post_content)}
                        </span>
                        <h3 className="font-display font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedBlog.post_title.replace(/&amp;/g, '&')}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(relatedBlog.post_date)}</span>
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