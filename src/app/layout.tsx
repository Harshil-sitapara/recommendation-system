import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "./providers/ConvexClientProvider";
import Link from "next/link";
import { Github } from "lucide-react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Recommendation system",
  description: "Convex vector search and voyage AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-full`}
      >
        <ConvexClientProvider>
          <div className="flex-1">
            {children}
          </div>
          <footer className="py-4 px-6 border-t bg-background">
            <div className="container mx-auto flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Recommendation System
              </p>
              <Link
                href="https://github.com/yourusername/yourrepository"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="View source on GitHub"
              >
                <Github className="w-6 h-6" />
              </Link>
            </div>
          </footer>
          <Toaster />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
