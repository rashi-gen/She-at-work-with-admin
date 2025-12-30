import { auth } from "@/auth";
import { Footer } from "@/components/footer/Footer";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "She At Work - Shaping the Future of Women Entrepreneurship",
  description: "Join a vibrant community of visionary women leaders, founders, and changemakers. Discover inspiring stories, insights, and resources.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider
          session={session}
          refetchInterval={5 * 60} // Refetch every 5 minutes
          refetchOnWindowFocus={true}
        >
  
            <main className="flex-1">{children}</main>
            <Footer/>
        </SessionProvider>
      </body>
    </html>
  );
}

