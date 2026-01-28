// "use client";

// import Cta from "@/components/common/Cta";
// import { Button } from "@/components/ui/button";
// import {
//   Award,
//   Bookmark,
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
//   Clock,
//   Eye,
//   Facebook,
//   Heart,
//   Linkedin,
//   MessageSquare,
//   Twitter
// } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";


// // Mock data - In real app, this would come from API/database based on [id]
// const entrechatInterviews = {
//   "1": {
//     id: 1,
//     slug: "sarah-mitchell-seed-funding",
//     author: {
//       name: "Sarah Mitchell",
//       role: "CEO & Founder at TechVenture",
//       bio: "Sarah Mitchell is a serial entrepreneur with over 10 years of experience in the tech startup ecosystem. She successfully raised $2M in seed funding and has mentored dozens of women founders.",
//       avatar: "/avatar1.jpg",
//       verified: true,
//     },
//     category: "Funding & Finance",
//     title: "How I Raised $2M in Seed Funding: My Complete Journey",
//     subtitle: "A candid conversation about fundraising, rejection, and eventual success",
//     excerpt: "After 6 months of pitching to investors, I finally closed our seed round. Here's everything I learned about the fundraising process, what worked, what didn't, and my advice for first-time founders.",
//     image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=1200&h=600&fit=crop",
//     publishDate: "November 27, 2025",
//     readTime: "8 minute read",
//     views: 234,
//     likes: 142,
//     comments: 38,
//     shares: 24,
    
//     introduction: "Sarah Mitchell, CEO & Founder of TechVenture, recently closed a $2M seed round after months of challenging negotiations and countless pitch meetings. In this exclusive interview, Sarah shares her complete fundraising journey, from the initial rejections to the final handshake. Her story offers invaluable insights for first-time founders navigating the complex world of venture capital.",
    
//     questions: [
//       {
//         question: "What inspired you to start your fundraising journey, and when did you know it was the right time?",
//         answer: "The decision to raise funding wasn't taken lightly. We had been bootstrapping for about 18 months and had reached a point where we needed capital to scale. The tipping point came when we hit product-market fit and started seeing organic growth that we couldn't sustain without investment. I knew it was the right time when customers were literally begging us to expand our services faster than we could organically grow. That demand validation gave me the confidence to approach investors."
//       },
//       {
//         question: "How did you prepare for investor meetings, and what were the key elements of your pitch deck?",
//         answer: "Preparation was everything. I spent about 6 weeks refining our pitch deck and practicing my presentation. The key elements that resonated most with investors were: our clear problem statement, the size of the market opportunity, our traction metrics (we had 500% year-over-year growth), our unique technology differentiator, and most importantly, a realistic financial projection. I also made sure to anticipate tough questions and had data-backed answers ready. The pitch deck was 15 slides, but I could tell our story in 10 minutes if needed."
//       },
//       {
//         question: "What were the biggest challenges you faced during the fundraising process?",
//         answer: "The rejections were brutal at first. Out of 50 investors I pitched to, 47 said no. Some didn't even respond. The biggest challenge was maintaining confidence and momentum after each rejection. I had to learn not to take it personally and to treat each 'no' as a learning opportunity. Another major challenge was managing the business while fundraising full-time. I essentially had two full-time jobs for 6 months. Time management and delegation became critical skills I had to develop quickly."
//       },
//       {
//         question: "Can you share a turning point or breakthrough moment in your fundraising journey?",
//         answer: "The breakthrough came when I connected with an investor who had built and sold a company in a similar space. Instead of the typical 30-minute pitch meeting, we had a 2-hour conversation about the industry, challenges, and opportunities. She introduced me to her network, and suddenly doors started opening. That taught me that fundraising is as much about finding the right partners as it is about the money. The right investor brings more than capital—they bring experience, networks, and credibility."
//       },
//       {
//         question: "How did being a woman founder impact your fundraising experience?",
//         answer: "I won't sugarcoat it—there were moments when I felt I had to work twice as hard to be taken half as seriously. I encountered unconscious bias, inappropriate questions about my family planning, and investors who doubted whether I could be 'tough enough' to lead through difficult times. However, I also connected with incredible investors, both men and women, who saw these challenges as exactly why they wanted to invest in women-led companies. My advice: find investors who get it, and don't waste time trying to convince those who don't."
//       },
//       {
//         question: "What advice would you give to first-time founders starting their fundraising journey?",
//         answer: "First, don't raise money just because everyone else is doing it. Make sure you actually need it and have a clear plan for how you'll use it. Second, start building relationships with investors long before you need the money. Fundraising is a long game. Third, get comfortable with rejection—it's part of the process. Fourth, find other founders who are going through or have been through the process. The support network is invaluable. Finally, remember that a 'no' now doesn't mean 'no' forever. Keep building, keep growing, and keep those relationships warm. Many of the investors who initially passed on us have reached out about our Series A."
//       }
//     ],
    
