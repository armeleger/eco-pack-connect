"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function Checkout() {
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const initCheckout = async () => {
      // 1. Check Auth
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);
      
      // 2. Load Item
      const savedItem = localStorage.getItem('ecopack_checkout_item');
      if (savedItem) setProduct(JSON.parse(savedItem));
      
      setIsLoading(false);
    };
    initCheckout();
  }, []);

  if (isLoading) return <div className="min-h-screen bg-stone-50 flex items-center justify-center font-bold text-stone-500">Loading secure checkout...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-sm border border-stone-200 text-center">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 mb-2">Auth Required</h2>
          <p className="text-stone-500 font-medium mb-8">You must be logged into a buyer account to join bulk pools and purchase inventory.</p>
          <div className="space-y-3">
            <Link href="/login" className="block w-full bg-stone-900 text-white font-bold py-3.5 rounded-xl hover:bg-stone-800 transition">Log In Now</Link>
            <Link href="/" className="block w-full text-stone-500 font-bold py-3 hover:text-stone-900 transition">&larr; Back to Market</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="text-center pt-20 font-bold">No product selected. <Link href="/" className="text-amber-600">Go back.</Link></div>;

  // Real-time calculation based on DB variables
  const totalAggregated = quantity + product.current_orders;
  const isTargetMet = totalAggregated >= product.bulk_target;
  const discountPercent = isTargetMet ? (product.discount_percent / 100) : 0;

  const subtotal = product.price * quantity;
  const discountAmount = subtotal * discountPercent;
  const finalTotal = subtotal - discountAmount;

  const handlePayment = async () => {
    if (quantity > product.stock_quantity) {
      alert("Error: You cannot order more than the available stock!");
      return;
    }

    setIsProcessing(true);
    
    // THE MAGIC: Real-time inventory deduction in Supabase!
    const newStock = product.stock_quantity - quantity;
    const newOrders = product.current_orders + quantity;

    const { error } = await supabase
      .from('products')
      .update({ stock_quantity: newStock, current_orders: newOrders })
      .eq('id', product.id);

    if (error) {
      alert("Database error processing transaction.");
      setIsProcessing(false);
      return;
    }

    // Generate Receipt
    const newOrder = {
      orderId: `ORD-${Math.floor(Math.random() * 900000 + 100000)}`,
      trackId: `ECO-${Math.floor(Math.random() * 900000 + 100000)}`,
      product: product.name,
      quantity,
      total: finalTotal,
      date: new Date().toLocaleDateString(),
    };

    const existingOrders = JSON.parse(localStorage.getItem('ecopack_orders') || '[]');
    localStorage.setItem('ecopack_orders', JSON.stringify([newOrder, ...existingOrders]));
    
    setReceipt(newOrder);
    setIsProcessing(false);
  };

  if (receipt) {
    return (
      <div className="min-h-screen bg-stone-50 pt-12 px-4 font-sans">
        <div className="max-w-xl mx-auto bg-white rounded-[2rem] shadow-sm border border-stone-200 overflow-hidden">
          <div className="bg-emerald-600 p-8 text-center text-white">
            <h2 className="text-2xl font-extrabold">Payment Successful</h2>
            <p className="font-medium mt-1 text-emerald-100">Database updated. Stock deducted.</p>
          </div>
          <div className="p-8">
            <div className="space-y-4 mb-8 text-sm font-medium text-stone-600">
              <div className="flex justify-between pb-4 border-b border-stone-100"><span className="text-stone-400">Billed To</span> <span className="text-stone-900 font-bold">{user.user_metadata?.company_name}</span></div>
              <div className="flex justify-between pb-4 border-b border-stone-100"><span className="text-stone-400">Item</span> <span className="text-stone-900">{receipt.product}</span></div>
              <div className="flex justify-between pb-4 border-b border-stone-100"><span className="text-stone-400">Quantity</span> <span className="text-stone-900">{receipt.quantity} units</span></div>
            </div>
            <Link href="/" className="block text-center bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-stone-800 transition">Return to Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-12 px-4 pb-20 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-sm font-bold text-stone-400 hover:text-stone-800 transition">&larr; Back to Market</Link>
        </div>
        
        <div className="bg-white rounded-[2rem] shadow-sm border border-stone-200 overflow-hidden p-8 md:p-10">
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 border-b border-stone-100 pb-8">
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Purchasing</p>
              <h2 className="text-2xl font-extrabold text-stone-900">{product.name}</h2>
              <p className="text-sm font-medium text-stone-500 mt-1">Supplied by {product.supplier}</p>
              <p className="mt-4 text-stone-900 font-bold">{product.stock_quantity} units available in stock</p>
            </div>
            <div className="w-full md:w-48 shrink-0">
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Order Qty</label>
              <input 
                type="number" min="10" max={product.stock_quantity} step="10" 
                value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} 
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 font-bold text-lg" 
              />
            </div>
          </div>
          
          <div className="mb-8 p-6 rounded-2xl bg-amber-50/50 border border-amber-200 shadow-inner">
            <h4 className="font-bold text-stone-900 mb-3 text-sm flex justify-between">
              <span>Dynamic Engine</span>
              <span className="text-amber-600">Target: {product.bulk_target}</span>
            </h4>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm text-stone-500 font-medium">
                <span>Subtotal ({quantity} x {product.price})</span>
                <span>{subtotal.toLocaleString()} RWF</span>
              </div>
              
              {isTargetMet ? (
                <div className="flex justify-between text-emerald-700 font-bold bg-emerald-100/50 p-3 rounded-lg border border-emerald-200 text-sm">
                  <span>Seller Discount Applied ({product.discount_percent}%)</span>
                  <span>- {discountAmount.toLocaleString()} RWF</span>
                </div>
              ) : (
                <div className="text-xs text-stone-400 font-medium p-3 border border-stone-200 border-dashed rounded-lg">
                  Order {(product.bulk_target - totalAggregated)} more units to unlock the seller's {product.discount_percent}% discount.
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-bold text-stone-500">Total</span>
            <span className="text-4xl font-extrabold text-stone-900">{finalTotal.toLocaleString()} RWF</span>
          </div>
          <button disabled={isProcessing || quantity > product.stock_quantity} onClick={handlePayment} className="w-full bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-stone-800 shadow-md transition disabled:bg-stone-300">
            {isProcessing ? "Updating Database..." : "Confirm & Pay"}
          </button>
        </div>
      </div>
    </div>
  );
}