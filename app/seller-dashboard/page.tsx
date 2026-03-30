"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, PackagePlus, ArrowLeft, Image as ImageIcon, Box, Lock } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function SellerDashboard() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [inventory, setInventory] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUserAndFetchInventory();
  }, []);

  const checkUserAndFetchInventory = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Block unauthorized users
    if (!session || session.user.user_metadata?.user_role !== "supplier") {
      setIsLoading(false);
      return; 
    }

    setUser(session.user);
    const company = session.user.user_metadata?.company_name || "EcoPack Supplier";
    setCompanyName(company);

    // Fetch this specific seller's inventory from Supabase
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('supplier', company)
      .order('created_at', { ascending: false });
      
    if (data) setInventory(data);
    setIsLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
    else setImagePreview(null);
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    
    const formData = new FormData(e.currentTarget);
    const file = formData.get('imageFile') as File;
    
    let finalImageUrl = "https://images.unsplash.com/photo-1530968831187-a937baadb39b?w=800&q=80"; // Fallback

    // 1. Upload Image to Cloudinary (if file exists)
    if (file && file.size > 0) {
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', file);
      cloudinaryFormData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: cloudinaryFormData,
        });
        const cloudData = await res.json();
        if (cloudData.secure_url) {
          finalImageUrl = cloudData.secure_url;
        }
      } catch (error) {
        console.error("Cloudinary upload failed", error);
        alert("Image upload failed, but saving product with default image.");
      }
    }

    // 2. Save Data to Supabase Database
    const newProduct = {
      title: formData.get('title'),
      category_id: formData.get('category'), // Ensure your DB handles this text or maps to an ID
      supplier: companyName,
      material: formData.get('material'),
      price_per_unit: Number(formData.get('price')),
      moq: Number(formData.get('moq')),
      lead_time_days: Number(formData.get('lead_time')),
      stock_quantity: Number(formData.get('stock')),
      image_url: finalImageUrl,
      eco_certifications: ["Eco-Friendly"], // Default tag
      tags: ["Sustainable", "B2B"],
    };

    const { error } = await supabase.from('products').insert([newProduct]);

    setIsUploading(false);

    if (!error) {
      alert("Product successfully published to the EcoPack catalog!");
      setImagePreview(null);
      (e.target as HTMLFormElement).reset();
      // Refresh inventory table
      checkUserAndFetchInventory();
    } else {
      alert("Database error. Could not save product.");
      console.error(error);
    }
  };

  // Auth Lock UI
  if (isLoading) return <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center font-bold text-[#2D6A4F]">Verifying Supplier Credentials...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-lg border border-stone-200 text-center">
          <div className="w-16 h-16 bg-[#F8FAF9] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
            <Lock size={28} className="text-[#2D6A4F]" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2" style={{fontFamily:"var(--font-display)"}}>Supplier Access Denied</h2>
          <p className="text-stone-500 font-medium mb-8 text-sm">You must be logged into a verified Supplier account to manage inventory.</p>
          <Link href="/login" className="block w-full bg-[#2D6A4F] text-white font-bold py-4 rounded-xl hover:bg-[#1B4332] transition-colors shadow-sm text-sm">
            Log In as Supplier
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] font-sans flex flex-col">
      <nav className="bg-[#1B4332] sticky top-0 z-50 shadow-md">
        <div className="max-w-[1400px] mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#95D5B2] hover:text-white transition-colors font-semibold text-sm flex items-center gap-1.5">
              <ArrowLeft size={16} /> <span className="hidden sm:block">Exit to Marketplace</span>
            </Link>
            <div className="h-6 w-px bg-[#2D6A4F] hidden sm:block"></div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2" style={{fontFamily:"var(--font-display)"}}>
              <LayoutDashboard size={18} className="text-[#95D5B2]"/> Supplier Portal
            </h1>
          </div>
          <div className="text-[10px] font-bold bg-[#2D6A4F] text-white px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest border border-[#3D8A5F]">
            {companyName}
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 pt-8 pb-20 grid xl:grid-cols-3 gap-8 flex-grow w-full">
        {/* Left: Upload Form */}
        <div className="xl:col-span-1 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200 h-fit">
          <h2 className="text-xl font-bold text-stone-900 mb-1 flex items-center gap-2" style={{fontFamily:"var(--font-display)"}}>
            <PackagePlus size={20} className="text-[#2D6A4F]" /> List a Product
          </h2>
          <p className="text-xs font-medium text-stone-500 mb-6 pb-6 border-b border-stone-100">Add a new item to your B2B catalog.</p>
          
          <form onSubmit={handleUpload} className="space-y-5 text-sm">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">Product Title</label>
              <input type="text" name="title" required className="w-full px-4 py-3 bg-[#F8FAF9] border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#95D5B2] focus:border-[#2D6A4F] outline-none transition-all font-semibold text-stone-900" placeholder="e.g., Heavy Duty Kraft Pouch" />
            </div>
            
            <div className="bg-[#F8FAF9] border-2 border-stone-200 border-dashed rounded-xl p-5 text-center hover:border-[#2D6A4F] transition-colors group">
              {imagePreview ? (
                <div className="mb-3 relative w-full h-32 rounded-lg overflow-hidden border border-stone-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                 <div className="w-12 h-12 bg-white text-[#2D6A4F] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-stone-100 group-hover:scale-110 transition-transform">
                  <ImageIcon size={20} />
                </div>
              )}
              <label className="block text-xs font-bold text-[#2D6A4F] cursor-pointer hover:underline">
                {imagePreview ? "Change Image" : "Upload Product Image"}
                <input type="file" name="imageFile" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">Category</label>
                <select name="category" className="w-full px-4 py-3 bg-[#F8FAF9] border border-stone-200 rounded-xl font-semibold text-stone-900 outline-none focus:ring-2 focus:ring-[#95D5B2]">
                  <option value="boxes-cartons">Corrugated Boxes</option>
                  <option value="bags-pouches">Flexible Pouches</option>
                  <option value="bottles-containers">Glass Bottles</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">Material</label>
                <input type="text" name="material" required className="w-full px-4 py-3 bg-[#F8FAF9] border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-[#95D5B2] font-semibold text-stone-900" placeholder="e.g. Bamboo" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">Price (RWF)</label>
                <input type="number" name="price" required className="w-full px-4 py-3 bg-[#F8FAF9] border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-[#95D5B2] font-semibold text-stone-900" placeholder="500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">Total Stock</label>
                <input type="number" name="stock" required className="w-full px-4 py-3 bg-[#F8FAF9] border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-[#95D5B2] font-semibold text-stone-900" placeholder="10000" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-stone-100 pt-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">Min. Order (MOQ)</label>
                <input type="number" name="moq" required className="w-full px-4 py-3 bg-[#F8FAF9] border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-[#95D5B2] font-semibold text-stone-900" placeholder="1000" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">Lead Time (Days)</label>
                <input type="number" name="lead_time" required className="w-full px-4 py-3 bg-[#F8FAF9] border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-[#95D5B2] font-semibold text-stone-900" placeholder="14" />
              </div>
            </div>

            <button type="submit" disabled={isUploading} className="w-full mt-2 bg-[#2D6A4F] text-white font-bold py-4 rounded-xl hover:bg-[#1B4332] transition-colors shadow-sm disabled:bg-stone-300">
              {isUploading ? "Processing Upload..." : "Publish to Catalog"}
            </button>
          </form>
        </div>

        {/* Right: Inventory Table */}
        <div className="xl:col-span-2 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200 h-fit">
          <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2" style={{fontFamily:"var(--font-display)"}}>
            <Box size={20} className="text-[#2D6A4F]" /> Active Inventory
          </h2>
          <div className="overflow-x-auto">
            {inventory.length === 0 ? (
               <div className="text-center py-10 text-stone-500 text-sm font-medium border-t border-stone-100">
                  No products listed yet. Your inventory will appear here.
               </div>
            ) : (
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-stone-100 text-stone-400 text-[10px] uppercase tracking-widest font-bold">
                    <th className="pb-4 pl-2">Product Info</th>
                    <th className="pb-4">Trade Details</th>
                    <th className="pb-4 pr-2 text-right">Inventory</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium text-stone-700">
                  {inventory.map((item) => (
                    <tr key={item.id} className="border-b border-stone-50 hover:bg-[#F8FAF9] transition-colors">
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-stone-900 line-clamp-1 text-sm">{item.title}</p>
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">{item.category_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <p className="font-bold text-stone-900">{item.price_per_unit?.toLocaleString()} RWF</p>
                        <p className="text-xs text-stone-500 mt-1">MOQ: {item.moq?.toLocaleString()}</p>
                      </td>
                      <td className="py-4 pr-2 text-right">
                        <span className={`inline-block px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${item.stock_quantity < item.moq ? 'bg-red-50 text-red-700 border-red-200' : 'bg-[#E8F5E9] text-[#1B4332] border-[#D8F3DC]'}`}>
                          {item.stock_quantity?.toLocaleString()} left
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}