//     keyTakeaways: [
//       "Product-market fit and traction are more important than a perfect pitch",
//       "Building relationships with investors takes time—start early",
//       "Rejection is part of the process—don't take it personally",
//       "The right investor brings more than just capital",
//       "Time management is critical when fundraising while running a business"
//     ],
    
//     relatedPosts: [
//       { id: 2, title: "Understanding SAFE Notes vs Convertible Notes", slug: "safe-notes-vs-convertible", views: 167 },
//       { id: 3, title: "Pitch Deck Essentials for First-Time Founders", slug: "pitch-deck-essentials", views: 203 },
//       { id: 4, title: "Negotiating Term Sheets: A Founder's Guide", slug: "negotiating-term-sheets", views: 145 }
//     ]
//   },
  
//   "2": {
//     id: 2,
//     slug: "priya-sharma-ai-tools",
//     author: {
//       name: "Priya Sharma",
//       role: "Tech Entrepreneur & AI Advocate",
//       bio: "Priya Sharma is a technology entrepreneur who has built multiple successful SaaS products. She's passionate about helping small businesses leverage AI technology.",
//       avatar: "/avatar3.jpg",
//       verified: true,
//     },
//     category: "Technology",
//     title: "AI Tools Every Small Business Should Be Using",
//     subtitle: "Transforming operations with intelligent automation",
//     excerpt: "From customer service to content creation, these AI tools are game-changers for modern entrepreneurs.",
//     image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop",
//     publishDate: "November 22, 2025",
//     readTime: "6 minute read",
//     views: 312,
//     likes: 203,
//     comments: 67,
//     shares: 89,
    
//     introduction: "Priya Sharma has been at the forefront of integrating AI into small business operations. In this interview, she shares her insights on the most impactful AI tools that are accessible, affordable, and transformative for entrepreneurs looking to scale their operations efficiently.",
    
//     questions: [
//       {
//         question: "What made you realize that AI was essential for small businesses, not just large corporations?",
//         answer: "The turning point came when I saw small businesses struggling with the same operational challenges that AI had already solved for larger companies. Tasks like customer support, content creation, and data analysis were eating up time that founders should spend on strategy and growth. I realized that AI had become accessible enough that even a solopreneur could leverage tools that were once only available to companies with massive IT budgets. The democratization of AI technology is one of the most exciting developments in entrepreneurship today."
//       },
//       {
//         question: "Which AI tools have had the most significant impact on your business operations?",
//         answer: "I'd highlight three categories. First, conversational AI for customer service—we use chatbots that handle 70% of our customer inquiries instantly. Second, AI writing assistants that help with everything from email responses to blog content, saving us about 15 hours per week. Third, predictive analytics tools that help us understand customer behavior and make data-driven decisions. These aren't expensive enterprise solutions—most cost less than $100 per month but deliver enormous value."
//       },
//       {
//         question: "How do you recommend small business owners start integrating AI into their workflows?",
//         answer: "Start small and focus on pain points. Don't try to AI-ify everything at once. Identify one repetitive, time-consuming task—maybe it's scheduling, email management, or social media posting—and find an AI tool to handle it. Use the time you save to tackle the next challenge. Also, don't be intimidated by the technology. Most modern AI tools are designed to be user-friendly and require no coding knowledge. Many offer free trials, so experiment before committing."
//       },
//       {
//         question: "What are the common mistakes you see entrepreneurs make when adopting AI tools?",
//         answer: "The biggest mistake is treating AI as a magic solution that requires no human oversight. AI is powerful, but it's a tool, not a replacement for human judgment and creativity. Another common error is buying too many tools without proper integration. You end up with subscription fatigue and disconnected systems. Finally, some entrepreneurs don't invest time in learning how to use the tools effectively. You wouldn't buy expensive equipment without learning how to operate it—the same applies to AI tools."
//       },
//       {
//         question: "How do you see AI evolving for small businesses in the next few years?",
//         answer: "I think we'll see even more specialized AI tools tailored to specific industries and business functions. The barrier to entry will continue to drop, making sophisticated AI accessible to everyone. We're also going to see better integration between tools, creating seamless workflows. Most excitingly, I believe AI will enable solo entrepreneurs and small teams to compete with much larger companies by dramatically amplifying their productivity and reach. The future of small business is incredibly AI-powered, and I'm here for it."
//       }
//     ],
    
