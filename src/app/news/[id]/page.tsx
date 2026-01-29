// /app/news/[id]/page.tsx
"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Mail, Newspaper, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { newsData } from "@/data/news";
import { Navbar } from "@/components/navbar/Navbar";

interface NewsItem {
  ID: string;
  post_title: string;
  post_content: string;
  post_date: string;
  post_excerpt: string;
  featured_image_url: string;
  external_url: string | null;
  section_name: string;
  post_modified?: string;
  post_author?: string;
  post_date_gmt?: string;
  guid?: string;
  post_name: string;
}

// Helper functions - defined outside component
const getSourceFromUrl = (url: string | null): string => {
  if (!url || url.trim() === '' || url === 'null') return 'She at Work';
  
  try {
    const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\- .\/?%&=]*)?$/i;
    
    if (!urlPattern.test(url)) {
      return 'She at Work';
    }
    
    const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
    const parsedUrl = new URL(urlWithProtocol);
    const hostname = parsedUrl.hostname.replace('www.', '');
    
    const domainParts = hostname.split('.');
    if (domainParts.length >= 2) {
      const mainDomain = domainParts[domainParts.length - 2];
      
      const formattedName = mainDomain
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/[_-]/g, ' ')
        .trim();
      
      return formattedName || hostname;
    }
    
    return hostname;
  } catch (error) {
    console.log(error)
    return 'She at Work';
  }
};

