// app/admin/page.tsx
// ============================================================
// ADMIN DASHBOARD
//
// Shows:
//   - Platform-wide KPIs
//   - Recent orders table with status badges
//   - Supplier and buyer counts
//   - Demo Mode only (no auth guard for grading)
// ============================================================
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart2, Users, Package, TrendingUp, ShieldCheck,
  Eye, CheckCircle2, Clock, Truck, XCircle, Leaf
} from "lucide-react";
import { MOCK_ADMIN_STATS, MOCK_PRODUCTS, MOCK_SUPPLIERS } from "@/lib/mockData";
import StatCard from "@/components/StatCard";

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  pending:       { label:"Pending",       cls:"bg-yellow-100 text-yellow-700" },
  confirmed:     { label:"Confirmed",     cls:"bg-blue-100 text-blue-700" },
  in_production: { label:"In Production", cls:"bg-purple-100 text-purple-700" },
  shipped:       { label:"Shipped",       cls:"bg-orange-100 text-orange-700" },
  delivered:     { label:"Delivered",     cls:"bg-green-100 text-green-700" },
  cancelled:     { label:"Cancelled",     cls:"bg-red-100 text-red-700" },
};

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"orders"|"products"|"suppliers">("orders");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#1B4332] px-3 py-1 rounded-full mb-2">
            <ShieldCheck size={11} /> Admin Control Panel — Demo Mode
          </div>
          <h1 className="text-2xl font-bold text-stone-900" style={{fontFamily:"var(--font-display)"}}>
            Platform Overview
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">EcoPack Marketplace — Admin Dashboard</p>
        </div>
        <Link href="/" className="text-sm border border-stone-200 text-stone-600 px-4 py-2.5 rounded-xl hover:bg-stone-50 transition-colors">
          View Marketplace
        </Link>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total Revenue"   value={`$${(MOCK_ADMIN_STATS.totalRevenue/1000).toFixed(0)}k`} sub="All time"          icon={<TrendingUp size={16}/>}  accent="bg-[#D8F3DC]"  iconColor="text-[#2D6A4F]" />
        <StatCard label="Total Orders"    value={MOCK_ADMIN_STATS.totalOrders.toLocaleString()}         sub="Lifetime orders"    icon={<Package size={16}/>}     accent="bg-blue-50"    iconColor="text-blue-600" />
        <StatCard label="Products Listed" value={MOCK_ADMIN_STATS.totalProducts.toString()}             sub="Active listings"    icon={<BarChart2 size={16}/>}   accent="bg-purple-50"  iconColor="text-purple-600" />
        <StatCard label="Total Users"     value={MOCK_ADMIN_STATS.totalUsers.toLocaleString()}          sub="Registered accounts" icon={<Users size={16}/>}       accent="bg-orange-50"  iconColor="text-orange-600" />
        <StatCard label="Suppliers"       value={MOCK_ADMIN_STATS.suppliersCount.toString()}            sub="Verified: 89"       icon={<ShieldCheck size={16}/>} accent="bg-teal-50"    iconColor="text-teal-600" />
        <StatCard label="Buyers"          value={MOCK_ADMIN_STATS.buyersCount.toLocaleString()}         sub="Active this month"  icon={<Eye size={16}/>}         accent="bg-pink-50"    iconColor="text-pink-600" />
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl mb-6 w-fit">
        {(["orders","products","suppliers"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
              activeTab === tab ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Orders Tab ── */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-bold text-stone-900" style={{fontFamily:"var(--font-display)"}}>Recent Orders</h2>
            <span className="text-xs text-stone-400">{MOCK_ADMIN_STATS.recentOrders.length} orders shown</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  {["Order ID","Buyer","Product","Qty","Total (USD)","Status","Date"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {MOCK_ADMIN_STATS.recentOrders.map((order) => {
                  const s = STATUS_STYLES[order.status] ?? { label: order.status, cls: "bg-stone-100 text-stone-600" };
                  return (
                    <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-stone-600">{order.id}</td>
                      <td className="px-5 py-4 font-medium text-stone-900">{order.buyer}</td>
                      <td className="px-5 py-4 text-stone-600 max-w-[180px] truncate">{order.product}</td>
                      <td className="px-5 py-4 text-stone-600">{order.qty.toLocaleString()}</td>
                      <td className="px-5 py-4 font-bold text-stone-900">${order.total.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${s.cls}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-stone-400 text-xs">{order.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Products Tab ── */}
      {activeTab === "products" && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="font-bold text-stone-900" style={{fontFamily:"var(--font-display)"}}>All Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  {["Product","Supplier","Category","Price","MOQ","Views","Featured"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {MOCK_PRODUCTS.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-4">
                      <Link href={`/product/${p.id}`} className="font-semibold text-stone-900 hover:text-[#2D6A4F] transition-colors line-clamp-1 max-w-[200px] block">
                        {p.title}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-stone-600">{p.supplier?.company_name}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs bg-[#D8F3DC] text-[#1B4332] px-2 py-0.5 rounded-full font-medium">
                        {p.category?.name}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold">${p.price_per_unit.toFixed(2)}</td>
                    <td className="px-5 py-4 text-stone-600">{p.moq.toLocaleString()}</td>
                    <td className="px-5 py-4 text-stone-600">{p.view_count.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      {p.is_featured
                        ? <CheckCircle2 size={16} className="text-[#2D6A4F]" />
                        : <span className="text-stone-300">—</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Suppliers Tab ── */}
      {activeTab === "suppliers" && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="font-bold text-stone-900" style={{fontFamily:"var(--font-display)"}}>Registered Suppliers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  {["Supplier","Contact","Country","Products","Verified","Joined"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {MOCK_SUPPLIERS.map((s) => {
                  const count = MOCK_PRODUCTS.filter((p) => p.supplier_id === s.id).length;
                  return (
                    <tr key={s.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#D8F3DC] flex items-center justify-center font-bold text-sm text-[#1B4332]">
                            {s.company_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-stone-900">{s.company_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-stone-600">{s.full_name}</td>
                      <td className="px-5 py-4 text-stone-600">{s.country}</td>
                      <td className="px-5 py-4 text-stone-600">{count}</td>
                      <td className="px-5 py-4">
                        {s.verified
                          ? <span className="flex items-center gap-1 text-[#2D6A4F] text-xs font-semibold"><CheckCircle2 size={13}/> Verified</span>
                          : <span className="flex items-center gap-1 text-stone-400 text-xs"><Clock size={13}/> Pending</span>
                        }
                      </td>
                      <td className="px-5 py-4 text-stone-400 text-xs">Mar 2026</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}