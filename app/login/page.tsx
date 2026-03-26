"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

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

    setIsLoading(false);

    if (error) {
      setError("Invalid credentials. Please check your email and password.");
    } else if (data.user) {
      // Check the role they selected during signup
      const role = data.user.user_metadata?.user_role;
      
      if (role === "seller") {
        router.push("/seller-dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center font-sans p-4 relative overflow-hidden">
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-orange-100/50 blur-[80px] -z-10"></div>
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-stone-200 p-8 md:p-10 relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-amber-600 rounded-xl shadow-md text-white font-black text-2xl mb-6">E</Link>
          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">Welcome Back</h2>
          <p className="text-stone-500 font-medium mt-1">Access your B2B dashboard.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">Work Email</label>
            <input type="email" name="email" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-stone-900" placeholder="admin@company.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">Password</label>
            <input type="password" name="password" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-stone-900" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full mt-6 bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-stone-800 transition-all shadow-md disabled:bg-stone-300">
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-stone-500">
          New to the network? <Link href="/signup" className="text-amber-600 font-bold hover:underline">Apply for an account</Link>
        </div>
      </div>
    </div>
  );
}