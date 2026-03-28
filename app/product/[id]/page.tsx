// app/product/[id]/page.tsx
// ============================================================
// PRODUCT DETAIL PAGE
//
// Shows:
//   - Full product image + eco certifications
//   - Pricing, MOQ, lead time, material specs
//   - Live bulk discount tier table
//   - Supplier trust card
//   - "Start Order" → checkout and "Contact Supplier" CTAs
// ============================================================
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, BadgeCheck, MapPin, Clock, Package,
  Leaf, MessageCircle, ShoppingCart, Share2,
  Star, ChevronRight, CheckCircle2, AlertCircle
} from "lucide-react";
import { MOCK_PRODUCTS, getMockDiscountTiers } from "@/lib/mockData";
import { getProductImage } from "@/lib/imageHelper";

export default function ProductDetailPage() {
  const { id }  = useParams<{ id: string }>();
  const product = MOCK_PRODUCTS.find((p) => p.id === id);

  const [quantity,     setQuantity]     = useState(product?.moq ?? 100);
  const [messageSent,  setMessageSent]  = useState(false);
  const [copied,       setCopied]       = useState(false);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <AlertCircle size={48} className="text-stone-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2" style={{fontFamily:"var(--font-display)"}}>Product Not Found</h1>
        <p className="text-stone-500 mb-6">This listing may have been removed or the link is incorrect.</p>
        <Link href="/" className="inline-flex items-center gap-2 text-[#2D6A4F] font-medium hover:underline">
          <ArrowLeft size={16} /> Back to Marketplace
        </Link>
      </div>
    );
  }

  const img   = getProductImage(product.image_url, product.title, product.tags);
  const tiers = getMockDiscountTiers(product.id);

  /** Calculates discount % for current quantity */
  function getDiscount(qty: number): number {
    for (const tier of [...tiers].reverse()) {
      if (qty >= tier.min_qty) return tier.discount_pct;
    }
    return 0;
  }

  const discount        = getDiscount(quantity);
  const discountedPrice = product.price_per_unit * (1 - discount / 100);
  const total           = discountedPrice * quantity;
  const savings         = (product.price_per_unit - discountedPrice) * quantity;

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-stone-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-[#2D6A4F] transition-colors">Marketplace</Link>
        <ChevronRight size={13} />
        <span className="text-stone-400">{product.category?.name}</span>
        <ChevronRight size={13} />
        <span className="text-stone-700 font-medium truncate">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

        {/* ── Left: Image + Info ── */}
        <div className="lg:col-span-3 space-y-6">

          {/* Hero Image */}
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-[#D8F3DC]">
            <img
              src={img}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1530968831187-a937baadb39b?w=800&q=80"; }}
            />
            {product.is_featured && (
              <div className="absolute top-4 left-4 bg-[#2D6A4F] text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Star size={11} fill="white" /> Featured Product
              </div>
            )}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl border border-stone-200 hover:bg-white transition-colors flex items-center gap-1.5 text-xs font-medium text-stone-600"
            >
              <Share2 size={12} /> {copied ? "Copied!" : "Share"}
            </button>

            {/* Eco certifications overlay */}
            {product.eco_certifications.length > 0 && (
              <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                {product.eco_certifications.map((cert) => (
                  <span key={cert} className="text-xs bg-[#1B4332]/80 backdrop-blur-sm text-[#95D5B2] px-2.5 py-1 rounded-full font-medium">
                    🌿 {cert}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h2 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
              <Leaf size={15} className="text-[#2D6A4F]" /> About This Product
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">{product.description}</p>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone-100">
              {[
                { label:"Material",       value: product.material ?? "—" },
                { label:"Currency",       value: "RWF" }, // Updated statically to RWF
                { label:"Lead Time",      value: `${product.lead_time_days} days` },
                { label:"Target Market",  value: product.target_market ?? "—" },
                { label:"Stock",          value: `${product.stock_quantity.toLocaleString()} units` },
                { label:"Category",       value: product.category?.name ?? "—" },
              ].map((spec) => (
                <div key={spec.label}>
                  <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-0.5">{spec.label}</p>
                  <p className="text-sm font-semibold text-stone-800">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bulk Pricing Table */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h2 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
              <Package size={15} className="text-[#2D6A4F]" /> Bulk Discount Tiers
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-stone-400 border-b border-stone-100">
                  <th className="text-left py-2 font-semibold">Quantity Range</th>
                  <th className="text-right py-2 font-semibold">Discount</th>
                  <th className="text-right py-2 font-semibold">Unit Price</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((tier) => {
                  const tierPrice = product.price_per_unit * (1 - tier.discount_pct / 100);
                  const isActive  = quantity >= tier.min_qty && (tier.max_qty === null || quantity <= tier.max_qty);
                  return (
                    <tr key={tier.id} className={`border-b border-stone-50 ${isActive ? "bg-[#D8F3DC] rounded-xl" : ""}`}>
                      <td className="py-3 pl-2 rounded-l-xl text-stone-700">
                        {tier.max_qty
                          ? `${tier.min_qty.toLocaleString()} – ${tier.max_qty.toLocaleString()} units`
                          : `${tier.min_qty.toLocaleString()}+ units`}
                        {isActive && <span className="ml-2 text-xs font-bold text-[#2D6A4F]">← Your tier</span>}
                      </td>
                      <td className={`py-3 text-right font-bold ${tier.discount_pct > 0 ? "text-[#2D6A4F]" : "text-stone-400"}`}>
                        {tier.discount_pct > 0 ? `-${tier.discount_pct}%` : "—"}
                      </td>
                      <td className="py-3 pr-2 text-right font-bold text-stone-900 rounded-r-xl">
                        {tierPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} RWF
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Right: Order Panel ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Price Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <p className="text-xs text-[#2D6A4F] font-bold uppercase tracking-widest mb-1">{product.category?.name}</p>
            <h1 className="text-xl font-bold text-stone-900 leading-snug mb-4" style={{fontFamily:"var(--font-display)"}}>
              {product.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {product.tags.map((t) => (
                <span key={t} className="text-xs bg-[#D8F3DC] text-[#1B4332] px-2.5 py-1 rounded-full font-medium">
                  {t}
                </span>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-bold text-stone-900" style={{fontFamily:"var(--font-display)"}}>
                {discountedPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} RWF
              </span>
              <span className="text-sm text-stone-400">/ unit</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center gap-2 mb-5">
                <span className="text-sm text-stone-400 line-through">{product.price_per_unit.toLocaleString()} RWF</span>
                <span className="text-xs font-bold text-white bg-[#2D6A4F] px-2 py-0.5 rounded-full">
                  -{discount}% bulk
                </span>
              </div>
            )}

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { icon:<Package size={14}/>, label:"Min. Order", value:`${product.moq.toLocaleString()} units` },
                { icon:<Clock size={14}/>,   label:"Lead Time",  value:`${product.lead_time_days} days` },
              ].map((s) => (
                <div key={s.label} className="bg-[#F8FAF9] border border-stone-100 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-stone-400 mb-1 text-xs">{s.icon}{s.label}</div>
                  <p className="text-sm font-bold text-stone-900">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Quantity Input */}
            <div className="mb-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">
                Order Quantity
              </label>
              <input
                type="number"
                value={quantity}
                min={product.moq}
                onChange={(e) => setQuantity(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all"
              />
              <p className="text-xs text-stone-400 mt-1">Minimum: {product.moq.toLocaleString()} units</p>
            </div>

            {/* Order Summary Box */}
            <div className="bg-[#D8F3DC] rounded-xl p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm text-stone-700">
                <span>{quantity.toLocaleString()} units × {discountedPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} RWF</span>
                <span className="font-semibold">{total.toLocaleString(undefined, { maximumFractionDigits: 0 })} RWF</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#1B4332] font-semibold">Your bulk savings</span>
                  <span className="font-bold text-[#1B4332]">- {savings.toLocaleString(undefined, { maximumFractionDigits: 0 })} RWF</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold border-t border-[#2D6A4F]/20 pt-2">
                <span className="text-stone-900">Estimated Total</span>
                <span className="text-stone-900">{total.toLocaleString(undefined, { maximumFractionDigits: 0 })} RWF</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5">
              <Link
                href={`/checkout?productId=${product.id}&qty=${quantity}`}
                className="w-full flex items-center justify-center gap-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold py-4 rounded-xl transition-colors text-sm"
              >
                <ShoppingCart size={16} /> Start Trade Order
              </Link>
              <button
                onClick={() => setMessageSent(true)}
                className="w-full flex items-center justify-center gap-2 border-2 border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#D8F3DC] font-bold py-4 rounded-xl transition-colors text-sm"
              >
                <MessageCircle size={16} /> Contact Supplier
              </button>
              {messageSent && (
                <div className="flex items-center gap-2 text-xs text-[#2D6A4F] bg-[#D8F3DC] px-3 py-2.5 rounded-xl">
                  <CheckCircle2 size={13} /> Message sent! Supplier responds within 24 hours.
                </div>
              )}
            </div>
          </div>

          {/* Supplier Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">Verified Supplier</h3>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#D8F3DC] flex items-center justify-center font-bold text-lg text-[#1B4332] flex-shrink-0">
                {product.supplier?.company_name?.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-bold text-stone-900 text-sm">{product.supplier?.company_name}</p>
                  {product.supplier?.verified && <BadgeCheck size={14} className="text-[#2D6A4F]" />}
                </div>
                <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                  <MapPin size={10} /> {product.supplier?.country}
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              {["Response Rate: 98%", "On-time Delivery: 96%", "Avg. Response: < 4 hours", "Orders fulfilled: 1,200+"].map((s) => (
                <div key={s} className="flex items-center gap-2 text-xs text-stone-500">
                  <CheckCircle2 size={11} className="text-[#2D6A4F] flex-shrink-0" /> {s}
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="bg-[#F8FAF9] rounded-2xl border border-stone-100 p-4 space-y-2.5">
            {[
              "Trade Assurance — Order protected until delivery",
              "Verified business registration on file",
              "Escrow payment — released after confirmation",
              "Third-party quality inspection available",
              "Carbon-neutral shipping options",
            ].map((b) => (
              <div key={b} className="flex items-start gap-2 text-xs text-stone-500">
                <Leaf size={11} className="text-[#2D6A4F] flex-shrink-0 mt-0.5" /> {b}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}