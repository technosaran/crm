import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/layout/Shell";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Zenith CRM",
    default: "Zenith CRM | The Enterprise Intelligence Platform",
  },
  description: "Advanced CRM platform for high-performance sales, marketing, and customer success teams. Real-time analytics, automated workflows, and enterprise intelligence.",
  keywords: ["CRM", "Sales Optimization", "Enterprise Dashboard", "Workflow Automation"],
  authors: [{ name: "Zenith Engineering" }],
  openGraph: {
    title: "Zenith CRM | The Enterprise Intelligence Platform",
    description: "Empowering teams with real-time customer data and automated intelligence.",
    url: "https://zenithcrm.example.com",
    siteName: "Zenith CRM",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zenith CRM",
    description: "The world's most unrecognizable CRM experience rebuilt for speed.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark:bg-slate-950">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100`}
      >
        <Shell>
          {children}
        </Shell>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
