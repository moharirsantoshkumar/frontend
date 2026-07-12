"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductPage() {

  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {

    setMounted(true);

    const stored =
        localStorage.getItem("selectedProduct");

    if (stored) {
        setProduct(JSON.parse(stored));
    }

    }, []);

  if (!mounted || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <button
        onClick={() => router.back()}
        className="text-green-600 mb-6"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* IMAGE */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6">

          <img
            src={
                product.image ||
                "https://via.placeholder.com/400"
            }
            alt={product.name}
            className="w-full h-96 object-contain"
            />

        </div>

        {/* DETAILS */}
        <div className="lg:col-span-3 space-y-4">

          <div>

            <h1 className="text-3xl font-semibold">
              {product.name}
            </h1>

            <p className="text-gray-500 mt-1">
              {product.brand || "Unknown Brand"}
            </p>

          </div>

          {/* DECISION BANNER */}
          <div className="rounded-xl border border-green-200 bg-green-50 p-3">

            <div className="text-xs uppercase tracking-wide text-green-700 font-semibold">
              ClariCart Decision
            </div>

            <div className="mt-1 font-medium text-gray-800">
              ✅ {product.pricing?.buy_recommendation}
            </div>

            <div className="mt-1 text-sm text-gray-600">
              {product.pricing?.retailer_reason}

              
            </div>

          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">

                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-gray-500">Lowest Price</div>
                  <div className="font-semibold">
                    {product.pricing?.currency === "USD" ? "$" : "₹"}
                    {product.pricing?.lowest_price}
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-gray-500">Highest Price</div>
                  <div className="font-semibold">
                    {product.pricing?.currency === "USD" ? "$" : "₹"}
                    {product.pricing?.highest_price}
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-gray-500">Average Price</div>
                  <div className="font-semibold">
                    {product.pricing?.currency === "USD" ? "$" : "₹"}
                    {product.pricing?.average_price}
                  </div>
                </div>

                <div className="rounded-lg bg-green-50 p-3">
                  <div className="text-xs text-gray-500">Predicted Price</div>
                  <div className="font-semibold text-green-700">
                    {product.pricing?.currency === "USD" ? "$" : "₹"}
                    {product.pricing?.predicted_price}
                  </div>
                </div>

              </div>
          <div>

            <div className="text-2xl font-bold">
              {product.pricing?.currency === "USD" ? "$" : "₹"}
              {product.pricing?.best_price ?? product.price}
            </div>

            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">

              <span>🏪</span>

              <span>
                Best Price at {product.pricing?.best_store}
              </span>

            </div>

          </div>

          <div className="flex gap-2">

            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              AI Score {
                product.score
                    ? (product.score * 100).toFixed(0)
                    : "--"
                }
            </span>

            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              Rating {product.rating || "--"}
            </span>

          </div>

          {/* RETAIL INTELLIGENCE */}
          <div className="bg-white rounded-xl p-4">

            <h2 className="font-semibold mb-3">
              Retail Intelligence
            </h2>

            <div className="grid grid-cols-3 gap-3 mb-4">

              <div className="rounded-lg bg-green-50 p-3 text-center">

                <div className="text-xs text-gray-500">
                  Best Store
                </div>

                <div className="font-semibold text-green-700">
                  {product.pricing?.best_store}
                </div>

              </div>

              <div className="rounded-lg bg-green-50 p-3 text-center">

                <div className="text-xs text-gray-500">
                  Savings
                </div>

                <div className="font-semibold text-green-700">
                  {product.pricing?.currency === "USD" ? "$" : "₹"}
                  {product.pricing?.potential_savings}
                </div>

              </div>

              <div className="rounded-lg bg-yellow-50 p-3 text-center">

                <div className="text-xs text-gray-500">
                  Status
                </div>

                <div className="font-semibold">
                  {product.pricing?.price_status}
                </div>

              </div>

            </div>

            <div className="text-sm text-gray-600 italic">
              ✔ {product.pricing?.retailer_reason}
            </div>

          </div>


          {/* WHY SECTION */}
          <div className="bg-white rounded-xl p-4">

            <h2 className="font-semibold mb-2">
              Why AI Recommended This
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed">

              {product.decision_summary ||
                product.explanation || "--"}

            </p>

          </div>

          {/* CONFIDENCE ANALYSIS */}

          <div className="bg-white rounded-xl p-5 border">

            <h2 className="font-semibold mb-4">
              Why We're Confident
            </h2>

            <div className="flex items-center justify-between mb-3">

              <div>

                <p className="text-sm text-gray-500">
                  Recommendation Confidence
                </p>

                <p
                  className={`text-2xl font-bold ${
                    product.confidence?.level === "High"
                      ? "text-green-600"
                      : product.confidence?.level === "Medium"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {product.confidence?.score}% ({product.confidence?.level})
                </p>

              </div>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">

              <div
                className={`h-2 rounded-full ${
                  product.confidence?.level === "High"
                    ? "bg-green-500"
                    : product.confidence?.level === "Medium"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{
                  width: `${product.confidence?.score || 0}%`,
                }}
              />

            </div>

            <p className="text-sm italic text-gray-600 mb-4">
              {product.confidence?.summary}
            </p>

            <div className="space-y-3 mt-4">

              {product.confidence?.factors?.map((factor, index) => (

                <div
                  key={index}
                  className="flex items-center gap-3 text-sm py-1"
                >
                  <span
                    className={
                      product.confidence?.level === "High"
                        ? "text-green-600"
                        : product.confidence?.level === "Medium"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }
                  >
                    ✓
                  </span>
                  <span>{factor}</span>
                </div>

              ))}

            </div>

          </div>

          {/* RETAILER COMPARISON */}
          <div className="bg-white rounded-xl p-4">

            <h2 className="font-semibold mb-3">
              Compare Retailers
            </h2>

            <div className="space-y-2">

              {product.retailers?.map((retailer, index) => (

                <div
                  key={index}
                  className="flex items-center justify-between border rounded-lg p-3"
                >

                  <div>

                    <div className="font-medium">
                      {retailer.retailer}
                    </div>

                    <div className="text-xs text-gray-500">
                      Seller: {retailer.seller}
                    </div>

                  </div>

                  <div className="text-right">

                    <div className="font-semibold">
                      {retailer.currency === "USD" ? "$" : "₹"}
                      {retailer.price}
                    </div>

                    <div className="text-xs text-gray-500">
                      {retailer.in_stock
                        ? `${retailer.delivery_days} day(s)`
                        : "Out of Stock"}
                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* TRADEOFF */}
          {product.tradeoff_vs_next && (
            <div className="bg-green-50 rounded-xl p-4">

              <h2 className="font-semibold mb-2 text-green-700">
                AI Tradeoff Analysis
              </h2>

              <p className="text-sm text-gray-700">

                {product.tradeoff_vs_next}

              </p>

            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-3">

            <button className="flex-1 bg-green-600 text-white py-3 rounded-xl">
              Save Product
            </button>

            <button className="flex-1 border py-3 rounded-xl">
              Compare
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}