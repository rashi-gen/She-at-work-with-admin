// /app/entrechat/[id]/page.tsx
"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Navbar } from "@/components/navbar/Navbar";
import { entrechatData } from "@/data/Entrechat";

interface EntreChatItem {
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

// Helper functions
const extractInterviewee = (title: string): string => {
  const cleaned = title.replace(/Entrechat\s+(?:With|with)\s+/i, '').trim();
  const finalName = cleaned.replace(/^(Ms\.|Mr\.)\s+/i, '').trim();
  return finalName || "Interviewee";
};

const extractCategory = (content: string): string => {
  const contentLower = content.toLowerCase();
  if (contentLower.includes("design") || contentLower.includes("interior")) return "Design & Architecture";
  if (contentLower.includes("wellness") || contentLower.includes("health")) return "Wellness & Health";
  if (contentLower.includes("funding") || contentLower.includes("finance")) return "Funding & Finance";
  if (contentLower.includes("technology") || contentLower.includes("tech")) return "Technology";
  if (contentLower.includes("leadership") || contentLower.includes("management")) return "Leadership";
  return "Entrepreneurship";
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date unavailable';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.log(error)
    return 'Date unavailable';
  }
};

const calculateReadTime = (content: string) => {
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min read`;
};

export default function EntrechatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  const [interview, setInterview] = useState<EntreChatItem | null>(null);
  const [relatedInterviews, setRelatedInterviews] = useState<EntreChatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Unwrap params (Next.js 15 compatibility)
  useEffect(() => {
    async function unwrapParams() {
      const unwrapped = await params;
      setUnwrappedParams(unwrapped);
    }
    unwrapParams();
  }, [params]);

  // Load interview data when params are unwrapped
  useEffect(() => {
    if (!unwrappedParams) return;

    // Find the interview by slug/ID
    const foundInterview = entrechatData.find(
      (item) => item.post_name === unwrappedParams.id || item.ID === unwrappedParams.id
    );

    if (foundInterview) {
      setInterview(foundInterview);
      
      // Get related interviews (same category, exclude current)
      const category = extractCategory(foundInterview.post_content);
      const related = entrechatData
        .filter(item => 
          item.ID !== foundInterview.ID && 
          extractCategory(item.post_content) === category
        )
        .slice(0, 3);
      
      setRelatedInterviews(related);
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
            <p className="text-muted-foreground">Loading interview...</p>
          </div>
        </div>
      </>
    );
  }

  if (!interview || !unwrappedParams) {
    notFound();
  }

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = interview.post_title;
    
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
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this interview: ${url}`)}`;
        break;
    }
  };

  const interviewee = extractInterviewee(interview.post_title);
  const category = extractCategory(interview.post_content);

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-background">
        {/* Navigation */}
        <div className="border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/entrechat">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to EntreChat
              </Button>
            </Link>
          </div>
        </div>

        {/* Interview Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold uppercase">
                {category}
              </span>
              <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold uppercase">
                Interview
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
              {interview.post_title.replace(/&amp;/g, '&')}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(interview.post_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{calculateReadTime(interview.post_content)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">With {interviewee}</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {interview.featured_image_url && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
              <img
                src={interview.featured_image_url}
                alt={interview.post_title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* Share Buttons */}
          <div className="flex items-center justify-between mb-8 p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Share this interview:</span>
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

          {/* Interview Content */}
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
                      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                      mb-12"
            dangerouslySetInnerHTML={{ __html: interview.post_content }}
          />

          {/* Interviewee Highlight */}
          <div className="mt-12 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0">
                {interviewee.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-foreground mb-2">
                  About {interviewee}
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  In this exclusive EntreChat interview, {interviewee} shares valuable insights, experiences, 
                  and advice for aspiring entrepreneurs and professionals.
                </p>
              </div>
            </div>
          </div>

          {/* Related Interviews */}
          {relatedInterviews.length > 0 && (
            <div className="mt-16 pt-8 border-t">
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                Related Interviews
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedInterviews.map((related) => {
                  const relatedInterviewee = extractInterviewee(related.post_title);
                  return (
                    <Link 
                      key={related.ID} 
                      href={`/entrechat/${related.post_name}`}
                      className="group"
                    >
                      <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border h-full">
                        <div className="h-48 bg-gradient-to-br from-muted to-secondary bg-cover bg-center"
                            style={{ backgroundImage: related.featured_image_url ? `url(${related.featured_image_url})` : undefined }}>
                          {!related.featured_image_url && (
                            <div className="h-full flex items-center justify-center text-white/40 text-4xl font-display">
                              {relatedInterviewee.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2 uppercase">
                            Interview
                          </span>
                          <h3 className="font-display font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {related.post_title.replace(/&amp;/g, '&')}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(related.post_date)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Back to EntreChat Button */}
          <div className="mt-12 text-center">
            <Link href="/entrechat">
              <Button variant="outline" size="lg" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to All Interviews
              </Button>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}