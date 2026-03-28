// app/page.tsx
// ============================================================
// MARKETPLACE HUB — Main product discovery page.
//
// Features:
//   - Hero banner with platform stats
//   - Sidebar category filter (desktop)
//   - Real-time search + sort filtering
//   - Product grid using ProductCard component
//   - Empty state handling
// ============================================================
"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search, Filter, Package, BadgeCheck,
  TrendingUp, Shield, Leaf, ChevronRight
} from "lucide-react";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mockData";
import ProductCard from "@/components/ProductCard";

// Wrapped in Suspense because useSearchParams requires it
function MarketplaceContent() {
  const searchParams = useSearchParams();
  const [search,   setSearch]   = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sort,     setSort]     = useState<"featured"|"price_asc"|"price_desc"|"moq">("featured");

  // Keep state in sync when URL params change (e.g. clicking Navbar category links)
  useEffect(() => {
    setSearch(searchParams.get("q") || "");
    setCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  /** Filtered and sorted product list — recalculates on any filter change */
  const products = useMemo(() => {
    let list = [...MOCK_PRODUCTS];

    // Category filter
    if (category !== "all") {
      const cat = MOCK_CATEGORIES.find((c) => c.slug === category);
      if (cat) list = list.filter((p) => p.category_id === cat.id);
    }

    // Search filter — title, description, tags, supplier name, country
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

    // Sort
    switch (sort) {
      case "price_asc":  list.sort((a, b) => a.price_per_unit - b.price_per_unit); break;
      case "price_desc": list.sort((a, b) => b.price_per_unit - a.price_per_unit); break;
      case "moq":        list.sort((a, b) => a.moq - b.moq); break;
      default:           list.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
    }

    return list;
  }, [category, search, sort]);

  const activeCategory = MOCK_CATEGORIES.find((c) => c.slug === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Hero Banner ── */}
      <div className="relative bg-[#1B4332] rounded-3xl px-8 py-12 mb-10 overflow-hidden">
        {/* Decorative leaf pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5 flex items-center justify-end pr-8">
          <Leaf size={200} className="text-white" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#2D6A4F] text-[#95D5B2] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <TrendingUp size={12} /> 318 verified suppliers across 20 African nations
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4" style={{fontFamily:"var(--font-display)"}}>
            Sustainable Packaging,<br />
            <span className="text-[#95D5B2]">Sourced from Africa.</span>
          </h1>
          <p className="text-[#95D5B2]/80 text-base mb-8 leading-relaxed">
            Compostable, biodegradable, and recycled packaging — direct from verified African manufacturers at wholesale prices.
          </p>
          <div className="flex flex-wrap items-center gap-5 text-sm text-white/70">
            <span className="flex items-center gap-1.5"><Shield size={14} /> Trade Assurance</span>
            <span className="flex items-center gap-1.5"><BadgeCheck size={14} /> Verified Suppliers</span>
            <span className="flex items-center gap-1.5"><Package size={14} /> Bulk Ready</span>
            <span className="flex items-center gap-1.5"><Leaf size={14} /> Eco Certified</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── Sidebar ── */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-stone-200 p-4 sticky top-24">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 px-1">
              Categories
            </h2>
            <nav className="space-y-0.5">
              <button
                onClick={() => setCategory("all")}
                className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  category === "all"
                    ? "bg-[#D8F3DC] text-[#1B4332] font-semibold"
                    : "text-stone-600 hover:bg-stone-50 hover:text-[#2D6A4F]"
                }`}
              >
                <span>All Products</span>
                <span className="text-xs text-stone-400">{MOCK_PRODUCTS.length}</span>
              </button>
              {MOCK_CATEGORIES.map((cat) => {
                const count = MOCK_PRODUCTS.filter((p) => p.category_id === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.slug)}
                    className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      category === cat.slug
                        ? "bg-[#D8F3DC] text-[#1B4332] font-semibold"
                        : "text-stone-600 hover:bg-stone-50 hover:text-[#2D6A4F]"
                    }`}
                  >
                    <span className="truncate pr-1">{cat.name}</span>
                    {count > 0 && <span className="text-xs text-stone-400 flex-shrink-0">{count}</span>}
                  </button>
                );
              })}
            </nav>

            {/* Trust badges */}
            <div className="mt-6 pt-4 border-t border-stone-100 space-y-2">
              {["Eco Certified Products", "Verified Suppliers", "Bulk Pricing", "Trade Assurance"].map((b) => (
                <div key={b} className="flex items-center gap-2 text-xs text-stone-500">
                  <Leaf size={11} className="text-[#2D6A4F] flex-shrink-0" /> {b}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
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
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-stone-400 flex-shrink-0" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="text-sm bg-white border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="moq">Lowest MOQ First</option>
              </select>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-stone-500">
              <span className="font-semibold text-stone-900">{products.length}</span> products
              {activeCategory && (
                <> in <span className="font-semibold text-[#2D6A4F]">{activeCategory.name}</span></>
              )}
            </p>
            {category !== "all" && (
              <button
                onClick={() => setCategory("all")}
                className="text-xs text-stone-400 hover:text-[#2D6A4F] flex items-center gap-1 transition-colors"
              >
                Clear filter <ChevronRight size={12} />
              </button>
            )}
          </div>

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 stagger">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-[#D8F3DC] rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={28} className="text-[#2D6A4F]" />
              </div>
              <h3 className="font-semibold text-stone-900 mb-2" style={{fontFamily:"var(--font-display)"}}>No products found</h3>
              <p className="text-sm text-stone-500 mb-4">Try adjusting your search or clearing the filter.</p>
              <button
                onClick={() => { setSearch(""); setCategory("all"); }}
                className="text-sm font-medium text-[#2D6A4F] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" /></div>}>
      <MarketplaceContent />
    </Suspense>
  );
}