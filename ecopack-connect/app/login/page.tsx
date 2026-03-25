"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => router.push("/dashboard"), 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-amber-200/40 blur-[80px] -z-10"></div>
      
      <div className="max-w-md w-full mx-4 bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-white">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl shadow-md flex items-center justify-center text-white font-extrabold text-2xl mb-4">E</div>
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-stone-500 font-medium">Sign in to access the wholesale pool</p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1.5">Email address</label>
            <input type="email" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-stone-900" placeholder="agro@cooperative.rw" />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1.5">Password</label>
            <input type="password" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-stone-900" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full mt-8 bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-stone-800 hover:-translate-y-0.5 transition-all shadow-md disabled:bg-stone-400">
            {isLoading ? "Authenticating..." : "Sign In &rarr;"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-stone-500 font-medium">
            New to EcoPack? <Link href="/signup" className="text-amber-600 hover:text-amber-700 font-bold border-b border-transparent hover:border-amber-600 transition-colors">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}