import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Import Outfit
import "./globals.css";
import { Shell } from "@/components/layout/Shell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home | Zenith CRM",
  description: "The world's most recognizable CRM experience.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 2,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-zenith-bg text-zenith-text`}
      >
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
