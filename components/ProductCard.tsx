// components/ProductCard.tsx
"use client";

import Link from "next/link";
import { Clock, Package, MapPin, BadgeCheck, Star, Leaf } from "lucide-react";
import type { Product } from "@/types";
import { getProductImage } from "@/lib/imageHelper";
// Removed formatRWF import since we are hardcoding the RWF display

export default function ProductCard({ product }: { product: Product }) {
  const img = getProductImage(product.image_url, product.title, product.tags);

  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#2D6A4F]/30 transition-all duration-300 animate-slide-up"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#D8F3DC]">
        <img
          src={img}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1530968831187-a937baadb39b?w=800&q=80";
          }}
        />
        {product.is_featured && (
          <div className="absolute top-3 left-3 bg-[#2D6A4F] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star size={9} fill="white" /> Featured
          </div>
        )}
        {product.supplier?.verified && (
          <div className="absolute top-3 right-3 bg-white text-[#2D6A4F] text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <BadgeCheck size={10} /> Verified
          </div>
        )}
        {product.eco_certifications.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2">
            <div className="flex gap-1 flex-wrap">
              {product.eco_certifications.slice(0, 2).map((cert) => (
                <span key={cert} className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <Leaf size={8} /> {cert}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-[11px] text-[#2D6A4F] font-semibold uppercase tracking-wide mb-1">
          {product.category?.name}
        </p>
        <h3 className="font-semibold text-stone-900 text-sm leading-snug mb-3 line-clamp-2 group-hover:text-[#2D6A4F] transition-colors" style={{fontFamily:"var(--font-display)"}}>
          {product.title}
        </h3>

        {/* Updated Currency Display Here */}
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-xl font-bold text-stone-900">{product.price_per_unit.toLocaleString()} RWF</span>
          <span className="text-xs text-stone-400">/ unit</span>
        </div>

        <div className="flex items-center justify-between text-xs text-stone-500 mb-3">
          <span className="flex items-center gap-1"><Package size={11} /> MOQ: {product.moq.toLocaleString()}</span>
          <span className="flex items-center gap-1"><Clock size={11} /> {product.lead_time_days}d lead</span>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
          <div className="w-6 h-6 rounded-full bg-[#D8F3DC] flex items-center justify-center text-[9px] font-bold text-[#2D6A4F] flex-shrink-0">
            {product.supplier?.company_name?.charAt(0) ?? "?"}
          </div>
          <p className="text-xs font-medium text-stone-600 truncate flex-1">{product.supplier?.company_name}</p>
          <span className="flex items-center gap-0.5 text-xs text-stone-400 flex-shrink-0">
            <MapPin size={9} /> {product.supplier?.country}
          </span>
        </div>
      </div>
    </Link>
  );
}