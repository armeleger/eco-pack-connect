"use client";

import Link from "next/link";
import { Shield, TrendingUp, Users, Activity, PackageCheck, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Platform Volume", value: "RWF 45.2M", icon: <TrendingUp size={20} /> },
    { label: "Active Suppliers", value: "318", icon: <Users size={20} /> },
    { label: "Pending Verifications", value: "12", icon: <AlertCircle size={20} /> },
    { label: "Trades Secured", value: "1,247", icon: <Shield size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF9] font-sans flex flex-col">
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-stone-400 hover:text-[#2D6A4F] transition-colors font-bold text-sm flex items-center gap-1.5">
              &larr; <span className="hidden sm:block">Marketplace</span>
            </Link>
            <div className="h-6 w-px bg-stone-200 hidden sm:block"></div>
            <h1 className="text-lg font-bold text-stone-900 flex items-center gap-2" style={{fontFamily:"var(--font-display)"}}>
              <Activity size={18} className="text-[#2D6A4F]"/> System Admin
            </h1>
          </div>
          <div className="text-[10px] font-bold bg-stone-900 text-white px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            Kira Capital Root Access
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 pt-10 pb-20 w-full flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-stone-900" style={{fontFamily:"var(--font-display)"}}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
          <div className="flex items-center justify-between border-b border-stone-100 pb-5 mb-5">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2" style={{fontFamily:"var(--font-display)"}}>
              <PackageCheck size={20} className="text-[#2D6A4F]"/> Recent Platform Activity
            </h2>
          </div>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Shield size={48} className="text-stone-200 mb-4" />
            <h3 className="text-lg font-bold text-stone-900 mb-2">System Secure</h3>
            <p className="text-sm text-stone-500 max-w-sm">All marketplace traffic, auth logs, and trade tunnels are operating normally under East African compliance protocols.</p>
          </div>
        </div>
      </main>
    </div>
  );
}