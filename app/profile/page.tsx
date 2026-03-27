"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [companyName, setCompanyName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
        setCompanyName(session.user.user_metadata?.company_name || "");
      }
      setIsLoading(false);
    };
    getUser();
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    const { error } = await supabase.auth.updateUser({
      data: { company_name: companyName }
    });

    setIsUpdating(false);
    if (!error) {
      alert("Profile updated successfully!");
    } else {
      alert("Error updating profile.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (isLoading) return <div className="min-h-screen bg-stone-50 flex items-center justify-center font-bold text-stone-500">Loading Profile...</div>;
  if (!user) return null;

  const role = user.user_metadata?.user_role === 'seller' ? 'Verified Manufacturer' : 'Registered Buyer';

  return (
    <div className="min-h-screen bg-stone-50 font-sans pb-20">
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 flex justify-between items-center h-16">
          <Link href="/" className="text-stone-400 hover:text-stone-900 transition font-bold text-sm">
            &larr; Back to Dashboard
          </Link>
          <button onClick={handleLogout} className="text-sm font-bold text-red-600 hover:text-red-700">Sign Out</button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 pt-12">
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-stone-200">
          <div className="flex items-center gap-6 mb-10 border-b border-stone-100 pb-8">
            <div className="w-20 h-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-3xl font-black shadow-inner">
              {companyName.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-stone-900">{companyName}</h1>
              <span className="inline-block mt-2 text-xs font-bold px-3 py-1 bg-stone-100 text-stone-600 rounded-full uppercase tracking-wider">
                {role}
              </span>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Account Email (Read Only)</label>
              <input type="email" disabled value={user.email} className="w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-xl font-medium text-stone-500 cursor-not-allowed" />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Display Name / Company</label>
              <input 
                type="text" 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)}
                required 
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 font-bold text-stone-900" 
              />
            </div>

            <button type="submit" disabled={isUpdating} className="w-full bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-stone-800 transition shadow-sm disabled:bg-stone-300">
              {isUpdating ? "Saving Changes..." : "Update Profile"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}