//     keyTakeaways: [
//       "AI tools are now accessible and affordable for small businesses",
//       "Start by automating one repetitive task, then scale from there",
//       "AI amplifies human productivity but doesn't replace human judgment",
//       "Integration and proper training are key to maximizing AI tool value",
//       "The competitive advantage of AI is no longer limited to large corporations"
//     ],
    
//     relatedPosts: [
//       { id: 1, title: "Digital Transformation for Small Businesses", slug: "digital-transformation", views: 234 },
//       { id: 5, title: "Automation Strategies for Busy Entrepreneurs", slug: "automation-strategies", views: 198 },
//       { id: 8, title: "The Future of Work: AI and Human Collaboration", slug: "ai-human-collaboration", views: 176 }
//     ]
//   }
// };

// export default function EntrechatDetailPage({ params }: { params: { id: string } }) {
//   const router = useRouter();
//   const interview = entrechatInterviews[params.id as keyof typeof entrechatInterviews];
  
//   const [liked, setLiked] = useState(false);
//   const [bookmarked, setBookmarked] = useState(false);

//   // If interview not found, show 404
//   if (!interview) {
//     return (
//       <main className="bg-background min-h-screen pt-20 sm:pt-24">
//         <div className="max-w-4xl mx-auto px-4 py-16 text-center">
//           <h1 className="text-4xl font-bold mb-4">Interview Not Found</h1>
//           <p className="text-muted-foreground mb-8">The interview you &apos;re looking for doesn &apos;t exist.</p>
//           <Button onClick={() => router.push('/entrechat')}>
//             <ChevronLeft className="mr-2 h-4 w-4" />
//             Back to EntreChat
//           </Button>
//         </div>
//       </main>
//     );
//   }

//   const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

//   const shareLinks = {
//     facebook: `https://www.facebook.com/sharer.php?u=${encodeURIComponent(shareUrl)}`,
//     twitter: `https://twitter.com/share?text=${encodeURIComponent(interview.title)}&url=${encodeURIComponent(shareUrl)}`,
//     linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(interview.title)}`,
//   };

//   return (
//     <main className="bg-background min-h-screen pt-20 sm:pt-24">
//       {/* BREADCRUMB & BACK BUTTON */}
//       <section className="px-4 sm:px-6 lg:px-8 py-6 border-b border-border">
//         <div className="max-w-4xl mx-auto">
//           <Button
//             variant="ghost"
//             onClick={() => router.push('/entrechat')}
//             className="mb-4 -ml-2"
//           >
//             <ChevronLeft className="mr-2 h-4 w-4" />
//             Back to EntreChat
//           </Button>
          
//           <div className="flex items-center gap-2 text-sm text-muted-foreground">
//             <Link href="/" className="hover:text-primary transition-colors">Home</Link>
//             <ChevronRight className="h-3 w-3" />
//             <Link href="/entrechat" className="hover:text-primary transition-colors">EntreChat</Link>
//             <ChevronRight className="h-3 w-3" />
//             <span className="text-foreground">{interview.category}</span>
//           </div>
//         </div>
//       </section>

//       {/* ARTICLE HEADER */}
//       <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
//         <div className="max-w-4xl mx-auto">
//           {/* Category Badge */}
//           <div className="mb-4">
//             <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-white text-xs font-semibold uppercase shadow-sm">
//               {interview.category}
//             </span>
//           </div>

//           {/* Title */}
//           <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
//             {interview.title}
//           </h1>

//           {/* Subtitle */}
//           {interview.subtitle && (
//             <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
//               {interview.subtitle}
//             </p>
//           )}

