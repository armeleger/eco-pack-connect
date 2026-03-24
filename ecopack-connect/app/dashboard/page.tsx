"use client";

import { useState } from "react";
import Link from "next/link";

// Mock data to simulate the database
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Eco-Friendly Corrugated Tomato Box",
    material: "100% Recycled Kraft Paper",
    basePrice: 450, // RWF
    bulkTarget: 1000,
    currentOrders: 850, // 85% full!
    discount: "20%",
  },
  {
    id: 2,
    name: "Biodegradable Coffee Pouches (500g)",
    material: "Compostable PLA",
    basePrice: 120, // RWF
    bulkTarget: 5000,
    currentOrders: 1200, // 24% full
    discount: "15%",
  },
  {
    id: 3,
    name: "Reusable Crate (Standard)",
    material: "Recycled HDPE Plastic",
    basePrice: 3500, // RWF
    bulkTarget: 500,
    currentOrders: 490, // almost there
    discount: "25%",
  }
];

export default function Dashboard() {
  const [addedItems, setAddedItems] = useState<number[]>([]);

  const handleJoinBulkOrder = (id: number) => {
    setAddedItems([...addedItems, id]);
    // In a real app, this would send an API request to the Bulk Aggregation Engine
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-green-700 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide">EcoPack Connect</h1>
          <div className="space-x-4">
            <Link href="/tracker" className="hover:text-green-200 font-medium">QR Tracker</Link>
            <Link href="/" className="bg-white text-green-700 px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-100">Sign Out</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Active Bulk Aggregations</h2>
          <p className="mt-2 text-gray-600">Join pending orders from other agro-cooperatives to unlock wholesale discounts.</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PRODUCTS.map((product) => {
            const progressPercentage = (product.currentOrders / product.bulkTarget) * 100;
            const isAdded = addedItems.includes(product.id);

            return (
              <div key={product.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col">
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">Material: {product.material}</p>
                  
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Base Price</p>
                      <p className="text-lg font-bold text-gray-900">{product.basePrice} RWF</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-green-600 uppercase tracking-wider font-semibold">Target Discount</p>
                      <p className="text-lg font-bold text-green-600">-{product.discount}</p>
                    </div>
                  </div>

                  {/* Aggregation Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span className="text-gray-700">{product.currentOrders} ordered</span>
                      <span className="text-gray-500">Goal: {product.bulkTarget}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Only {product.bulkTarget - product.currentOrders} more units needed!
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <button 
                    onClick={() => handleJoinBulkOrder(product.id)}
                    disabled={isAdded}
                    className={`w-full py-2 px-4 rounded-md text-sm font-bold transition-colors ${
                      isAdded 
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed" 
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {isAdded ? "Added to Cart ✓" : "Join Bulk Order"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}