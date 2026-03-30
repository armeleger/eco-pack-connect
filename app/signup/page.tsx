"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "../../lib/supabase";
import { Leaf, ShoppingBag, LayoutDashboard, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function Signup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "supplier" ? "supplier" : "buyer";
  const supabase = createClient();

  const [role, setRole] = useState<"buyer" | "supplier">(initialRole);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const companyName = formData.get("companyName") as string;
    const fullName = formData.get("fullName") as string;

    // Supabase Authentication Logic
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_name: companyName,
          user_role: role,
          is_verified: role === "buyer" ? true : false, // Suppliers need manual verification
        },
      },
    });

    setIsLoading(false);

    if (error) {
      setError(error.message);
    } else if (data.user) {
      setSuccess(true);
      setTimeout(() => {
        if (role === "supplier") {
          router.push("/seller-dashboard");
        } else {
          router.push("/");
        }
      }, 2000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-sm border border-stone-200 text-center animate-in zoom-in-95">
          <div className="w-16 h-16 bg-[#D8F3DC] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 size={32} className="text-[#2D6A4F]" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2" style={{fontFamily:"var(--font-display)"}}>Account Created!</h2>
          <p className="text-stone-500 font-medium">Securing your B2B access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center font-sans p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#D8F3DC]/40 blur-[80px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#95D5B2]/20 blur-[80px] -z-10 pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-stone-200 p-8 sm:p-10 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-[#2D6A4F] transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Hub
        </Link>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-stone-900 leading-tight" style={{fontFamily:"var(--font-display)"}}>
            Join EcoPack
          </h2>
          <p className="text-stone-500 font-medium mt-1 text-sm">Create your B2B trade account.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold text-center">
            {error}
          </div>
        )}

        {/* Role Selector */}
        <div className="flex gap-3 mb-8 bg-[#F8FAF9] p-1.5 rounded-2xl border border-stone-200">
          <button
            type="button"
            onClick={() => setRole("buyer")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === "buyer" ? "bg-white text-[#2D6A4F] shadow-sm border border-stone-200" : "text-stone-500 hover:text-stone-700"}`}
          >
            <ShoppingBag size={16} /> Buyer
          </button>
          <button
            type="button"
            onClick={() => setRole("supplier")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === "supplier" ? "bg-white text-[#2D6A4F] shadow-sm border border-stone-200" : "text-stone-500 hover:text-stone-700"}`}
          >
            <LayoutDashboard size={16} /> Supplier
          </button>
        </div>

        <form onSubmit={handleSignup} className="space-y-4 text-sm">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">Company Name</label>
            <input type="text" name="companyName" required className="w-full px-4 py-3 bg-[#F8FAF9] border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95D5B2] focus:border-[#2D6A4F] font-semibold text-stone-900 transition-all" placeholder="e.g. Kira Capital Ltd" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">Your Full Name</label>
            <input type="text" name="fullName" required className="w-full px-4 py-3 bg-[#F8FAF9] border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95D5B2] focus:border-[#2D6A4F] font-semibold text-stone-900 transition-all" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">Work Email</label>
            <input type="email" name="email" required className="w-full px-4 py-3 bg-[#F8FAF9] border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95D5B2] focus:border-[#2D6A4F] font-semibold text-stone-900 transition-all" placeholder="contact@company.com" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">Password</label>
            <input type="password" name="password" required className="w-full px-4 py-3 bg-[#F8FAF9] border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95D5B2] focus:border-[#2D6A4F] font-semibold text-stone-900 transition-all" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full mt-4 bg-[#2D6A4F] text-white font-bold py-4 rounded-xl hover:bg-[#1B4332] transition-colors shadow-md disabled:bg-stone-300 text-sm flex items-center justify-center gap-2">
            {isLoading ? "Creating Account..." : `Join as ${role === "buyer" ? "Buyer" : "Supplier"}`}
          </button>
        </form>

        <div className="mt-8 text-center text-xs font-semibold text-stone-500">
          Already part of the network? <Link href="/login" className="text-[#2D6A4F] font-bold hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}