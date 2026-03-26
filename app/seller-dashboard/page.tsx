"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function SellerDashboard() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [inventory, setInventory] = useState<any[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.user_metadata?.user_role !== 'seller') {
      router.push("/login"); // Kick out buyers and guests
    } else {
      setCompanyName(session.user.user_metadata?.company_name);
      fetchInventory(session.user.user_metadata?.company_name);
    }
  };

  const fetchInventory = async (company: string) => {
    // Only fetch products listed by THIS specific seller
    const { data } = await supabase.from('products').select('*').eq('supplier', company).order('created_at', { ascending: false });
    if (data) setInventory(data);
    setIsLoading(false);
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData(e.currentTarget);
    
    const newProduct = {
      name: formData.get('name'),
      material: formData.get('material'),
      supplier: companyName,
      price: Number(formData.get('price')),
      stock_quantity: Number(formData.get('stock')),
      bulk_target: Number(formData.get('target')),
      discount_percent: Number(formData.get('discount')), // The new custom discount!
      current_orders: 0
    };

    const { error } = await supabase.from('products').insert([newProduct]);
    setIsUploading(false);
    
    if (!error) {
      alert("Product live!");
      fetchInventory(companyName);
      (e.target as HTMLFormElement).reset();
    } else {
      alert("Error saving.");
    }
  };

  if (isLoading) return <div className="min-h-screen bg-stone-50 flex items-center justify-center font-bold text-stone-500">Authenticating Seller Portal...</div>;

  return (
    <div className="min-h-screen bg-stone-50 font-sans pb-20">
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-stone-400 hover:text-stone-900 transition font-bold text-sm flex items-center gap-1">
              &larr; <span className="hidden sm:block">Back to Market</span>
            </Link>
            <div className="h-6 w-px bg-stone-200 hidden sm:block"></div>
            <h1 className="text-lg font-bold text-stone-900 tracking-tight">Seller Hub</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">{companyName}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 pt-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-[2rem] shadow-sm border border-stone-200 h-fit">
          <h2 className="text-xl font-extrabold text-stone-900 mb-6">List Inventory</h2>
          <form onSubmit={handleUpload} className="space-y-4 text-sm">
            <div>
              <label className="block font-bold text-stone-700 mb-1.5">Product Name</label>
              <input type="text" name="name" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500" placeholder="e.g., Kraft Pouch" />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1.5">Material</label>
              <select name="material" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-700">
                <option>Recycled Kraft</option><option>Compostable PLA</option><option>HDPE Plastic</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">Price (RWF)</label>
                <input type="number" name="price" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl" placeholder="150" />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">Total Stock</label>
                <input type="number" name="stock" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl" placeholder="5000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">Target Qty</label>
                <input type="number" name="target" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl" placeholder="1000" />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">Discount %</label>
                <input type="number" name="discount" required max="100" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl" placeholder="20" />
              </div>
            </div>
            <button type="submit" disabled={isUploading} className="w-full mt-4 bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-stone-800 transition shadow-sm disabled:bg-stone-300">
              {isUploading ? "Uploading..." : "Publish to Market"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-stone-200">
          <h2 className="text-xl font-extrabold text-stone-900 border-b border-stone-100 pb-4 mb-6">Your Live Inventory</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 text-xs uppercase tracking-wider font-bold">
                  <th className="pb-4">Product</th>
                  <th className="pb-4">Price / Disc</th>
                  <th className="pb-4">Stock Left</th>
                  <th className="pb-4">Orders</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-stone-700">
                {inventory.map((item) => (
                  <tr key={item.id} className="border-b border-stone-50 hover:bg-stone-50">
                    <td className="py-5 font-bold text-stone-900">{item.name}</td>
                    <td className="py-5">{item.price} <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded ml-2">-{item.discount_percent}%</span></td>
                    <td className="py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.stock_quantity < 500 ? 'bg-red-100 text-red-700' : 'bg-stone-100'}`}>{item.stock_quantity}</span>
                    </td>
                    <td className="py-5 text-emerald-600 font-bold">+{item.current_orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}