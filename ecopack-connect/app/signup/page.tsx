"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => router.push("/dashboard"), 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 relative overflow-hidden py-12">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-amber-200/40 blur-[80px] -z-10"></div>
      
      <div className="max-w-md w-full mx-4 bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">Join the Network</h2>
          <p className="mt-2 text-stone-500 font-medium">Start pooling orders today.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSignup}>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1.5">Business Name</label>
            <input type="text" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-stone-900" placeholder="Green Farms Ltd" />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1.5">Account Type</label>
            <select className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-stone-900 font-medium appearance-none">
              <option>Buyer (Agro-processor)</option>
              <option>Seller (Manufacturer)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1.5">Email address</label>
            <input type="email" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-stone-900" placeholder="hello@company.com" />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1.5">Password</label>
            <input type="password" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-stone-900" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full mt-8 bg-amber-600 text-white font-bold py-4 rounded-xl hover:bg-amber-700 hover:-translate-y-0.5 transition-all shadow-md disabled:bg-amber-400">
            {isLoading ? "Creating Account..." : "Create Account &rarr;"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-stone-500 font-medium">
            Already a member? <Link href="/login" className="text-stone-900 hover:text-amber-600 font-bold transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}