"use client";

import { useState } from "react";
import Link from "next/link";

export default function Tracker() {
  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setResult({
        id: trackingId || "ECO-84729",
        product: "Corrugated Tomato Box",
        status: "Recycled",
        purchaseDate: "2026-02-15",
        recycleDate: "2026-03-20",
        location: "Kigali Processing Center"
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center pt-24 px-4 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-amber-200/40 blur-[80px] -z-10"></div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-sm border border-white p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-stone-100 text-stone-900 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">Lifecycle Tracker</h2>
          <p className="text-stone-500 font-medium mt-2">Enter the code printed on your packaging.</p>
        </div>

        <form onSubmit={handleScan} className="space-y-4">
          <input 
            type="text" 
            placeholder="e.g., ECO-84729" 
            className="w-full px-4 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-center uppercase tracking-widest text-stone-900"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            required
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-amber-600 text-white font-bold py-4 rounded-xl hover:bg-amber-700 transition shadow-md hover:-translate-y-0.5"
          >
            {isLoading ? "Scanning Ledger..." : "Trace Journey"}
          </button>
        </form>

        {result && (
          <div className="mt-8 p-6 bg-stone-900 rounded-2xl border border-stone-800 text-stone-300 animate-fade-in shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-700">
              <span className="font-bold text-white text-lg">{result.product}</span>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                {result.status}
              </span>
            </div>
            <div className="space-y-3 text-sm font-medium">
              <div className="flex justify-between"><span className="text-stone-500">ID</span> <span className="text-white">{result.id}</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Purchased</span> <span className="text-white">{result.purchaseDate}</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Recycled</span> <span className="text-amber-400">{result.recycleDate}</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Location</span> <span className="text-white">{result.location}</span></div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-stone-400 font-medium text-sm hover:text-stone-600 transition-colors">
            &larr; Back to Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}