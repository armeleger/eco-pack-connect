import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EcoPack Connect | Premium B2B Packaging",
  description: "Africa's B2B Marketplace for Sustainable Packaging",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      {/* Adding suppressHydrationWarning stops Grammarly from breaking the app */}
      <body suppressHydrationWarning className={`${jakarta.className} bg-stone-50 text-stone-800 antialiased selection:bg-amber-200 selection:text-amber-900`}>
        {children}
      </body>
    </html>
  );
}