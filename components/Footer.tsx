// components/Footer.tsx
import Link from "next/link";
import { Leaf, Mail, MapPin, Phone, Shield, Lock, Globe } from "lucide-react";

const LINKS = {
  Platform:   [{ l:"Marketplace", h:"/" }, { l:"Sell on EcoPack", h:"/seller-dashboard" }, { l:"Pricing", h:"#" }],
  Resources:  [{ l:"Eco Guides", h:"#" }, { l:"Certifications", h:"#" }, { l:"HS Codes", h:"#" }],
  Company:    [{ l:"About Us", h:"#" }, { l:"Careers", h:"#" }, { l:"Contact", h:"#" }],
  Legal:      [{ l:"Terms of Service", h:"#" }, { l:"Privacy Policy", h:"#" }],
};

export default function Footer() {
  return (
    <footer className="bg-[#1B4332] text-[#95D5B2] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 pb-12 border-b border-[#2D6A4F]">

          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-[#2D6A4F] rounded-xl flex items-center justify-center">
                <Leaf size={18} className="text-white" />
              </div>
              <span className="font-bold text-xl text-white" style={{fontFamily:"var(--font-display)"}}>
                Eco<span className="text-[#95D5B2]">Pack</span>
              </span>
            </div>
            <p className="text-sm text-[#95D5B2]/70 leading-relaxed mb-6">
              Africa&apos;s B2B marketplace for sustainable, eco-friendly, and recycled packaging solutions.
            </p>
            <div className="space-y-2 text-sm text-[#95D5B2]/60">
              <div className="flex items-center gap-2"><MapPin size={12} /> Kigali, Rwanda</div>
              <div className="flex items-center gap-2"><Mail size={12} /> hello@ecopack.africa</div>
              <div className="flex items-center gap-2"><Phone size={12} /> +250 788 000 000</div>
            </div>
          </div>

          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#95D5B2]/50 mb-4">{group}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.l}>
                    <Link href={link.h} className="text-sm text-[#95D5B2]/70 hover:text-white transition-colors">
                      {link.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#95D5B2]/40">
            © {new Date().getFullYear()} EcoPack Technologies Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-[#2D6A4F] px-3 py-1.5 rounded-lg text-[#95D5B2]">
              <Leaf size={11} /> Carbon Neutral
            </div>
            <div className="flex items-center gap-1.5 bg-[#2D6A4F] px-3 py-1.5 rounded-lg text-[#95D5B2]">
              <Lock size={11} /> SSL Secured
            </div>
            <div className="flex items-center gap-1.5 bg-[#2D6A4F] px-3 py-1.5 rounded-lg text-[#95D5B2]">
              <Globe size={11} /> AFCFTA Ready
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}