import { auth } from "@/auth";
import { Footer } from "@/components/footer/Footer";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

/**
 * BODY FONT — Clean & highly readable
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * HEADING FONT — Modern & premium
 */
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "She At Work - Shaping the Future of Women Entrepreneurship",
  description:
    "Join a vibrant community of visionary women leaders, founders, and changemakers. Discover inspiring stories, insights, and resources.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${manrope.variable} antialiased bg-background text-foreground`}
      >
        <SessionProvider
          session={session}
          refetchInterval={5 * 60}
          refetchOnWindowFocus={true}
        >
          <main className="flex min-h-screen flex-col">
            {children}
          </main>

          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
