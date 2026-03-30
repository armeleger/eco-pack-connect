"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Package, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { supabase } from "../lib/supabase";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const initialQty = parseInt(searchParams.get("qty") || "0");

  const [user, setUser] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const initCheckout = async () => {
      // 1. Check Authentication Status
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);

      // 2. Load Product Details
      if (productId) {
        const found = MOCK_PRODUCTS.find(p => p.id === productId);
        if (found) {
          setProduct(found);
          setQuantity(initialQty > found.moq ? initialQty : found.moq);
        }
      }
      setIsLoading(false);
    };
    initCheckout();
  }, [productId, initialQty]);

  const adjustQuantity = (amount: number) => {
    if (!product) return;
    const newQty = quantity + amount;
    if (newQty >= product.moq && newQty <= product.stock_quantity) {
      setQuantity(newQty);
    }
  };

  const NavBar = () => (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1000px] mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-stone-400 hover:text-[#2D6A4F] transition-colors font-bold text-sm">
            &larr; Back
          </button>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#2D6A4F]" />
          <span className="text-sm font-bold text-stone-900" style={{fontFamily:"var(--font-display)"}}>Secure B2B Checkout</span>
        </div>
        <div className="text-[10px] font-bold bg-[#E8F5E9] text-[#1B4332] px-2.5 py-1 rounded-full uppercase tracking-widest border border-[#D8F3DC]">
          SSL Encrypted
        </div>
      </div>
    </nav>
  );

  if (isLoading) return <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center font-bold text-[#2D6A4F]">Securing Trade Tunnel...</div>;

  // =========================================================================
  // STRICT AUTHENTICATION LOCK
  // If the user is not logged in, block checkout and show this screen
  // =========================================================================
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] rounded-full bg-[#D8F3DC]/40 blur-[80px] -z-10 pointer-events-none"></div>
          
          <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-lg border border-stone-200 text-center relative z-10">
            <div className="w-16 h-16 bg-[#F8FAF9] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Lock size={28} className="text-[#2D6A4F]" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2" style={{fontFamily:"var(--font-display)"}}>B2B Auth Required</h2>
            <p className="text-stone-500 font-medium mb-8 text-sm">You must be logged into a registered company account to place wholesale trade orders.</p>
            <div className="space-y-3">
              <Link href="/login" className="block w-full bg-[#2D6A4F] text-white font-bold py-4 rounded-xl hover:bg-[#1B4332] transition-colors shadow-sm text-sm">
                Secure Sign In
              </Link>
              <Link href="/signup" className="block w-full bg-white border-2 border-stone-200 text-stone-600 hover:border-[#2D6A4F] hover:text-[#2D6A4F] font-bold py-3.5 rounded-xl transition-colors text-sm">
                Apply for an Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center font-bold">No product selected. <Link href="/" className="text-[#4A7C59] ml-2 hover:underline">Return to Market.</Link></div>;

  const subtotal = product.price_per_unit * quantity;
  const discountAmount = quantity >= (product.moq * 2) ? (subtotal * 0.05) : 0; 
  const finalTotal = subtotal - discountAmount;

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newOrder = {
        orderId: `TRD-${Math.floor(Math.random() * 900000 + 100000)}`,
        trackId: `ECO-${Math.floor(Math.random() * 900000 + 100000)}`,
        product: product.title,
        quantity,
        total: finalTotal,
        date: new Date().toLocaleDateString(),
      };
      setReceipt(newOrder);
      setIsProcessing(false);
    }, 1500);
  };

  if (receipt) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex flex-col">
        <NavBar />
        <main className="flex-grow pt-12 px-4 pb-20">
          <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="bg-[#1B4332] p-10 text-center relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#2D6A4F] rounded-full blur-3xl opacity-50"></div>
              <div className="w-16 h-16 bg-[#D8F3DC] rounded-full flex items-center justify-center mx-auto mb-5 relative z-10 shadow-lg">
                <CheckCircle2 size={32} className="text-[#1B4332]" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2 relative z-10" style={{fontFamily:"var(--font-display)"}}>Order Authorized</h2>
              <p className="text-[#95D5B2] text-sm font-medium relative z-10">Commercial invoice generated and sent to supplier.</p>
            </div>
            <div className="p-8 sm:p-10">
              <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-3 mb-6">Trade Details</h3>
              <div className="space-y-4 mb-8 text-sm text-stone-600">
                <div className="flex justify-between"><span className="text-stone-500 font-medium">Buyer</span> <span className="text-stone-900 font-bold">{user.user_metadata?.company_name}</span></div>
                <div className="flex justify-between"><span className="text-stone-500 font-medium">Order Reference</span> <span className="text-stone-900 font-bold bg-stone-100 px-2 py-0.5 rounded">{receipt.orderId}</span></div>
                <div className="flex justify-between"><span className="text-stone-500 font-medium">Logistics Tracking</span> <span className="text-[#2D6A4F] font-bold bg-[#D8F3DC] px-2 py-0.5 rounded">{receipt.trackId}</span></div>
                <div className="flex justify-between"><span className="text-stone-500 font-medium">Commodity</span> <span className="text-stone-900 font-semibold text-right max-w-[200px] truncate">{receipt.product}</span></div>
                <div className="flex justify-between items-center pt-4 border-t border-stone-100"><span className="text-stone-500 font-medium">Total Volume</span> <span className="text-stone-900 font-bold">{receipt.quantity.toLocaleString()} units</span></div>
                <div className="flex justify-between items-center bg-[#F8FAF9] p-4 rounded-xl border border-stone-200 mt-4">
                  <span className="text-stone-900 font-bold uppercase tracking-wide text-xs">Total Settled</span> 
                  <span className="text-xl font-bold text-[#2D6A4F]" style={{fontFamily:"var(--font-display)"}}>{receipt.total.toLocaleString()} RWF</span>
                </div>
              </div>
              <Link href="/" className="flex items-center justify-center gap-2 w-full bg-[#2D6A4F] text-white font-bold py-4 rounded-xl hover:bg-[#1B4332] transition-colors shadow-sm text-sm">
                Return to Marketplace <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col">
      <NavBar />
      <main className="max-w-[1000px] mx-auto px-4 pt-10 pb-20 w-full flex-grow">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <h1 className="text-2xl font-bold text-stone-900 mb-2" style={{fontFamily:"var(--font-display)"}}>Review & Confirm Order</h1>
            
            {/* Product Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <div className="w-20 h-20 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                 <img src={product.image_url || "https://images.unsplash.com/photo-1530968831187-a937baadb39b?w=800&q=80"} alt={product.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block mb-1">{product.supplier?.company_name}</span>
                <h3 className="font-bold text-stone-900 text-lg leading-tight mb-2 line-clamp-1">{product.title}</h3>
                <div className="flex gap-4 text-sm font-medium text-stone-500">
                  <p>Unit Price: <span className="font-bold text-stone-900">{product.price_per_unit.toLocaleString()} RWF</span></p>
                </div>
              </div>
            </div>

            {/* Volume Editor */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <h4 className="font-bold text-stone-900 text-base mb-4 flex items-center gap-2"><Package size={16} className="text-[#2D6A4F]"/> Order Volume</h4>
              <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
                <div className="flex items-center w-full sm:w-auto bg-[#F8FAF9] border border-stone-200 rounded-xl p-1">
                  <button onClick={() => setQuantity(Math.max(product.moq, quantity - 500))} className="w-12 h-12 flex items-center justify-center text-stone-600 font-bold hover:bg-stone-200 rounded-lg transition-colors">-</button>
                  <input 
                    type="number" min={product.moq} 
                    value={quantity} onChange={(e) => setQuantity(Math.max(product.moq, Number(e.target.value)))} 
                    className="w-24 sm:w-32 text-center h-12 bg-transparent font-bold text-xl text-stone-900 outline-none" 
                  />
                  <button onClick={() => setQuantity(quantity + 500)} className="w-12 h-12 flex items-center justify-center text-stone-600 font-bold hover:bg-stone-200 rounded-lg transition-colors">+</button>
                </div>
                <div className="text-xs text-stone-500">
                  <p className="font-bold text-stone-900 mb-0.5">Minimum Order: {product.moq.toLocaleString()}</p>
                  <p>Double the MOQ for a 5% bulk discount.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Trade Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden sticky top-24">
              <div className="bg-[#1B4332] p-5">
                <h3 className="font-bold text-white text-base flex items-center gap-2" style={{fontFamily:"var(--font-display)"}}>
                  <Lock size={16} className="text-[#95D5B2]"/> Trade Summary
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm text-stone-600 font-medium">
                    <span>Commodity Subtotal</span>
                    <span className="font-semibold text-stone-900">{subtotal.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between text-sm text-stone-600 font-medium">
                    <span>Logistics (EAC)</span>
                    <span className="text-stone-400 italic">Calculated post-auth</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm font-bold text-[#2D6A4F] bg-[#E8F5E9] p-3 rounded-xl border border-[#D8F3DC]">
                      <span>Volume Discount</span>
                      <span>- {discountAmount.toLocaleString()} RWF</span>
                    </div>
                  )}
                </div>
                
                <div className="pt-6 border-t border-stone-100 mb-6">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">TOTAL DUE</span>
                    <span className="text-3xl font-bold text-stone-900" style={{fontFamily:"var(--font-display)"}}>{finalTotal.toLocaleString()}</span>
                  </div>
                  <div className="text-right text-sm font-bold text-stone-400">RWF</div>
                </div>
                
                <button 
                  disabled={isProcessing} 
                  onClick={handlePayment} 
                  className="w-full bg-[#2D6A4F] text-white font-bold py-4 rounded-xl hover:bg-[#1B4332] shadow-sm transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed text-sm flex justify-center items-center gap-2"
                >
                  {isProcessing ? "Authorizing Trade..." : "Authorize Payment"}
                  {!isProcessing && <ArrowRight size={16} />}
                </button>
                <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  <ShieldCheck size={12} /> Protected by EcoPack for {user.user_metadata?.company_name}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center font-bold text-[#2D6A4F]">Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}