const getCategoryFromContent = (content: string): string => {
  const contentLower = content.toLowerCase();
  if (contentLower.includes("funding") || content.includes("$") || contentLower.includes("investment") || contentLower.includes("raise")) return "Funding";
  if (contentLower.includes("award") || contentLower.includes("recognizing") || contentLower.includes("honor")) return "Awards";
  if (contentLower.includes("launch") || contentLower.includes("debut") || contentLower.includes("introduce")) return "Launches";
  if (contentLower.includes("partner") || contentLower.includes("collaboration") || contentLower.includes("joint")) return "Partnerships";
  if (contentLower.includes("success") || contentLower.includes("journey") || contentLower.includes("story") || contentLower.includes("empire")) return "Success Stories";
  if (contentLower.includes("trend") || contentLower.includes("growth") || contentLower.includes("industry") || contentLower.includes("market")) return "Industry Trends";
  if (contentLower.includes("policy") || contentLower.includes("government") || contentLower.includes("tax") || contentLower.includes("initiative")) return "Policy Updates";
  return "General News";
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

const extractExcerpt = (content: string, maxLength: number = 150): string => {
  if (!content) return 'No excerpt available';
  
  try {
    const plainText = content.replace(/<[^>]*>/g, '');
    const cleanText = plainText.replace(/\s+/g, ' ').trim();
    
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + '...';
  } catch (error) {
    console.log(error)
    return 'No excerpt available';
  }
};

// Process content to remove business source and enhance Read More links
const processContent = (content: string, externalUrl: string | null): string => {
  let processed = content;
  
  // Remove "businessworld.in" or similar source lines at the beginning
  processed = processed.replace(/<!-- wp:paragraph -->\s*<p>[\w.-]+\.(com|in|org|net|io)<\/p>\s*<!-- \/wp:paragraph -->\s*/i, '');
  processed = processed.replace(/<p>[\w.-]+\.(com|in|org|net|io)<\/p>\s*/i, '');
  
  // Find and replace "Read more" links with styled span
  if (externalUrl) {
    // Escape special characters in URL for JavaScript
    const escapedUrl = externalUrl.replace(/'/g, "\\'").replace(/"/g, '&quot;');
    
    // Replace "Read more" links with clickable span that opens external URL
    const readMoreRegex = /<a[^>]*>Read more<\/a>/gi;
    processed = processed.replace(readMoreRegex, () => {
      return `
        <span 
          onclick="window.open('${escapedUrl}', '_blank', 'noopener,noreferrer')"
          class="inline-flex items-center gap-1 text-primary hover:text-accent font-semibold  read-more-text"
          style="cursor: pointer; transition: color 0.2s ease;"
          onmouseover="this.style.color='var(--color-accent)'"
          onmouseout="this.style.color='var(--color-primary)'"
        >
          Read more
          <svg class="h-3.5 w-3.5 hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </span>
      `;
    });
    
    // If no "Read more" found, add it to the last paragraph
    if (!processed.includes('read-more-text')) {
      // Find last paragraph
      const lastParagraphIndex = processed.lastIndexOf('</p>');
      if (lastParagraphIndex !== -1) {
        const beforeLastPara = processed.substring(0, lastParagraphIndex);
        const afterLastPara = processed.substring(lastParagraphIndex);
        
        processed = `${beforeLastPara}
          <span 
            onclick="window.open('${escapedUrl}', '_blank', 'noopener,noreferrer')"
            class="inline-flex items-center gap-1 text-primary hover:text-accent font-semibold ml-2 read-more-text"
            style="cursor: pointer; transition: color 0.2s ease;"
            onmouseover="this.style.color='var(--color-accent)'"
            onmouseout="this.style.color='var(--color-primary)'"
          >
            Read more
            <svg class="h-3.5 w-3.5 hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </span>
        ${afterLastPara}`;
      }
    }
  }
  
  return processed;
};

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  const [news, setNews] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processedContent, setProcessedContent] = useState<string>('');

  // Unwrap params (Next.js 15 compatibility)
  useEffect(() => {
    async function unwrapParams() {
      const unwrapped = await params;
      setUnwrappedParams(unwrapped);
    }
    unwrapParams();
  }, [params]);

  // Load news data when params are unwrapped
  useEffect(() => {
    if (!unwrappedParams) return;

    // Find the news by slug/ID
    const foundNews = newsData.find(
      (item) => item.post_name === unwrappedParams.id || item.ID === unwrappedParams.id
    );

    if (foundNews) {
      setNews(foundNews);
      
      // Process content to remove source and enhance Read More links
      const content = processContent(foundNews.post_content, foundNews.external_url);
      setProcessedContent(content);
      
      // Get related news (same category, exclude current, limit to 3)
      const category = getCategoryFromContent(foundNews.post_content);
      const related = newsData
        .filter(item => 
          item.ID !== foundNews.ID && 
          getCategoryFromContent(item.post_content) === category
        )
        .slice(0, 3);
      
      setRelatedNews(related);
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
            <p className="text-muted-foreground">Loading news article...</p>
          </div>
        </div>
      </>
    );
  }

  if (!news || !unwrappedParams) {
    notFound();
  }

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = news.post_title;
    
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
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this news article: ${url}`)}`;
        break;
    }
  };

  const handleExternalLink = () => {
    if (news.external_url && news.external_url.trim() !== '') {
      try {
        const urlWithProtocol = news.external_url.startsWith('http') ? news.external_url : `https://${news.external_url}`;
        window.open(urlWithProtocol, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('Error opening URL:', error);
      }
    }
  };

  const category = getCategoryFromContent(news.post_content);
  const source = getSourceFromUrl(news.external_url);
  const excerpt = news.post_excerpt && news.post_excerpt.trim() !== '' 
    ? news.post_excerpt 
    : extractExcerpt(news.post_content, 200);

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-background">
        {/* Navigation */}
        <div className="border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/news">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to News
              </Button>
            </Link>
          </div>
        </div>

        {/* News Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold uppercase">
                {category}
              </span>
              <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold uppercase">
                {source}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
              {news.post_title.replace(/&amp;/g, '&')}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(news.post_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{calculateReadTime(news.post_content)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Newspaper className="h-4 w-4" />
                  <span className="text-sm">Source: {source}</span>
                </div>
              </div>
              
              {/* Read More Button for External Links */}
              {news.external_url && news.external_url.trim() !== '' && (
                <Button 
                  onClick={handleExternalLink}
                  variant="outline"
                  className="gap-2 group"
                >
                  Read Full Article
                  <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {news.featured_image_url && news.featured_image_url.trim() !== '' && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
              <img
                src={news.featured_image_url}
                alt={news.post_title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* Share Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Share this article:</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('facebook')}
                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('twitter')}
                className="h-8 w-8 p-0 hover:bg-sky-50 hover:text-sky-600"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('linkedin')}
                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-700"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('email')}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Article Excerpt */}
          {excerpt && excerpt.trim() !== '' && (
            <div className="mb-8 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
              <p className="text-lg font-medium text-foreground italic leading-relaxed">
                {excerpt}
              </p>
            </div>
          )}

          {/* News Content */}
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
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />

          {/* Related News */}
          {relatedNews.length > 0 && (
            <div className="mt-16 pt-8 border-t">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-foreground">
                  Related News
                </h2>
                <Link href="/news" className="text-primary hover:text-accent text-sm font-medium flex items-center gap-1">
                  View all <ArrowLeft className="h-3 w-3 rotate-180" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedNews.map((related) => {
                  const relatedCategory = getCategoryFromContent(related.post_content);
                  const relatedSource = getSourceFromUrl(related.external_url);
                  const relatedExcerpt = extractExcerpt(related.post_content, 100);
                  
                  return (
                    <div 
                      key={related.ID} 
                      className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border h-full flex flex-col"
                    >
                      <div className="h-48 bg-gradient-to-br from-muted to-secondary bg-cover bg-center flex-shrink-0"
                          style={{ 
                            backgroundImage: related.featured_image_url && related.featured_image_url.trim() !== '' 
                              ? `url(${related.featured_image_url})` 
                              : undefined 
                          }}>
                        {(!related.featured_image_url || related.featured_image_url.trim() === '') && (
                          <div className="h-full w-full flex items-center justify-center text-white/40 text-4xl font-display">
                            {related.post_title.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase">
                            {relatedCategory}
                          </span>
                          <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                            {relatedSource}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-foreground mb-2 line-clamp-2">
                          {related.post_title.replace(/&amp;/g, '&')}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-grow">
                          {relatedExcerpt}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(related.post_date)}</span>
                          </div>
                          <Link 
                            href={`/news/${related.post_name}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-accent transition-colors"
                          >
                            Read
                            <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Back to News Button */}
          <div className="mt-12 text-center">
            <Link href="/news">
              <Button variant="outline" size="lg" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to All News
              </Button>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}