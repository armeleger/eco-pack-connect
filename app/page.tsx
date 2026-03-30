// app/page.tsx
// ============================================================
// MARKETPLACE HUB — Main product discovery page.
//
// Features:
//   - Hero banner with animated stats
//   - How it works section
//   - Category quick-select cards
//   - Sidebar filter (desktop) + horizontal scroll (mobile)
//   - Real-time search + sort
//   - Featured products strip
//   - Trust/social proof section
//   - Empty state handling
// ============================================================
"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, Filter, Package, BadgeCheck,
  TrendingUp, Shield, Leaf, ChevronRight,
  ArrowRight, Star, Boxes, ShoppingBag,
  FlaskConical, Tag, Layers, CheckCircle2,
  Users, Globe, Zap, LayoutDashboard
} from "lucide-react";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mockData";
import ProductCard from "@/components/ProductCard";

// ── Category icon map ────────────────────────────────────────
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "bags-pouches":         <ShoppingBag size={22} />,
  "boxes-cartons":        <Boxes size={22} />,
  "bottles-containers":   <FlaskConical size={22} />,
  "wrapping-labels":      <Tag size={22} />,
  "industrial-sacks":     <Package size={22} />,
  "food-packaging":       <Layers size={22} />,
  "protective-packaging": <Shield size={22} />,
  "custom-branded":       <Star size={22} />,
};

// ── How It Works steps ───────────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Browse & Discover",
    desc: "Search thousands of verified eco-packaging products across 8 categories from African manufacturers.",
    icon: <Search size={20} />,
  },
  {
    step: "02",
    title: "Compare & Select",
    desc: "View detailed specs, bulk discount tiers, lead times, and supplier credentials side by side.",
    icon: <BadgeCheck size={20} />,
  },
  {
    step: "03",
    title: "Place Trade Order",
    desc: "Submit your B2B order with shipping details. Receive a pro-forma invoice within 24 hours.",
    icon: <Package size={20} />,
  },
  {
    step: "04",
    title: "Receive & Trade",
    desc: "Production begins on deposit. EcoPack trade assurance protects your order until delivery.",
    icon: <CheckCircle2 size={20} />,
  },
];

// ── Platform stats ───────────────────────────────────────────
const PLATFORM_STATS = [
  { value: "318+",   label: "Verified Suppliers" },
  { value: "2,800+", label: "Active Buyers" },
  { value: "20+",    label: "African Countries" },
  { value: "1,247+", label: "Orders Fulfilled" },
];

