// app/signup/page.tsx
// ============================================================
// SIGNUP PAGE
//
// Handles:
//   - Role selection (Buyer / Supplier) via URL param or toggle
//   - Full Supabase auth registration
//   - Auto-redirects based on role after signup
//   - Supabase email confirmation handling
//   - No emoji characters
// ============================================================
"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Leaf, UserPlus, Eye, EyeOff, AlertCircle,
  CheckCircle2, ArrowRight, ShoppingBag, Factory,
  Info
} from "lucide-react";
import { signUp } from "@/lib/auth";
import type { UserRole } from "@/types";

function SignupContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const roleParam    = searchParams.get("role") as UserRole | null;

  const [role,     setRole]     = useState<UserRole>(roleParam === "supplier" ? "supplier" : "buyer");
  const [name,     setName]     = useState("");
  const [company,  setCompany]  = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [success,  setSuccess]  = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);

  useEffect(() => {
    if (roleParam === "supplier" || roleParam === "buyer") setRole(roleParam);
  }, [roleParam]);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!name.trim())    { setError("Please enter your full name."); return; }
    if (role === "supplier" && !company.trim()) {
      setError("Company name is required for supplier accounts."); return;
    }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm)  { setError("Passwords do not match."); return; }

    setLoading(true);
    const { user, error: authError } = await signUp(email, password, name, company, role);

    if (authError || !user) {
      setError(authError || "Registration failed. Please try again.");
      setLoading(false);
      return;
    }

    // Check if email confirmation is required
    if (!user.confirmed_at && !user.email_confirmed_at) {
      setNeedsConfirm(true);
      setSuccess(true);
    } else {
      // Email confirmation disabled — go straight to dashboard
      setSuccess(true);
      setTimeout(() => {
        router.push(role === "supplier" ? "/seller-dashboard" : "/");
        router.refresh();
      }, 1500);
    }
    setLoading(false);
  }

  // ── Success / Email Confirm Screen ───────────────────────
  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center animate-slide-up">
          <div className="w-20 h-20 bg-[#D8F3DC] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-[#2D6A4F]" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-3" style={{fontFamily:"var(--font-display)"}}>
            Account Created!
          </h2>
          {needsConfirm ? (
            <>
              <p className="text-stone-600 mb-2">
                We sent a confirmation email to <strong>{email}</strong>.
              </p>
              <p className="text-sm text-stone-400 mb-6">
                Click the link in the email to verify your account, then sign in.
              </p>
              <Link href="/login"
                className="inline-flex items-center gap-2 bg-[#2D6A4F] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-[#1B4332] transition-colors"
              >
                Go to Sign In <ArrowRight size={16} />
              </Link>
            </>
          ) : (
            <p className="text-stone-500 text-sm">
              Redirecting you to your dashboard...
            </p>
          )}
        </div>
      </div>
    );
  }

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
            Create your account
          </h1>
          <p className="text-sm text-stone-500 mb-6">
            Join Africa&apos;s sustainable packaging marketplace
          </p>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {([
              { value:"buyer",    label:"I am a Buyer",    icon:<ShoppingBag size={20}/>,  sub:"Source eco packaging" },
              { value:"supplier", label:"I am a Supplier", icon:<Factory size={20}/>,      sub:"List and sell products" },
            ] as { value: UserRole; label: string; icon: React.ReactNode; sub: string }[]).map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center ${
                  role === r.value
                    ? "border-[#2D6A4F] bg-[#D8F3DC]"
                    : "border-stone-200 hover:border-stone-300 bg-white"
                }`}
              >
                <div className={role === r.value ? "text-[#2D6A4F]" : "text-stone-400"}>
                  {r.icon}
                </div>
                <div>
                  <p className={`text-sm font-bold leading-none ${role === r.value ? "text-[#1B4332]" : "text-stone-700"}`}>
                    {r.label}
                  </p>
                  <p className="text-[10px] text-stone-400 mt-0.5">{r.sub}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Supplier info notice */}
          {role === "supplier" && (
            <div className="flex items-start gap-2 bg-[#D8F3DC] border border-[#2D6A4F]/20 px-4 py-3 rounded-xl mb-5 text-xs text-[#1B4332]">
              <Info size={14} className="flex-shrink-0 mt-0.5 text-[#2D6A4F]" />
              <span>
                Supplier accounts get access to the Seller Dashboard to list products and manage inventory.
                Accounts are verified within 24 hours of registration.
              </span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Your full name"
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">
                Company Name
                {role === "supplier" && <span className="text-red-400 ml-1">*</span>}
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                autoComplete="organization"
                placeholder={
                  role === "supplier"
                    ? "Your manufacturing / distribution company"
                    : "Your company (optional)"
                }
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all"
              />
            </div>

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
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPw ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Repeat your password"
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all ${
                  confirm && confirm !== password
                    ? "border-red-300 bg-red-50"
                    : "border-stone-200"
                }`}
              />
              {confirm && confirm !== password && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#2D6A4F] hover:bg-[#1B4332] disabled:bg-stone-300 text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={16} />
                  Create {role === "supplier" ? "Supplier" : "Buyer"} Account
                </>
              )}
            </button>
          </form>

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

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}