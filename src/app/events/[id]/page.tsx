// /app/events/[id]/page.tsx
"use client";

import { AnimatedText, ScrollFade } from "@/components/common/ScrollFade";
import { Navbar } from "@/components/navbar/Navbar";
import { Button } from "@/components/ui/button";
import { eventsData } from "@/data/events";
import { motion, Variants } from "framer-motion";
import { ArrowLeft, Calendar, Facebook, IndianRupee, Linkedin, Mail, MapPin, Share2, Twitter, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

// Assuming you have this utility (same as used in EventsPage)
import { openEventRegistrationEmail } from "@/hooks/Emailutils";

interface EventItem {
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
  external_url?: string | null;
}

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const slideInFromBottom: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Helper functions (kept mostly the same, minor cleanup)
const extractCategory = (content: string): string => {
  const contentLower = content.toLowerCase();
  if (contentLower.includes("summit") || contentLower.includes("conference")) return "Conferences";
  if (contentLower.includes("workshop") || contentLower.includes("masterclass")) return "Workshops";
  if (contentLower.includes("webinar") || contentLower.includes("online")) return "Webinars";
  if (contentLower.includes("networking") || contentLower.includes("meetup")) return "Networking";
  if (contentLower.includes("seminar") || contentLower.includes("talk")) return "Seminars";
  if (contentLower.includes("dialogue") || contentLower.includes("forum")) return "Forums";
  if (contentLower.includes("launch") || contentLower.includes("inauguration")) return "Launches";
  if (contentLower.includes("award") || contentLower.includes("ceremony")) return "Awards";
  return "Other Events";
};

const extractLocation = (content: string): string => {
  const locationPatterns = [
    /in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /at\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+conference/i,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+event/i,
  ];
  
  for (const pattern of locationPatterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      const location = match[1].trim();
      if (!['The', 'This', 'Our', 'Global', 'Annual', 'International'].includes(location.split(' ')[0])) {
        return location;
      }
    }
  }
  
  return 'Online / Location TBD';
};

const extractDateDetails = (content: string, postDate: string): { date: string, time?: string } => {
  const dateRangeMatch = content.match(/([A-Za-z]+\s+\d+\s+(?:to\s+)?\d*(?:\s*,\s*\d{4})?)/i);
  if (dateRangeMatch) return { date: dateRangeMatch[1] };
  
  const dateMatch = content.match(/([A-Za-z]+\s+\d+(?:\s*,\s*\d{4})?)/i);
  if (dateMatch) return { date: dateMatch[1] };
  
  const date = new Date(postDate);
  return { 
    date: date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  };
};

const extractFormat = (content: string): string => {
  const contentLower = content.toLowerCase();
  if (contentLower.includes("online") || contentLower.includes("virtual") || contentLower.includes("zoom")) return "Virtual";
  if (contentLower.includes("in-person") || contentLower.includes("physical") || contentLower.includes("venue")) return "In-person";
  if (contentLower.includes("hybrid") || contentLower.includes("both online and in-person")) return "Hybrid";
  return "To be announced";
};