//           {/* Meta Information */}
//           <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-border">
//             <div className="flex items-center gap-2 text-sm text-muted-foreground">
//               <Calendar className="h-4 w-4" />
//               <span>{interview.publishDate}</span>
//             </div>
//             <div className="flex items-center gap-2 text-sm text-muted-foreground">
//               <Clock className="h-4 w-4" />
//               <span>{interview.readTime}</span>
//             </div>
//             <div className="flex items-center gap-2 text-sm text-muted-foreground">
//               <Eye className="h-4 w-4" />
//               <span>{interview.views} views</span>
//             </div>
//             <div className="flex items-center gap-2 text-sm text-muted-foreground">
//               <MessageSquare className="h-4 w-4" />
//               <span>{interview.comments} comments</span>
//             </div>
//           </div>

//           {/* Share Buttons */}
//           <div className="flex items-center justify-between py-6 border-b border-border">
//             <div className="flex items-center gap-2">
//               <span className="text-sm font-semibold text-foreground mr-2">Share:</span>
//               <a
//                 href={shareLinks.facebook}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
//                 aria-label="Share on Facebook"
//               >
//                 <Facebook className="h-4 w-4" />
//               </a>
//               <a
//                 href={shareLinks.twitter}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="p-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white transition-colors"
//                 aria-label="Share on Twitter"
//               >
//                 <Twitter className="h-4 w-4" />
//               </a>
//               <a
//                 href={shareLinks.linkedin}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="p-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white transition-colors"
//                 aria-label="Share on LinkedIn"
//               >
//                 <Linkedin className="h-4 w-4" />
//               </a>
//             </div>

//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => setLiked(!liked)}
//                 className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
//               >
//                 <Heart className={`h-4 w-4 ${liked ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
//                 <span className="text-sm font-medium">{interview.likes + (liked ? 1 : 0)}</span>
//               </button>
//               <button
//                 onClick={() => setBookmarked(!bookmarked)}
//                 className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
//                 aria-label="Bookmark"
//               >
//                 <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* FEATURED IMAGE */}
//       <section className="px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
//         <div className="max-w-4xl mx-auto">
//           <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video">
//             <img
//               src={interview.image}
//               alt={interview.title}
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
//           </div>
//         </div>
//       </section>

//       {/* MAIN CONTENT */}
//       <section className="px-4 sm:px-6 lg:px-8 pb-12">
//         <div className="max-w-4xl mx-auto">
//           <div className="grid lg:grid-cols-4 gap-8">
//             {/* ARTICLE CONTENT - 3 COLUMNS */}
//             <div className="lg:col-span-3">
//               {/* Author Card */}
//               <div className="bg-gradient-to-br from-secondary/50 to-secondary rounded-xl p-6 mb-8 border border-border">
//                 <div className="flex items-start gap-4">
//                   <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
//                     {interview.author.name.charAt(0)}
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-1">
//                       <h3 className="text-lg font-bold text-foreground">
//                         {interview.author.name}
//                       </h3>
//                       {interview.author.verified && (
//                         <Award className="h-5 w-5 text-accent" />
//                       )}
//                     </div>
//                     <p className="text-sm text-muted-foreground mb-2">
//                       {interview.author.role}
//                     </p>
//                     <p className="text-sm text-foreground leading-relaxed">
//                       {interview.author.bio}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Introduction */}
//               <div className="prose prose-lg max-w-none mb-12">
//                 <p className="text-lg leading-relaxed text-foreground">
//                   {interview.introduction}
//                 </p>
//               </div>

