"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { use } from "react";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from('products').select('*').eq('id', resolvedParams.id).single();
      if (data) setProduct(data);
      setIsLoading(false);
    };
    fetchProduct();
  }, [resolvedParams.id]);

  const handleBuyNow = () => {
    localStorage.setItem('ecopack_checkout_item', JSON.stringify(product));
    router.push("/checkout");
  };

  if (isLoading) return <div className="min-h-screen bg-[#f7f6f2] flex items-center justify-center font-bold text-stone-500">Loading Product Data...</div>;
  if (!product) return <div className="min-h-screen bg-[#f7f6f2] flex items-center justify-center font-bold text-stone-500">Product Not Found.</div>;

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans">
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 px-4 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm font-bold text-stone-500 hover:text-[#8B8068] transition">&larr; Back to Catalog</Link>
          <span className="font-extrabold text-xl text-stone-900 tracking-tight hidden sm:block">EcoPack</span>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-4 pt-8 pb-20">
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-[400px] md:h-[600px] bg-stone-100 p-4">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg border border-stone-200 shadow-sm" />
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
            <span className="inline-block px-3 py-1 bg-[#F0ECE3] text-[#5A5343] border border-[#D6D0C4] text-[10px] font-black uppercase tracking-wider rounded mb-4 w-fit">Verified Supplier</span>
            <h1 className="text-3xl font-extrabold text-stone-900 mb-2">{product.name}</h1>
            <p className="text-sm font-bold text-stone-500 mb-6 uppercase tracking-wider">{product.supplier}</p>
            
            <div className="bg-[#FAF9F7] border border-[#D6D0C4] p-6 rounded-xl mb-8">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Wholesale Price</p>
                  <p className="text-4xl font-black text-[#8B8068]">{product.price} <span className="text-sm font-bold text-stone-500">RWF / piece</span></p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-[#D6D0C4] pt-4 mt-4 text-sm font-medium text-stone-700">
                <div><span className="block text-[10px] text-stone-500 font-bold uppercase">Min. Order (MOQ)</span> {product.moq} pieces</div>
                <div><span className="block text-[10px] text-stone-500 font-bold uppercase">Production Time</span> {product.lead_time_days} Days</div>
                <div><span className="block text-[10px] text-stone-500 font-bold uppercase">Material</span> {product.material}</div>
                <div><span className="block text-[10px] text-stone-500 font-bold uppercase">In Stock</span> {product.stock_quantity} pieces</div>
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <button onClick={handleBuyNow} className="w-full bg-[#8B8068] hover:bg-[#736A56] text-white font-bold py-4 rounded-lg transition shadow-sm text-lg">
                Start Order
              </button>
              <button className="w-full bg-white border-2 border-stone-200 text-stone-900 hover:border-[#8B8068] hover:text-[#8B8068] font-bold py-4 rounded-lg transition text-lg">
                Contact Supplier (RFQ)
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}