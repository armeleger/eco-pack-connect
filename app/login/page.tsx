"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase";

const supabase = createClient();
import { Leaf, ArrowLeft } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid credentials. Please check your email and password.");
      setIsLoading(false);
    } else if (data.user) {
      // Smart Routing: Check their role and send them to the right dashboard
      const role = data.user.user_metadata?.user_role;
      
      if (role === "supplier") {
        router.push("/seller-dashboard");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center font-sans p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#D8F3DC]/40 blur-[80px] -z-10 pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-stone-200 p-8 sm:p-10 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-[#2D6A4F] transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Hub
        </Link>

        <div className="mb-8 text-center">
          <div className="w-14 h-14 bg-[#1B4332] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md">
            <Leaf size={28} className="text-[#95D5B2]" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight mb-1" style={{fontFamily:"var(--font-display)"}}>
            Welcome Back
          </h2>
          <p className="text-stone-500 font-medium text-sm">Access your B2B trade portal.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 text-sm">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">Work Email</label>
            <input type="email" name="email" required className="w-full px-4 py-3.5 bg-[#F8FAF9] border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95D5B2] focus:border-[#2D6A4F] font-semibold text-stone-900 transition-all" placeholder="admin@company.com" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">Password</label>
            <input type="password" name="password" required className="w-full px-4 py-3.5 bg-[#F8FAF9] border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95D5B2] focus:border-[#2D6A4F] font-semibold text-stone-900 transition-all" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full mt-2 bg-[#2D6A4F] text-white font-bold py-4 rounded-xl hover:bg-[#1B4332] transition-colors shadow-md disabled:bg-stone-300">
            {isLoading ? "Authenticating..." : "Secure Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-xs font-semibold text-stone-500">
          New to the network? <Link href="/signup" className="text-[#2D6A4F] font-bold hover:underline">Apply for an account</Link>
        </div>
      </div>
    </div>
  );
}