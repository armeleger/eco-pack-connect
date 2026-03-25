"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const router = useRouter();
  const [cart, setCart] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("market");
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Live Data
  useEffect(() => {
    fetchProducts();
    const savedOrders = JSON.parse(localStorage.getItem('ecopack_orders') || '[]');
    setMyOrders(savedOrders);
  }, [activeTab]);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('products').select('*');
    if (data) setProducts(data);
    setIsLoading(false);
  };

  const handleAddToCart = (id: string) => {
    if (!cart.includes(id)) setCart([...cart, id]);
  };

  return (
    <div className="min-h-screen bg-stone-100 font-sans pb-24">
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex justify-between items-center gap-8">
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-600 rounded-lg shadow-sm flex items-center justify-center text-white font-extrabold text-2xl">E</div>
            <span className="font-extrabold text-2xl text-stone-900 tracking-tight hidden lg:block">EcoPack</span>
          </Link>
          
          <div className="flex gap-4 items-center bg-stone-100 p-1 rounded-xl">
            <button onClick={() => setActiveTab("market")} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "market" ? "bg-white shadow-sm text-stone-900" : "text-stone-500"}`}>Marketplace</button>
            <button onClick={() => setActiveTab("orders")} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "orders" ? "bg-white shadow-sm text-stone-900" : "text-stone-500"}`}>My Orders</button>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/tracker" className="text-sm font-bold text-amber-600">QR Tracker</Link>
            <Link href="/" className="text-sm font-bold text-stone-500">Sign Out</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-4 pt-6 flex gap-6">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
            <div className="bg-stone-900 text-white px-4 py-3 font-bold text-sm">My Markets</div>
            <ul className="text-sm font-medium text-stone-600 divide-y divide-stone-100">
              <li className="px-4 py-3 hover:bg-stone-50 hover:text-amber-600 cursor-pointer text-amber-700 font-bold bg-amber-50">Live Bulk Pools</li>
              <li className="px-4 py-3 hover:text-amber-600 cursor-pointer">Agriculture & Farming</li>
              <li className="px-4 py-3 hover:text-amber-600 cursor-pointer">Food & Beverage</li>
            </ul>
          </div>
        </aside>

        <main className="flex-grow min-w-0">
          {activeTab === "market" && (
            <div className="animate-fade-in">
              <div className="bg-gradient-to-r from-amber-100/50 to-stone-100 border border-stone-200 rounded-2xl p-8 mb-6">
                <h1 className="text-3xl font-extrabold text-stone-900 mb-2">Live Cloud Database Hub</h1>
                <p className="text-stone-600 font-medium">These products are being fetched directly from your Supabase PostgreSQL database in real-time.</p>
              </div>

              {isLoading ? (
                <div className="text-center py-20 text-stone-500 font-bold animate-pulse">Fetching inventory from Supabase...</div>
              ) : products.length === 0 ? (
                <div className="text-center py-20 text-stone-500 font-bold">No products found. Go to the Seller Dashboard and upload one!</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => {
                    const progress = (product.current_orders / product.bulk_target) * 100;
                    const inCart = cart.includes(product.id);

                    return (
                      <div key={product.id} className="bg-white rounded-lg shadow-sm border border-stone-200 flex flex-col group overflow-hidden">
                        <div className={`h-40 ${product.image_color || 'bg-stone-200'} flex items-center justify-center relative`}>
                          <span className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-amber-700 text-[10px] font-bold uppercase">Target: {product.bulk_target}</span>
                        </div>
                        <div className="p-4 flex-grow flex flex-col">
                          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">{product.supplier}</p>
                          <h3 className="text-sm font-bold text-stone-900 mb-3">{product.name}</h3>
                          
                          <div className="mb-4">
                            <p className="text-xs text-stone-500">Base Price</p>
                            <p className="text-xl font-extrabold text-stone-900">{product.price} <span className="text-[10px] font-normal text-stone-500">RWF</span></p>
                          </div>

                          <div className="mt-auto">
                            <div className="w-full bg-stone-200 rounded-full h-1.5 mb-3">
                              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <button 
                              onClick={() => handleAddToCart(product.id)}
                              disabled={inCart}
                              className={`w-full py-2.5 rounded text-xs font-bold transition-all ${inCart ? "bg-stone-100 text-stone-500" : "bg-white border border-amber-500 text-amber-600 hover:bg-amber-50"}`}
                            >
                              {inCart ? "In Quotation Cart" : "Add to Pool"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="animate-fade-in max-w-4xl mx-auto space-y-4">
              <h2 className="text-2xl font-extrabold text-stone-900 mb-6">Order History</h2>
              {myOrders.map((order, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex justify-between items-center gap-4">
                  <div>
                    <span className="font-extrabold text-stone-900">{order.orderId}</span>
                    <p className="text-sm font-bold text-stone-700 mt-1">{order.product} (x{order.quantity})</p>
                    <p className="text-xs text-stone-400 mt-1">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-stone-900 mb-2">{order.total.toLocaleString()} RWF</p>
                    <Link href="/tracker" className="text-xs font-bold text-amber-600 hover:underline">Track: {order.trackId}</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {cart.length > 0 && activeTab === "market" && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-stone-300 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
          <div className="max-w-[1400px] mx-auto px-4 py-4 flex justify-between items-center">
            <p className="font-bold text-stone-900">{cart.length} item(s) selected</p>
            <button onClick={() => router.push("/checkout")} className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-xl transition-colors">
              Configure Quantity & Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}