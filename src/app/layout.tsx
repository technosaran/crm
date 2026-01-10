import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/layout/Shell";

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
        className="antialiased bg-zenith-bg text-zenith-text"
        style={{
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}
      >
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
