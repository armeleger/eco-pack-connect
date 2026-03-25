"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MOCK_PRODUCTS = [
  { id: 1, name: "Eco-Friendly Corrugated Tomato Box", material: "100% Recycled Kraft Paper", basePrice: 450, bulkTarget: 1000, currentOrders: 850, discount: "20%" },
  { id: 2, name: "Biodegradable Coffee Pouches (500g)", material: "Compostable PLA", basePrice: 120, bulkTarget: 5000, currentOrders: 1200, discount: "15%" },
  { id: 3, name: "Reusable Crate (Standard)", material: "Recycled HDPE Plastic", basePrice: 3500, bulkTarget: 500, currentOrders: 490, discount: "25%" }
];

export default function Dashboard() {
  const router = useRouter();
  const [cart, setCart] = useState<number[]>([]);

  const handleAddToCart = (id: number) => {
    if (!cart.includes(id)) {
      setCart([...cart, id]);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24 font-sans">
      
      {/* Premium Glassmorphism Nav */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 gap-8">
            
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl shadow-md flex items-center justify-center text-white font-extrabold text-2xl">E</div>
              <span className="font-extrabold text-2xl text-stone-900 tracking-tight hidden sm:block">EcoPack</span>
            </Link>
            
            {/* Prominent Search Bar */}
            <div className="flex-grow max-w-2xl">
              <div className="relative flex items-center w-full h-12 rounded-full shadow-sm bg-stone-100 border border-stone-200 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 focus-within:bg-white transition-all">
                <div className="grid place-items-center h-full w-12 text-stone-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input
                  className="peer h-full w-full outline-none text-sm text-stone-900 bg-transparent pr-2"
                  type="text"
                  id="search"
                  placeholder="Search for kraft boxes, pouches, crates..." />
                <button className="h-full px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm transition-colors">
                  Search
                </button>
              </div>
            </div>

            {/* Right Nav Links */}
            <div className="flex items-center gap-6 text-sm font-semibold text-stone-600">
              <Link href="/tracker" className="hover:text-amber-700 flex items-center gap-1 transition-colors">
                <span className="hidden md:block">QR Tracker</span>
              </Link>
              <Link href="/login" className="px-5 py-2.5 rounded-full border-2 border-stone-200 hover:border-amber-600 hover:text-amber-700 transition-all">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Category Navigation */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8 overflow-x-auto py-4 text-sm font-bold text-stone-500 hide-scrollbar">
          <span className="cursor-pointer text-amber-700 border-b-2 border-amber-600 pb-1 whitespace-nowrap">Active Aggregations</span>
          <span className="cursor-pointer hover:text-amber-600 whitespace-nowrap">Corrugated Boxes</span>
          <span className="cursor-pointer hover:text-amber-600 whitespace-nowrap">Kraft Envelopes</span>
          <span className="cursor-pointer hover:text-amber-600 whitespace-nowrap">Biodegradable Bags</span>
          <span className="cursor-pointer hover:text-amber-600 whitespace-nowrap">Reusable Crates</span>
        </div>
      </div>

      {/* Marketplace Banner */}
      <div className="bg-gradient-to-r from-amber-100/50 to-stone-100 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-extrabold text-stone-900 mb-2">Live Wholesale Pools</h1>
          <p className="text-stone-600 max-w-2xl text-lg">
            Join pending orders from other cooperatives. When the target is hit, everyone unlocks the wholesale discount.
          </p>
        </div>
      </div>

      {/* Main Catalog */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PRODUCTS.map((product) => {
            const progress = (product.currentOrders / product.bulkTarget) * 100;
            const inCart = cart.includes(product.id);

            return (
              <div key={product.id} className="group bg-white rounded-[2rem] shadow-sm hover:shadow-[0_20px_40px_rgba(217,119,6,0.1)] transition-all duration-300 border border-stone-100 overflow-hidden flex flex-col">
                
                {/* Image Area with Kraft/Amber Tint */}
                <div className="h-56 bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                    <span className="text-amber-700 text-xs font-bold uppercase tracking-wider">Up to -{product.discount}</span>
                  </div>
                  <svg className="w-20 h-20 text-amber-200 group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>

                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">{product.material}</p>
                    <h3 className="text-xl font-bold text-stone-900 mb-4 leading-tight">{product.name}</h3>
                    <div className="flex items-end gap-1 mb-6">
                      <span className="text-3xl font-extrabold text-stone-900">{product.basePrice}</span>
                      <span className="text-lg font-medium text-stone-500 mb-1">RWF / unit</span>
                    </div>

                    {/* Aggregation Progress Bar */}
                    <div className="bg-stone-50 rounded-xl p-4 border border-stone-100 mb-6">
                      <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-stone-800">{product.currentOrders} units</span>
                        <span className="text-stone-400">Target: {product.bulkTarget}</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-400 to-amber-600 h-2.5 rounded-full relative" style={{ width: `${progress}%` }}>
                          <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                        </div>
                      </div>
                      <p className="text-xs text-stone-500 mt-2 font-medium">
                        {(product.bulkTarget - product.currentOrders).toLocaleString()} more units to unlock {product.discount} off!
                      </p>
                    </div>
                  </div>

                  {/* Huge Action Button */}
                  <button 
                    onClick={() => handleAddToCart(product.id)}
                    disabled={inCart}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-sm hover:shadow-md ${
                      inCart 
                        ? "bg-stone-800 text-white shadow-inner" 
                        : "bg-amber-600 text-white hover:bg-amber-700 hover:-translate-y-0.5"
                    }`}
                  >
                    {inCart ? "Added to Order ✓" : "Join Bulk Order"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Checkout Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl bg-stone-900/95 backdrop-blur-xl text-white p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 animate-slide-up border border-stone-700">
          <div className="flex flex-col sm:flex-row justify-between items-center px-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
                <span className="text-amber-500 font-bold text-xl">{cart.length}</span>
              </div>
              <div>
                <p className="text-lg font-bold">Item(s) ready for aggregation</p>
                <p className="text-sm text-stone-400">Lock in your volume discount before the pool closes.</p>
              </div>
            </div>
            <button 
              onClick={() => router.push("/checkout")}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-stone-900 font-extrabold py-3.5 px-8 rounded-xl transition-all shadow-lg hover:shadow-amber-500/20"
            >
              Secure Checkout &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}