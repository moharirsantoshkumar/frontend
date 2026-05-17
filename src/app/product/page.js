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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* IMAGE */}
        <div className="bg-white rounded-2xl p-6">

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
        <div className="space-y-4">

          <div>

            <h1 className="text-3xl font-semibold">
              {product.name}
            </h1>

            <p className="text-gray-500 mt-1">
              {product.brand || "Unknown Brand"}
            </p>

          </div>

          <div className="text-2xl font-bold">
            ₹{product.price}
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