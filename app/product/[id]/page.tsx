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
      <div className="min-h-screen bg-[#F8FAF9] flex flex-col items-center justify-center p-4">
        <AlertCircle size={48} className="text-stone-300 mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-stone-900" style={{fontFamily:"var(--font-display)"}}>Product Not Found</h1>
        <p className="text-stone-500 mb-6 text-sm">This listing may have been removed or the link is incorrect.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-[#2D6A4F] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#1B4332] transition-colors">
          <ArrowLeft size={16} /> Back to Marketplace
        </Link>
      </div>
    );
  }

  const img   = getProductImage(product.image_url, product.title, product.tags);
  const tiers = getMockDiscountTiers(product.id);

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
    <div className="min-h-screen bg-[#F8FAF9]">
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
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-[#D8F3DC] border border-stone-200">
              <img
                src={img}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1530968831187-a937baadb39b?w=800&q=80"; }}
              />
              {product.is_featured && (
                <div className="absolute top-4 left-4 bg-[#2D6A4F] text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Star size={11} fill="white" /> Featured
                </div>
              )}
              <button
                onClick={handleShare}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl border border-stone-200 hover:bg-white transition-colors flex items-center gap-1.5 text-xs font-medium text-stone-600 shadow-sm"
              >
                <Share2 size={12} /> {copied ? "Copied!" : "Share"}
              </button>
              {product.eco_certifications.length > 0 && (
                <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                  {product.eco_certifications.map((cert) => (
                    <span key={cert} className="text-[10px] uppercase tracking-wider bg-[#1B4332]/90 backdrop-blur-sm text-[#95D5B2] px-3 py-1.5 rounded-full font-bold shadow-sm flex items-center gap-1.5">
                      <Leaf size={10} /> {cert}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
              <h2 className="font-bold text-stone-900 mb-3 flex items-center gap-2 text-lg" style={{fontFamily:"var(--font-display)"}}>
                <Leaf size={18} className="text-[#2D6A4F]" /> About This Product
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed mb-8">{product.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-stone-100">
                {[
                  { label:"Material",       value: product.material ?? "—" },
                  { label:"Lead Time",      value: `${product.lead_time_days} days` },
                  { label:"Target Market",  value: product.target_market ?? "—" },
                  { label:"In Stock",       value: `${product.stock_quantity.toLocaleString()} units` },
                  { label:"Category",       value: product.category?.name ?? "—" },
                ].map((spec) => (
                  <div key={spec.label}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">{spec.label}</p>
                    <p className="text-sm font-semibold text-stone-900">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bulk Pricing Table */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
              <h2 className="font-bold text-stone-900 mb-6 flex items-center gap-2 text-lg" style={{fontFamily:"var(--font-display)"}}>
                <Package size={18} className="text-[#2D6A4F]" /> Wholesale Discount Tiers
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-widest text-stone-400 border-b border-stone-100">
                      <th className="text-left py-3 font-bold">Volume (Units)</th>
                      <th className="text-right py-3 font-bold">Discount</th>
                      <th className="text-right py-3 font-bold">Unit Price (RWF)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiers.map((tier) => {
                      const tierPrice = product.price_per_unit * (1 - tier.discount_pct / 100);
                      const isActive  = quantity >= tier.min_qty && (tier.max_qty === null || quantity <= tier.max_qty);
                      return (
                        <tr key={tier.id} className={`border-b border-stone-50 transition-colors ${isActive ? "bg-[#D8F3DC] rounded-xl" : "hover:bg-stone-50"}`}>
                          <td className="py-4 pl-3 rounded-l-xl text-stone-700 font-medium">
                            {tier.max_qty
                              ? `${tier.min_qty.toLocaleString()} – ${tier.max_qty.toLocaleString()}`
                              : `${tier.min_qty.toLocaleString()}+`}
                            {isActive && <span className="ml-3 text-[10px] font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#95D5B2]/30 px-2 py-1 rounded-md">Active</span>}
                          </td>
                          <td className={`py-4 text-right font-bold ${tier.discount_pct > 0 ? "text-[#2D6A4F]" : "text-stone-400"}`}>
                            {tier.discount_pct > 0 ? `-${tier.discount_pct}%` : "—"}
                          </td>
                          <td className="py-4 pr-3 text-right font-bold text-stone-900 rounded-r-xl">
                            {tierPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Right: Order Panel ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Price Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] text-[#2D6A4F] bg-[#D8F3DC] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest">{product.category?.name}</span>
                {product.tags.slice(0, 1).map((t) => (
                  <span key={t} className="text-[10px] text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest">{t}</span>
                ))}
              </div>
              
              <h1 className="text-2xl font-bold text-stone-900 leading-tight mb-6" style={{fontFamily:"var(--font-display)"}}>
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-stone-900" style={{fontFamily:"var(--font-display)"}}>
                  {discountedPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <span className="text-sm font-bold text-stone-400">RWF / unit</span>
              </div>
              {discount > 0 ? (
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-sm text-stone-400 line-through">{product.price_per_unit.toLocaleString()} RWF</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B4332] bg-[#95D5B2] px-2 py-0.5 rounded-full">
                    Bulk Savings Applied
                  </span>
                </div>
              ) : (
                <div className="h-6 mb-6"></div> // spacer
              )}

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[#F8FAF9] border border-stone-100 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-stone-400 mb-1 text-[10px] font-bold uppercase tracking-widest"><Package size={12}/> Min. Order</div>
                  <p className="text-sm font-bold text-stone-900">{product.moq.toLocaleString()} units</p>
                </div>
                <div className="bg-[#F8FAF9] border border-stone-100 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-stone-400 mb-1 text-[10px] font-bold uppercase tracking-widest"><Clock size={12}/> Lead Time</div>
                  <p className="text-sm font-bold text-stone-900">{product.lead_time_days} days</p>
                </div>
              </div>

              {/* Quantity Input */}
              <div className="mb-6">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-2">
                  Order Volume (Units)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={quantity}
                    min={product.moq}
                    onChange={(e) => setQuantity(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                    className="w-full px-4 py-3.5 bg-white border border-stone-200 rounded-xl text-base font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all shadow-sm"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                    Min: {product.moq.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="bg-[#1B4332] rounded-xl p-5 mb-6 text-white shadow-lg">
                <div className="flex justify-between text-sm text-[#95D5B2] mb-2">
                  <span>{quantity.toLocaleString()} units × {discountedPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  <span className="font-semibold">{total.toLocaleString(undefined, { maximumFractionDigits: 0 })} RWF</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-white font-semibold">Bulk Savings</span>
                    <span className="font-bold text-[#95D5B2]">- {savings.toLocaleString(undefined, { maximumFractionDigits: 0 })} RWF</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold border-t border-[#2D6A4F] pt-3 mt-1">
                  <span>Total Due</span>
                  <span>{total.toLocaleString(undefined, { maximumFractionDigits: 0 })} RWF</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <Link
                  href={`/checkout?productId=${product.id}&qty=${quantity}`}
                  className="w-full flex items-center justify-center gap-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold py-4 rounded-xl transition-all shadow-md text-sm"
                >
                  <ShoppingCart size={18} /> Start Trade Order
                </Link>
                <button
                  onClick={() => setMessageSent(true)}
                  className="w-full flex items-center justify-center gap-2 bg-white border-2 border-stone-200 text-stone-600 hover:border-[#2D6A4F] hover:text-[#2D6A4F] font-bold py-3.5 rounded-xl transition-colors text-sm"
                >
                  <MessageCircle size={18} /> Contact Supplier
                </button>
                {messageSent && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1B4332] bg-[#D8F3DC] px-4 py-3 rounded-xl animate-in fade-in slide-in-from-bottom-2">
                    <CheckCircle2 size={16} className="text-[#2D6A4F]" /> Message sent to supplier.
                  </div>
                )}
              </div>
            </div>

            {/* Supplier Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4">Supplier Credentials</h3>
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] flex items-center justify-center font-bold text-xl text-[#2D6A4F] flex-shrink-0 border border-[#D8F3DC]">
                  {product.supplier?.company_name?.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <p className="font-bold text-stone-900 text-sm">{product.supplier?.company_name}</p>
                    {product.supplier?.verified && <BadgeCheck size={16} className="text-[#2D6A4F]" />}
                  </div>
                  <p className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                    <MapPin size={12} /> {product.supplier?.country}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  "EcoPack Verified Business",
                  "Trade Assurance Protected",
                  "Average Response: < 4 hours",
                  "Carbon-neutral shipping eligible"
                ].map((s) => (
                  <div key={s} className="flex items-center gap-2 text-xs font-medium text-stone-600">
                    <CheckCircle2 size={14} className="text-[#95D5B2] flex-shrink-0" /> {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}