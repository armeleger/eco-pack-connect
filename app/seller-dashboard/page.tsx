"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function SellerDashboard() {
  const [isUploading, setIsUploading] = useState(false);
  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setInventory(data);
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData(e.currentTarget);
    
    const newProduct = {
      name: formData.get('name'),
      material: formData.get('material'),
      supplier: "Kira Capital Manufacturing",
      price: Number(formData.get('price')),
      stock_quantity: Number(formData.get('stock')),
      bulk_target: Number(formData.get('target')),
      current_orders: 0
    };

    const { error } = await supabase.from('products').insert([newProduct]);
    setIsUploading(false);
    
    if (!error) {
      alert("Success! Product is now live on the marketplace.");
      fetchInventory();
      (e.target as HTMLFormElement).reset();
    } else {
      alert("Error uploading product.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans pb-20">
      <nav className="bg-white/80 backdrop-blur-xl border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-600 rounded-2xl shadow-md flex items-center justify-center text-white font-extrabold text-xl">E</div>
            <h1 className="text-xl font-bold tracking-tight text-stone-900">EcoPack <span className="text-stone-400 font-medium">| Seller Hub</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-200 uppercase tracking-wider">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Verified
            </span>
            <Link href="/" className="hover:text-amber-600 text-sm font-bold text-stone-500">Log Out</Link>
          </div>
        </div>
      </nav>

      <div className="bg-stone-900 border-b border-stone-800 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-extrabold text-white">Welcome back, Partner.</h1>
          <p className="text-stone-400 mt-1 font-medium">Manage your live database inventory below.</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 h-fit">
          <h2 className="text-xl font-extrabold text-stone-900 mb-6">List New Product</h2>
          <form onSubmit={handleUpload} className="space-y-4 text-sm">
            <div>
              <label className="block font-bold text-stone-700 mb-1.5">Product Name</label>
              <input type="text" name="name" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500" placeholder="e.g., Kraft Pouch" />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1.5">Material</label>
              <select name="material" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-stone-700">
                <option>Recycled Kraft Paper</option>
                <option>Compostable PLA</option>
                <option>Recycled HDPE Plastic</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">Price (RWF)</label>
                <input type="number" name="price" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500" placeholder="150" />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">Stock Qty</label>
                <input type="number" name="stock" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500" placeholder="5000" />
              </div>
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1.5">Discount Target</label>
              <input type="number" name="target" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500" placeholder="e.g., 1000 units" />
            </div>
            <button type="submit" disabled={isUploading} className="w-full mt-4 bg-amber-600 text-white font-bold py-4 rounded-xl hover:bg-amber-700 transition shadow-sm disabled:bg-stone-300">
              {isUploading ? "Uploading..." : "Publish to Marketplace"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
          <h2 className="text-xl font-extrabold text-stone-900 border-b border-stone-100 pb-4 mb-6">Live Cloud Inventory</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 text-xs uppercase tracking-wider font-bold">
                  <th className="pb-4">Product</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4">Stock</th>
                  <th className="pb-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {inventory.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center text-stone-400">No products uploaded yet.</td></tr>
                ) : (
                  inventory.map((item) => (
                    <tr key={item.id} className="border-b border-stone-50 hover:bg-stone-50">
                      <td className="py-5 text-stone-900 font-bold">{item.name}</td>
                      <td className="py-5 text-stone-500">{item.price} RWF</td>
                      <td className="py-5"><span className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-xs font-bold">{item.stock_quantity}</span></td>
                      <td className="py-5 text-right"><span className="text-amber-600 font-bold cursor-pointer hover:underline">Manage</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}