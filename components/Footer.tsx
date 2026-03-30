// components/Footer.tsx
// ============================================================
// Full-featured corporate footer.
// - Working navigation links
// - Newsletter subscription input
// - Contact info + social links
// - Trust badges
// - Sitemap columns
// ============================================================
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Leaf, Mail, MapPin, Phone, Shield, Lock,
  Globe, ArrowRight, CheckCircle2, Twitter,
  Linkedin, Instagram, Facebook, ExternalLink
} from "lucide-react";

const FOOTER_LINKS = {
  Platform: [
    { label: "Marketplace",       href: "/" },
    { label: "Sell on EcoPack",   href: "/signup?role=supplier" },
    { label: "Seller Dashboard",  href: "/seller-dashboard" },
  ],
  "For Buyers": [
    { label: "Browse Products",   href: "/" },
    { label: "Bulk Discounts",    href: "#pricing" },
    { label: "Sign Up as Buyer",  href: "/signup?role=buyer" },
  ],
  "For Suppliers": [
    { label: "Register as Supplier", href: "/signup?role=supplier" },
  ],
  Company: [
    { label: "About EcoPack",    href: "#about" },
    { label: "Contact Us",       href: "#contact" },
  ],
};

const SOCIAL_LINKS = [
  { icon: <Twitter size={16} />,   href: "https://x.com/kirarmel", label: "Twitter" },
  { icon: <Linkedin size={16} />,  href: "https://www.linkedin.com/in/kirarmeleger", label: "LinkedIn" },
  { icon: <Instagram size={16} />, href: "https://www.instagram.com/kirarmel", label: "Instagram" },
];

export default function Footer() {
  const [email,      setEmail]      = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubscribed(true);
    setSubLoading(false);
  }

  return (
    <footer className="bg-[#1B4332] text-[#95D5B2] mt-24">

      {/* ── Newsletter Strip ── */}
      <div className="border-b border-[#2D6A4F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-white font-bold text-lg" style={{fontFamily:"var(--font-display)"}}>
                Stay ahead of sustainable packaging trends
              </h3>
              <p className="text-[#95D5B2]/70 text-sm mt-1">
                Get supplier updates, new product alerts, and trade insights. No spam.
              </p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2 bg-[#2D6A4F] px-5 py-3 rounded-xl text-white text-sm font-medium">
                <CheckCircle2 size={16} /> Subscribed — thank you!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full lg:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 lg:w-64 px-4 py-2.5 rounded-xl bg-[#2D6A4F] border border-[#3D8A5F] text-white placeholder-[#95D5B2]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#95D5B2]/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={subLoading}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-[#1B4332] font-bold text-sm rounded-xl hover:bg-[#D8F3DC] disabled:opacity-70 transition-all flex-shrink-0"
                >
                  {subLoading
                    ? <div className="w-4 h-4 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
                    : <><ArrowRight size={14} /> Subscribe</>
                  }
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10 pb-10 border-b border-[#2D6A4F]">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 w-fit group">
              <div className="w-10 h-10 bg-[#2D6A4F] rounded-xl flex items-center justify-center group-hover:bg-[#3D8A5F] transition-colors">
                <Leaf size={20} className="text-white" />
              </div>
              <span className="font-bold text-2xl text-white" style={{fontFamily:"var(--font-display)"}}>
                Eco<span className="text-[#95D5B2]">Pack</span>
              </span>
            </Link>

            <p className="text-sm text-[#95D5B2]/70 leading-relaxed mb-6 max-w-xs">
              Africa&apos;s premier B2B marketplace for sustainable, eco-friendly, compostable, and recycled packaging. Connecting verified manufacturers with businesses across 20+ countries.
            </p>

            {/* Contact Info */}
            <div className="space-y-2.5 mb-6">
              <a href="https://maps.google.com/?q=Kigali+Rwanda" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-[#95D5B2]/60 hover:text-[#95D5B2] transition-colors group"
              >
                <MapPin size={13} className="flex-shrink-0" />
                <span>Kigali, Rwanda (HQ)</span>
                <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="mailto:hello@ecopack.africa"
                className="flex items-center gap-2.5 text-sm text-[#95D5B2]/60 hover:text-[#95D5B2] transition-colors"
              >
                <Mail size={13} className="flex-shrink-0" />
                a.kayisire@alustudent.com
              </a>
              <a href="tel:+250788000000"
                className="flex items-center gap-2.5 text-sm text-[#95D5B2]/60 hover:text-[#95D5B2] transition-colors"
              >
                <Phone size={13} className="flex-shrink-0" />
                +250 790 137 757
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-[#2D6A4F] flex items-center justify-center text-[#95D5B2] hover:bg-[#3D8A5F] hover:text-white transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group} className="lg:col-span-1">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#95D5B2]/50 mb-4">
                {group}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#95D5B2]/65 hover:text-white transition-colors flex items-center gap-1 group"
                    >
                      <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-200">
                        <ArrowRight size={10} />
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">

          {/* Copyright */}
          <p className="text-xs text-[#95D5B2]/40 text-center lg:text-left">
            © {new Date().getFullYear()} EcoPack Technologies Ltd. All rights reserved.{" "}
            <Link href="#" className="hover:text-[#95D5B2]/70 transition-colors">Privacy Policy</Link>
            {" · "}
            <Link href="#" className="hover:text-[#95D5B2]/70 transition-colors">Terms of Service</Link>
            {" · "}
            <Link href="#" className="hover:text-[#95D5B2]/70 transition-colors">Cookie Policy</Link>
          </p>

          {/* Trust Badges */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {[
              { icon: <Leaf size={11} />,   label: "Carbon Neutral" },
              { icon: <Lock size={11} />,   label: "SSL Secured" },
              { icon: <Shield size={11} />, label: "Trade Assured" },
              { icon: <Globe size={11} />,  label: "AFCFTA Ready" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-1.5 bg-[#2D6A4F] px-3 py-1.5 rounded-lg text-[#95D5B2] text-xs font-medium"
              >
                {badge.icon} {badge.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}