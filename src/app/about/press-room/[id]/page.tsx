// /app/about/press-room/[id]/page.tsx
"use client";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Clock, Mail, Share2, Facebook, Twitter, Linkedin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { pressData } from "@/data/Press";
import Image from "next/image";

interface PressItem {
  ID: string;
  post_title: string;
  post_content: string;
  post_date: string;
  post_excerpt: string;
  post_name: string;
  post_modified?: string;
  post_author?: string;
  featured_image_url?: string | null;
  content_images?: string[] | null;
}

// Clean HTML tags from text
const cleanText = (text: string): string => {
  if (!text) return '';
  
  // Remove HTML tags
  const clean = text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&amp;/g, '&') // Replace HTML entities
    .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
    .replace(/&\w+;/g, ' ') // Replace other HTML entities
    .trim();
  
  return clean;
};

// Helper to process content
const processContent = (content: string): string => {
  if (!content) return '<p>Content not available</p>';
  
  // Clean the content first
  let processed = cleanText(content);
  
  // If content is just gallery shortcodes, show a message
  if (processed.length === 0 || processed.length < 20) {
    return '<p class="text-muted-foreground italic">Press release with media gallery. Please view the gallery below for images.</p>';
  }
  
  // Clean up WordPress HTML (in case there are any left after cleaning)
  processed = processed
    .replace(/<!--\s*wp:paragraph\s*-->/g, '')
    .replace(/<!--\s*\/wp:paragraph\s*-->/g, '')
    .replace(/<!--\s*wp:heading\s*-->/g, '')
    .replace(/<!--\s*\/wp:heading\s*-->/g, '')
    .replace(/<!--\s*wp:list\s*-->/g, '')
    .replace(/<!--\s*\/wp:list\s*-->/g, '')
    .replace(/<!--\s*wp:image[^>]*-->/g, '')
    .replace(/<!--\s*\/wp:image\s*-->/g, '');

  // Ensure proper paragraph structure
  processed = processed
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => {
      const trimmed = line.trim();
      if (trimmed.length > 0) return `<p>${trimmed}</p>`;
      return '';
    })
    .join('');

  return processed;
};

const extractAuthor = (content: string) => {
  const authorMatch = content.match(/by\s+([A-Z][a-z]+\s+[A-Z][a-z]+(?:,\s+[A-Z][a-z]+\s+[A-Z][a-z]+)*)/i) ||
                     content.match(/–\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i) ||
                     content.match(/According to\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i) ||
                     content.match(/Addressing the.*,\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i);
  
  if (authorMatch) {
    // Take the first author if multiple
    const authors = authorMatch[1].split(/\s*,\s*/);
    return authors[0];
  }
  
  return "She at Work";
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date unavailable';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch {
    return 'Date unavailable';
  }
};

const calculateReadTime = (text: string): string => {
  if (!text) return '1 min read';
  
  // Clean HTML and shortcodes
  const cleanTextContent = cleanText(text);
  
  if (cleanTextContent.length === 0) return '1 min read';
  
  const wordCount = cleanTextContent.split(/\s+/).filter(word => word.length > 0).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
};

const getImageUrl = (item: PressItem): string => {
  // First, try featured image URL
  if (item.featured_image_url) {
    return item.featured_image_url;
  }
  
  // Then try content images array
  if (item.content_images && item.content_images.length > 0) {
    return item.content_images[0];
  }
  
  // Fallback to default placeholder
  return '/images/press-placeholder.jpg';
};

