// app/checkout/page.tsx
// ============================================================
// B2B TRADE CHECKOUT — Requires authentication (any role).
// Middleware handles the redirect, but we also check client-side
// as a fallback for graceful handling.
// Currency: RWF throughout.
// ============================================================
"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Shield, Lock, CheckCircle2, Package,
  Truck, FileText, Leaf, ChevronRight, AlertCircle, LogIn
} from "lucide-react";
import { MOCK_PRODUCTS, getMockDiscountTiers, formatRWF } from "@/lib/mockData";
import { getProductImage } from "@/lib/imageHelper";
import { createClient } from "@/lib/supabase";

type Form = {
  company: string; contact: string; email: string; phone: string;
  street:  string; city:    string; country: string; postal: string;
  incoterm:string; notes:   string;
};
const BLANK: Form = {
  company:"", contact:"", email:"", phone:"",
  street:"", city:"", country:"Rwanda", postal:"",
  incoterm:"FOB", notes:"",
};
const COUNTRIES = ["Rwanda","Kenya","Uganda","Tanzania","Burundi","Ethiopia","Ghana","Nigeria","South Africa","Egypt","Senegal","Other"];
const INCOTERMS  = ["EXW","FOB","CIF","DDP","DAP","FCA","CPT"];

function CheckoutContent() {
  const sp      = useSearchParams();
  const router  = useRouter();
  const supabase = createClient();

  const productId = sp.get("productId") || "prod-1";
  const initQty   = parseInt(sp.get("qty") || "0");
  const product   = MOCK_PRODUCTS.find((p) => p.id === productId) ?? MOCK_PRODUCTS[0];
  const tiers     = getMockDiscountTiers(product.id);
  const img       = getProductImage(product.image_url, product.title, product.tags);

  const [qty,       setQty]       = useState(Math.max(initQty, product.moq));
  const [form,      setForm]      = useState<Form>(BLANK);
  const [errors,    setErrors]    = useState<Partial<Form>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthed,    setIsAuthed]    = useState(false);

  // Client-side auth check (middleware is primary, this is fallback)
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthed(!!user);
      setAuthChecked(true);
    });
  }, []);

  const discount = useMemo(() => {
    for (const t of [...tiers].reverse()) if (qty >= t.min_qty) return t.discount_pct;
    return 0;
  }, [qty, tiers]);

  const unitPrice = product.price_per_unit * (1 - discount / 100);
  const total     = unitPrice * qty;
  const savings   = (product.price_per_unit - unitPrice) * qty;

  function f(k: keyof Form, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Form> = {};
    if (!form.company.trim())      e.company = "Required";
    if (!form.contact.trim())      e.contact = "Required";
    if (!form.email.includes("@")) e.email   = "Valid email required";
    if (!form.city.trim())         e.city    = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    // Simulate API submission
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setSubmitted(true);
  }

  // Loading auth state
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated — show sign in prompt
  if (!isAuthed) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-[#D8F3DC] rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={28} className="text-[#2D6A4F]" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-3" style={{fontFamily:"var(--font-display)"}}>
          Sign in to place your order
        </h2>
        <p className="text-stone-500 text-sm mb-8">
          You need an EcoPack account to submit a trade order. It takes less than a minute to create one.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href={`/login?redirect=/checkout?productId=${productId}&qty=${qty}&role=buyer`}
            className="flex items-center justify-center gap-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold py-3.5 rounded-xl transition-colors"
          >
            <LogIn size={16} /> Sign In to Continue
          </Link>
          <Link
            href={`/signup?role=buyer&redirect=/checkout?productId=${productId}&qty=${qty}`}
            className="flex items-center justify-center gap-2 border-2 border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#D8F3DC] font-bold py-3.5 rounded-xl transition-colors"
          >
            Create a Free Account
          </Link>
          <Link href={`/product/${productId}`} className="text-sm text-stone-400 hover:text-stone-600 flex items-center justify-center gap-1 mt-1 transition-colors">
            <ArrowLeft size={13} /> Back to product
          </Link>
        </div>
      </div>
    );
  }

  // ── Success Screen ───────────────────────────────────────
  if (submitted) {
    const orderId = `EP-${Math.random().toString(36).substring(2,8).toUpperCase()}`;
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center animate-fade-in">
        <div className="w-20 h-20 bg-[#D8F3DC] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-[#2D6A4F]" />
        </div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2" style={{fontFamily:"var(--font-display)"}}>
          Order Submitted!
        </h1>
        <p className="text-stone-500 mb-2">Your trade order is now with the supplier.</p>
        <p className="font-mono text-sm bg-stone-100 inline-block px-4 py-2 rounded-xl text-stone-700 mb-8">
          Order ID: <strong>{orderId}</strong>
        </p>
        <div className="bg-white border border-stone-200 rounded-2xl p-6 text-left mb-8 space-y-3">
          <h3 className="font-semibold text-stone-900 mb-2">What happens next?</h3>
          {[
            "Supplier confirms availability within 24 hours",
            "Pro-forma invoice sent to your email in RWF",
            "Production begins on deposit receipt",
            `Shipment ready in ${product.lead_time_days} business days`,
            "EcoPack trade assurance active until delivery",
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-stone-600">
              <div className="w-6 h-6 rounded-full bg-[#2D6A4F] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                {i + 1}
              </div>
              {s}
            </div>
          ))}
        </div>
        <Link href="/" className="inline-flex items-center gap-2 bg-[#2D6A4F] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-[#1B4332] transition-colors">
          Continue Shopping <ChevronRight size={16} />
        </Link>
      </div>
    );
  }

  // ── Checkout Form ────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-stone-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-[#2D6A4F] flex items-center gap-1 transition-colors">
          <ArrowLeft size={14} /> Marketplace
        </Link>
        <ChevronRight size={13} />
        <Link href={`/product/${product.id}`} className="hover:text-[#2D6A4F] truncate max-w-xs transition-colors">
          {product.title}
        </Link>
        <ChevronRight size={13} />
        <span className="text-stone-700 font-medium">Checkout</span>
      </div>

      {/* Security Banner */}
      <div className="flex items-center gap-3 bg-[#D8F3DC] border border-[#2D6A4F]/20 rounded-xl px-4 py-3 mb-8">
        <Lock size={15} className="text-[#2D6A4F] flex-shrink-0" />
        <p className="text-xs text-stone-700">
          <span className="font-bold text-[#1B4332]">Secure Trade Order</span> — Funds held in escrow until delivery confirmation. All prices in Rwandan Franc (RWF).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left: Form ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Volume */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h2 className="font-bold text-stone-900 text-lg mb-5 flex items-center gap-2" style={{fontFamily:"var(--font-display)"}}>
              <Package size={18} className="text-[#2D6A4F]" /> Order Volume
            </h2>
            <div className="mb-5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">Quantity (units)</label>
              <input
                type="number" value={qty} min={product.moq}
                onChange={(e) => setQty(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                className="w-full px-4 py-3.5 border border-stone-200 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all"
              />
              <p className="text-xs text-stone-400 mt-1">Minimum: {product.moq.toLocaleString()} units</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {tiers.map((tier) => {
                const active = qty >= tier.min_qty && (tier.max_qty === null || qty <= tier.max_qty);
                return (
                  <button key={tier.id} onClick={() => setQty(tier.min_qty)}
                    className={`p-3 rounded-xl border text-center transition-all ${active ? "border-[#2D6A4F] bg-[#D8F3DC]" : "border-stone-200 hover:border-[#2D6A4F]/40 bg-stone-50"}`}
                  >
                    <p className="text-xs text-stone-500 mb-0.5">
                      {tier.max_qty ? `${tier.min_qty.toLocaleString()}–${tier.max_qty.toLocaleString()}` : `${tier.min_qty.toLocaleString()}+`}
                    </p>
                    <p className={`text-sm font-bold ${active ? "text-[#1B4332]" : "text-stone-700"}`}>
                      {tier.discount_pct > 0 ? `-${tier.discount_pct}%` : "Base"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h2 className="font-bold text-stone-900 text-lg mb-5 flex items-center gap-2" style={{fontFamily:"var(--font-display)"}}>
              <Truck size={18} className="text-[#2D6A4F]" /> Shipping Destination
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">Company Name *</label>
                <input type="text" value={form.company} onChange={(e) => f("company", e.target.value)} placeholder="Your company name"
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all ${errors.company ? "border-red-300 bg-red-50" : "border-stone-200"}`}
                />
                {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company}</p>}
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">Contact Person *</label>
                <input type="text" value={form.contact} onChange={(e) => f("contact", e.target.value)} placeholder="Full name"
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all ${errors.contact ? "border-red-300 bg-red-50" : "border-stone-200"}`}
                />
                {errors.contact && <p className="text-xs text-red-500 mt-1">{errors.contact}</p>}
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">Email Address *</label>
                <input type="email" value={form.email} onChange={(e) => f("email", e.target.value)} placeholder="trade@company.com"
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all ${errors.email ? "border-red-300 bg-red-50" : "border-stone-200"}`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => f("phone", e.target.value)} placeholder="+250 788 000 000"
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">City *</label>
                <input type="text" value={form.city} onChange={(e) => f("city", e.target.value)} placeholder="Kigali"
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all ${errors.city ? "border-red-300 bg-red-50" : "border-stone-200"}`}
                />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">Country</label>
                <select value={form.country} onChange={(e) => f("country", e.target.value)}
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white transition-all"
                >
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">Incoterm</label>
                <select value={form.incoterm} onChange={(e) => f("incoterm", e.target.value)}
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white transition-all"
                >
                  {INCOTERMS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">Special Instructions</label>
                <textarea rows={3} value={form.notes} onChange={(e) => f("notes", e.target.value)}
                  placeholder="Custom printing, certifications required, special packaging..."
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] resize-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-stone-400 px-1">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <p>
              By submitting, you agree to EcoPack&apos;s{" "}
              <Link href="#" className="text-[#2D6A4F] underline">Terms of Service</Link>{" "}
              and Trade Order Policy. A pro-forma invoice in RWF will be emailed within 24 hours.
            </p>
          </div>
        </div>

        {/* ── Right: Summary ── */}
        <div>
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sticky top-24">
            <h3 className="font-bold text-stone-900 mb-4 flex items-center gap-2" style={{fontFamily:"var(--font-display)"}}>
              <FileText size={16} className="text-[#2D6A4F]" /> Order Summary
            </h3>

            <div className="flex gap-3 mb-5 pb-5 border-b border-stone-100">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#D8F3DC] flex-shrink-0">
                <img src={img} alt={product.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-900 leading-snug line-clamp-2">{product.title}</p>
                <p className="text-xs text-stone-400 mt-1">{product.supplier?.company_name}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-5">
              <div className="flex justify-between text-stone-600">
                <span>Unit price</span>
                <span>{formatRWF(unitPrice)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Quantity</span>
                <span>{qty.toLocaleString()} units</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-[#2D6A4F] font-semibold">
                  <span>Volume discount ({discount}%)</span>
                  <span>-{formatRWF(savings)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-stone-900 border-t border-stone-200 pt-2 mt-1">
                <span>Total</span>
                <span>{formatRWF(total)}</span>
              </div>
            </div>

            <p className="text-xs text-stone-400 mb-5">
              Excludes shipping, customs, and taxes. Final amount on pro-forma invoice.
            </p>

            <button onClick={handleSubmit} disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#2D6A4F] hover:bg-[#1B4332] disabled:bg-stone-300 text-white font-bold py-4 rounded-xl transition-colors"
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><Shield size={16} /> Submit Trade Order</>
              }
            </button>

            <div className="mt-4 space-y-1.5">
              {["Trade Assurance protection active","Verified eco supplier","Escrow payment security"].map((t) => (
                <div key={t} className="flex items-center gap-2 text-xs text-stone-400">
                  <Leaf size={10} className="text-[#2D6A4F]" /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#2D6A4F] border-t-transparent rounded-full animate-spin"/></div>}>
      <CheckoutContent />
    </Suspense>
  );
}