// ── Marketplace Content (wrapped in Suspense) ────────────────
function MarketplaceContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [search,   setSearch]   = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sort,     setSort]     = useState<"featured"|"price_asc"|"price_desc"|"moq">("featured");
  const [showHow,  setShowHow]  = useState(false);

  // Sync with URL params
  useEffect(() => {
    setSearch(searchParams.get("q") || "");
    setCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  // Filtered + sorted products
  const products = useMemo(() => {
    let list = [...MOCK_PRODUCTS];

    if (category !== "all") {
      const cat = MOCK_CATEGORIES.find((c) => c.slug === category);
      if (cat) list = list.filter((p) => p.category_id === cat.id);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        (p.supplier?.company_name ?? "").toLowerCase().includes(q) ||
        (p.supplier?.country ?? "").toLowerCase().includes(q) ||
        p.eco_certifications.some((c) => c.toLowerCase().includes(q))
      );
    }

    switch (sort) {
      case "price_asc":  list.sort((a, b) => a.price_per_unit - b.price_per_unit); break;
      case "price_desc": list.sort((a, b) => b.price_per_unit - a.price_per_unit); break;
      case "moq":        list.sort((a, b) => a.moq - b.moq); break;
      default:           list.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
    }

    return list;
  }, [category, search, sort]);

  const featuredProducts  = MOCK_PRODUCTS.filter((p) => p.is_featured);
  const activeCategory    = MOCK_CATEGORIES.find((c) => c.slug === category);
  const isFiltering       = category !== "all" || search.trim().length > 0;

  return (
    <div className="bg-[#F8FAF9] min-h-screen">

      {/* ══════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#1B4332] relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-32 -top-32 w-96 h-96 bg-[#2D6A4F]/40 rounded-full blur-3xl" />
          <div className="absolute -left-20 bottom-0 w-72 h-72 bg-[#2D6A4F]/20 rounded-full blur-3xl" />
          <Leaf size={400} className="absolute -right-20 top-1/2 -translate-y-1/2 text-white/3 rotate-12" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#2D6A4F] text-[#95D5B2] text-xs font-bold px-3 py-1.5 rounded-full mb-5">
                <TrendingUp size={12} />
                Africa&apos;s #1 Sustainable Packaging Marketplace
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-5xl font-bold text-white leading-tight mb-5"
                style={{fontFamily:"var(--font-display)"}}
              >
                Sustainable Packaging,{" "}
                <span className="text-[#95D5B2]">Sourced from Africa.</span>
              </h1>

              <p className="text-[#95D5B2]/80 text-base mb-8 leading-relaxed max-w-lg">
                Connect directly with verified African manufacturers of compostable, biodegradable, and recycled packaging. Transparent wholesale pricing, bulk discounts, and trade assurance.
              </p>

              {/* Hero Search Bar */}
              <div className="flex gap-2 mb-8 max-w-lg">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && search.trim()) {
                        router.push(`/?q=${encodeURIComponent(search.trim())}`);
                      }
                    }}
                    placeholder="Search kraft bags, jute sacks, food trays..."
                    className="w-full pl-10 pr-4 py-3.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#95D5B2] transition-all shadow-lg"
                  />
                </div>
                <button
                  onClick={() => {
                    if (search.trim()) router.push(`/?q=${encodeURIComponent(search.trim())}`);
                  }}
                  className="px-5 py-3.5 bg-[#2D6A4F] hover:bg-[#3D8A5F] text-white font-bold text-sm rounded-xl transition-colors shadow-lg flex-shrink-0 flex items-center gap-1.5"
                >
                  <Search size={15} /> Search
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-4 text-sm text-white/70">
                {[
                  { icon: <Shield size={14} />,       label: "Trade Assurance" },
                  { icon: <BadgeCheck size={14} />,   label: "Verified Suppliers" },
                  { icon: <Leaf size={14} />,          label: "Eco Certified" },
                  { icon: <Zap size={14} />,           label: "Bulk Discounts" },
                ].map((item) => (
                  <span key={item.label} className="flex items-center gap-1.5">
                    {item.icon} {item.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Stats Grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {PLATFORM_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#2D6A4F]/50 backdrop-blur-sm border border-[#3D8A5F]/50 rounded-2xl p-6 text-center hover:bg-[#2D6A4F]/70 transition-colors"
                >
                  <p
                    className="text-3xl font-bold text-white mb-1"
                    style={{fontFamily:"var(--font-display)"}}
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm text-[#95D5B2]/80">{stat.label}</p>
                </div>
              ))}

              {/* CTA Cards */}
              <Link href="/signup?role=buyer"
                className="col-span-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-center transition-colors group"
              >
                <ShoppingBag size={24} className="text-[#95D5B2] group-hover:scale-110 transition-transform" />
                <p className="text-sm font-bold text-white">Join as Buyer</p>
                <p className="text-xs text-[#95D5B2]/70">Browse & order today</p>
              </Link>

              <Link href="/signup?role=supplier"
                className="col-span-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-center transition-colors group"
              >
                <LayoutDashboard size={24} className="text-[#95D5B2] group-hover:scale-110 transition-transform" />
                <p className="text-sm font-bold text-white">Start Selling</p>
                <p className="text-xs text-[#95D5B2]/70">List your products free</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CATEGORY QUICK SELECT (only shown when not filtering)
      ══════════════════════════════════════════════════════ */}
      {!isFiltering && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-stone-900" style={{fontFamily:"var(--font-display)"}}>
              Browse by Category
            </h2>
            <button
              onClick={() => setCategory("all")}
              className="text-sm text-[#2D6A4F] font-semibold hover:underline flex items-center gap-1"
            >
              View all <ChevronRight size={14} />
            </button>
          </div>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex lg:grid lg:grid-cols-8 gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {MOCK_CATEGORIES.map((cat) => {
              const count = MOCK_PRODUCTS.filter((p) => p.category_id === cat.id).length;
              const isActive = category === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(isActive ? "all" : cat.slug)}
                  className={`flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center min-w-[100px] lg:min-w-0 ${
                    isActive
                      ? "border-[#2D6A4F] bg-[#D8F3DC] shadow-sm"
                      : "border-stone-200 bg-white hover:border-[#2D6A4F]/50 hover:bg-[#D8F3DC]/50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-[#2D6A4F] text-white"
                      : "bg-[#E8F5E9] text-[#2D6A4F]"
                  }`}>
                    {CATEGORY_ICONS[cat.slug] ?? <Leaf size={22} />}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold leading-tight ${isActive ? "text-[#1B4332]" : "text-stone-700"}`}>
                      {cat.name}
                    </p>
                    <p className="text-[10px] text-stone-400 mt-0.5">{count} products</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          FEATURED PRODUCTS (only when not filtering)
      ══════════════════════════════════════════════════════ */}
      {!isFiltering && featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Star size={16} className="text-[#2D6A4F]" fill="#2D6A4F" />
              <h2 className="text-xl font-bold text-stone-900" style={{fontFamily:"var(--font-display)"}}>
                Featured Products
              </h2>
            </div>
            <button
              onClick={() => setSort("featured")}
              className="text-sm text-[#2D6A4F] font-semibold hover:underline flex items-center gap-1"
            >
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          MAIN MARKETPLACE GRID
      ══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Sidebar ── */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-stone-200 p-4 sticky top-24 shadow-sm">

              {/* Categories */}
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 px-1">
                Filter by Category
              </h2>
              <nav className="space-y-0.5 mb-5">
                <button
                  onClick={() => setCategory("all")}
                  className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    category === "all"
                      ? "bg-[#D8F3DC] text-[#1B4332] font-bold"
                      : "text-stone-600 hover:bg-stone-50 hover:text-[#2D6A4F]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Boxes size={13} className={category === "all" ? "text-[#2D6A4F]" : "text-stone-400"} />
                    All Products
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    category === "all" ? "bg-[#2D6A4F] text-white" : "text-stone-400 bg-stone-100"
                  }`}>
                    {MOCK_PRODUCTS.length}
                  </span>
                </button>

                {MOCK_CATEGORIES.map((cat) => {
                  const count = MOCK_PRODUCTS.filter((p) => p.category_id === cat.id).length;
                  const isActive = category === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(isActive ? "all" : cat.slug)}
                      className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${
                        isActive
                          ? "bg-[#D8F3DC] text-[#1B4332] font-bold"
                          : "text-stone-600 hover:bg-stone-50 hover:text-[#2D6A4F]"
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate pr-1">
                        <span className={isActive ? "text-[#2D6A4F]" : "text-stone-400"}>
                          {CATEGORY_ICONS[cat.slug] ?? <Leaf size={13} />}
                        </span>
                        <span className="truncate">{cat.name}</span>
                      </span>
                      {count > 0 && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                          isActive ? "bg-[#2D6A4F] text-white" : "text-stone-400 bg-stone-100"
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Divider */}
              <div className="border-t border-stone-100 pt-4 mb-4">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 px-1">
                  Sort By
                </h2>
                <div className="space-y-0.5">
                  {[
                    { value: "featured",   label: "Featured First" },
                    { value: "price_asc",  label: "Price: Low to High" },
                    { value: "price_desc", label: "Price: High to Low" },
                    { value: "moq",        label: "Lowest MOQ First" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSort(option.value as typeof sort)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors ${
                        sort === option.value
                          ? "bg-[#D8F3DC] text-[#1B4332] font-bold"
                          : "text-stone-500 hover:bg-stone-50 hover:text-stone-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust badges */}
              <div className="border-t border-stone-100 pt-4 space-y-2">
                {[
                  "Eco Certified Products",
                  "Verified Suppliers",
                  "Bulk Pricing Available",
                  "Trade Assurance",
                ].map((b) => (
                  <div key={b} className="flex items-center gap-2 text-xs text-stone-500">
                    <Leaf size={10} className="text-[#2D6A4F] flex-shrink-0" /> {b}
                  </div>
                ))}
              </div>

              {/* Sell CTA */}
              <div className="mt-4 pt-4 border-t border-stone-100">
                <Link
                  href="/signup?role=supplier"
                  className="flex items-center justify-center gap-1.5 w-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
                >
                  <LayoutDashboard size={12} /> Start Selling
                </Link>
              </div>
            </div>
          </aside>

          {/* ── Main Product Grid ── */}
          <div className="flex-1 min-w-0">

            {/* Search + Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products, materials, certifications..."
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all shadow-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Filter size={14} className="text-stone-400 flex-shrink-0" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="text-sm bg-white border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] cursor-pointer shadow-sm"
                >
                  <option value="featured">Featured First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="moq">Lowest MOQ First</option>
                </select>
              </div>
            </div>

            {/* Active filters + result count */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm text-stone-500">
                  <span className="font-bold text-stone-900">{products.length}</span> product{products.length !== 1 ? "s" : ""}
                  {activeCategory && (
                    <> in <span className="font-bold text-[#2D6A4F]">{activeCategory.name}</span></>
                  )}
                  {search && (
                    <> matching <span className="font-bold text-[#2D6A4F]">&quot;{search}&quot;</span></>
                  )}
                </p>

                {/* Active filter pills */}
                {isFiltering && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {activeCategory && (
                      <span className="inline-flex items-center gap-1 text-xs bg-[#D8F3DC] text-[#1B4332] px-2.5 py-1 rounded-full font-medium">
                        {activeCategory.name}
                        <button onClick={() => setCategory("all")} className="hover:text-red-500 ml-0.5">×</button>
                      </span>
                    )}
                    {search && (
                      <span className="inline-flex items-center gap-1 text-xs bg-[#D8F3DC] text-[#1B4332] px-2.5 py-1 rounded-full font-medium">
                        &quot;{search}&quot;
                        <button onClick={() => setSearch("")} className="hover:text-red-500 ml-0.5">×</button>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {isFiltering && (
                <button
                  onClick={() => { setSearch(""); setCategory("all"); }}
                  className="text-xs text-stone-400 hover:text-[#2D6A4F] flex items-center gap-1 transition-colors font-medium"
                >
                  Clear all <ChevronRight size={12} />
                </button>
              )}
            </div>

            {/* Product Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-24 bg-white rounded-2xl border border-stone-200">
                <div className="w-16 h-16 bg-[#D8F3DC] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package size={28} className="text-[#2D6A4F]" />
                </div>
                <h3
                  className="font-bold text-stone-900 text-lg mb-2"
                  style={{fontFamily:"var(--font-display)"}}
                >
                  No products found
                </h3>
                <p className="text-sm text-stone-500 mb-6 max-w-sm mx-auto">
                  We couldn&apos;t find any products matching your search. Try adjusting your filters or searching for something else.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <button
                    onClick={() => { setSearch(""); setCategory("all"); }}
                    className="flex items-center gap-2 bg-[#2D6A4F] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#1B4332] transition-colors"
                  >
                    <Boxes size={14} /> Browse all products
                  </button>
                  <Link href="/signup?role=supplier"
                    className="flex items-center gap-2 border border-stone-200 text-stone-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors"
                  >
                    <LayoutDashboard size={14} /> List your product
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS (only shown when not filtering)
      ══════════════════════════════════════════════════════ */}
      {!isFiltering && (
        <section className="bg-white border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-[#D8F3DC] text-[#1B4332] text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                <Zap size={12} /> Simple B2B Trade Process
              </div>
              <h2
                className="text-3xl font-bold text-stone-900"
                style={{fontFamily:"var(--font-display)"}}
              >
                How EcoPack Works
              </h2>
              <p className="text-stone-500 mt-2 max-w-lg mx-auto text-sm">
                From discovery to delivery — a seamless, transparent B2B trade experience built for African commerce.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {HOW_IT_WORKS.map((step, i) => (
                <div key={step.step} className="relative">
                  {/* Connector line */}
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-[#D8F3DC] z-0 -translate-x-1/2" />
                  )}
                  <div className="relative bg-[#F8FAF9] rounded-2xl p-6 border border-stone-200 hover:border-[#2D6A4F]/30 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#2D6A4F] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                        {step.icon}
                      </div>
                      <span className="text-2xl font-bold text-stone-200" style={{fontFamily:"var(--font-display)"}}>
                        {step.step}
                      </span>
                    </div>
                    <h3 className="font-bold text-stone-900 mb-2 text-sm">
                      {step.title}
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/signup"
                className="inline-flex items-center gap-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold px-6 py-3.5 rounded-xl transition-colors shadow-sm text-sm"
              >
                Get Started Today <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          SUPPLIER CTA BANNER (only shown when not filtering)
      ══════════════════════════════════════════════════════ */}
      {!isFiltering && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="relative bg-[#1B4332] rounded-3xl p-8 lg:p-12 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-[#2D6A4F]/40 rounded-full blur-3xl" />
              <Leaf size={300} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/3" />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left max-w-xl">
                <div className="inline-flex items-center gap-2 bg-[#2D6A4F] text-[#95D5B2] text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                  <Globe size={12} /> For African Manufacturers
                </div>
                <h2
                  className="text-2xl lg:text-3xl font-bold text-white mb-3"
                  style={{fontFamily:"var(--font-display)"}}
                >
                  Sell Your Eco Packaging to Buyers Across Africa
                </h2>
                <p className="text-[#95D5B2]/80 text-sm leading-relaxed">
                  Join 318+ verified suppliers on EcoPack. List your products for free, reach thousands of B2B buyers, and grow your export business.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Link href="/signup?role=supplier"
                  className="flex items-center justify-center gap-2 bg-white text-[#1B4332] font-bold px-6 py-3.5 rounded-xl hover:bg-[#D8F3DC] transition-colors text-sm shadow-lg"
                >
                  <LayoutDashboard size={32} /> Start Selling Free
                </Link>
              </div>
            </div>

            {/* Stats row */}
            <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[#2D6A4F]">
              {[
                { icon: <Users size={14} />,      label: "Active Buyers",   value: "2,800+" },
                { icon: <Globe size={14} />,       label: "Countries",       value: "20+" },
                { icon: <Package size={14} />,     label: "Orders/Month",    value: "150+" },
                { icon: <TrendingUp size={14} />,  label: "Avg. Order Size", value: "RWF 1.2M" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-[#95D5B2]/60 text-xs mb-1">
                    {stat.icon} {stat.label}
                  </div>
                  <p className="text-white font-bold text-lg" style={{fontFamily:"var(--font-display)"}}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh] bg-[#F8FAF9]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#2D6A4F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-stone-400">Loading marketplace...</p>
        </div>
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}