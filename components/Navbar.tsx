// components/Navbar.tsx
// ============================================================
// Persistent navigation bar.
// Auth-aware: shows user name + logout when signed in.
// No emoji characters — Lucide icons only.
// ============================================================
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Leaf, Search, ChevronDown, Menu, X,
  LayoutDashboard, LogIn, UserPlus, ShieldCheck,
  Globe, LogOut, User, ChevronRight
} from "lucide-react";
import { MOCK_CATEGORIES } from "@/lib/mockData";
import { createClient } from "@/lib/supabase";
import type { Profile } from "@/types";

export default function Navbar() {
  const router   = useRouter();
  const supabase = createClient();

  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [catOpen,     setCatOpen]     = useState(false);
  const [userOpen,    setUserOpen]    = useState(false);
  const [search,      setSearch]      = useState("");
  const [profile,     setProfile]     = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const catRef  = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Load current user profile on mount
  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
      setAuthLoading(false);
    }
    loadUser();

    // Listen for auth state changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
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

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) router.push(`/?q=${encodeURIComponent(search.trim())}`);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setProfile(null);
    setUserOpen(false);
    router.push("/");
    router.refresh();
  }

  /** Dashboard link based on user role */
  function getDashboardHref(): string {
    if (profile?.role === "admin")    return "/admin";
    if (profile?.role === "supplier") return "/seller-dashboard";
    return "/";
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">

      {/* Announcement strip */}
      <div className="bg-[#2D6A4F] text-white text-xs text-center py-1.5 flex items-center justify-center gap-2">
        <Globe size={11} />
        <span>Africa&apos;s Sustainable Packaging Marketplace — Verified Suppliers in 20+ Countries</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-9 h-9 bg-[#2D6A4F] rounded-xl flex items-center justify-center shadow-sm group-hover:bg-[#1B4332] transition-colors">
              <Leaf size={18} className="text-white" />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-bold text-lg text-[#1B4332] tracking-tight" style={{fontFamily:"var(--font-display)"}}>
                Eco<span className="text-[#2D6A4F]">Pack</span>
              </span>
              <span className="text-[10px] text-stone-400 tracking-widest uppercase">Marketplace</span>
            </div>
          </Link>

          {/* Category Dropdown */}
          <div className="hidden md:block relative" ref={catRef}>
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-[#2D6A4F] px-3 py-2 rounded-lg hover:bg-[#D8F3DC] transition-all"
            >
              Categories
              <ChevronDown size={14} className={`transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`} />
            </button>

            {catOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl border border-stone-200 shadow-2xl p-3 z-50 animate-slide-up">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-2 pb-2 mb-1">
                  Browse by Category
                </p>
                {MOCK_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/?category=${cat.slug}`}
                    onClick={() => setCatOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#D8F3DC] hover:text-[#1B4332] transition-colors group"
                  >
                    <Leaf size={14} className="text-[#2D6A4F] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-stone-800 group-hover:text-[#1B4332]">{cat.name}</p>
                      <p className="text-xs text-stone-400 truncate">{cat.description}</p>
                    </div>
                    <ChevronRight size={12} className="text-stone-300 flex-shrink-0 ml-auto" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg hidden md:flex">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search eco packaging, materials, suppliers..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-100 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:bg-white transition-all"
              />
            </div>
          </form>

          {/* Right Nav */}
          <div className="hidden md:flex items-center gap-2">
            {!authLoading && (
              <>
                {profile ? (
                  // Logged in — show user menu
                  <div className="relative" ref={userRef}>
                    <button
                      onClick={() => setUserOpen(!userOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-200 hover:border-[#2D6A4F] hover:bg-[#D8F3DC] transition-all"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#2D6A4F] flex items-center justify-center">
                        <User size={14} className="text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-stone-900 leading-none">
                          {profile.full_name || "User"}
                        </p>
                        <p className="text-[10px] text-stone-400 capitalize leading-none mt-0.5">
                          {profile.role}
                        </p>
                      </div>
                      <ChevronDown size={13} className={`text-stone-400 transition-transform ${userOpen ? "rotate-180" : ""}`} />
                    </button>

                    {userOpen && (
                      <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-2xl border border-stone-200 shadow-xl p-2 z-50 animate-slide-up">
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
                        <div className="my-1 border-t border-stone-100" />
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
                  // Not logged in
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-1.5 text-sm font-medium text-stone-700 border border-stone-300 px-3.5 py-2 rounded-xl hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-all"
                    >
                      <LogIn size={14} /> Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center gap-1.5 text-sm font-medium text-white bg-[#2D6A4F] px-3.5 py-2 rounded-xl hover:bg-[#1B4332] transition-all"
                    >
                      <UserPlus size={14} /> Join Free
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden ml-auto p-2 rounded-xl hover:bg-stone-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-stone-100 py-4 space-y-2 animate-slide-up">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                />
              </div>
            </form>

            {profile ? (
              <>
                <div className="px-3 py-2 bg-[#D8F3DC] rounded-xl mb-2">
                  <p className="text-sm font-semibold text-[#1B4332]">{profile.full_name}</p>
                  <p className="text-xs text-[#2D6A4F] capitalize">{profile.role}</p>
                </div>
                {(profile.role === "supplier" || profile.role === "admin") && (
                  <Link href={getDashboardHref()} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-[#D8F3DC] text-sm font-medium transition-colors"
                  >
                    <LayoutDashboard size={14} className="text-[#2D6A4F]" />
                    {profile.role === "admin" ? "Admin Panel" : "Seller Dashboard"}
                  </Link>
                )}
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-red-50 text-sm text-red-600 font-medium transition-colors"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login"   onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-stone-50 text-sm font-medium transition-colors"><LogIn size={14} className="text-[#2D6A4F]" /> Sign In</Link>
                <Link href="/signup"  onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-sm font-medium transition-colors"><UserPlus size={14} /> Join Free</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}