export default function PressDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  const [press, setPress] = useState<PressItem | null>(null);
  const [relatedPress, setRelatedPress] = useState<PressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasGallery, setHasGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [isGalleryOnly, setIsGalleryOnly] = useState(false);

  useEffect(() => {
    async function unwrap() {
      const p = await params;
      setUnwrappedParams(p);
    }
    unwrap();
  }, [params]);

  useEffect(() => {
    if (!unwrappedParams) return;
    
    const found = pressData.find(item => 
      item.post_name === unwrappedParams.id || 
      item.ID === unwrappedParams.id
    );
    
    if (found) {
      setPress(found);
      
      // Check if it's gallery-only content
      const cleanContent = cleanText(found.post_content);
      const isGalleryPost = cleanContent.length < 50 && !!(found.content_images && found.content_images.length > 0);
      setIsGalleryOnly(Boolean(isGalleryPost));
      
      // Check for gallery images
      if (found.content_images && found.content_images.length > 0) {
        setHasGallery(true);
        setGalleryImages(found.content_images);
      }
      
      // Get related press (same year or similar content)
      const currentYear = new Date(found.post_date).getFullYear();
      const related = pressData
        .filter(item => item.ID !== found.ID && item.post_content)
        .sort((a, b) => {
          const aYear = new Date(a.post_date).getFullYear();
          const bYear = new Date(b.post_date).getFullYear();
          const aScore = aYear === currentYear ? 1 : 0;
          const bScore = bYear === currentYear ? 1 : 0;
          return bScore - aScore;
        })
        .slice(0, 3);
      
      setRelatedPress(related);
    }
    
    setIsLoading(false);
  }, [unwrappedParams]);

  const handleShare = (platform: string) => {
    if (!press) return;
    
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = encodeURIComponent(cleanText(press.post_title));
    const text = encodeURIComponent('Check out this press release from Sheatwork');
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${title}&body=${text}%0A%0A${url}`;
        break;
    }
    
    setShowShareTooltip(false);
  };

  const copyToClipboard = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
      </>
    );
  }
  
  if (!press) notFound();

  const cleanTitle = cleanText(press.post_title) || 'Untitled Press Release';

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
      

        {/* Main content */}
        <article className="max-w-4xl mx-auto px-4 py-8 lg:py-28">
          {/* Header */}
          <header className="mb-8 lg:mb-12">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Featured Image */}
              <div className="lg:w-2/5">
                <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={getImageUrl(press)}
                    alt={cleanTitle}
                    fill
                    className="object-cover"
                    unoptimized={getImageUrl(press).startsWith('http')}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Title and Metadata */}
              <div className="lg:w-3/5 flex flex-col justify-center">
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                    <Calendar className="h-3.5 w-3.5" />
                    Press Release
                  </span>
                </div>
                
                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground mb-6 leading-tight">
                  {cleanTitle}
                </h1>
                
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">{extractAuthor(press.post_content)}</span>
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{formatDate(press.post_date)}</span>
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{calculateReadTime(press.post_content)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Share Bar */}
          <div className=" top-32 z-20 mb-8">
            <div className="flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm rounded-xl shadow-sm border">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Share this release:</span>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleShare('facebook')}
                  className="h-9 w-9 p-0 hover:bg-primary/10"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleShare('twitter')}
                  className="h-9 w-9 p-0 hover:bg-primary/10"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleShare('linkedin')}
                  className="h-9 w-9 p-0 hover:bg-primary/10"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleShare('email')}
                  className="h-9 w-9 p-0 hover:bg-primary/10"
                  aria-label="Share via Email"
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={copyToClipboard}
                    className="h-9 px-3 hover:bg-primary/10"
                  >
                    Copy Link
                  </Button>
                  {showShareTooltip && (
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded whitespace-nowrap">
                      Link copied!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content - Show message for gallery-only posts */}
          <div className="mb-12">
            {isGalleryOnly ? (
              <div className="bg-muted/30 p-6 rounded-lg border mb-8">
                <h3 className="text-lg font-semibold mb-2">Media Gallery</h3>
                <p className="text-muted-foreground">
                  This press release contains a gallery of images. Scroll down to view the complete collection.
                </p>
              </div>
            ) : (
              <div 
                className="prose prose-lg max-w-none 
                  prose-headings:text-foreground 
                  prose-p:text-foreground/90 
                  prose-strong:text-foreground 
                  prose-a:text-primary hover:prose-a:text-primary/80
                  prose-li:text-foreground/90
                  prose-img:rounded-lg prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: processContent(press.post_content) }}
              />
            )}
          </div>

          {/* Gallery Section */}
          {hasGallery && galleryImages.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-6">Gallery ({galleryImages.length} images)</h3>
              {isGalleryOnly && (
                <p className="text-muted-foreground mb-4">
                  This press release showcases the following images:
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((img, index) => (
                  <div key={index} className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-[4/3] bg-muted">
                      <Image
                        src={img}
                        alt={`Gallery image ${index + 1} for ${cleanTitle}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white text-sm font-medium truncate">
                          Image {index + 1} of {galleryImages.length}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Press Releases */}
          {relatedPress.length > 0 && (
            <div className="mt-16 pt-8 border-t">
              <h2 className="text-2xl font-bold mb-8">More Press Releases</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPress.map((rel) => {
                  const relatedCleanTitle = cleanText(rel.post_title) || 'Untitled Press Release';
                  return (
                    <Link 
                      key={rel.ID} 
                      href={`/about/press-room/${rel.post_name}`} 
                      className="group block"
                    >
                      <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl border hover:border-primary/20 transition-all duration-300 h-full">
                        <div className="relative h-48 bg-gradient-to-br from-muted to-secondary">
                          <Image
                            src={getImageUrl(rel)}
                            alt={relatedCleanTitle}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            unoptimized={getImageUrl(rel).startsWith('http')}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                            {relatedCleanTitle}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(rel.post_date)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Back to Press Room */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Explore More Press Releases</h3>
                <p className="text-sm text-muted-foreground">
                  Stay updated with the latest news and announcements from Sheatwork
                </p>
              </div>
              <Link href="/about/press-room">
                <Button className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  View All Press Releases
                </Button>
              </Link>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}