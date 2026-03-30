// app/layout.tsx
// ============================================================
// Root layout — wraps every page with Navbar and Footer.
// Fonts are loaded via Google Fonts in globals.css.
// ============================================================
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title:       "EcoPack Connect — Sustainable Packaging Marketplace",
  description: "Africa's premier B2B marketplace for eco-friendly, compostable, and recycled packaging. Connect with verified suppliers across the continent.",
  keywords:    ["eco packaging", "sustainable", "B2B", "Africa", "compostable", "biodegradable", "Kira Capital"],
  openGraph: {
    title:       "EcoPack Connect — Sustainable Packaging Marketplace",
    description: "Source eco-friendly packaging direct from verified African manufacturers.",
    type:        "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-[#F8FAF9]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}