const extractPrice = (content: string): string => {
  const pricePatterns = [
    /\$(\d+(?:\.\d{2})?)/,
    /₹(\d+(?:\.\d{2})?)/,
    /(\d+)\s*(?:USD|dollars?)/i,
    /(\d+)\s*(?:INR|rupees?)/i,
    /free/i,
    /complimentary/i,
    /no cost/i
  ];
  
  for (const pattern of pricePatterns) {
    const match = content.match(pattern);
    if (match) {
      if (pattern.toString().includes('free') || pattern.toString().includes('complimentary') || pattern.toString().includes('no cost')) {
        return 'Free';
      }
      if (pattern.toString().includes('₹')) return `₹${match[1]}`;
      if (pattern.toString().includes('$')) return `$${match[1]}`;
      return match[0];
    }
  }
  
  return 'Contact for details';
};

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  const [event, setEvent] = useState<EventItem | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    async function unwrapParams() {
      const unwrapped = await params;
      setUnwrappedParams(unwrapped);
    }
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!unwrappedParams) return;

    const foundEvent = eventsData.find(
      (item) => item.post_name === unwrappedParams.id || item.ID === unwrappedParams.id
    );

    if (foundEvent) {
      setEvent(foundEvent);
      
      const category = extractCategory(foundEvent.post_content);
      const related = eventsData
        .filter(item => 
          item.ID !== foundEvent.ID && 
          extractCategory(item.post_content) === category
        )
        .slice(0, 3);
      
      setRelatedEvents(related);
    }
    
    setIsLoading(false);
  }, [unwrappedParams]);

  if (isLoading) {
    return (
      <>
        <Navbar/>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4 border-4 border-primary/30 border-t-primary rounded-full"
            />
            <p className="text-muted-foreground">Loading event details...</p>
          </div>
        </motion.div>
      </>
    );
  }

  if (!event || !unwrappedParams) {
    notFound();
  }

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = event.post_title;
    
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
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this event: ${url}`)}`;
        break;
    }
  };

  // Open email client with pre-filled event details
  const handleContactClick = () => {
    openEventRegistrationEmail({
      title: event.post_title.replace(/&amp;/g, '&'),
      date: extractDateDetails(event.post_content, event.post_date).date,
      time: extractDateDetails(event.post_content, event.post_date).time,
      location: extractLocation(event.post_content),
      format: extractFormat(event.post_content),
      price: extractPrice(event.post_content),
      category: extractCategory(event.post_content)
    });
  };

  const category = extractCategory(event.post_content);
  const location = extractLocation(event.post_content);
  const { date, time } = extractDateDetails(event.post_content, event.post_date);
  const format = extractFormat(event.post_content);
  const price = extractPrice(event.post_content);

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-background">
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/events">
              <motion.div
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Events
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Event Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <ScrollFade>
            <motion.header 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <motion.div 
                variants={fadeInUp}
                className="flex items-center gap-2 mb-4"
              >
                <motion.span 
                  variants={scaleIn}
                  className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold uppercase"
                >
                  {category}
                </motion.span>
                <motion.span 
                  variants={scaleIn}
                  transition={{ delay: 0.1 }}
                  className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold uppercase"
                >
                  {format}
                </motion.span>
              </motion.div>
              
              <AnimatedText 
                as="h1" 
                className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6"
              >
                {event.post_title.replace(/&amp;/g, '&')}
              </AnimatedText>
              
              <motion.div 
                variants={scaleIn}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-xl mb-6"
              >
                <motion.div variants={fadeInLeft} className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium text-foreground">{date} {time && `• ${time}`}</p>
                  </div>
                </motion.div>
                
                <motion.div variants={fadeInRight} className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">{location}</p>
                  </div>
                </motion.div>
                
                <motion.div variants={fadeInLeft} className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Format</p>
                    <p className="font-medium text-foreground">{format}</p>
                  </div>
                </motion.div>
                
                <motion.div variants={fadeInRight} className="flex items-center gap-3">
                  <IndianRupee className="h-5 w-5 text-accent flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium text-foreground">{price}</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.header>
          </ScrollFade>

          {/* Featured Image */}
          {event.featured_image_url && (
            <ScrollFade>
              <motion.div 
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                className="mb-8 rounded-2xl overflow-hidden shadow-xl relative"
              >
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <motion.img
                  src={event.featured_image_url}
                  alt={event.post_title}
                  className={`w-full h-auto max-h-[500px] object-cover transition-opacity duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </ScrollFade>
          )}

          {/* Share Buttons */}
          <ScrollFade>
            <motion.div 
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="flex items-center justify-between mb-8 p-4 bg-secondary/30 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Share this event:</span>
              </div>
              <motion.div 
                variants={staggerContainer}
                className="flex items-center gap-2"
              >
                {[
                  { platform: 'facebook', icon: Facebook },
                  { platform: 'twitter', icon: Twitter },
                  { platform: 'linkedin', icon: Linkedin },
                  { platform: 'email', icon: Mail }
                ].map((item) => (
                  <motion.div
                    key={item.platform}
                    variants={scaleIn}
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleShare(item.platform)} 
                      className="h-8 w-8 p-0 hover:bg-primary/10"
                    >
                      <item.icon className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </ScrollFade>

          {/* Event Content */}
          <ScrollFade>
            <motion.div 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
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
              dangerouslySetInnerHTML={{ __html: event.post_content }}
            />
          </ScrollFade>

          {/* Contact CTA */}
          <ScrollFade>
            <motion.div 
              variants={slideInFromBottom}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="mt-12 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <AnimatedText 
                    as="h3" 
                    className="text-xl font-display font-bold text-foreground mb-2"
                  >
                    Interested in this event?
                  </AnimatedText>
                  <AnimatedText delay={0.1} className="text-foreground/80">
                    Get in touch with us to know more or to register your interest.
                  </AnimatedText>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={handleContactClick}
                    className="bg-accent text-white font-semibold gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Contact via Email
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </ScrollFade>

          {/* Related Events */}
          {relatedEvents.length > 0 && (
            <ScrollFade>
              <motion.div 
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                className="mt-16 pt-8 border-t"
              >
                <AnimatedText 
                  as="h2" 
                  className="text-2xl font-display font-bold text-foreground mb-6"
                >
                  Related Events
                </AnimatedText>
                
                <motion.div 
                  variants={staggerContainer}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {relatedEvents.map((relatedEvent, index) => {
                    const relatedCategory = extractCategory(relatedEvent.post_content);
                    const relatedLocation = extractLocation(relatedEvent.post_content);
                    const relatedDate = extractDateDetails(relatedEvent.post_content, relatedEvent.post_date);
                    
                    return (
                      <motion.div
                        key={relatedEvent.ID}
                        variants={fadeInUp}
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Link 
                          href={`/events/${relatedEvent.post_name}`}
                          className="group"
                        >
                          <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border h-full">
                            <motion.div 
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.3 }}
                              className="h-48 bg-gradient-to-br from-muted to-secondary bg-cover bg-center relative"
                              style={{ 
                                backgroundImage: relatedEvent.featured_image_url ? `url(${relatedEvent.featured_image_url})` : undefined 
                              }}
                            >
                              {!relatedEvent.featured_image_url && (
                                <div className="h-full flex items-center justify-center text-white/40 text-4xl font-display">
                                  {relatedEvent.post_title.charAt(0)}
                                </div>
                              )}
                              {!relatedEvent.featured_image_url && (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-50" />
                              )}
                            </motion.div>
                            <div className="p-4">
                              <motion.span 
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2 uppercase"
                              >
                                {relatedCategory}
                              </motion.span>
                              <h3 className="font-display font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {relatedEvent.post_title.replace(/&amp;/g, '&')}
                              </h3>
                              <motion.div 
                                variants={staggerContainer}
                                className="space-y-1 text-xs text-muted-foreground"
                              >
                                <motion.div variants={fadeInLeft} className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{relatedDate.date}</span>
                                </motion.div>
                                <motion.div variants={fadeInRight} className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="line-clamp-1">{relatedLocation}</span>
                                </motion.div>
                              </motion.div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            </ScrollFade>
          )}

          {/* Back to Events Button */}
          <ScrollFade>
            <motion.div 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="mt-12 text-center"
            >
              <Link href="/events">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" size="lg" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to All Events
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </ScrollFade>
        </article>
      </main>
    </>
  );
}