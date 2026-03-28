// app/seller-dashboard/page.tsx
// ============================================================
// SUPPLIER SELLER DASHBOARD
//
// Features:
//   - KPI stats strip
//   - Add Product form with full validation
//   - Inventory data table with active/inactive toggle
//   - Delete listing
//   - All state is local (Demo Mode)
// ============================================================
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus, Package, TrendingUp, Eye, Users,
  ToggleLeft, ToggleRight, Trash2, Upload,
  CheckCircle2, X, ImageIcon, BarChart2, Leaf
} from "lucide-react";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, type Product } from "@/lib/mockData";
import { getProductImage } from "@/lib/imageHelper";
import StatCard from "@/components/StatCard";

type ProductForm = {
  title:         string; description:  string; category_id:    string;
  material:      string; price_per_unit:string; moq:           string;
  stock_quantity:string; lead_time_days:string; target_market: string;
  image_url:     string; tags:          string; eco_certifications: string;
};
const BLANK_FORM: ProductForm = {
  title:"", description:"", category_id:"", material:"",
  price_per_unit:"", moq:"", stock_quantity:"", lead_time_days:"14",
  target_market:"East Africa", image_url:"", tags:"", eco_certifications:"",
};

export default function SellerDashboardPage() {
  const [inventory, setInventory] = useState<Product[]>(
    MOCK_PRODUCTS.map((p) => ({ ...p,
      supplier: { id:"sup-demo", full_name:"Demo User", company_name:"My EcoPack Company", role:"supplier" as const, country:"Kenya", phone:null, avatar_url:null, verified:true, created_at:"", updated_at:"" }
    }))
  );
  const [showForm,   setShowForm]   = useState(false);
  const [form,       setForm]       = useState<ProductForm>(BLANK_FORM);
  const [errors,     setErrors]     = useState<Partial<ProductForm>>({});
  const [submitting, setSubmitting] = useState(false);
  const [toast,      setToast]      = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function f(k: keyof ProductForm, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<ProductForm> = {};
    if (!form.title.trim())         e.title         = "Title is required";
    if (!form.category_id)          e.category_id   = "Select a category";
    if (!form.price_per_unit || isNaN(Number(form.price_per_unit))) e.price_per_unit = "Valid price required";
    if (!form.moq || isNaN(Number(form.moq))) e.moq = "Valid MOQ required";
    if (!form.stock_quantity || isNaN(Number(form.stock_quantity))) e.stock_quantity = "Valid stock required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleAdd() {
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));

    const newProduct: Product = {
      id:              `prod-${Date.now()}`,
      supplier_id:     "sup-demo",
      category_id:     form.category_id,
      title:           form.title,
      description:     form.description,
      material:        form.material,
      price_per_unit:  parseFloat(form.price_per_unit),
      currency:        "USD",
      moq:             parseInt(form.moq),
      stock_quantity:  parseInt(form.stock_quantity),
      lead_time_days:  parseInt(form.lead_time_days) || 14,
      target_market:   form.target_market,
      image_url:       form.image_url || null,
      tags:            form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      eco_certifications: form.eco_certifications.split(",").map((t) => t.trim()).filter(Boolean),
      is_active:       true,
      is_featured:     false,
      view_count:      0,
      created_at:      new Date().toISOString(),
      updated_at:      new Date().toISOString(),
      category:        MOCK_CATEGORIES.find((c) => c.id === form.category_id),
      supplier:        { id:"sup-demo", full_name:"Demo User", company_name:"My EcoPack Company", role:"supplier", country:"Kenya", phone:null, avatar_url:null, verified:true, created_at:"", updated_at:"" },
    };

    setInventory((prev) => [newProduct, ...prev]);
    setForm(BLANK_FORM);
    setShowForm(false);
    setSubmitting(false);
    showToast("✅ Product listed successfully!");
  }

  function toggleActive(id: string) {
    setInventory((prev) => prev.map((p) => p.id === id ? { ...p, is_active: !p.is_active } : p));
  }

  function deleteProduct(id: string) {
    setInventory((prev) => prev.filter((p) => p.id !== id));
    showToast("Product removed from listings.");
  }

  const active   = inventory.filter((p) => p.is_active).length;
  const revenue  = inventory.reduce((s, p) => s + p.price_per_unit * p.stock_quantity * 0.01, 0);
  const views    = inventory.reduce((s, p) => s + p.view_count, 0);

  const inputCls = (err?: string) =>
    `w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all ${err ? "border-red-300 bg-red-50" : "border-stone-200"}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-[#2D6A4F] text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-slide-up">
          {toast}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D6A4F] bg-[#D8F3DC] px-3 py-1 rounded-full mb-2">
            <Leaf size={11} /> Demo Mode — My EcoPack Company
          </div>
          <h1 className="text-2xl font-bold text-stone-900" style={{fontFamily:"var(--font-display)"}}>
            Seller Dashboard
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">Manage your eco-packaging listings</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="text-sm border border-stone-200 text-stone-600 px-4 py-2.5 rounded-xl hover:bg-stone-50 transition-colors">
            View Storefront
          </Link>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
          >
            {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Product</>}
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Listings"  value={inventory.length.toString()} sub={`${active} active`}           icon={<Package size={16}/>}    accent="bg-[#D8F3DC]"   iconColor="text-[#2D6A4F]" />
        <StatCard label="Est. Revenue"    value={`$${(revenue/1000).toFixed(1)}k`} sub="Based on stock value"   icon={<TrendingUp size={16}/>} accent="bg-blue-50"     iconColor="text-blue-600" />
        <StatCard label="Product Views"   value={views > 1000 ? `${(views/1000).toFixed(1)}k` : views.toString()} sub="Total impressions"        icon={<Eye size={16}/>}        accent="bg-purple-50"  iconColor="text-purple-600" />
        <StatCard label="Trade Inquiries" value="143"  sub="38 awaiting reply"                                    icon={<Users size={16}/>}      accent="bg-orange-50"   iconColor="text-orange-600" />
      </div>

      {/* ── Add Product Form ── */}
      {showForm && (
        <div className="bg-white border border-[#2D6A4F]/30 rounded-2xl p-6 mb-8 shadow-sm animate-slide-up">
          <h2 className="font-bold text-stone-900 text-lg mb-5 flex items-center gap-2" style={{fontFamily:"var(--font-display)"}}>
            <Plus size={18} className="text-[#2D6A4F]" /> List New Eco Product
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Title */}
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">Product Title *</label>
              <input type="text" value={form.title} onChange={(e) => f("title", e.target.value)}
                placeholder="e.g. Compostable Kraft Paper Bags — Flat Bottom"
                className={inputCls(errors.title)}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">Category *</label>
              <select value={form.category_id} onChange={(e) => f("category_id", e.target.value)}
                className={`${inputCls(errors.category_id)} bg-white`}
              >
                <option value="">Select category</option>
                {MOCK_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id}</p>}
            </div>

            {/* Description */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => f("description", e.target.value)}
                placeholder="Detailed product specs, certifications, use cases..."
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] resize-none transition-all"
              />
            </div>

            {/* Material */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">Material / Grade</label>
              <input type="text" value={form.material} onChange={(e) => f("material", e.target.value)}
                placeholder="e.g. FSC Kraft Paper + PLA lining"
                className={inputCls()}
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">Price / Unit (USD) *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">$</span>
                <input type="number" step="0.01" min="0" value={form.price_per_unit} onChange={(e) => f("price_per_unit", e.target.value)}
                  placeholder="0.00"
                  className={`${inputCls(errors.price_per_unit)} pl-8`}
                />
              </div>
              {errors.price_per_unit && <p className="text-xs text-red-500 mt-1">{errors.price_per_unit}</p>}
            </div>

            {/* MOQ */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">MOQ (units) *</label>
              <input type="number" min="1" value={form.moq} onChange={(e) => f("moq", e.target.value)}
                placeholder="1000"
                className={inputCls(errors.moq)}
              />
              {errors.moq && <p className="text-xs text-red-500 mt-1">{errors.moq}</p>}
            </div>

            {/* Stock */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">Stock Available *</label>
              <input type="number" min="0" value={form.stock_quantity} onChange={(e) => f("stock_quantity", e.target.value)}
                placeholder="50000"
                className={inputCls(errors.stock_quantity)}
              />
              {errors.stock_quantity && <p className="text-xs text-red-500 mt-1">{errors.stock_quantity}</p>}
            </div>

            {/* Lead Time */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">Lead Time (days)</label>
              <input type="number" min="1" value={form.lead_time_days} onChange={(e) => f("lead_time_days", e.target.value)}
                placeholder="14"
                className={inputCls()}
              />
            </div>

            {/* Target Market */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">Target Market</label>
              <input type="text" value={form.target_market} onChange={(e) => f("target_market", e.target.value)}
                placeholder="East Africa, EU"
                className={inputCls()}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">Tags (comma-separated)</label>
              <input type="text" value={form.tags} onChange={(e) => f("tags", e.target.value)}
                placeholder="kraft, compostable, food-safe"
                className={inputCls()}
              />
            </div>

            {/* Eco Certifications */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">Eco Certifications</label>
              <input type="text" value={form.eco_certifications} onChange={(e) => f("eco_certifications", e.target.value)}
                placeholder="FSC Certified, OK Compost HOME"
                className={inputCls()}
              />
            </div>

            {/* Image URL */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">
                Product Image URL <span className="normal-case font-normal text-stone-300">(leave blank for auto)</span>
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <ImageIcon size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input type="url" value={form.image_url} onChange={(e) => f("image_url", e.target.value)}
                    placeholder="https://images.unsplash.com/... or leave blank"
                    className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all"
                  />
                </div>
                {form.image_url && (
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-stone-200 flex-shrink-0">
                    <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 pt-5 border-t border-stone-100">
            <button onClick={handleAdd} disabled={submitting}
              className="flex items-center gap-2 bg-[#2D6A4F] hover:bg-[#1B4332] disabled:bg-stone-300 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> : <Upload size={14}/>}
              {submitting ? "Publishing..." : "Publish Listing"}
            </button>
            <button onClick={() => { setForm(BLANK_FORM); setErrors({}); }} className="text-sm text-stone-400 hover:text-stone-600 transition-colors">
              Reset
            </button>
          </div>
        </div>
      )}

      {/* ── Inventory Table ── */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="font-bold text-stone-900 flex items-center gap-2" style={{fontFamily:"var(--font-display)"}}>
            <BarChart2 size={16} className="text-[#2D6A4F]" /> Active Inventory
            <span className="text-xs font-normal text-stone-400">({inventory.length} listings)</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">Product</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-stone-400 hidden md:table-cell">Category</th>
                <th className="text-right px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">Price</th>
                <th className="text-right px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-stone-400 hidden sm:table-cell">MOQ</th>
                <th className="text-right px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-stone-400 hidden lg:table-cell">Stock</th>
                <th className="text-center px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">Status</th>
                <th className="text-center px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {inventory.map((p) => {
                const img = getProductImage(p.image_url, p.title, p.tags);
                return (
                  <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#D8F3DC] flex-shrink-0">
                          <img src={img} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-stone-900 truncate max-w-[160px]">{p.title}</p>
                          <p className="text-xs text-stone-400 truncate max-w-[160px]">{p.material || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-xs bg-[#D8F3DC] text-[#1B4332] px-2.5 py-1 rounded-full font-medium">
                        {p.category?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-stone-900">
                      ${p.price_per_unit.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-right text-stone-600 hidden sm:table-cell">
                      {p.moq.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right hidden lg:table-cell">
                      <span className={`text-xs font-semibold ${p.stock_quantity < 1000 ? "text-red-500" : "text-stone-600"}`}>
                        {p.stock_quantity.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button onClick={() => toggleActive(p.id)} className="flex items-center justify-center mx-auto">
                        {p.is_active
                          ? <><ToggleRight size={24} className="text-[#2D6A4F]" /></>
                          : <><ToggleLeft size={24} className="text-stone-300" /></>
                        }
                      </button>
                      <p className={`text-[10px] mt-0.5 ${p.is_active ? "text-[#2D6A4F]" : "text-stone-400"}`}>
                        {p.is_active ? "Active" : "Inactive"}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/product/${p.id}`}
                          className="p-1.5 rounded-lg hover:bg-[#D8F3DC] text-stone-500 hover:text-[#2D6A4F] transition-colors"
                          title="View"
                        >
                          <Eye size={15} />
                        </Link>
                        <button onClick={() => deleteProduct(p.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {inventory.length === 0 && (
          <div className="text-center py-16">
            <Package size={32} className="text-stone-300 mx-auto mb-3" />
            <p className="font-semibold text-stone-500">No listings yet</p>
            <p className="text-sm text-stone-400 mt-1">Click &quot;Add Product&quot; to publish your first listing.</p>
          </div>
        )}
      </div>
    </div>
  );
}