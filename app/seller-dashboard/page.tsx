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

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.user_metadata?.user_role !== 'seller') {
      router.push("/login"); 
    } else {
      setCompanyName(session.user.user_metadata?.company_name);
      fetchInventory(session.user.user_metadata?.company_name);
    }
  };

  const fetchInventory = async (company: string) => {
    const { data } = await supabase.from('products').select('*').eq('supplier', company).order('created_at', { ascending: false });
    if (data) setInventory(data);
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData(e.currentTarget);
    
    const file = formData.get('imageFile') as File;
    let finalImageUrl = 'https://images.unsplash.com/photo-1605600659873-d808a1d85715?q=80&w=800&auto=format&fit=crop';

    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file);
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
        finalImageUrl = publicUrl;
      }
    }

    const newProduct = {
      name: formData.get('name'),
      category: formData.get('category'),
      supplier: companyName,
      material: formData.get('material'),
      price: Number(formData.get('price')),
      moq: Number(formData.get('moq')),
      lead_time_days: Number(formData.get('lead_time')),
      stock_quantity: Number(formData.get('stock')),
      bulk_target: Number(formData.get('target')),
      discount_percent: Number(formData.get('discount')),
      image_url: finalImageUrl, 
      current_orders: 0
    };

    const { error } = await supabase.from('products').insert([newProduct]);
    setIsUploading(false);
    
    if (!error) {
      alert("Product successfully listed on EcoPack Global.");
      fetchInventory(companyName);
      (e.target as HTMLFormElement).reset();
    } else {
      alert("Database Error.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans flex flex-col">
      <nav className="bg-stone-900 border-b border-stone-800 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-stone-400 hover:text-white transition font-bold text-sm flex items-center gap-1">
              &larr; <span className="hidden sm:block">Exit to Marketplace</span>
            </Link>
            <div className="h-6 w-px bg-stone-700 hidden sm:block"></div>
            <h1 className="text-lg font-bold text-white tracking-tight">EcoPack Supplier Center</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold bg-[#8B8068] text-white px-3 py-1.5 rounded shadow-sm">{companyName} (Verified)</span>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 pt-8 pb-20 grid xl:grid-cols-3 gap-6 flex-grow w-full">
        <div className="xl:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-stone-200 h-fit">
          <h2 className="text-lg font-extrabold text-stone-900 mb-1">Post a Product</h2>
          <p className="text-xs font-medium text-stone-500 mb-6 pb-4 border-b border-stone-100">Reach buyers across the EAC region.</p>
          
          <form onSubmit={handleUpload} className="space-y-4 text-sm">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Product Title</label>
              <input type="text" name="name" required className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded focus:ring-2 focus:ring-[#A89F86] outline-none" />
            </div>
            
            <div>
              <label className="block font-bold text-stone-700 mb-1">Product Image</label>
              <input type="file" name="imageFile" accept="image/*" className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded outline-none text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-[#F0ECE3] file:text-[#736A56] hover:file:bg-[#D6D0C4]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Category</label>
                <select name="category" className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded font-medium text-stone-700 outline-none">
                  <option>Corrugated Boxes</option><option>Flexible Pouches</option><option>Glass Bottles</option><option>Eco-Plastics</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Material</label>
                <input type="text" name="material" required className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded outline-none" placeholder="e.g., 3-Ply Kraft" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Price (RWF)</label>
                <input type="number" name="price" required className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded outline-none" />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Total Stock</label>
                <input type="number" name="stock" required className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-4 border-b border-stone-100">
              <div>
                <label className="block font-bold text-stone-700 mb-1">MOQ</label>
                <input type="number" name="moq" required className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded outline-none" placeholder="500" />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Lead Time</label>
                <input type="number" name="lead_time" required className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded outline-none" placeholder="7" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Pool Target</label>
                <input type="number" name="target" required className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded outline-none" placeholder="5000" />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Discount %</label>
                <input type="number" name="discount" required max="100" className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded outline-none" placeholder="20" />
              </div>
            </div>

            <button type="submit" disabled={isUploading} className="w-full mt-4 bg-[#8B8068] text-white font-bold py-3 rounded hover:bg-[#736A56] transition shadow-sm disabled:bg-stone-300">
              {isUploading ? "Processing..." : "Submit to Catalog"}
            </button>
          </form>
        </div>

        <div className="xl:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <h2 className="text-lg font-extrabold text-stone-900 border-b border-stone-100 pb-4 mb-4">Manage Products</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 text-[10px] uppercase tracking-wider font-bold">
                  <th className="pb-3">Product Info</th>
                  <th className="pb-3">Trade Details</th>
                  <th className="pb-3">Inventory</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-stone-700">
                {inventory.map((item) => (
                  <tr key={item.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                          <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-stone-900 line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-stone-500 uppercase mt-0.5">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="font-bold text-stone-900">{item.price} RWF</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">MOQ: {item.moq} | {item.lead_time_days} Days</p>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold border ${item.stock_quantity < item.moq ? 'bg-red-50 text-red-700 border-red-200' : 'bg-stone-50 border-stone-200'}`}>{item.stock_quantity} left</span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-[#8B8068] hover:underline text-xs font-bold">Edit</button>
                    </td>
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