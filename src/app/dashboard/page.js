"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [result, setResult] = useState([]);
  useEffect(() => {
    const data = localStorage.getItem("history");

    if (data) {
        setResult(JSON.parse(data));
    }
    }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* TOPBAR */}
      <div className="flex items-center gap-2 md:gap-4 px-4 md:px-6 h-14 bg-white border-b">

        <button className="md:hidden text-lg">
            ☰
        </button>
        {/* Logo */}
        <div className="text-lg font-semibold">
          Clari<span className="text-green-600">Cart</span>
        </div>

        {/* Search */}
        <div className="flex-1 bg-gray-100 px-2 md:px-3 py-1.5 rounded-md text-xs md:text-sm">
          Search any product...
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          <span>Saved</span>
          <button className="bg-green-600 text-white px-3 py-1 rounded">
            Pro
          </button>
          <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-xs">
            SK
          </div>
        </div>

      </div>

      {/* LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-12">

        {/* SIDEBAR */}
        <div className="hidden md:block md:col-span-2 bg-white border-r p-4">

          <p className="text-xs text-gray-900 mb-2">Menu</p>

          <div className="space-y-2 text-sm">
            <div className="bg-green-100 text-green-700 p-2 rounded">
              Dashboard
            </div>
            <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">
              Search
            </div>
            <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">
              Saved Items
            </div>
          </div>

          {/* Preferences */}
          <div className="mt-6">
            <p className="text-xs text-gray-900 mb-2">
              Your weights
            </p>

            {["Price", "Reviews", "Brand", "Speed", "Eco"].map((item, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <span className="w-16 text-xs text-gray-900">{item}</span>
                <div className="flex-1 h-1 bg-gray-200 rounded">
                  <div className="h-1 bg-green-600 rounded w-2/3" />
                </div>
              </div>
            ))}

            <p
              onClick={() => router.push("/onboarding")}
              className="text-xs text-green-600 mt-2 cursor-pointer"
            >
              Edit →
            </p>
          </div>

        </div>

        {/* MAIN */}
        <div className="col-span-1 md:col-span-10 p-4 md:p-6">

          <h1 className="text-xl font-semibold mb-2">
            Good morning 👋
            </h1>

            <p className="text-sm text-gray-700 mb-6">
            {result
                ? `Your latest recommendation is ${result?.[0]?.top_recommendation?.name}`
                : "Start exploring products tailored for you."}
            </p>

          <p className="text-sm text-gray-900 mb-6">
            Your recommendations are personalized for you.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6">

            <div className="bg-white p-4 rounded shadow-sm">
                <p className="text-xs text-gray-700">Searches</p>
                <p className="text-xl font-semibold">
                {result ? 1 : 0}
                </p>
            </div>

            <div className="bg-white p-4 rounded shadow-sm">
                <p className="text-xs text-gray-700">Items Shown</p>
                <p className="text-xl font-semibold">
                {result?.[0]?.alternatives?.length
                    ? result[0].alternatives.length + 1
                    : 0}
                </p>
            </div>

            <div className="bg-white p-4 rounded shadow-sm">
                <p className="text-xs text-gray-700">Top Score</p>
                <p className="text-xl font-semibold">
                {result?.[0]?.top_recommendation?.score
                    ? Math.round(result[0].top_recommendation.score * 100)
                    : "--"}
                </p>
            </div>

          </div>

            
          {/* Categories */}
          <p className="text-xs text-gray-900 mb-2">
            Shop by category
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {["💻", "📱","🏠", "👟", "🏋️", "📚"].map((icon, i) => (
              <div
                key={i}
                className="bg-white p-4 text-center rounded border cursor-pointer"
              >
                <div className="text-xl">{icon}</div>
              </div>
            ))}
          </div>

          <p className="text-sm font-medium mb-3 mt-6">
            Recent Activity
            </p>

            <div className="space-y-3">

            {result?.length > 0 ? (
                result.slice(0, 5)?.map((item, i) => (
                <div
                    key={i}
                    className="bg-white p-3 rounded border flex justify-between items-center"
                >
                    <div>
                    <p className="text-sm font-medium">
                        {item.top_recommendation.name}
                    </p>
                    <p className="text-xs text-gray-600">
                        {new Date(item.timestamp).toLocaleString()}
                    </p>
                    </div>

                    <p className="text-sm font-semibold text-green-600">
                    {Math.round(item?.top_recommendation?.score * 100)}
                    </p>
                </div>
                ))
            ) : (
                <p className="text-gray-500 text-sm">
                No activity yet
                </p>
            )}

            </div>

        </div>

      </div>

    </div>
  );
}