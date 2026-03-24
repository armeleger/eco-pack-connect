"use client";

import { useState } from "react";
import Link from "next/link";

export default function Tracker() {
  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulating the scanQRCode() method from your Class Diagram
    setTimeout(() => {
      setResult({
        id: trackingId || "ECO-84729",
        product: "Corrugated Tomato Box",
        status: "Recycled",
        purchaseDate: "2026-02-15",
        recycleDate: "2026-03-20",
        location: "Kigali Processing Center"
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-green-700">QR Lifecycle Tracker</h2>
          <p className="text-gray-600 mt-2">Enter the code on your packaging to trace its journey.</p>
        </div>

        <form onSubmit={handleScan} className="space-y-4">
          <input 
            type="text" 
            placeholder="Enter Tracking ID (e.g., ECO-84729)" 
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            required
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-700 transition"
          >
            {isLoading ? "Scanning Database..." : "Track Packaging"}
          </button>
        </form>

        {result && (
          <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-gray-900">{result.product}</span>
              <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold uppercase">
                {result.status}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Tracking ID:</strong> {result.id}</p>
              <p><strong>Purchased:</strong> {result.purchaseDate}</p>
              <p><strong>Recycled On:</strong> {result.recycleDate}</p>
              <p><strong>Location:</strong> {result.location}</p>
            </div>
            <div className="mt-6 text-center">
              <Link href="/dashboard" className="text-green-600 font-medium hover:underline">
                &larr; Back to Marketplace
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}