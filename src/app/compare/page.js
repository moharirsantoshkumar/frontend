"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ComparePage() {

  const router = useRouter();

  const [products, setProducts] = useState([]);

  useEffect(() => {

    const stored =
      localStorage.getItem("compareProducts");

    if (stored) {
      setProducts(JSON.parse(stored));
    }

  }, []);

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No products selected for comparison
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

      <h1 className="text-2xl font-semibold mb-6">
        Product Comparison
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {products.map((product, i) => (

          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >

            <img
              src={
                product.image ||
                "https://via.placeholder.com/300"
              }
              alt={product.name}
              className="w-full h-60 object-contain mb-4"
            />

            <h2 className="text-lg font-semibold">
              {product.name}
            </h2>

            <p className="text-gray-500 text-sm mb-2">
              {product.brand || "Unknown"}
            </p>

            <p className="text-2xl font-bold mb-4">
              ₹{product.price}
            </p>

            <div className="flex gap-2 mb-4">

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

            <div className="bg-gray-50 rounded-xl p-4">

              <h3 className="font-medium mb-2">
                AI Summary
              </h3>

              <p className="text-sm text-gray-600">

                {product.decision_summary ||
                  product.explanation}

              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}