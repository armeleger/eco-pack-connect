"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Checkout() {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const initCheckout = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);
      
      const savedItem = localStorage.getItem('ecopack_checkout_item');
      if (savedItem) {
        const parsedItem = JSON.parse(savedItem);
        setProduct(parsedItem);
        // Start exactly at the MOQ
        setQuantity(parsedItem.moq || 500);
      }
      setIsLoading(false);
    };
    initCheckout();
  }, []);

  // Quick adjustment functions
  const adjustQuantity = (amount: number) => {
    if (!product) return;
    const newQty = quantity + amount;
    if (newQty >= product.moq && newQty <= product.stock_quantity) {
      setQuantity(newQty);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#f7f6f2] flex items-center justify-center font-bold text-stone-500">Securing B2B trade tunnel...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f7f6f2] flex flex-col">
        <nav className="bg-white border-b border-stone-200 px-4 py-4">
          <div className="max-w-[1400px] mx-auto flex items-center gap-2">
            <div className="w-8 h-8 bg-[#8B8068] rounded flex items-center justify-center text-white font-black">E</div>
            <span className="font-extrabold text-xl text-stone-900">EcoPack</span>
          </div>
        </nav>
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-sm border border-stone-200 text-center">
            <h2 className="text-2xl font-extrabold text-stone-900 mb-2">B2B Auth Required</h2>
            <p className="text-stone-500 font-medium mb-8">You must be logged into a registered company account to place wholesale orders.</p>
            <div className="space-y-3">
              <Link href="/login" className="block w-full bg-[#8B8068] text-white font-bold py-3.5 rounded-lg hover:bg-[#736A56] transition">Log In / Register</Link>
              <Link href="/" className="block w-full text-stone-500 font-bold py-3 hover:text-stone-900 transition">&larr; Back to Catalog</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="min-h-screen bg-[#f7f6f2] flex items-center justify-center font-bold">No product selected. <Link href="/" className="text-[#8B8068] ml-2 hover:underline">Return to Market.</Link></div>;

  // Real-time calculations
  const subtotal = product.price * quantity;
  const currentPoolTotal = quantity + product.current_orders;
  const isTargetMet = currentPoolTotal >= product.bulk_target;
  const unitsNeededForDiscount = product.bulk_target - currentPoolTotal;
  const discountAmount = isTargetMet ? subtotal * (product.discount_percent / 100) : 0;
  const finalTotal = subtotal - discountAmount;
  
  // Progress bar logic
  const progressPercent = Math.min((currentPoolTotal / product.bulk_target) * 100, 100);

  const handlePayment = async () => {
    if (quantity < product.moq) {
      alert(`Minimum Order Quantity is ${product.moq} units.`);
      return;
    }
    if (quantity > product.stock_quantity) {
      alert("Error: Order exceeds available inventory.");
      return;
    }

    setIsProcessing(true);
    
    const newStock = product.stock_quantity - quantity;
    const newOrders = product.current_orders + quantity;

    const { error } = await supabase.from('products').update({ stock_quantity: newStock, current_orders: newOrders }).eq('id', product.id);

    if (error) {
      alert("Trade transaction failed. Please try again.");
      setIsProcessing(false);
      return;
    }

    const newOrder = {
      orderId: `TRD-${Math.floor(Math.random() * 900000 + 100000)}`,
      trackId: `ECO-${Math.floor(Math.random() * 900000 + 100000)}`,
      product: product.name,
      quantity,
      price: product.price,
      total: finalTotal,
      date: new Date().toLocaleDateString(),
    };

    const existingOrders = JSON.parse(localStorage.getItem('ecopack_orders') || '[]');
    localStorage.setItem('ecopack_orders', JSON.stringify([newOrder, ...existingOrders]));
    
    setReceipt(newOrder);
    setIsProcessing(false);
  };

  // The Top Navigation Bar (Shared across both Checkout and Receipt views)
  const NavBar = () => (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-stone-400 hover:text-[#8B8068] transition font-bold text-sm flex items-center gap-1">
            &larr; <span className="hidden sm:block">Back</span>
          </button>
          <div className="h-6 w-px bg-stone-200 hidden sm:block"></div>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#8B8068] rounded flex items-center justify-center text-white font-black text-lg">E</div>
            <h1 className="text-lg font-bold text-stone-900 tracking-tight hidden sm:block">EcoPack Secure Checkout</h1>
          </Link>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold">
          <span className="text-stone-500 hidden md:block">Buyer: {user.user_metadata?.company_name}</span>
          <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded border border-emerald-200 text-xs">SSL Secured</span>
        </div>
      </div>
    </nav>
  );

  // The Corporate Footer (Shared)
  const Footer = () => (
    <footer className="bg-stone-900 text-stone-400 pt-16 pb-8 border-t border-stone-800 mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-stone-800 pb-12 mb-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#8B8068] rounded flex items-center justify-center text-white font-black text-lg">E</div>
            <span className="font-extrabold text-xl text-white tracking-tight">EcoPack Connect</span>
          </div>
          <p className="text-sm font-medium leading-relaxed max-w-sm mb-6">A Kira Capital venture dedicated to streamlining the sustainable packaging supply chain in East Africa.</p>
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500"><p>HQ: Kigali Logistics Hub, Rwanda</p></div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-[#D6D0C4] transition">Marketplace</Link></li>
            <li><Link href="/seller-dashboard" className="hover:text-[#D6D0C4] transition">Supplier Portal</Link></li>
            <li><Link href="/tracker" className="hover:text-[#D6D0C4] transition">Lifecycle Tracker</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Trade Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-[#D6D0C4] transition">Trade Assurance</a></li>
            <li><a href="#" className="hover:text-[#D6D0C4] transition">Customs & Logistics</a></li>
            <li><a href="#" className="hover:text-[#D6D0C4] transition">Dispute Resolution</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs font-medium">
        <p>&copy; {new Date().getFullYear()} EcoPack Connect. All rights reserved.</p>
      </div>
    </footer>
  );

  if (receipt) {
    return (
      <div className="min-h-screen bg-[#f7f6f2] font-sans flex flex-col">
        <NavBar />
        <main className="flex-grow pt-12 px-4 pb-20">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="bg-[#8B8068] p-10 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-3xl font-extrabold">Trade Order Authorized</h2>
              <p className="font-medium mt-2 text-[#F0ECE3]">Commercial invoice generated. Supplier notified.</p>
            </div>
            <div className="p-10">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100 pb-2 mb-6">Commercial Invoice Details</h3>
              <div className="space-y-5 mb-10 text-sm font-medium text-stone-600">
                <div className="flex justify-between"><span className="text-stone-500">Buying Entity</span> <span className="text-stone-900 font-bold">{user.user_metadata?.company_name}</span></div>
                <div className="flex justify-between"><span className="text-stone-500">Trade Reference (Order ID)</span> <span className="text-stone-900 font-bold">{receipt.orderId}</span></div>
                <div className="flex justify-between"><span className="text-stone-500">Logistics Tracking</span> <span className="text-amber-600 font-bold">{receipt.trackId}</span></div>
                <div className="flex justify-between"><span className="text-stone-500">Commodity</span> <span className="text-stone-900">{receipt.product}</span></div>
                <div className="flex justify-between items-center pt-4 border-t border-stone-100"><span className="text-stone-500">Total Volume</span> <span className="text-stone-900 font-bold text-lg">{receipt.quantity} units</span></div>
                <div className="flex justify-between items-center bg-[#FAF9F7] p-4 rounded-lg border border-[#D6D0C4]"><span className="text-stone-900 font-bold">Total Settled</span> <span className="text-xl font-black text-[#8B8068]">{receipt.total.toLocaleString()} RWF</span></div>
              </div>
              <Link href="/" className="block text-center bg-stone-900 text-white font-bold py-4 rounded-lg hover:bg-stone-800 transition shadow-sm text-lg">Return to Trading Hub</Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans flex flex-col">
      <NavBar />
      
      <main className="max-w-[1200px] mx-auto px-4 pt-8 pb-20 w-full flex-grow">
        <h1 className="text-3xl font-extrabold text-stone-900 mb-8">Review Trade Order</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Product & Quantity */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Product Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="w-24 h-24 rounded bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                 <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#F0ECE3] text-[#736A56] text-[10px] font-bold px-2 py-0.5 rounded uppercase">{product.category}</span>
                  <span className="text-[10px] font-bold text-stone-400 uppercase">{product.supplier}</span>
                </div>
                <h3 className="font-extrabold text-stone-900 text-xl leading-tight mb-2">{product.name}</h3>
                <div className="flex gap-4 text-sm font-medium text-stone-500">
                  <p>Unit Price: <span className="font-bold text-stone-900">{product.price} RWF</span></p>
                  <p>In Stock: <span className="font-bold text-stone-900">{product.stock_quantity}</span></p>
                </div>
              </div>
            </div>

            {/* Interactive Quantity Card */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 md:p-8">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h4 className="font-extrabold text-stone-900 text-lg mb-1">Order Volume</h4>
                  <p className="text-sm font-medium text-stone-500">Specify your desired quantity.</p>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Supplier MOQ</span>
                  <span className="text-lg font-black text-[#8B8068]">{product.moq} units</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex items-center w-full sm:w-auto bg-stone-50 border border-stone-200 rounded-lg p-1">
                  <button onClick={() => adjustQuantity(-100)} disabled={quantity <= product.moq} className="w-12 h-12 flex items-center justify-center text-stone-600 font-bold hover:bg-stone-200 rounded transition disabled:opacity-30">-</button>
                  <input 
                    type="number" min={product.moq} max={product.stock_quantity} 
                    value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} 
                    className="w-24 sm:w-32 text-center h-12 bg-transparent font-black text-2xl text-stone-900 outline-none" 
                  />
                  <button onClick={() => adjustQuantity(100)} disabled={quantity >= product.stock_quantity} className="w-12 h-12 flex items-center justify-center text-stone-600 font-bold hover:bg-stone-200 rounded transition disabled:opacity-30">+</button>
                </div>
                <p className={`text-sm font-bold ml-2 ${quantity < product.moq ? 'text-red-500' : 'text-emerald-600'}`}>
                  {quantity < product.moq ? `Warning: Minimum order is ${product.moq}.` : 'Volume accepted.'}
                </p>
              </div>

              {/* Real-time Discount Tracker */}
              <div className="mt-8 pt-8 border-t border-stone-100">
                <h4 className="font-bold text-stone-900 mb-2 flex justify-between">
                  <span>Aggregation Pool Target</span>
                  <span>{currentPoolTotal} / {product.bulk_target}</span>
                </h4>
                <div className="w-full bg-stone-100 rounded-full h-3 mb-3 overflow-hidden border border-stone-200">
                  <div className={`h-3 rounded-full transition-all duration-500 ${isTargetMet ? 'bg-emerald-500' : 'bg-[#8B8068]'}`} style={{ width: `${progressPercent}%` }}></div>
                </div>
                <p className="text-sm font-medium text-stone-500">
                  {isTargetMet 
                    ? <span className="text-emerald-600 font-bold">Target reached! {product.discount_percent}% wholesale discount applied.</span>
                    : <span>Add <strong className="text-stone-900">{unitsNeededForDiscount} more units</strong> to your order to instantly unlock a <strong className="text-stone-900">{product.discount_percent}% discount</strong>.</span>
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden sticky top-24">
              <div className="bg-[#FAF9F7] p-6 border-b border-stone-200">
                <h3 className="font-extrabold text-stone-900 text-lg">Trade Summary</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm font-medium text-stone-600">
                    <span>Commodity Subtotal</span>
                    <span>{subtotal.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-stone-600">
                    <span>Standard Shipping (EAC)</span>
                    <span className="text-stone-400">Calculated later</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm font-bold text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                      <span>Bulk Target Discount</span>
                      <span>- {discountAmount.toLocaleString()} RWF</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-end pt-6 border-t border-stone-200 mb-8">
                  <span className="font-bold text-stone-900">Total Due</span>
                  <div className="text-right">
                    <span className="block text-3xl font-black text-[#8B8068]">{finalTotal.toLocaleString()}</span>
                    <span className="text-xs font-bold text-stone-400 uppercase">RWF</span>
                  </div>
                </div>
                
                <button 
                  disabled={isProcessing || quantity < product.moq || quantity > product.stock_quantity} 
                  onClick={handlePayment} 
                  className="w-full bg-stone-900 text-white font-bold py-4 rounded-lg hover:bg-stone-800 shadow-sm transition disabled:bg-stone-300 disabled:cursor-not-allowed text-lg flex justify-center items-center gap-2"
                >
                  {isProcessing ? "Authorizing..." : "Submit Trade Order"}
                  {!isProcessing && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                </button>
                <p className="text-center text-[10px] font-bold text-stone-400 uppercase mt-4">Protected by EcoPack Trade Assurance</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}