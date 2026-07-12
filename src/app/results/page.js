"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { fetchUserPreferences } from "../../../lib/supabase";
import { saveProduct } from "../../../lib/supabase";

export default function ResultsPage() {

  const [result, setResult] = useState(null);
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [weights, setWeights] = useState(null);
  const [compareProducts, setCompareProducts] = useState([]);
  const categoryIcons = {
    laptops: "💻",
    mobiles: "📱",
  };

  const [filters, setFilters] = useState({
    priceRange: [0, 100000]   // safe default
  });

  const prices = Array.isArray(result)
  ? result
      .filter(item => item)
      .map(item => item.price)
  : [];

  const minAvailablePrice = prices.length ? Math.min(...prices) : 0;
  const maxAvailablePrice = prices.length ? Math.max(...prices) : 100000;

  useEffect(() => {
      const data = localStorage.getItem("result");
      const savedCategory = localStorage.getItem("selectedCategory");

      if (savedCategory) {
        setSelectedCategory(savedCategory);
      }

      if (data) {
        const parsed = JSON.parse(data);

        console.log(parsed);

        const combined = [
          parsed.top_recommendation,
          ...(parsed.alternatives || [])
        ];

        
        setResult(combined);
      }

      async function loadPreferences() {

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {

          const preferences =
            await fetchUserPreferences(user.id);

          if (preferences) {

            setWeights([
              {
                name: "Price",
                value:
                  Math.round(
                    preferences.price_sensitivity * 100
                  ),
              },
              {
                name: "Reviews",
                value:
                  Math.round(
                    preferences.review_depth * 100
                  ),
              },
              {
                name: "Brand",
                value:
                  Math.round(
                    preferences.brand_trust * 100
                  ),
              },
              {
                name: "Speed",
                value:
                  Math.round(
                    preferences.delivery_speed * 100
                  ),
              },
              {
                name: "Eco",
                value:
                  Math.round(
                    preferences.sustainability * 100
                  ),
              },
            ]);
          }
        }
      }

      loadPreferences();

    }, []);

  useEffect(() => {
      if (Array.isArray(result) && result.length > 0) {

        const validProducts = result.filter(Boolean);

        const prices = validProducts.map(r => r.price);

        if (!prices.length) return;

        setFilters({
          priceRange: [
            Math.min(...prices),
            Math.max(...prices)
          ]
        });
      }
    }, [result]);
    
  useEffect(() => {

    const stored =
      JSON.parse(
        localStorage.getItem("compareProducts")
      ) || [];

    setCompareProducts(stored);

  }, []);

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
            <span className="Black text-sm mr-2">🔍</span>
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
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-green-600"
            >
              Dashboard →
            </button>
          </div>

        </div>

      {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
            onClick={() => setIsDrawerOpen(false)}
          />
        )}
      {/* MAIN */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 p-4 md:p-6">

        {/* SIDEBAR */}
        <div
            className={`
              fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white z-50 p-4 space-y-6
              transform transition-transform duration-300
              ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}
              md:static md:translate-x-0 md:col-span-3 md:h-auto md:w-auto md:z-auto
            `}
          >
          
          <div className="md:hidden flex justify-between items-center mb-4">
            <h3 className="font-semibold">Filters</h3>
            <button onClick={() => setIsDrawerOpen(false)}>✕</button>
          </div>

          {/* CATEGORY */}
          <div>
            <p className="text-xs uppercase Black mb-2">Category</p>

            <div className="space-y-1">
              <div className="flex justify-between px-3 py-1.5 rounded bg-green-100 text-green-700 font-medium cursor-pointer">
                <span className="capitalize flex items-center gap-2">
                  <span>{categoryIcons[selectedCategory]}</span>
                  {selectedCategory || "Products"}
                </span>
                <span className="text-xs">{filteredResults.length}</span>
              </div>
            </div>
          </div>

          {/* PRICE RANGE */}
          <div>
            <p className="text-xs uppercase Black mb-2">Price range</p>

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
            <p className="text-xs uppercase Black mb-2">Delivery</p>

            <div className="space-y-1">
              <div className="flex justify-between px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer">
                <span>Same day</span>
                <span className="text-xs Black">3</span>
              </div>

              <div className="flex justify-between px-3 py-1.5 rounded bg-green-100 text-green-700 font-medium cursor-pointer">
                <span>Next day</span>
                <span className="text-xs">8</span>
              </div>
            </div>
          </div>

          {/* SMART SCORE */}
          <div>
            <p className="text-xs uppercase Black mb-2">SmartScore</p>

            <div className="space-y-1">
              <div className="flex justify-between px-3 py-1.5 rounded bg-green-100 text-green-700 font-medium cursor-pointer">
                <span>90–100</span>
                <span className="text-xs">2</span>
              </div>

              <div className="flex justify-between px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer">
                <span>80–89</span>
                <span className="text-xs Black">5</span>
              </div>
            </div>
          </div>

          {/* YOUR WEIGHTS */}
          <div>
            <p className="text-xs uppercase Black mb-2">Your active weights</p>

            {(weights || []).map((w, i) => (
              <div key={i} className="flex items-center gap-2 mb-1">
                <span className="w-16 text-xs text-gray-500">
                  {w.name}
                </span>

                <div className="flex-1 h-[3px] bg-gray-200 rounded">
                  <div
                    className="h-[3px] bg-green-600 rounded"
                    style={{ width: `${w.value}%` }}
                  />
                </div>
              </div>
            ))}

            <p
                onClick={() => {
                  localStorage.setItem("onboardingStep", 2);
                  router.push("/onboarding");
                }}
                className="text-xs text-green-600 mt-2 cursor-pointer hover:underline"
              >
                Edit preferences →
              </p>
          </div>

          {/* APPLY BUTTON (mobile only) */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
            >
              Apply Filters
            </button>
          </div>

        </div>

        {/* RESULTS */}
        <div className="md:col-span-9">

          <div className="col-span-9 bg-gray-50 p-4 space-y-4">

            {/* HEADER */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{filteredResults.length}</span> {selectedCategory}
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

            <div className="md:hidden mb-3">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
              >
                Filters
              </button>
            </div>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">

              {filteredResults.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-200 relative"
                >

                  {/* BEST BADGE */}
                  {index === 0 && (
                    <div className="absolute top-0 right-4 bg-green-600 text-white text-xs px-2 py-1 rounded-b">
                      Best match
                    </div>
                  )}

                  {/* HEADER */}
                  <div className="mb-4">

                    <img
                      src={item.image || "https://via.placeholder.com/300"}
                      alt={item.name}
                      className="w-full h-48 object-contain rounded-2xl mb-3 transition-transform duration-200 hover:scale-[1.02]"
                    />

                    <p className="text-sm font-semibold text-gray-900">
                      {item.name}
                    </p>

                    <p className="text-xs text-gray-500 mb-1">
                      {item.brand || "Unknown"} · SmartMatch AI
                    </p>

                    <div className="mb-3">

                      <p className="text-base font-semibold text-gray-900">
                        {item.pricing?.currency === "USD" ? "$" : "₹"}
                        {item.pricing?.best_price ?? item.price}
                      </p>

                      {item.pricing && (
                        <div className="mt-2 rounded-lg bg-green-50 border border-green-100 p-2">

                          <div className="flex justify-between text-xs">

                            <span className="text-gray-500">
                              Best Store
                            </span>

                            <span className="font-medium text-green-700">
                              {item.pricing.best_store}
                            </span>

                          </div>
                          <div className="mt-2 text-[11px] text-gray-600 italic">
                            ✔ {item.pricing?.retailer_reason}
                          </div>

                          <div className="flex justify-between items-center mt-2">

                            <span className="text-xs text-gray-500">
                              Savings
                            </span>

                            <span className="rounded-full bg-green-600 px-2 py-1 text-xs font-semibold text-white">
                              {item.pricing.currency === "USD" ? "$" : "₹"}
                              {item.pricing.potential_savings}
                            </span>

                          </div>

                          <div className="flex justify-between text-xs mt-1">

                            <span className="text-gray-500">
                              Retailers Compared
                            </span>

                            <span className="font-medium">
                              {item.retailers?.length || 0}
                            </span>

                          </div>
                          <div className="flex justify-between text-xs mt-1">

                            <span className="text-gray-500">
                              Fastest Delivery
                            </span>

                            <span className="font-medium text-blue-600">
                              {item.retailers?.find(r => r.in_stock)?.delivery_days
                                ? `${item.retailers.find(r => r.in_stock).delivery_days} day(s)`
                                : "N/A"}
                            </span>

                          </div>
                          <div className="flex justify-between text-xs mt-1">

                            <span className="text-gray-500">
                              Seller
                            </span>

                            <span className="font-medium">
                              {item.retailers?.find(r => r.in_stock)?.seller || "N/A"}
                            </span>

                          </div>
                          <div className="flex justify-between text-xs mt-1">
                              <span className="text-gray-500">
                                  Trend
                              </span>

                              <span
                                  className={`font-medium ${
                                      item.pricing?.price_trend === "Falling"
                                          ? "text-green-600"
                                          : item.pricing?.price_trend === "Rising"
                                          ? "text-red-600"
                                          : "text-gray-700"
                                  }`}
                              >
                                  {item.pricing?.price_trend}
                              </span>

                          </div>
                          
                          <div className="mt-2 inline-block rounded-full bg-green-100 px-2 py-1 text-[10px] font-medium text-green-700">

                            {item.pricing.price_status}

                          </div>

                        </div>
                      )}

                    </div>

                    <div className="flex justify-between items-center">

                      <div>

                          <div className="text-[10px] uppercase text-blue-600 font-semibold">
                              AI Recommendation
                          </div>

                          <div className="text-xs mt-1">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                                    item.pricing?.recommended_action === "Buy Now"
                                        ? "bg-green-100 text-green-700"
                                        : item.pricing?.recommended_action === "Wait"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-blue-100 text-blue-700"
                                }`}
                            >
                                {item.pricing?.recommended_action}
                            </span>
                          </div>


                      </div>

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

                  <div className="mt-3">

                    <div className="flex justify-between text-xs mb-1">

                        <span className="text-gray-500">
                            Recommendation Confidence
                        </span>

                        <span
                            className={`font-semibold ${
                                item.confidence?.level === "High"
                                    ? "text-green-600"
                                    : item.confidence?.level === "Medium"
                                    ? "text-yellow-600"
                                    : "text-red-600"
                            }`}
                        >
                            {item.confidence?.score}% ({item.confidence?.level})
                        </span>

                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">

                        <div
                            className={`h-2 rounded-full ${
                                item.confidence?.level === "High"
                                    ? "bg-green-500"
                                    : item.confidence?.level === "Medium"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                            }`}
                            style={{
                                width: `${item.confidence?.score || 0}%`,
                            }}
                        />

                    </div>

                    <p className="text-[11px] text-gray-500 italic mt-2">
                        {item.confidence?.summary}
                    </p>

                </div>

                  {/* WHY TEXT */}
                  <div className="text-xs bg-gray-50 rounded p-2 mb-3 leading-relaxed">
                    <span className="font-medium text-gray-700">Why:</span>{" "}
                    <span className="text-gray-600">
                      {item.decision_summary ||
                          item.explanation
                            ?.split("\n")
                            .filter(line => line.trim() && !line.includes("Pros") && !line.includes("Cons"))
                            [0]
                        }
                    </span>
                  </div>
                  
                  {index === 0 && item.tradeoff_vs_next && (
                    <div className="text-xs text-gray-600 bg-green-50 rounded p-2 mb-3 leading-relaxed">

                      {/* AI Insight Label */}
                      <div className="text-[10px] uppercase text-green-600 font-medium mb-1">
                        AI Insight
                      </div>

                      <span className="font-medium text-green-700">
                        Why this is better:
                      </span>{" "}
                      {item.tradeoff_vs_next}

                    </div>
                  )}
                  
                  {/* BUTTONS */}
                  <div className="flex gap-2">

                    {/* VIEW */}
                    <button
                      onClick={() => {

                        localStorage.setItem(
                          "selectedProduct",
                          JSON.stringify(item)
                        );

                        router.push("/product");
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-md transition"
                    >
                      View →
                    </button>

                    {/* COMPARE */}
                    <button
                      onClick={() => {

                      const existing =
                        JSON.parse(
                          localStorage.getItem("compareProducts")
                        ) || [];

                      const alreadyExists = existing.find(
                        (p) => p.name === item.name
                      );

                      // REMOVE PRODUCT
                      if (alreadyExists) {

                        const updated = existing.filter(
                          (p) => p.name !== item.name
                        );

                        localStorage.setItem(
                          "compareProducts",
                          JSON.stringify(updated)
                        );

                        setCompareProducts(updated);

                        return;
                      }

                      // LIMIT TO 2
                      if (existing.length >= 2) {

                        alert(
                          "You can compare only 2 products currently"
                        );

                        return;
                      }

                      // ADD PRODUCT
                      const updated = [...existing, item];

                      localStorage.setItem(
                        "compareProducts",
                        JSON.stringify(updated)
                      );

                      setCompareProducts(updated);
                    }}
                      className="border text-sm px-3 rounded"
                    >
                      {
                        compareProducts.find(
                          (p) => p.name === item.name
                        )
                          ? "✓ Selected"
                          : "Compare"
                      }
                    </button>

                    {/* SAVE */}
                    <button
                      onClick={async () => {

                        try {

                          const {
                            data: { user },
                          } = await supabase.auth.getUser();

                          if (!user) {

                            alert(
                              "Please login to save products"
                            );

                            return;
                          }

                          await saveProduct({
                            userId: user.id,
                            product: item,
                          });

                          alert("Product saved!");

                        } catch (err) {

                          console.error(err);

                          alert("Error saving product");
                        }
                      }}
                      className={`text-sm px-3 rounded border transition ${
                        compareProducts.find(
                          (p) => p.name === item.name
                        )
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white"
                      }`}
                    >
                      Save
                    </button>

                  </div>

                </div>
              ))}

            </div>

          </div>
        </div>

      </div>

      {compareProducts.length >= 2 && (

          <div className="fixed bottom-6 right-6 bg-white shadow-xl border rounded-2xl px-5 py-4 flex items-center gap-4 z-50">

            <p className="text-sm font-medium">
              {compareProducts.length} products selected
            </p>

            <button
              onClick={() => router.push("/compare")}
              className="bg-green-600 text-white px-4 py-2 rounded-xl"
            >
              Compare Now
            </button>

          </div>
        )}

    </div>

    
  );
}