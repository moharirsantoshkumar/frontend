"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();

  const [weights, setWeights] = useState({
    "Price sensitivity": 0.5,
    "Delivery speed": 0.2,
    "Sustainability": 0.2,
    "Review depth": 0.1,
    "Brand trust": 0.3
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setWeights({ ...weights, [key]: parseFloat(value) });
  };

  const getRecommendation = async () => {
    setLoading(true);

    try {
     const res = await fetch("https://backend-mm9y.onrender.com/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ weights })
    });
      const data = await res.json();

      // store result
      localStorage.setItem("result", JSON.stringify(data));

      // navigate to results page (currently homepage)
      router.push("/results");
    } catch (err) {
      console.error(err);
      alert("Error fetching recommendations");
    }

    setLoading(false);
  };

  return (
   <div className="min-h-screen">

    {/* HEADER */}
    <div className="flex items-center justify-between px-8 h-14 bg-white">

        {/* LOGO */}
        <div className="text-lg font-semibold">
            Clari<span className="text-green-600">Cart</span>
        </div>

        {/* STEPS */}
        <div className="flex items-center gap-3 text-sm">

            {/* Step 1 */}
            <div className="flex items-center gap-1 text-green-600">
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-600 text-white text-xs">
                ✓
            </div>
            <span>Account</span>
            </div>

            <div className="w-6 h-px"></div>

            {/* Step 2 (active) */}
            <div className="flex items-center gap-1 text-black font-medium">
            <div className="w-6 h-6 flex items-center justify-center rounded-full border border-green-600 text-green-600 text-xs">
                2
            </div>
            <span>Preferences</span>
            </div>

            <div className="w-6 h-px "></div>

            {/* Step 3 */}
            <div className="flex items-center gap-1 text-gray-400">
            <div className="w-6 h-6 flex items-center justify-center rounded-full border text-xs">
                3
            </div>
            <span>Categories</span>
            </div>

            <div className="w-6 h-px"></div>

            {/* Step 4 */}
            <div className="flex items-center gap-1 text-gray-400">
            <div className="w-6 h-6 flex items-center justify-center rounded-full border text-xs">
                4
            </div>
            <span>Done</span>
            </div>

        </div>

        <div></div>

        </div>

    {/* BODY */}
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-56px)]">

    {/* LEFT PANEL */}
    <div className="p-10 flex flex-col justify-center">
      <p className="text-xs font-medium text-green-600 tracking-wide mb-2 uppercase">
        Step 2 of 4 · Preferences
      </p>
      <h1 className="text-3xl font-semibold mb-2">
        What matters most to you?
      </h1>

      <p className="text-gray-600 mb-8">
        Set your weights once. Every recommendation adjusts to these — across all 20 categories.
      </p>

      {/* Sliders */}
      <div className="space-y-6">

        {Object.entries(weights).map(([key, value]) => (
            <div key={key} className="space-y-2">

                {/* Top row: name + dynamic label */}
                <div className="flex justify-between items-center">
                <span className="capitalize font-medium">{key}</span>
                <span className="capitalize font-medium" >
                    {value < 0.3
                    ? "Low"
                    : value < 0.7
                    ? "Medium"
                    : "High"}{" "}
                    critical
                </span>
                </div>

                {/* Slider */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={value * 100}
                    onChange={(e) => handleChange(key, e.target.value / 100)}
                    className="w-full appearance-none cursor-pointer slider"
                    style={{
                        background: `linear-gradient(to right, #16a34a ${value * 100}%, #e5e7eb ${value * 100}%)`
                    }}
                />
                {/* Bottom labels */}
                <div className="capitalize font-small">
                <span>Not important</span>
                <span></span>
                </div>

            </div>
            ))}

      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-8">

        <button
          onClick={getRecommendation}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "Analyzing..." : "Save & Continue →"}
        </button>

        <button className="border px-6 rounded-lg text-gray-600">
          Skip
        </button>

      </div>

    </div>

    {/* RIGHT PANEL */}
    <div className="bg-white p-10 flex flex-col justify-center">

      <h2 className="text-lg font-medium mb-4">
        Categories you shop most
      </h2>

      <div className="grid grid-cols-3 gap-3 mb-8">

        {["💻", "🏠", "👟", "🏋️", "📚", "🧴"].map((icon, i) => (
          <div
            key={i}
            className="bg-white border rounded-lg p-4 text-center cursor-pointer hover:border-green-500"
          >
            <div className="text-2xl">{icon}</div>
          </div>
        ))}

      </div>

      <div className="bg-white p-4 rounded-lg border">

        <p className="text-sm text-gray-500 mb-2">
          Your preference profile
        </p>

        {Object.entries(weights).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2 mb-2">

            <span className="w-24 text-sm capitalize">{key}</span>

            <div className="flex-1 h-2 rounded">
              <div
                className="h-2 bg-green-600 rounded"
                style={{ width: `${value * 100}%` }}
              />
            </div>

            <span className="text-xs text-gray-500">
              {(value * 100).toFixed(0)}%
            </span>

          </div>
        ))}

      </div>

    </div>

  </div>
  </div>
);
}