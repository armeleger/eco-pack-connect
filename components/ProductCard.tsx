// components/ProductCard.tsx
// ============================================================
// Product card for the marketplace grid.
// - Local image with graceful fallback
// - Eco certification badges
// - RWF pricing
// - Quick action on hover
// ============================================================
"use client";

import Link from "next/link";
import {
  Clock, Package, MapPin, BadgeCheck,
  Star, Leaf, ShoppingCart, Eye
} from "lucide-react";
import type { Product } from "@/types";
import { getProductImage } from "@/lib/imageHelper";

export default function ProductCard({ product }: { product: Product }) {
  const img = getProductImage(product.image_url, product.title, product.tags);

  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#2D6A4F]/40 transition-all duration-300"
    >
      {/* ── Image ── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#D8F3DC]">
        <img
          src={img}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback to a safe local image if load fails
            (e.target as HTMLImageElement).src = "/images/products/Bags & Pouches.webp";
          }}
        />

        {/* Featured badge */}
        {product.is_featured && (
          <div className="absolute top-3 left-3 bg-[#2D6A4F] text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Star size={9} fill="white" /> Featured
          </div>
        )}

        {/* Verified badge */}
        {product.supplier?.verified && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[#2D6A4F] text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <BadgeCheck size={10} /> Verified
          </div>
        )}

        {/* Eco cert strip */}
        {product.eco_certifications.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-3">
            <div className="flex gap-1 flex-wrap">
              {product.eco_certifications.slice(0, 2).map((cert) => (
                <span
                  key={cert}
                  className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full flex items-center gap-0.5 font-medium border border-white/20"
                >
                  <Leaf size={8} /> {cert}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quick view overlay on hover */}
        <div className="absolute inset-0 bg-[#1B4332]/0 group-hover:bg-[#1B4332]/10 transition-colors duration-300 flex items-center justify-center">
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <div className="bg-white text-[#2D6A4F] text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-lg">
              <Eye size={13} /> View Details
            </div>
          </div>
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="p-4">

        {/* Category label */}
        <p className="text-[10px] text-[#2D6A4F] font-bold uppercase tracking-widest mb-1.5">
          {product.category?.name}
        </p>

        {/* Title */}
        <h3
          className="font-semibold text-stone-900 text-sm leading-snug mb-3 line-clamp-2 group-hover:text-[#2D6A4F] transition-colors"
          style={{fontFamily:"var(--font-display)"}}
        >
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-3">
          <span className="text-xl font-bold text-stone-900">
            {product.price_per_unit.toLocaleString()} RWF
          </span>
          <span className="text-xs text-stone-400 font-medium">/ unit</span>
        </div>

        {/* MOQ + Lead Time */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-3 bg-stone-50 rounded-lg px-3 py-2">
          <span className="flex items-center gap-1.5">
            <Package size={11} className="text-[#2D6A4F]" />
            MOQ: <span className="font-semibold text-stone-700">{product.moq.toLocaleString()}</span>
          </span>
          <div className="w-px h-3 bg-stone-200" />
          <span className="flex items-center gap-1.5">
            <Clock size={11} className="text-[#2D6A4F]" />
            <span className="font-semibold text-stone-700">{product.lead_time_days}d</span> lead
          </span>
        </div>

        {/* Supplier info */}
        <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
          <div className="w-6 h-6 rounded-full bg-[#D8F3DC] flex items-center justify-center text-[9px] font-bold text-[#2D6A4F] flex-shrink-0 border border-[#2D6A4F]/20">
            {product.supplier?.company_name?.charAt(0) ?? "?"}
          </div>
          <p className="text-xs font-medium text-stone-600 truncate flex-1">
            {product.supplier?.company_name}
          </p>
          <span className="flex items-center gap-0.5 text-[10px] text-stone-400 flex-shrink-0 bg-stone-100 px-1.5 py-0.5 rounded-full">
            <MapPin size={8} /> {product.supplier?.country}
          </span>
        </div>

        {/* CTA button — appears on hover */}
        <div className="mt-3 overflow-hidden max-h-0 group-hover:max-h-12 transition-all duration-300">
          <div className="flex items-center justify-center gap-1.5 w-full bg-[#D8F3DC] hover:bg-[#2D6A4F] text-[#1B4332] hover:text-white font-semibold text-xs py-2.5 rounded-xl transition-colors">
            <ShoppingCart size={13} /> Start Order
          </div>
        </div>
      </div>
    </Link>
  );
}