//               {/* Q&A Section */}
//               <div className="space-y-8 mb-12">
//                 {interview.questions.map((qa, index) => (
//                   <div key={index} className="border-l-4 border-primary pl-6">
//                     <h3 className="text-xl font-display font-bold text-foreground mb-4 flex items-start gap-3">
//                       <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex-shrink-0 mt-1">
//                         Q{index + 1}
//                       </span>
//                       <span className="flex-1">{qa.question}</span>
//                     </h3>
//                     <div className="pl-11">
//                       <p className="text-base leading-relaxed text-foreground">
//                         {qa.answer}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Key Takeaways */}
//               {interview.keyTakeaways && interview.keyTakeaways.length > 0 && (
//                 <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-6 sm:p-8 mb-12 border-2 border-accent/20">
//                   <h3 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
//                     <span className="text-accent">✓</span>
//                     Key Takeaways
//                   </h3>
//                   <ul className="space-y-3">
//                     {interview.keyTakeaways.map((takeaway, index) => (
//                       <li key={index} className="flex items-start gap-3">
//                         <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex-shrink-0 mt-0.5">
//                           {index + 1}
//                         </span>
//                         <span className="text-base text-foreground leading-relaxed flex-1">
//                           {takeaway}
//                         </span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {/* Comments Section Placeholder */}
//               <div className="bg-card rounded-xl p-6 sm:p-8 border border-border">
//                 <h3 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
//                   <MessageSquare className="h-5 w-5 text-primary" />
//                   Comments ({interview.comments})
//                 </h3>
//                 <p className="text-muted-foreground mb-6">
//                   Join the conversation! Share your thoughts and experiences.
//                 </p>
//                 <Button className="bg-gradient-to-r from-primary to-accent text-white font-semibold">
//                   Leave a Comment
//                 </Button>
//               </div>
//             </div>

//             {/* SIDEBAR - 1 COLUMN */}
//             <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
//               {/* Related Posts */}
//               {interview.relatedPosts && interview.relatedPosts.length > 0 && (
//                 <div className="bg-card rounded-xl p-5 shadow-lg border border-border">
//                   <h3 className="text-base font-display font-bold text-foreground mb-4">
//                     Related Posts
//                   </h3>
//                   <div className="space-y-4">
//                     {interview.relatedPosts.map((post) => (
//                       <a
//                         key={post.id}
//                         href={`/entrechat/${post.id}`}
//                         className="block group"
//                       >
//                         <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight mb-2">
//                           {post.title}
//                         </h4>
//                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                           <Eye className="h-3 w-3" />
//                           <span>{post.views} views</span>
//                         </div>
//                       </a>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Share Again */}
//               <div className="bg-gradient-to-br from-secondary/50 to-secondary rounded-xl p-5 border border-border">
//                 <h3 className="text-base font-display font-bold text-foreground mb-3">
//                   Share This Interview
//                 </h3>
//                 <div className="grid grid-cols-1 gap-2">
//                   <a
//                     href={shareLinks.facebook}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
//                   >
//                     <Facebook className="h-4 w-4" />
//                     Facebook
//                   </a>
//                   <a
//                     href={shareLinks.twitter}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-2 px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors text-sm font-medium"
//                   >
//                     <Twitter className="h-4 w-4" />
//                     Twitter
//                   </a>
//                   <a
//                     href={shareLinks.linkedin}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-2 px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors text-sm font-medium"
//                   >
//                     <Linkedin className="h-4 w-4" />
//                     LinkedIn
//                   </a>
//                 </div>
//               </div>

//               {/* Category Link */}
//               <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
//                 <h3 className="text-sm font-display font-bold text-foreground mb-2">
//                   Explore More
//                 </h3>
//                 <p className="text-sm text-muted-foreground mb-3">
//                   More interviews in:
//                 </p>
//                 <a
//                   href={`/entrechat?category=${encodeURIComponent(interview.category)}`}
//                   className="inline-block px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors w-full text-center"
//                 >
//                   {interview.category}
//                 </a>
//               </div>
//             </aside>
//           </div>
//         </div>
//       </section>

//       {/* RELATED POSTS CAROUSEL */}
//       {interview.relatedPosts && interview.relatedPosts.length > 0 && (
//         <section className="px-4 sm:px-6 lg:px-8 py-12 bg-secondary/30">
//           <div className="max-w-screen-xl mx-auto">
//             <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-8">
//               You May Also Like
//             </h2>
//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {interview.relatedPosts.map((post) => (
//                 <a
//                   key={post.id}
//                   href={`/entrechat/${post.id}`}
//                   className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/30 group"
//                 >
//                   <h3 className="text-lg font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
//                     {post.title}
//                   </h3>
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <Eye className="h-4 w-4" />
//                     <span>{post.views} views</span>
//                   </div>
//                 </a>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       <Cta />
//     </main>
//   );
// }

import React from 'react'

const EntreChat = () => {
  return (
    <div>EntreChat</div>
  )
}

export default EntreChat