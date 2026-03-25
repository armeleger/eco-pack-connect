import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Importing the premium corporate font
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: "EcoPack Connect | Premium B2B Packaging",
  description: "Africa's B2B Marketplace for Sustainable Packaging",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      {/* Applying the font and a premium global text color */}
      <body className={`${jakarta.className} bg-slate-50 text-slate-800 antialiased selection:bg-green-200 selection:text-green-900`}>
        {children}
      </body>
    </html>
  );
}