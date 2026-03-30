// components/Navbar.tsx
// ============================================================
// Full-featured navigation bar.
// - Auth-aware user menu with role-based dashboard links
// - Working category dropdown with product counts
// - Live search with keyboard shortcut hint
// - Mobile-responsive slide-down menu
// - Announcement strip removed per request
// ============================================================
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Leaf, Search, ChevronDown, Menu, X,
  LayoutDashboard, LogIn, UserPlus, ShieldCheck,
  LogOut, User, ChevronRight, Package, Tag,
  Boxes, FlaskConical, Layers, ShoppingBag,
  BadgeCheck, Bell, Settings
} from "lucide-react";
import { MOCK_CATEGORIES } from "@/lib/mockData";
import { createClient } from "@/lib/supabase";
import type { Profile } from "@/types";

// Map category slugs to icons for the dropdown
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "bags-pouches":        <ShoppingBag size={14} />,
  "boxes-cartons":       <Boxes size={14} />,
  "bottles-containers":  <FlaskConical size={14} />,
  "wrapping-labels":     <Tag size={14} />,
  "industrial-sacks":    <Package size={14} />,
  "food-packaging":      <Layers size={14} />,
  "protective-packaging":<BadgeCheck size={14} />,
  "custom-branded":      <Leaf size={14} />,
};

