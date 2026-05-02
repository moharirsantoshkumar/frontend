"use client";

import { useEffect, useState } from "react";

export default function ResultsPage() {

  const [result, setResult] = useState(null);

  const [filters, setFilters] = useState({
    priceRange: [0, 100000]   // safe default
  });

  const prices = Array.isArray(result) ? result.map(r => r.price) : [];

  const minAvailablePrice = prices.length ? Math.min(...prices) : 0;
  const maxAvailablePrice = prices.length ? Math.max(...prices) : 100000;

  useEffect(() => {
      const data = localStorage.getItem("result");

      if (data) {
        const parsed = JSON.parse(data);

        const combined = [
          parsed.top_recommendation,
          ...(parsed.alternatives || [])
        ];

        setResult(combined);
      }
    }, []);

  useEffect(() => {
      if (Array.isArray(result) && result.length > 0) {
        const prices = result.map(r => r.price);

        const min = Math.min(...prices);
        const max = Math.max(...prices);

        setFilters({
          priceRange: [min, max]
        });
      }
    }, [result]);
  
  const filteredResults = Array.isArray(result)
    ? result.filter((item) => {
        const range = filters.priceRange || [0, Infinity];

        if (item.price < range[0]) return false;
        if (item.price > range[1]) return false;

        return true;
      })
    : [];
     
  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="flex items-center gap-2 md:gap-4 px-4 md:px-6 h-14 bg-white shadow-sm">

          {/* LOGO */}
          <div className="text-lg font-semibold">
            Clari<span className="text-green-600">Cart</span>
          </div>

          {/* SEARCH BAR */}
          <div className="flex-1 flex items-center bg-gray-100 rounded-md px-2 md:px-3 py-1.5">
            <span className="text-gray-400 text-sm mr-2">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          {/* RIGHT NAV */}
          <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
            <span className="cursor-pointer hover:text-black">Saved</span>
            <span className="cursor-pointer hover:text-black">Pro</span>

            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-700">
              SK
            </div>
          </div>

        </div>
      {/* MAIN */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 p-4 md:p-6">

        {/* SIDEBAR */}
        <div className="md:col-span-3 bg-white p-4 rounded-xl shadow-sm space-y-6 text-sm">

          {/* CATEGORY */}
          <div>
            <p className="text-xs uppercase text-gray-400 mb-2">Category</p>

            <div className="space-y-1">
              <div className="flex justify-between px-3 py-1.5 rounded bg-green-100 text-green-700 font-medium cursor-pointer">
                <span>Laptops</span>
                <span className="text-xs">14</span>
              </div>

              <div className="flex justify-between px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer">
                <span>Tablets</span>
                <span className="text-xs text-gray-400">6</span>
              </div>
            </div>
          </div>

          {/* PRICE RANGE */}
          <div>
            <p className="text-xs uppercase text-gray-400 mb-2">Price range</p>

            <div className="flex justify-between text-xs mb-1">
              <span>₹{filters.priceRange?.[0]}</span>
              <span className="font-medium">₹{filters.priceRange?.[1]}</span>
            </div>

            <input
              type="range"
              min={minAvailablePrice}
              max={maxAvailablePrice}
              value={filters.priceRange?.[1] || 0}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: [
                    prev.priceRange?.[0] || minAvailablePrice,
                    Number(e.target.value)
                  ]
                }))
              }
              className="w-full appearance-none cursor-pointer price-slider"
              style={{
                background: `linear-gradient(
                  to right,
                  #16a34a ${
                    ((filters.priceRange?.[1] - minAvailablePrice) /
                      (maxAvailablePrice - minAvailablePrice)) * 100
                  }%,
                  #e5e7eb ${
                    ((filters.priceRange?.[1] - minAvailablePrice) /
                      (maxAvailablePrice - minAvailablePrice)) * 100
                  }%
                )`
              }}
            />
          </div>

          {/* DELIVERY */}
          <div>
            <p className="text-xs uppercase text-gray-400 mb-2">Delivery</p>

            <div className="space-y-1">
              <div className="flex justify-between px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer">
                <span>Same day</span>
                <span className="text-xs text-gray-400">3</span>
              </div>

              <div className="flex justify-between px-3 py-1.5 rounded bg-green-100 text-green-700 font-medium cursor-pointer">
                <span>Next day</span>
                <span className="text-xs">8</span>
              </div>
            </div>
          </div>

          {/* SMART SCORE */}
          <div>
            <p className="text-xs uppercase text-gray-400 mb-2">SmartScore</p>

            <div className="space-y-1">
              <div className="flex justify-between px-3 py-1.5 rounded bg-green-100 text-green-700 font-medium cursor-pointer">
                <span>90–100</span>
                <span className="text-xs">2</span>
              </div>

              <div className="flex justify-between px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer">
                <span>80–89</span>
                <span className="text-xs text-gray-400">5</span>
              </div>
            </div>
          </div>

          {/* YOUR WEIGHTS */}
          <div>
            <p className="text-xs uppercase text-gray-400 mb-2">Your active weights</p>

            {[
              { name: "Price", value: 78 },
              { name: "Reviews", value: 70 },
              { name: "Brand", value: 55 },
              { name: "Speed", value: 50 },
              { name: "Eco", value: 22 }
            ].map((w, i) => (
              <div key={i} className="flex items-center gap-2 mb-1">
                <span className="w-16 text-xs text-gray-500">{w.name}</span>

                <div className="flex-1 h-[3px] bg-gray-200 rounded">
                  <div
                    className="h-[3px] bg-green-600 rounded"
                    style={{ width: `${w.value}%` }}
                  />
                </div>
              </div>
            ))}

            <p className="text-xs text-green-600 mt-2 cursor-pointer">
              Edit preferences →
            </p>
          </div>

        </div>

        {/* RESULTS */}
        <div className="md:col-span-9">

          <div className="col-span-9 bg-gray-50 p-4 space-y-4">

            {/* HEADER */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{filteredResults.length}</span> results
              </div>

              <select className="text-sm border rounded px-2 py-1">
                <option>Sort: Best match</option>
              </select>
            </div>

            {/* AI CONSENSUS BAR */}
            <div className="bg-white shadow-sm rounded-lg px-4 py-2 flex items-center gap-2">
              <span className="text-xs text-gray-500 uppercase">AI Consensus</span>

              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Claude</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">GPT-4</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">Gemini</span>

              <span className="ml-auto text-xs text-green-600 font-medium">
                Models agree on top pick ✓
              </span>
            </div>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">

              {filteredResults.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 transition relative"
                >

                  {/* BEST BADGE */}
                  {index === 0 && (
                    <div className="absolute top-0 right-4 bg-green-600 text-white text-xs px-2 py-1 rounded-b">
                      Best match
                    </div>
                  )}

                  {/* HEADER */}
                  <div className="flex gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                      💻
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">Brand · Retailer</p>
                      <p className="text-base font-semibold text-gray-900">₹{item.price}</p>
                    </div>
                  </div>

                  {/* SCORE CHIPS */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded">
                      Score {(item.score * 100).toFixed(0)}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      Rating {item.rating}
                    </span>
                  </div>

                  {/* MODEL AGREEMENT */}
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <span>Models:</span>
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>3/3 recommend</span>
                  </div>

                  {/* WHY TEXT */}
                  <div className="text-xs bg-gray-50 rounded p-2 mb-3">
                    <strong>Why:</strong> {item.decision_summary}
                  </div>

                  {/* BUTTONS */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-md transition">
                      View →
                    </button>
                    <button className="border text-sm px-3 rounded">
                      Save
                    </button>
                  </div>

                </div>
              ))}

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}