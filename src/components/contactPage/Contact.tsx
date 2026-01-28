/*eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  Twitter,
  Youtube,
} from "lucide-react";
import { useState } from "react";
import { PageBanner } from "../PageBanner";

const faqs = [
  {
    q: "How can I contribute content to She At Work?",
    a: "You can submit your stories, articles, or insights through our Share Your Story page. Our editorial team reviews all submissions.",
  },
  {
    q: "Are your events virtual or in-person?",
    a: "We host both virtual and in-person events depending on the format and location. Event details are mentioned on each listing.",
  },
  {
    q: "How can I become a partner or sponsor?",
    a: "You can reach out to us via the contact form or email us directly to explore partnership and sponsorship opportunities.",
  },
  {
    q: "Can I advertise my business on your platform?",
    a: "Yes, we offer tailored advertising solutions for brands aligned with our mission. Contact us to learn more.",
  },
  {
    q: "Do you offer mentorship programs?",
    a: "Yes, we periodically launch mentorship initiatives connecting experienced leaders with emerging entrepreneurs.",
  },
];

export default function ContactPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
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
    setSuccess(false);

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setError("Name, email, and message are required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to submit your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-background min-h-screen">
         <PageBanner
              title="Get In Touch"
              description=" Have questions or want to collaborate? We&apos;d love to hear from you and support your entrepreneurial journey."
              image="/contactus/Contactusbanner.png"
            />
  

      {/* ================= CONTACT + FORM ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* LEFT INFO WITH ENHANCED STYLING */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold mb-3 sm:mb-4 text-foreground">
                Let&apos;s Connect
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-md leading-relaxed">
                Whether you have questions about our platform, want to share
                your story, or explore partnerships, we&apos;re here to help.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {[
                {
                  icon: Mail,
                  label: "Email Us",
                  value: "hello@sheatwork.com",
                  link: "mailto:hello@sheatwork.com",
                },
                {
                  icon: Phone,
                  label: "Call Us",
                  value: "+91 98765 43210",
                  link: "tel:+919876543210",
                },
                {
                  icon: MapPin,
                  label: "Visit Us",
                  value: "Shree House , A Block , sector 2 ,  A-50 Floor 2 , Noida , Uttar Pradesh , 201301 , India",
                  link: "#",
                },
              ].map(({ icon: Icon, label, value, link }) => (
                <a
                  key={label}
                  href={link}
                  className="group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                >
                  <span className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-md group-hover:shadow-lg transition-shadow shrink-0">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground text-sm sm:text-base mb-0.5 sm:mb-1">
                      {label}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* DECORATIVE ELEMENT */}
            <div className="relative mt-6 sm:mt-12 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
              <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-4 h-4 sm:w-6 sm:h-6 bg-primary rounded-full blur-sm" />
              <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 w-4 h-4 sm:w-6 sm:h-6 bg-accent rounded-full blur-sm" />
              <p className="text-xs sm:text-sm text-muted-foreground italic">
                &quot;Join a community of visionary women leaders shaping the
                future of entrepreneurship.&quot;
              </p>
            </div>
          </div>

          {/* RIGHT FORM WITH ROYAL STYLING */}
          <div className="relative">
            <div className="absolute -inset-0.5 sm:-inset-1 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 blur-2xl opacity-50" />
            <div className="relative bg-card border-2 border-primary/20 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 md:p-10 shadow-lg sm:shadow-2xl">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-primary to-accent rounded-full" />
                <h3 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-foreground">
                  Send Us a Message
                </h3>
              </div>

              {/* Success Message */}
              {success && (
                <div className="mb-6 rounded-xl bg-green-50 border-2 border-green-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-green-800 text-base">Message Sent Successfully!</h3>
                      <p className="text-green-700 text-sm">
                        Thank you for contacting us. We&apos;ll get back to you within 24-48 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 rounded-xl bg-red-50 border-2 border-red-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.698-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-red-800 text-base">Submission Failed</h3>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-5">
                <div>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name *"
                    className="h-10 sm:h-12 border-2 focus:border-primary transition-colors text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address *"
                    className="h-10 sm:h-12 border-2 focus:border-primary transition-colors text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number (Optional)"
                    className="h-10 sm:h-12 border-2 focus:border-primary transition-colors text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject (Optional)"
                    className="h-10 sm:h-12 border-2 focus:border-primary transition-colors text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Your Message *"
                    className="border-2 focus:border-primary transition-colors resize-none text-sm sm:text-base min-h-32"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full h-10 sm:h-12
                    bg-gradient-to-r from-primary to-accent
                    text-white
                    font-semibold
                    shadow-lg
                    hover:from-primary/90 hover:to-accent/90
                    hover:shadow-xl
                    transition-all
                    text-sm sm:text-base
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground mt-2">
                  * Required fields. We respect your privacy and will never share your information.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ================= GRADIENT DIVIDER ================= */}
      <section className="h-16 sm:h-20 lg:h-32 hero-gradient" />

      {/* ================= FAQ WITH ROYAL STYLING ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-screen-xl mx-auto text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-2 sm:mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto">
            Find quick answers to common questions
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`group border-2 rounded-lg sm:rounded-xl lg:rounded-2xl bg-card overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "border-border hover:border-primary/50 hover:shadow-md"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex justify-between items-center p-3 sm:p-4 lg:p-6 text-left"
                >
                  <span
                    className={`font-semibold text-sm sm:text-base lg:text-lg transition-colors ${
                      isOpen
                        ? "text-primary"
                        : "text-foreground group-hover:text-primary"
                    }`}
                  >
                    {item.q}
                  </span>
                  <div
                    className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "bg-gradient-to-br from-primary to-accent text-white rotate-180"
                        : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6 text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed border-t border-border/50 pt-3 sm:pt-4">
                      {item.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= SOCIAL WITH ENHANCED STYLING ================= */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 overflow-hidden hero-gradient">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
        
        <div className="relative max-w-screen-xl mx-auto text-center text-white px-4">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-display font-bold mb-2 sm:mb-3">
            Follow Us on Social Media
          </h3>
          <p className="text-white/90 text-sm sm:text-base mb-6 sm:mb-8 max-w-3xl mx-auto">
            Stay connected and inspired
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
            {[
              { Icon: Facebook, color: "hover:bg-[#1877F2]" ,href:"https://www.facebook.com/sheatwork" },
              { Icon: Twitter, color: "hover:bg-[#1DA1F2]",href:"https://x.com/sheatwork_com" },
              {
                Icon: Instagram,
                color:
                  "hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF]", href:"https://www.instagram.com/she_at_work"
              },

              
              { Icon: Linkedin, color: "hover:bg-[#0A66C2]",href:"https://www.linkedin.com/company/SheatWork" },
              { Icon: Youtube, color: "hover:bg-[#FF0000]",href:"https://www.youtube.com/@sheatwork" },
            ].map(({ Icon, color ,href }, i) => (
              <a
                href={href}
                target="_blank"
                key={i}
                className={`group w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center
                bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white
                ${color} hover:text-white hover:border-transparent
                transition-all duration-300 hover:scale-105 sm:hover:scale-110 hover:shadow-lg hover:-translate-y-0.5 sm:hover:-translate-y-1`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}