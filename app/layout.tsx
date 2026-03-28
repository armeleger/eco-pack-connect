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
  title:       "EcoPack — Sustainable Packaging Marketplace",
  description: "Africa's premier B2B marketplace for eco-friendly, compostable, and recycled packaging. Connect with verified suppliers across 54 countries.",
  keywords:    ["eco packaging", "sustainable", "B2B", "Africa", "compostable", "biodegradable"],
  openGraph: {
    title:       "EcoPack — Sustainable Packaging Marketplace",
    description: "Source eco-friendly packaging direct from African manufacturers.",
    type:        "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F8FAF9]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}