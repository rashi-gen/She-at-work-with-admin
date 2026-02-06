/*eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, FileText, Sparkles, Users, Target, Award } from "lucide-react";
import { PageBanner } from "../PageBanner";
import Link from "next/link";

export default function ShareYourStory() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    story: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        title: "",
        story: "",
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-background min-h-screen">
       <PageBanner
              title="Share Your Entrepreneurial Journey Inspire Our Community"
              description=" Your story has the power to inspire the next generation of women entrepreneurs. Join our community of 975+ published stories and make your voice heard."
              image="/finalshareyourstorybanner.png"
            />


      {/* ================= MAIN CONTENT ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* ================= LEFT COLUMN - INSPIRATION ================= */}
            <div className="lg:col-span-1 space-y-8">
              {/* Why Share Section */}
              <div className="bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border-2 border-border hover:border-primary/30">
                <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
                </div>

                <div className="mt-8 sm:mt-10 lg:mt-12">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-foreground mb-2 sm:mb-3">
                    Why Share Your Story?
                  </h3>
                  
                  <div className="space-y-6 mt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Inspire Others</h4>
                        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                          Your journey can motivate fellow entrepreneurs facing similar challenges.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Build Your Legacy</h4>
                        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                          Become part of our growing collection of success stories.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Gain Visibility</h4>
                        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                          Share your business with 50K+ members and potential collaborators.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Testimonial */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-primary/20">
                <div className="text-primary mb-3">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm lg:text-base italic text-foreground mb-4 leading-relaxed">
                  &quot;Sharing my story on She At Work connected me with amazing mentors and opened doors I never imagined. Your story matters!&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-accent" />
                  <div>
                    <div className="font-semibold text-xs sm:text-sm text-foreground">Sarah Chen</div>
                    <div className="text-xs text-muted-foreground">Founder - BloomTech</div>
                  </div>
                </div>
              </div>
              
              {/* Tips */}
              <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-border">
                <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-3 sm:mb-4">
                  Writing Tips
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>Be authentic and share your true journey</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>Include challenges and how you overcame them</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>Share specific lessons learned</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>Aim for 500-1000 words for maximum impact</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* ================= RIGHT COLUMN - FORM ================= */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                {success && (
                  <div className="mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-base sm:text-lg text-green-800 mb-2">Story Submitted Successfully!</h3>
                        <p className="text-xs sm:text-sm text-green-700">
                          Thank you for sharing your journey with our community. Our editorial team will review your submission and notify you once it&apos;s published. Expect to hear from us within 3-5 business days.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.698-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-base sm:text-lg text-red-800 mb-2">Submission Failed</h3>
                        <p className="text-xs sm:text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg border-2 border-border">
                  <div className="flex items-center gap-4 mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                      <FileText className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground mb-1">
                        Your Story Awaits
                      </h2>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Fill out the form below to share your entrepreneurial journey
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-sm font-semibold flex items-center gap-1">
                          Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="h-10 sm:h-12 rounded-lg border-2 border-border focus:border-primary transition-all"
                          placeholder="Your full name"
                        />
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-sm font-semibold flex items-center gap-1">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="h-10 sm:h-12 rounded-lg border-2 border-border focus:border-primary transition-all"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <Label className="text-sm font-semibold">Phone (Optional)</Label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="h-10 sm:h-12 rounded-lg border-2 border-border focus:border-primary transition-all"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <Label className="text-sm font-semibold flex items-center gap-1">
                        Story Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="h-10 sm:h-12 rounded-lg border-2 border-border focus:border-primary transition-all"
                        placeholder="Give your story a compelling title"
                      />
                      <p className="text-xs text-muted-foreground">
                        Example: &aqout;From Side Hustle to Six Figures: My 3-Year Entrepreneurial Journey &aqout;
                      </p>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <Label className="text-sm font-semibold flex items-center gap-1">
                        Your Story <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Textarea
                          name="story"
                          value={formData.story}
                          onChange={handleChange}
                          rows={8}
                          required
                          className="rounded-lg border-2 border-border focus:border-primary transition-all resize-none"
                          placeholder="Share your entrepreneurial journey... What inspired you to start? What challenges did you face? What lessons have you learned? What advice would you give to others?"
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                          {formData.story.length}/2000 characters
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>• Be authentic and share your true experience</p>
                        <p>• Include specific examples and lessons learned</p>
                        <p>• Aim for 500-1000 words for best engagement</p>
                      </div>
                    </div>

                    <div className="pt-4 sm:pt-6 border-t-2 border-border">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          <p className="flex items-center gap-1">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Your information is secure and private
                          </p>
                          <p className="flex items-center gap-1">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Editorial review within 3-5 business days
                          </p>
                        </div>
                        
                        <Button
                          type="submit"
                          disabled={loading}
                          size="lg"
                          className="h-10 sm:h-12 px-6 sm:px-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg group"
                        >
                          {loading ? (
                            <>
                              <div className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              <span className="text-sm sm:text-base">Submitting...</span>
                            </>
                          ) : (
                            <>
                              <span className="text-sm sm:text-base">Share Your Journey</span>
                              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <p className="mt-3 sm:mt-4 text-xs text-center text-muted-foreground">
                        By submitting, you agree to our Terms of Service and Privacy Policy. 
                        We may contact you about your story via email.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION - SAME as About page ================= */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 overflow-hidden hero-gradient">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

        <div className="relative max-w-screen-xl mx-auto text-center text-white px-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold mb-3 sm:mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto">
            Your story has the power to change someone &apos;s entrepreneurial journey. 
            Share your experience and inspire our community today.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              className="h-10 sm:h-12 bg-white text-primary hover:bg-white/90 font-semibold px-6 sm:px-8 text-sm sm:text-base"
              onClick={() => {
                document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Share Your Story Now
            </Button>
            <Link href="/entrechat">
            <Button
              variant="outline"
              className="h-10 sm:h-12 border-2 border-white text-primary hover:bg-white/10 font-semibold px-6 sm:px-8 text-sm sm:text-base"
            >
              Read Other Stories
              <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}