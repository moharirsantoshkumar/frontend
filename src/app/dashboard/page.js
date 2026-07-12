"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { fetchRecommendationSessions } from "../../../lib/supabase";
import { fetchUserPreferences } from "../../../lib/supabase";
import { fetchSavedProducts } from "../../../lib/supabase";

export default function Dashboard() {
  const router = useRouter();
  const [result, setResult] = useState([]);
  const [weights, setWeights] = useState(null);
  const [savedProducts, setSavedProducts] = useState([]);
  useEffect(() => {

    async function loadHistory() {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Logged-in user → DB history
      if (user) {

        const sessions =
          await fetchRecommendationSessions(user.id);

        const saved =
          await fetchSavedProducts(user.id);
        setSavedProducts(saved);

        const formattedHistory = sessions
          .map((session) => ({
            ...session.recommendation_payload,
            timestamp: session.created_at,
          }))
          .filter(item => item.top_recommendation);

        setResult(formattedHistory);
        
      }

      // Guest user → localStorage fallback
      else {

        const data = localStorage.getItem("history");

        if (data) {
          setResult(JSON.parse(data));
        }
      }

      if (user) {

        const preferences =
          await fetchUserPreferences(user.id);

        if (preferences) {

          setWeights([
            {
              name: "Price",
              value: Math.round(preferences.price_sensitivity * 100),
            },
            {
              name: "Reviews",
              value: Math.round(preferences.review_depth * 100),
            },
            {
              name: "Brand",
              value: Math.round(preferences.brand_trust * 100),
            },
            {
              name: "Speed",
              value: Math.round(preferences.delivery_speed * 100),
            },
            {
              name: "Eco",
              value: Math.round(preferences.sustainability * 100),
            },
          ]);
        }
      }
    }

    loadHistory();

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
        <div className="flex-1 bg-gray-100 px-2 md:px-3 py-1.5 rounded-xl text-xs md:text-sm">
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

            {(weights || []).map((w, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">

                <span className="w-16 text-xs text-gray-900">
                  {w.name}
                </span>

                <div className="flex-1 h-1 bg-gray-200 rounded">

                  <div
                    className="h-1 bg-green-600 rounded"
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

            <div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <p className="text-xs text-gray-700">Searches</p>
                <p className="text-xl font-semibold">
                {result ? 1 : 0}
                </p>
            </div>

            <div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <p className="text-xs text-gray-700">Items Shown</p>
                <p className="text-xl font-semibold">
                {result?.[0]?.alternatives?.length
                    ? result[0].alternatives.length + 1
                    : 0}
                </p>
            </div>

            <div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <p className="text-xs text-gray-700">Top Score</p>
                <p className="text-xl font-semibold">
                {result?.[0]?.top_recommendation?.score
                    ? Math.round(result[0].top_recommendation.score * 100)
                    : "--"}
                </p>
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">

                <p className="text-sm text-gray-500">
                  🛡 Avg Confidence
                </p>

                <p
                    className={`text-3xl font-bold mt-2 ${
                        result?.[0]?.top_recommendation?.confidence?.level === "High"
                            ? "text-green-600"
                            : result?.[0]?.top_recommendation?.confidence?.level === "Medium"
                            ? "text-yellow-600"
                            : "text-red-600"
                    }`}
                >
                    {result?.[0]?.top_recommendation?.confidence?.score || "--"}%
                </p>

                <p className="text-xs text-gray-500 mt-2">
                    {result?.[0]?.top_recommendation?.confidence?.level || "--"} Confidence
                </p>

            </div>

          </div>

          {/* PRICE INTELLIGENCE */}

            {result?.[0]?.top_recommendation?.pricing && (

            <div className="bg-white rounded-xl border shadow-sm p-5 mb-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">

                <h2 className="font-semibold mb-4">
                    Price Intelligence
                </h2>

                <div className="grid grid-cols-3 gap-4">

                    <div>

                        <p className="text-xs text-gray-500">
                            Recommendation
                        </p>

                        <p className="font-semibold text-green-700">
                            {
                                result[0].top_recommendation.pricing.recommended_action
                            }
                        </p>

                    </div>

                    <div>

                        <p className="text-xs text-gray-500">
                            Price Trend
                        </p>

                        <p className="font-semibold">
                            {
                                result[0].top_recommendation.pricing.price_trend
                            }
                        </p>

                    </div>

                    <div>

                        <p className="text-xs text-gray-500">
                            Potential Savings
                        </p>

                        <p className="font-semibold text-green-700">
                            $
                            {
                                result[0].top_recommendation.pricing.estimated_wait_savings
                            }
                        </p>

                    </div>

                </div>

            </div>

            )}

            
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
            📈 Recent Activity
          </p>
          <div className="space-y-3">

            {result?.length > 0 ? (
                result.slice(0, 3)?.map((item, i) => (
                <div
                    key={i}
                    className="bg-white p-3 rounded-xl border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex justify-between items-center"
                >
                    <div>
                    <p className="text-sm font-medium">
                        {item.top_recommendation.name}
                    </p>
                    <p className="text-xs text-gray-600">
                        {new Date(item.timestamp).toLocaleString()}
                    </p>
                    </div>

                    <div className="text-right">

                        <p
                            className={`text-sm font-semibold ${
                                item.top_recommendation.confidence?.level === "High"
                                    ? "text-green-600"
                                    : item.top_recommendation.confidence?.level === "Medium"
                                    ? "text-yellow-600"
                                    : "text-red-600"
                            }`}
                        >
                            {item.top_recommendation.confidence?.score}%
                        </p>

                        <p className="text-xs text-gray-500">
                            Confidence
                        </p>

                    </div>
                </div>
                ))
            ) : (
                <p className="text-gray-500 text-sm">
                No activity yet
                </p>
            )}

          </div>
          {result.length > 3 && (
            <p className="text-sm text-green-600 mt-3 cursor-pointer">
              View More →
            </p>
          )}

          <p className="text-sm font-medium mb-3 mt-8">
            ❤️ Saved Products
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

            {savedProducts?.length > 0 ? (

              savedProducts.slice(0, 3).map((item, i) => {

                const product = item.product_payload;

                return (

                  <div
                    key={i}
                    className="bg-white rounded-xl border shadow-sm p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                  >

                    <img
                      src={
                        product.image ||
                        "https://via.placeholder.com/300"
                      }
                      alt={product.name}
                      className="w-full h-40 object-contain mb-3"
                    />

                    <p className="font-medium text-sm">
                      {product.name}
                    </p>

                    <p className="text-xs text-gray-500 mb-2">
                      {product.brand || "Unknown"}
                    </p>

                    <div className="flex items-center justify-between">

                      <p className="font-semibold">
                        ₹{product.price}
                      </p>

                      <button
                        onClick={() => {

                          localStorage.setItem(
                            "selectedProduct",
                            JSON.stringify(product)
                          );

                          router.push("/product");
                        }}
                        className="text-sm text-green-600"
                      >
                        View →
                      </button>

                    </div>

                  </div>
                );
              })

            ) : (

              <p className="text-sm text-gray-500">
                No saved products yet
              </p>

            )}

          </div>

          {savedProducts.length > 3 && (
            <p className="text-sm text-green-600 mt-3 cursor-pointer">
              View More →
            </p>
          )}

        </div>

      </div>

    </div>
  );
}