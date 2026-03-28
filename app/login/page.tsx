// app/login/page.tsx
// ============================================================
// LOGIN PAGE
//
// Handles:
//   - Email/password auth via Supabase
//   - Role-aware redirect after login
//   - URL param ?redirect= for post-auth navigation
//   - ?role=supplier shows supplier-specific messaging
//   - ?error= shows access denial messages
//   - No emoji characters
// ============================================================
"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Leaf, LogIn, Eye, EyeOff, AlertCircle,
  ArrowRight, ShieldCheck, LayoutDashboard, ShoppingBag
} from "lucide-react";
import { signIn } from "@/lib/auth";

function LoginContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const redirectTo  = searchParams.get("redirect") || null;
  const roleHint    = searchParams.get("role") as "buyer"|"supplier"|"admin"|null;
  const accessError = searchParams.get("error");

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  // Show access error from middleware redirect
  useEffect(() => {
    if (accessError === "supplier_only") {
      setError("The Seller Dashboard is only accessible to registered suppliers. Please sign in with a supplier account.");
    } else if (accessError === "admin_only") {
      setError("The Admin Panel requires administrator credentials.");
    }
  }, [accessError]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { user, profile, error: authError } = await signIn(email, password);

    if (authError || !user) {
      setError(authError || "Login failed. Please try again.");
      setLoading(false);
      return;
    }

    // Navigate based on redirect param or user role
    if (redirectTo) {
      router.push(redirectTo);
    } else {
      switch (profile?.role) {
        case "admin":    router.push("/admin"); break;
        case "supplier": router.push("/seller-dashboard"); break;
        default:         router.push("/");
      }
    }
    router.refresh();
  }

  const roleMessages: Record<string, { icon: React.ReactNode; title: string; desc: string }> = {
    supplier: {
      icon:  <LayoutDashboard size={16} className="text-[#2D6A4F]" />,
      title: "Supplier Sign In",
      desc:  "Sign in with your supplier account to access the Seller Dashboard.",
    },
    admin: {
      icon:  <ShieldCheck size={16} className="text-[#2D6A4F]" />,
      title: "Admin Sign In",
      desc:  "Administrator access only. Contact support if you need access.",
    },
    buyer: {
      icon:  <ShoppingBag size={16} className="text-[#2D6A4F]" />,
      title: "Sign in to continue",
      desc:  "You need an account to place a trade order.",
    },
  };

  const roleMsg = roleHint ? roleMessages[roleHint] : null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 w-fit">
            <div className="w-10 h-10 bg-[#2D6A4F] rounded-xl flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl text-stone-900" style={{fontFamily:"var(--font-display)"}}>
              Eco<span className="text-[#2D6A4F]">Pack</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-stone-900 mb-1" style={{fontFamily:"var(--font-display)"}}>
            {roleMsg?.title || "Welcome back"}
          </h1>
          <p className="text-sm text-stone-500 mb-6">
            {roleMsg?.desc || "Sign in to your EcoPack account"}
          </p>

          {/* Role context banner */}
          {roleMsg && (
            <div className="flex items-center gap-2 bg-[#D8F3DC] border border-[#2D6A4F]/20 px-4 py-3 rounded-xl mb-5 text-sm text-[#1B4332]">
              {roleMsg.icon}
              <span className="font-medium">{roleMsg.desc}</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="#" className="text-xs text-[#2D6A4F] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#2D6A4F] hover:bg-[#1B4332] disabled:bg-stone-300 text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><LogIn size={16} /> Sign In</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-xs text-stone-400 font-medium">NO ACCOUNT YET?</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* Sign up options */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/signup?role=buyer"
              className="flex flex-col items-center gap-1.5 px-3 py-4 rounded-xl border border-stone-200 hover:border-[#2D6A4F] hover:bg-[#D8F3DC] transition-all group"
            >
              <ShoppingBag size={20} className="text-stone-400 group-hover:text-[#2D6A4F]" />
              <span className="text-xs font-semibold text-stone-500 group-hover:text-[#1B4332] text-center">
                Join as Buyer
              </span>
            </Link>
            <Link href="/signup?role=supplier"
              className="flex flex-col items-center gap-1.5 px-3 py-4 rounded-xl border border-stone-200 hover:border-[#2D6A4F] hover:bg-[#D8F3DC] transition-all group"
            >
              <LayoutDashboard size={20} className="text-stone-400 group-hover:text-[#2D6A4F]" />
              <span className="text-xs font-semibold text-stone-500 group-hover:text-[#1B4332] text-center">
                Join as Supplier
              </span>
            </Link>
          </div>

          <p className="text-center text-sm text-stone-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#2D6A4F] font-semibold hover:underline">
              Sign in <ArrowRight size={12} className="inline" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}