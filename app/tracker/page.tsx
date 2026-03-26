"use client";

import { useState } from "react";
import Link from "next/link";

export default function Tracker() {
  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);
    setResult(null);
    
    setTimeout(() => {
      const orders = JSON.parse(localStorage.getItem('ecopack_orders') || '[]');
      const foundOrder = orders.find((o: any) => o.trackId === trackingId);

      if (foundOrder) {
        setResult({
          id: foundOrder.trackId,
          product: foundOrder.product,
          status: "Processing at Facility",
          purchaseDate: foundOrder.date,
          recycleDate: "Pending Delivery",
          location: "Kigali Logistics Hub",
          quantity: foundOrder.quantity
        });
      } else {
        setError(true);
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center pt-24 px-4 font-sans relative overflow-hidden">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-sm border border-stone-200 p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">Lifecycle Tracker</h2>
          <p className="text-stone-500 font-medium mt-2">Enter the ECO- code from your receipt.</p>
        </div>
        <form onSubmit={handleScan} className="space-y-4">
          <input type="text" placeholder="e.g., ECO-84729" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} required className="w-full px-4 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 font-bold text-center uppercase tracking-widest text-stone-900" />
          <button type="submit" disabled={isLoading} className="w-full bg-amber-600 text-white font-bold py-4 rounded-xl hover:bg-amber-700 transition shadow-md">
            {isLoading ? "Querying Database..." : "Trace Journey"}
          </button>
        </form>

        {error && <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center text-sm font-bold">Tracking ID not found.</div>}

        {result && (
          <div className="mt-8 p-6 bg-stone-900 rounded-2xl border border-stone-800 text-stone-300 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-700 relative z-10">
              <span className="font-bold text-white text-lg">{result.product}</span>
            </div>
            <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-[11px] before:w-0.5 before:bg-gradient-to-b before:from-stone-700 before:to-transparent z-10">
              <div className="relative">
                <div className="absolute -left-8 w-4 h-4 rounded-full bg-amber-500 border-4 border-stone-900"></div>
                <p className="font-bold text-white text-sm">Order Placed ({result.quantity} units)</p>
                <p className="text-xs text-stone-500 mt-1">{result.purchaseDate}</p>
              </div>
              <div className="relative">
                <div className="absolute -left-8 w-4 h-4 rounded-full bg-amber-500 border-4 border-stone-900 animate-pulse"></div>
                <p className="font-bold text-amber-400 text-sm">{result.status}</p>
                <p className="text-xs text-stone-500 mt-1">{result.location}</p>
              </div>
            </div>
          </div>
        )}
        <div className="mt-8 text-center"><Link href="/dashboard" className="text-stone-400 font-medium text-sm hover:text-stone-600">&larr; Back to Hub</Link></div>
      </div>
    </div>
  );
}