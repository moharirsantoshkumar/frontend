"use client";

import { useEffect, useState } from "react";

export default function ResultsPage() {

  const [result, setResult] = useState(null);

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

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 h-14 bg-white border-b">
        <div className="text-lg font-semibold">
          Clari<span className="text-green-600">Cart</span>
        </div>
        <div className="text-sm text-gray-500">Results</div>
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-12 gap-4 p-6">

        {/* SIDEBAR */}
        <div className="bg-white p-5 rounded-xl border space-y-6">

          <h3 className="font-semibold text-lg">Filters</h3>

          {/* Price */}
          <div>
            <p className="text-sm font-medium mb-2">Price</p>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full border rounded px-2 py-1 text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
          </div>

          {/* RAM */}
          <div>
            <p className="text-sm font-medium mb-2">RAM</p>
            <div className="space-y-1 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" /> 8 GB
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> 16 GB
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> 32 GB
              </label>
            </div>
          </div>

          {/* Rating */}
          <div>
            <p className="text-sm font-medium mb-2">Rating</p>
            <div className="space-y-1 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" /> 4★ & above
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> 4.5★ & above
              </label>
            </div>
          </div>

          {/* Apply Button */}
          <button className="w-full bg-black text-white py-2 rounded-lg text-sm">
            Apply Filters
          </button>

        </div>

        {/* RESULTS */}
        <div className="col-span-9">

          <div className="mb-4 text-sm text-gray-600">
            Showing results based on your preferences
          </div>

          <div className="grid grid-cols-2 gap-4">

            {Array.isArray(result) && result.length > 0 && (
              <>
                {/* 🔥 TOP RECOMMENDATION */}
                <div className="bg-white p-6 rounded-xl border mb-6">

                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {result[0].name}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        ₹{result[0].price}
                      </p>
                    </div>

                    <span className="text-green-600 text-sm font-medium">
                      ⭐ Top Recommendation
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-3">
                    {result[0].decision_summary}
                  </p>

                </div>

                {/* 🔽 ALTERNATIVES */}
                <div className="grid grid-cols-2 gap-4">

                  {result.slice(1).map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border">

                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500">₹{item.price}</p>

                    </div>
                  ))}

                </div>
              </>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}