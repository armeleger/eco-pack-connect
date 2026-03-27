"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("All Categories");

  const categories = ["All Categories", "Corrugated Boxes", "Flexible Pouches", "Glass Bottles", "Eco-Plastics", "Custom Labels"];

  useEffect(() => {
    checkUser();
    fetchProducts();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) setUser(session.user);
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
    setIsLoading(false);
  };

  const filteredProducts = activeCategory === "All Categories" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans flex flex-col">
      {/* Top Global Nav */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4">
        <div className="max-w-[1400px] mx-auto flex justify-between">
          <div className="flex gap-4">
            <Link href="/" className="hover:text-white transition">EcoPack for Buyers</Link>
            <Link href="/seller-dashboard" className="hover:text-white transition">EcoPack for Suppliers</Link>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition">Help Center</a>
            <span className="text-stone-400">Ship to: 🇷🇼 Rwanda / 🇰🇪 Kenya</span>
          </div>
        </div>
      </div>

      {/* Main Search Nav */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 py-5 flex items-center gap-8">
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 bg-[#8B8068] rounded flex items-center justify-center text-white font-black text-2xl">E</div>
            <span className="font-extrabold text-2xl text-stone-900 tracking-tight">EcoPack</span>
          </Link>
          
          <div className="flex-grow hidden md:flex">
            <div className="flex w-full max-w-3xl border-2 border-[#8B8068] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#D6D0C4] transition">
              <select className="bg-stone-50 border-r border-stone-200 px-4 text-sm font-bold text-stone-600 outline-none cursor-pointer">
                <option>Products</option>
                <option>Suppliers</option>
              </select>
              <input type="text" placeholder="What packaging are you looking for..." className="w-full px-4 py-3 text-sm outline-none" />
              <button className="bg-[#8B8068] hover:bg-[#736A56] text-white px-8 font-bold transition">Search</button>
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            {user ? (
              <Link href="/profile" className="flex items-center gap-2 hover:text-[#8B8068] transition">
                <div className="w-8 h-8 bg-[#F0ECE3] rounded-full flex items-center justify-center font-bold text-[#736A56]">
                  {user.user_metadata?.company_name?.charAt(0) || "U"}
                </div>
                <div className="text-sm">
                  <p className="text-stone-400 text-xs leading-none">Welcome back,</p>
                  <p className="font-bold text-stone-900 leading-tight">{user.user_metadata?.company_name}</p>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-bold text-stone-600 hover:text-[#8B8068]">Sign In</Link>
                <Link href="/signup" className="text-sm font-bold text-[#8B8068] border border-[#8B8068] px-4 py-1.5 rounded hover:bg-[#F0ECE3] transition">Join Free</Link>
              </div>
            )}
            <Link href="/tracker" className="text-sm font-bold text-stone-600 hover:text-[#8B8068] flex flex-col items-center">
              <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              Track Orders
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-4 py-6 flex gap-6 w-full flex-grow">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="bg-[#F0ECE3] px-4 py-3 font-bold text-sm border-b border-stone-200 text-[#5A5343]">Packaging Categories</div>
            <ul className="text-sm font-medium text-stone-600">
              {categories.map((cat) => (
                <li 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-3 cursor-pointer transition ${activeCategory === cat ? 'bg-[#F0ECE3] text-[#736A56] font-bold border-l-4 border-[#8B8068]' : 'hover:bg-stone-50 hover:text-[#8B8068] border-l-4 border-transparent'}`}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="flex-grow min-w-0">
          <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-stone-200">
            <h1 className="text-xl font-extrabold text-stone-900">{activeCategory} <span className="text-stone-400 font-medium text-sm ml-2">({filteredProducts.length} items)</span></h1>
            <div className="flex gap-2 text-sm font-medium">
              <button className="px-3 py-1.5 border border-stone-200 rounded hover:bg-stone-50">Verified Only</button>
            </div>
          </div>

          {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
               {[1,2,3,4].map(n => <div key={n} className="h-96 bg-white animate-pulse rounded-xl border border-stone-200"></div>)}
             </div>
          ) : filteredProducts.length === 0 ? (
             <div className="bg-white text-center py-20 rounded-xl border border-stone-200 text-stone-500 font-bold">No products found in this category.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-stone-200 flex flex-col group hover:shadow-lg transition-all overflow-hidden">
                  <div className="h-48 relative bg-stone-100 p-2">
                    <img src={product.image_url} alt={product.name} className="object-cover w-full h-full rounded-lg" />
                    <span className="absolute top-4 right-4 bg-white/95 text-stone-800 px-2 py-0.5 rounded text-[10px] font-bold shadow-sm border border-stone-100">
                      Lead Time: {product.lead_time_days || 7} days
                    </span>
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-sm font-bold text-stone-900 mb-1 line-clamp-2 hover:text-[#8B8068] cursor-pointer">{product.name}</h3>
                    
                    <div className="mt-2 mb-4">
                      <p className="text-xl font-black text-stone-900">{product.price} RWF <span className="text-[10px] font-normal text-stone-500">/ piece</span></p>
                      <p className="text-xs font-bold text-stone-500 mt-1">MOQ: {product.moq || 500} pieces</p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-stone-100">
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="w-3 h-3 rounded-full bg-[#A89F86]"></span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 line-clamp-1">{product.supplier}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/product/${product.id}`} className="flex-grow text-center bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-2 rounded text-xs transition">View Detail</Link>
                        <button className="flex-grow bg-[#8B8068] hover:bg-[#736A56] text-white font-bold py-2 rounded text-xs transition shadow-sm">Contact</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <footer className="bg-stone-900 text-stone-400 pt-16 pb-8 border-t border-stone-800 mt-auto">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-stone-800 pb-12 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#8B8068] rounded flex items-center justify-center text-white font-black text-lg">E</div>
              <span className="font-extrabold text-xl text-white tracking-tight">EcoPack Connect</span>
            </div>
            <p className="text-sm font-medium leading-relaxed max-w-sm mb-6">
              A Kira Capital venture dedicated to streamlining the sustainable packaging supply chain.
            </p>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
              <p>HQ: Kigali Logistics Hub, Rwanda</p>
            </div>
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
            <h4 className="text-white font-bold mb-4">Legal & Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#D6D0C4] transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#D6D0C4] transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#D6D0C4] transition">Supplier Verification</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs font-medium">
          <p>&copy; {new Date().getFullYear()} EcoPack Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}