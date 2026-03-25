"use client";

import { useState } from "react";
import Link from "next/link";

export default function Checkout() {
  const [quantity, setQuantity] = useState<number>(500);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  
  // Product Data
  const basePrice = 450;
  const communityPendingUnits = 850;
  const totalAggregated = quantity + communityPendingUnits;
  
  // Dynamic Discount Logic
  let discountPercent = 0;
  if (totalAggregated >= 1000) discountPercent = 0.20;
  else if (totalAggregated >= 500) discountPercent = 0.15;
  else if (totalAggregated >= 100) discountPercent = 0.10;

  const subtotal = basePrice * quantity;
  const discountAmount = subtotal * discountPercent;
  const finalTotal = subtotal - discountAmount;

  const handlePayment = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      // Generate realistic IDs
      const orderId = `ORD-${Math.floor(Math.random() * 900000 + 100000)}`;
      const trackId = `ECO-${Math.floor(Math.random() * 900000 + 100000)}`;
      
      // Create the Order Object
      const newOrder = {
        orderId,
        trackId,
        product: "Heavy Duty Corrugated Tomato Box",
        quantity,
        total: finalTotal,
        date: new Date().toLocaleDateString(),
        status: "Processing",
      };

      // Save to our LocalStorage DB
      const existingOrders = JSON.parse(localStorage.getItem('ecopack_orders') || '[]');
      localStorage.setItem('ecopack_orders', JSON.stringify([newOrder, ...existingOrders]));
      
      setReceipt(newOrder);
      setIsProcessing(false);
    }, 1500);
  };

  if (receipt) {
    return (
      <div className="min-h-screen bg-stone-50 pt-12 px-4 font-sans">
        <div className="max-w-xl mx-auto bg-white rounded-[2rem] shadow-sm border border-stone-200 overflow-hidden">
          <div className="bg-emerald-600 p-8 text-center text-white">
            <div className="w-16 h-16 bg-white text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-extrabold">Payment Successful</h2>
            <p className="font-medium mt-1 text-emerald-100">Order {receipt.orderId} is confirmed.</p>
          </div>
          <div className="p-8">
            <div className="space-y-4 mb-8 text-sm font-medium text-stone-600">
              <div className="flex justify-between pb-4 border-b border-stone-100"><span className="text-stone-400">Billed To</span> <span className="text-stone-900 font-bold text-right">Kira Capital<br/>Kigali, Rwanda</span></div>
              <div className="flex justify-between pb-4 border-b border-stone-100"><span className="text-stone-400">Product</span> <span className="text-stone-900">{receipt.product}</span></div>
              <div className="flex justify-between pb-4 border-b border-stone-100"><span className="text-stone-400">Quantity</span> <span className="text-stone-900">{receipt.quantity} units</span></div>
              <div className="flex justify-between pb-4 border-b border-stone-100"><span className="text-stone-400">Total Paid</span> <span className="text-stone-900 font-bold text-lg">{receipt.total.toLocaleString()} RWF</span></div>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center mb-6">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Your QR Tracking Code</p>
              <p className="text-2xl font-black text-amber-900 tracking-widest">{receipt.trackId}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/tracker" className="text-center bg-stone-100 text-stone-700 font-bold py-3 rounded-xl hover:bg-stone-200 transition">Track Order</Link>
              <Link href="/dashboard" className="text-center bg-stone-900 text-white font-bold py-3 rounded-xl hover:bg-stone-800 transition">Back to Hub</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-12 px-4 pb-20 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-stone-900">Secure Checkout</h1>
          <p className="text-stone-500 font-medium mt-2">Adjust your quantity to optimize your wholesale discount.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-8 md:p-10">
            <h3 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-4 mb-6">Configure Order</h3>
            
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
              <div>
                <p className="font-bold text-stone-900">Corrugated Tomato Box</p>
                <p className="text-sm text-stone-500">Base Price: {basePrice} RWF / unit</p>
              </div>
              <div className="w-full md:w-48">
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Order Quantity</label>
                <input 
                  type="number" 
                  min="50" 
                  step="50"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 font-bold text-stone-900" 
                />
              </div>
            </div>

            <div className="my-8 p-6 rounded-2xl transition-all duration-300 bg-amber-50/50 border border-amber-200 shadow-inner">
              <h4 className="font-bold text-stone-900 mb-3 flex items-center gap-2">
                <span className="text-amber-500">⚡</span> Live Aggregation Engine
              </h4>
              <div className="animate-fade-in">
                <p className="text-stone-600 text-sm mb-4 leading-relaxed font-medium">
                  We found <strong className="text-stone-900">{communityPendingUnits}</strong> pending units from other cooperatives! 
                  The combined pool size is now <strong className="text-amber-700 text-lg">{totalAggregated.toLocaleString()}</strong> units.
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm text-stone-500">
                    <span>Subtotal ({quantity} units)</span>
                    <span>{subtotal.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-700 font-bold bg-amber-100/50 p-3 rounded-lg border border-amber-200">
                    <span>Volume Discount ({discountPercent * 100}%)</span>
                    <span>- {discountAmount.toLocaleString()} RWF</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-stone-100 pt-6 flex justify-between items-center mb-10">
              <span className="text-xl font-bold text-stone-900">Total Amount</span>
              <span className="text-3xl font-extrabold text-stone-900">
                {finalTotal.toLocaleString()} RWF
              </span>
            </div>

            <button 
              disabled={isProcessing}
              className="w-full bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-stone-800 transition-all shadow-md hover:-translate-y-0.5 disabled:bg-stone-300"
              onClick={handlePayment}
            >
              {isProcessing ? "Processing MTN Mobile Money..." : "Pay Securely"}
            </button>
            
            <div className="mt-6 text-center">
              <Link href="/dashboard" className="text-stone-400 font-medium text-sm hover:text-stone-600 transition-colors">
                &larr; Return to catalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
}