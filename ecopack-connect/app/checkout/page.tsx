"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Checkout() {
  const [isAggregating, setIsAggregating] = useState(true);
  
  // Simulating data from the Cart and the Database
  const basePrice = 450000; // 1000 units at 450 RWF
  const myUnits = 1000;
  const communityPendingUnits = 850;
  const totalAggregated = myUnits + communityPendingUnits;
  
  // Discount Logic as defined in the Sequence Diagram
  let discountPercent = 0;
  if (totalAggregated > 1000) discountPercent = 0.20;
  else if (totalAggregated > 500) discountPercent = 0.15;
  else if (totalAggregated > 100) discountPercent = 0.10;

  const discountAmount = basePrice * discountPercent;
  const finalTotal = basePrice - discountAmount;

  useEffect(() => {
    // Simulating the 500ms critical performance requirement for the Bulk Aggregation Engine
    const timer = setTimeout(() => setIsAggregating(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-green-700 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">Secure Checkout</h2>
        </div>
        
        <div className="p-8">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Order Summary</h3>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Eco-Friendly Corrugated Tomato Box (x{myUnits})</span>
            <span>{basePrice.toLocaleString()} RWF</span>
          </div>

          <div className="my-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2">⚡ Bulk Aggregation Engine</h4>
            {isAggregating ? (
              <p className="text-blue-700 animate-pulse">Scanning database for similar pending orders...</p>
            ) : (
              <div>
                <p className="text-blue-800 text-sm mb-2">
                  We found <strong>{communityPendingUnits}</strong> pending units from other cooperatives! 
                  Your combined order size is <strong>{totalAggregated}</strong> units.
                </p>
                <div className="flex justify-between items-center text-green-700 font-bold bg-green-100 p-3 rounded">
                  <span>Volume Discount Applied ({discountPercent * 100}%)</span>
                  <span>- {discountAmount.toLocaleString()} RWF</span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-4 flex justify-between items-center mb-8">
            <span className="text-xl font-bold text-gray-900">Total Amount</span>
            <span className="text-2xl font-extrabold text-green-700">
              {isAggregating ? "..." : `${finalTotal.toLocaleString()} RWF`}
            </span>
          </div>

          <button 
            disabled={isAggregating}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-md hover:bg-green-700 transition disabled:bg-gray-400"
            onClick={() => alert("Mobile Money Gateway Prompt Initiated!")}
          >
            Pay via Mobile Money
          </button>
          
          <div className="mt-4 text-center">
            <Link href="/dashboard" className="text-gray-500 text-sm hover:underline">
              Cancel and return to catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}