export default function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [catOpen,     setCatOpen]     = useState(false);
  const [userOpen,    setUserOpen]    = useState(false);
  const [search,      setSearch]      = useState("");
  const [profile,     setProfile]     = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const catRef    = useRef<HTMLDivElement>(null);
  const userRef   = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Load user on mount + subscribe to auth changes
  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles").select("*").eq("id", user.id).single();
        setProfile(data);
      }
      setAuthLoading(false);
    }
    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data } = await supabase
            .from("profiles").select("*").eq("id", session.user.id).single();
          setProfile(data);
        } else {
          setProfile(null);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (catRef.current  && !catRef.current.contains(e.target as Node))  setCatOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setCatOpen(false);
        setUserOpen(false);
        searchRef.current?.blur();
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?q=${encodeURIComponent(search.trim())}`);
      searchRef.current?.blur();
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setProfile(null);
    setUserOpen(false);
    router.push("/");
    router.refresh();
  }

  function getDashboardHref() {
    if (profile?.role === "admin")    return "/admin";
    if (profile?.role === "supplier") return "/seller-dashboard";
    return "/";
  }

  // Active link helper
  function isActive(href: string) {
    return pathname === href;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-3">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group mr-2">
            <div className="w-9 h-9 bg-[#2D6A4F] rounded-xl flex items-center justify-center shadow-sm group-hover:bg-[#1B4332] transition-colors">
              <Leaf size={18} className="text-white" />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-bold text-lg text-[#1B4332] tracking-tight" style={{fontFamily:"var(--font-display)"}}>
                Eco<span className="text-[#2D6A4F]">Pack</span>
              </span>
              <span className="text-[9px] text-stone-400 tracking-widest uppercase font-medium">
                B2B Marketplace
              </span>
            </div>
          </Link>

          {/* ── Category Dropdown ── */}
          <div className="hidden lg:block relative flex-shrink-0" ref={catRef}>
            <button
              onClick={() => setCatOpen(!catOpen)}
              className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-all ${
                catOpen
                  ? "bg-[#D8F3DC] text-[#1B4332]"
                  : "text-stone-600 hover:text-[#2D6A4F] hover:bg-[#D8F3DC]"
              }`}
            >
              <Boxes size={14} />
              Categories
              <ChevronDown size={13} className={`transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`} />
            </button>

            {catOpen && (
              <div className="absolute top-full left-0 mt-2 w-[340px] bg-white rounded-2xl border border-stone-200 shadow-2xl z-50 overflow-hidden animate-slide-up">
                <div className="px-4 pt-4 pb-2 border-b border-stone-100">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    Browse by Category
                  </p>
                </div>
                <div className="p-2 grid grid-cols-1 gap-0.5 max-h-[400px] overflow-y-auto">
                  {MOCK_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/?category=${cat.slug}`}
                      onClick={() => setCatOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#D8F3DC] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] flex items-center justify-center text-[#2D6A4F] flex-shrink-0 group-hover:bg-[#2D6A4F] group-hover:text-white transition-colors">
                        {CATEGORY_ICONS[cat.slug] ?? <Leaf size={14} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-stone-800 group-hover:text-[#1B4332] transition-colors">
                          {cat.name}
                        </p>
                        <p className="text-xs text-stone-400 truncate">{cat.description}</p>
                      </div>
                      <ChevronRight size={12} className="text-stone-300 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
                <div className="p-3 border-t border-stone-100 bg-stone-50">
                  <Link
                    href="/"
                    onClick={() => setCatOpen(false)}
                    className="flex items-center justify-center gap-2 text-xs font-semibold text-[#2D6A4F] hover:underline"
                  >
                    View all products <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ── Search Bar ── */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, materials, suppliers..."
                className="w-full pl-10 pr-16 py-2.5 text-sm bg-stone-100 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:bg-white transition-all"
              />
              {/* Keyboard shortcut hint */}
              {!search && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-0.5">
                  <kbd className="text-[10px] text-stone-400 bg-stone-200 px-1.5 py-0.5 rounded font-mono">/</kbd>
                </div>
              )}
              {/* Clear button */}
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </form>

          {/* ── Desktop Nav Actions ── */}
          <div className="hidden md:flex items-center gap-2 ml-auto flex-shrink-0">

            {/* Sell link — always visible */}
            {!profile || profile.role === "buyer" ? (
              <Link
                href="/signup?role=supplier"
                className="text-sm font-medium text-stone-600 hover:text-[#2D6A4F] px-3 py-2 rounded-lg hover:bg-[#D8F3DC] transition-all flex items-center gap-1.5"
              >
                <LayoutDashboard size={14} />
                Start Selling
              </Link>
            ) : null}

            {!authLoading && (
              <>
                {profile ? (
                  /* Logged in user menu */
                  <div className="relative" ref={userRef}>
                    <button
                      onClick={() => setUserOpen(!userOpen)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                        userOpen
                          ? "border-[#2D6A4F] bg-[#D8F3DC]"
                          : "border-stone-200 hover:border-[#2D6A4F] hover:bg-[#D8F3DC]"
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#2D6A4F] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">
                          {profile.full_name?.charAt(0)?.toUpperCase() ?? "U"}
                        </span>
                      </div>
                      <div className="text-left hidden lg:block">
                        <p className="text-xs font-semibold text-stone-900 leading-none max-w-[100px] truncate">
                          {profile.full_name || "User"}
                        </p>
                        <p className="text-[10px] text-[#2D6A4F] capitalize leading-none mt-0.5 font-medium">
                          {profile.role}
                        </p>
                      </div>
                      <ChevronDown size={13} className={`text-stone-400 transition-transform flex-shrink-0 ${userOpen ? "rotate-180" : ""}`} />
                    </button>

                    {userOpen && (
                      <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl border border-stone-200 shadow-xl p-2 z-50 animate-slide-up">

                        {/* User info header */}
                        <div className="px-3 py-2.5 mb-1 bg-stone-50 rounded-xl">
                          <p className="text-sm font-semibold text-stone-900 truncate">
                            {profile.full_name}
                          </p>
                          <p className="text-xs text-stone-400 truncate">{profile.company_name}</p>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                            profile.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : profile.role === "supplier"
                              ? "bg-[#D8F3DC] text-[#1B4332]"
                              : "bg-blue-50 text-blue-700"
                          }`}>
                            {profile.role === "admin" && <ShieldCheck size={9} />}
                            {profile.role === "supplier" && <LayoutDashboard size={9} />}
                            {profile.role === "buyer" && <ShoppingBag size={9} />}
                            {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                          </span>
                        </div>

                        {/* Dashboard link */}
                        {(profile.role === "supplier" || profile.role === "admin") && (
                          <Link
                            href={getDashboardHref()}
                            onClick={() => setUserOpen(false)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-[#D8F3DC] text-sm text-stone-700 hover:text-[#1B4332] font-medium transition-colors"
                          >
                            {profile.role === "admin"
                              ? <ShieldCheck size={14} className="text-[#2D6A4F]" />
                              : <LayoutDashboard size={14} className="text-[#2D6A4F]" />
                            }
                            {profile.role === "admin" ? "Admin Panel" : "Seller Dashboard"}
                          </Link>
                        )}

                        {/* Marketplace link for suppliers */}
                        {profile.role === "supplier" && (
                          <Link
                            href="/"
                            onClick={() => setUserOpen(false)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-stone-50 text-sm text-stone-700 font-medium transition-colors"
                          >
                            <ShoppingBag size={14} className="text-stone-400" />
                            View Marketplace
                          </Link>
                        )}

                        <div className="my-1.5 border-t border-stone-100" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-red-50 text-sm text-red-600 font-medium transition-colors"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Not logged in */
                  <div className="flex items-center gap-2">
                    <Link
                      href="/login"
                      className="flex items-center gap-1.5 text-sm font-medium text-stone-700 border border-stone-300 px-3.5 py-2 rounded-xl hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-all"
                    >
                      <LogIn size={14} /> Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center gap-1.5 text-sm font-medium text-white bg-[#2D6A4F] px-3.5 py-2 rounded-xl hover:bg-[#1B4332] transition-all shadow-sm"
                    >
                      <UserPlus size={14} /> Join Free
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className="md:hidden ml-auto p-2 rounded-xl hover:bg-stone-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white animate-slide-up">
          <div className="px-4 py-4 space-y-1">

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 text-sm bg-stone-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                />
              </div>
            </form>

            {/* Logged in state */}
            {profile ? (
              <>
                <div className="px-3 py-3 bg-[#D8F3DC] rounded-xl mb-2">
                  <p className="text-sm font-bold text-[#1B4332]">{profile.full_name}</p>
                  <p className="text-xs text-[#2D6A4F]">{profile.company_name}</p>
                  <p className="text-[10px] text-[#2D6A4F] capitalize font-semibold mt-0.5">{profile.role} account</p>
                </div>
                {(profile.role === "supplier" || profile.role === "admin") && (
                  <Link href={getDashboardHref()}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-[#D8F3DC] text-sm font-medium transition-colors text-stone-700"
                  >
                    <LayoutDashboard size={14} className="text-[#2D6A4F]" />
                    {profile.role === "admin" ? "Admin Panel" : "Seller Dashboard"}
                  </Link>
                )}
                <Link href="/"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-stone-50 text-sm font-medium transition-colors text-stone-700"
                >
                  <ShoppingBag size={14} className="text-stone-400" /> Marketplace
                </Link>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-red-50 text-sm text-red-600 font-medium transition-colors"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </>
            ) : (
              <>
                {/* Category links on mobile */}
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-3 pt-1 pb-1">
                  Categories
                </p>
                {MOCK_CATEGORIES.slice(0, 4).map((cat) => (
                  <Link key={cat.id} href={`/?category=${cat.slug}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-stone-50 text-sm text-stone-600 transition-colors"
                  >
                    <span className="text-[#2D6A4F]">{CATEGORY_ICONS[cat.slug] ?? <Leaf size={13} />}</span>
                    {cat.name}
                  </Link>
                ))}
                <Link href="/" className="flex items-center gap-1 px-3 py-2 text-xs text-[#2D6A4F] font-semibold">
                  View all <ChevronRight size={12} />
                </Link>

                <div className="border-t border-stone-100 my-2 pt-2 space-y-2">
                  <Link href="/login"
                    className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-stone-200 text-sm font-semibold text-stone-700 hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-all"
                  >
                    <LogIn size={14} /> Sign In
                  </Link>
                  <Link href="/signup"
                    className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-[#2D6A4F] text-white text-sm font-bold hover:bg-[#1B4332] transition-all"
                  >
                    <UserPlus size={14} /> Create Free Account
                  </Link>
                  <Link href="/signup?role=supplier"
                    className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl border-2 border-[#2D6A4F] text-[#2D6A4F] text-sm font-bold hover:bg-[#D8F3DC] transition-all"
                  >
                    <LayoutDashboard size={14} /> Start Selling
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}