"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const company = formData.get("company") as string;
    const role = formData.get("role") as string;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          company_name: company,
          user_role: role,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      setError(error.message);
    } else {
      if (role === "seller") {
        router.push("/seller-dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center font-sans p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-amber-200/40 blur-[80px] -z-10"></div>
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-stone-200 p-8 md:p-10 relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-amber-600 rounded-xl shadow-md text-white font-black text-2xl mb-6">E</Link>
          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">Join the Network</h2>
          <p className="text-stone-500 font-medium mt-1">Create your marketplace account.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <label className="cursor-pointer">
              <input type="radio" name="role" value="buyer" className="peer sr-only" defaultChecked />
              <div className="text-center p-3 rounded-xl border border-stone-200 peer-checked:border-amber-600 peer-checked:bg-amber-50 peer-checked:text-amber-800 font-bold text-sm text-stone-500 transition-all">
                I am a Buyer
              </div>
            </label>
            <label className="cursor-pointer">
              <input type="radio" name="role" value="seller" className="peer sr-only" />
              <div className="text-center p-3 rounded-xl border border-stone-200 peer-checked:border-stone-900 peer-checked:bg-stone-900 peer-checked:text-white font-bold text-sm text-stone-500 transition-all">
                I am a Seller
              </div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">Company Name</label>
            <input type="text" name="company" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-stone-900" placeholder="e.g., Kigali Processing Ltd" />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">Work Email</label>
            <input type="email" name="email" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-stone-900" placeholder="admin@company.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">Secure Password</label>
            <input type="password" name="password" required minLength={6} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-stone-900" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full mt-6 bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-stone-800 transition-all shadow-md disabled:bg-stone-300">
            {isLoading ? "Provisioning Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-stone-500">
          Already have an account? <Link href="/login" className="text-amber-600 font-bold hover:underline">Sign in securely</Link>
        </div>
      </div>
    </div>
  );
}