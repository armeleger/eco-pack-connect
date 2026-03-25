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
      // 1. Check our LocalStorage "DB" for the ID
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
        // ID not found in DB
        setError(true);
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center pt-24 px-4 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-amber-200/40 blur-[80px] -z-10"></div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-sm border border-white p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-stone-100 text-stone-900 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">Lifecycle Tracker</h2>
          <p className="text-stone-500 font-medium mt-2">Enter the ECO- code from your receipt.</p>
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
            {isLoading ? "Querying Database..." : "Trace Journey"}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center text-sm font-bold animate-fade-in">
            Tracking ID not found in system.
          </div>
        )}

        {result && (
          <div className="mt-8 p-6 bg-stone-900 rounded-2xl border border-stone-800 text-stone-300 animate-fade-in shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
            
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-700 relative z-10">
              <span className="font-bold text-white text-lg line-clamp-1 pr-4">{result.product}</span>
              <span className="flex-shrink-0 px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                Active
              </span>
            </div>
            
            {/* Realistic Tracking Timeline */}
            <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-stone-700 before:to-transparent z-10">
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
              <div className="relative opacity-40">
                <div className="absolute -left-8 w-4 h-4 rounded-full bg-stone-700 border-4 border-stone-900"></div>
                <p className="font-bold text-stone-400 text-sm">QR Scan / Recycling</p>
                <p className="text-xs text-stone-500 mt-1">{result.recycleDate}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-stone-400 font-medium text-sm hover:text-stone-600 transition-colors">
            &larr; Back to Hub
          </Link>
        </div>
      </div>
    </div>
  );
}