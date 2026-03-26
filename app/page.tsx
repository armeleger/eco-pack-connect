"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabase";

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
    fetchProducts();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) setUser(session.user);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
    setIsLoading(false);
  };

  const proceedToCheckout = (product: any) => {
    // Save the specific product they clicked to local storage so checkout knows what to bill
    localStorage.setItem('ecopack_checkout_item', JSON.stringify(product));
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-stone-100 font-sans pb-24">
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex justify-between items-center gap-4 md:gap-8">
          <div className="shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-600 rounded-lg shadow-sm flex items-center justify-center text-white font-extrabold text-2xl">E</div>
            <span className="font-extrabold text-2xl text-stone-900 tracking-tight hidden lg:block">EcoPack</span>
          </div>
          
          <div className="flex-grow flex justify-center">
            <span className="bg-stone-100 text-stone-600 px-4 py-2 rounded-lg text-sm font-bold shadow-inner">Public Marketplace</span>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/seller-dashboard" className="hidden md:block text-xs font-bold text-stone-500 hover:text-stone-900 transition border border-stone-200 px-3 py-1.5 rounded-md">Seller Portal</Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-amber-700 hidden sm:block">{user.user_metadata?.company_name}</span>
                <button onClick={handleLogout} className="text-sm font-bold text-stone-500 hover:text-stone-700">Sign Out</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-bold text-stone-600 hover:text-stone-900">Sign In</Link>
                <Link href="/signup" className="bg-stone-900 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-stone-800 transition shadow-sm">Register</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 pt-10">
        <div className="bg-gradient-to-r from-amber-100/50 to-stone-100 border border-stone-200 rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-extrabold text-stone-900 mb-2">Wholesale Packaging Hub</h1>
          <p className="text-stone-600 font-medium">Browse inventory. Join bulk pools to unlock seller-defined discounts.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-stone-500 font-bold animate-pulse">Loading live inventory...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-stone-500 font-bold">No products found. Be the first to list one!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const progress = Math.min((product.current_orders / product.bulk_target) * 100, 100);
              
              return (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-stone-200 flex flex-col group overflow-hidden hover:shadow-md transition-all">
                  <div className={`h-48 ${product.image_color || 'bg-stone-200'} flex items-center justify-center relative p-4`}>
                    <span className="absolute top-3 right-3 bg-white/95 px-2.5 py-1 rounded text-amber-700 text-[10px] font-black uppercase shadow-sm">
                      {product.discount_percent}% OFF Target
                    </span>
                    <span className="font-bold text-stone-400 opacity-50 text-xl">{product.material}</span>
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">{product.supplier}</p>
                    <h3 className="text-base font-extrabold text-stone-900 mb-2">{product.name}</h3>
                    
                    <div className="flex justify-between items-end mb-5">
                      <div>
                        <p className="text-xs text-stone-500 font-medium">Base Price</p>
                        <p className="text-xl font-black text-stone-900">{product.price} <span className="text-[10px] font-bold text-stone-500">RWF</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-stone-500 font-medium">Stock</p>
                        <p className={`text-sm font-bold ${product.stock_quantity < 500 ? 'text-red-500' : 'text-stone-700'}`}>{product.stock_quantity}</p>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="flex justify-between text-[10px] font-bold text-stone-500 mb-1.5">
                        <span>{product.current_orders} orders</span>
                        <span>Target: {product.bulk_target}</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2 mb-4 overflow-hidden">
                        <div className="bg-amber-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                      </div>
                      <button 
                        onClick={() => proceedToCheckout(product)}
                        disabled={product.stock_quantity <= 0}
                        className="w-full bg-stone-900 text-white hover:bg-stone-800 font-bold py-3 rounded-lg text-sm transition-all shadow-sm disabled:bg-stone-300 disabled:cursor-not-allowed"
                      >
                        {product.stock_quantity <= 0 ? "Out of Stock" : "Checkout Item"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}