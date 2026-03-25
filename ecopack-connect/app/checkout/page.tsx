"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Checkout() {
  const [isAggregating, setIsAggregating] = useState(true);
  
  const basePrice = 450000;
  const myUnits = 1000;
  const communityPendingUnits = 850;
  const totalAggregated = myUnits + communityPendingUnits;
  
  let discountPercent = 0;
  if (totalAggregated > 1000) discountPercent = 0.20;
  else if (totalAggregated > 500) discountPercent = 0.15;
  else if (totalAggregated > 100) discountPercent = 0.10;

  const discountAmount = basePrice * discountPercent;
  const finalTotal = basePrice - discountAmount;

  useEffect(() => {
    const timer = setTimeout(() => setIsAggregating(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 pt-12 px-4 pb-20 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-stone-900">Secure Checkout</h1>
          <p className="text-stone-500 font-medium mt-2">Finalize your order and lock in your discount.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden">
          <div className="p-8 md:p-10">
            <h3 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-4 mb-6">Order Summary</h3>
            <div className="flex justify-between items-center text-stone-700 mb-2 font-medium">
              <span>Eco-Friendly Corrugated Tomato Box</span>
              <span className="font-bold text-stone-900">{basePrice.toLocaleString()} RWF</span>
            </div>
            <p className="text-sm text-stone-400 mb-8">Quantity: {myUnits} units</p>

            {/* Premium Aggregation Visualizer */}
            <div className={`my-8 p-6 rounded-2xl transition-all duration-500 border ${isAggregating ? "bg-stone-50 border-stone-200" : "bg-amber-50/50 border-amber-200 shadow-inner"}`}>
              <h4 className="font-bold text-stone-900 mb-3 flex items-center gap-2">
                <span className="text-amber-500">⚡</span> Bulk Aggregation Engine
              </h4>
              {isAggregating ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-stone-300 border-t-amber-500 rounded-full animate-spin"></div>
                  <p className="text-stone-500 font-medium">Scanning network for pending orders...</p>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <p className="text-stone-600 text-sm mb-4 leading-relaxed font-medium">
                    We found <strong className="text-stone-900">{communityPendingUnits}</strong> pending units from other cooperatives! 
                    Your combined order size is <strong className="text-stone-900">{totalAggregated}</strong> units.
                  </p>
                  <div className="flex justify-between items-center text-amber-700 font-bold bg-amber-100/50 p-4 rounded-xl border border-amber-200">
                    <span>Volume Discount Applied ({discountPercent * 100}%)</span>
                    <span>- {discountAmount.toLocaleString()} RWF</span>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-stone-100 pt-6 flex justify-between items-center mb-10">
              <span className="text-xl font-bold text-stone-900">Total Amount</span>
              <span className="text-3xl font-extrabold text-stone-900">
                {isAggregating ? "..." : `${finalTotal.toLocaleString()} RWF`}
              </span>
            </div>

            <button 
              disabled={isAggregating}
              className="w-full bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-stone-800 transition-all shadow-md hover:shadow-lg disabled:bg-stone-300 disabled:shadow-none hover:-translate-y-0.5"
              onClick={() => alert("Mobile Money Gateway Prompt Initiated!")}
            >
              Pay via Mobile Money
            </button>
            
            <div className="mt-6 text-center">
              <Link href="/dashboard" className="text-stone-400 font-medium text-sm hover:text-stone-600 transition-colors">
                &larr; Return to catalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}