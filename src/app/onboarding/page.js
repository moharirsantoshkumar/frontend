"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const categories = [
    { icon: "💻", value: "laptops", label: "Laptops" },
    { icon: "🏠", value: "home", label: "Home" },
    { icon: "👟", value: "fashion", label: "Fashion" },
    { icon: "🏋️", value: "fitness", label: "Fitness" },
    { icon: "📚", value: "books", label: "Books" },
    { icon: "🧴", value: "beauty", label: "Beauty" }
  ];

  const [weights, setWeights] = useState({
    "Price sensitivity": 0.5,
    "Delivery speed": 0.2,
    "Sustainability": 0.2,
    "Review depth": 0.1,
    "Brand trust": 0.3
  });

  const [selectedCategory, setSelectedCategory] = useState(null);

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
      body: JSON.stringify({
          weights,
          category: selectedCategory
        })
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
    <div className="flex items-center justify-between px-4 md:px-8 h-14 bg-white">

        {/* LOGO */}
        <div className="text-lg font-semibold">
            Clari<span className="text-green-600">Cart</span>
        </div>
        <div className="md:hidden text-sm text-gray-500">
          Step {step} of 4
        </div>

        {/* STEPS */}
        <div className="hidden md:flex items-center gap-3 text-sm">

            {/* Step 1 */}
            <div
              onClick={() => setStep(1)}
              className={`flex items-center gap-1 cursor-pointer ${
                step > 1 ? "text-green-600" : step === 1 ? "text-black font-medium" : "text-gray-400"
              }`}
            >
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${
                  step > 1
                    ? "bg-green-600 text-white"
                    : step === 1
                    ? "border border-green-600 text-green-600"
                    : "border text-gray-400"
                }`}
              >
                {step > 1 ? "✓" : "1"}
              </div>
              <span>Account</span>
            </div>

            <div className="w-6 h-px"></div>

            {/* Step 2 (active) */}
            <div
              onClick={() => setStep(2)}
              className={`flex items-center gap-1 cursor-pointer ${
                step > 2 ? "text-green-600" : step === 2 ? "text-black font-medium" : "text-gray-400"
              }`}
            >
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${
                  step > 2
                    ? "bg-green-600 text-white"
                    : step === 2
                    ? "border border-green-600 text-green-600"
                    : "border text-gray-400"
                }`}
              >
                {step > 2 ? "✓" : "2"}
              </div>
              <span>Preferences</span>
            </div>

            <div className="w-6 h-px"></div>

            {/* Step 3 */}
            <div
              onClick={() => setStep(3)}
              className={`flex items-center gap-1 cursor-pointer ${
                step > 3 ? "text-green-600" : step === 3 ? "text-black font-medium" : "text-gray-400"
              }`}
            >
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${
                  step > 3
                    ? "bg-green-600 text-white"
                    : step === 3
                    ? "border border-green-600 text-green-600"
                    : "border text-gray-400"
                }`}
              >
                {step > 3 ? "✓" : "3"}
              </div>
              <span>Categories</span>
            </div>

            <div className="w-6 h-px"></div>

            {/* Step 4 */}
            <div className={`flex items-center gap-1 ${
              step === 4 ? "text-black font-medium" : "text-gray-400"
            }`}>
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
    <div className="p-4 md:p-10 flex flex-col justify-start">
      <p className="text-xs font-medium text-green-600 tracking-wide mb-2 uppercase">
        Step {step} of 4 · {step === 1 ? "Account" : step === 2 ? "Preferences" : "Categories"}
      </p>

      <h1 className="text-2xl md:text-3xl font-semibold mb-2">
        {step === 1
          ? "Welcome to ClariCart"
          : step === 2
          ? "What matters most to you?"
          : "Choose your category"}
      </h1>

      <p className="text-gray-600">
        Set your weights once. Every recommendation adjusts to these — across all 20 categories.
      </p>
    
    {step === 1 && (
      <>
        {/* <h1 className="text-2xl md:text-3xl font-semibold mb-4">
          Welcome to ClariCart
        </h1> */}

        <p className="text-gray-600 mb-6">
          Let’s personalize your shopping experience in a few steps.
        </p>

        <button
          onClick={() => setStep(2)}
          className="w-full bg-green-600 text-white py-3 rounded-lg"
        >
          Get Started →
        </button>
      </>
    )}

    {step === 2 && (
      <>

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
                <div className="flex justify-between text-xs text-gray-500">
                <span>Not important</span>
                <span></span>
                </div>

            </div>
            ))}

      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-8">

        <button
          onClick={() => {
            if (step === 2) {
              setStep(3);
            } else {
              getRecommendation();
            }
          }}
          className="w-full md:flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold"
        >
          {loading
            ? "Analyzing..."
            : step === 2
            ? "Continue →"
            : "Get Recommendations →"}
        </button>

        <button className="w-full md:w-auto border py-3 px-6 rounded-lg text-gray-600">
          Skip
        </button>

      </div>
    </>
    )}
    </div>

    {step === 3 && (
    <>

    {/* RIGHT PANEL */}
    <div className="bg-white p-4 md:p-10 flex flex-col justify-center">

      <h2 className="text-lg font-medium mb-4">
        Categories you shop most
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-3 mb-8">

        {categories.map((cat, i) => (
          <div
            key={i}
            onClick={() => setSelectedCategory(cat.value)}
            className={`p-4 text-center rounded-lg cursor-pointer transition
              ${
                selectedCategory === cat.value
                  ? "border-green-500 bg-green-50 border"
                  : "border hover:border-green-400"
              }`}
          >
            <div className="text-2xl">{cat.icon}</div>
            <div className="text-xs mt-1 text-gray-600">{cat.label}</div>
          </div>
        ))}

        {selectedCategory && (
          <p className="text-sm text-green-600 mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
            Selected: {categories.find(c => c.value === selectedCategory)?.label}
          </p>
        )}
      </div>
      <div className="mt-6">
      {/* Loading message */}
      {loading && (
        <p className="text-sm text-gray-500 mb-2">
          Finding best options for you...
        </p>
      )}
      <button
        onClick={getRecommendation}
        disabled={!selectedCategory || loading}
        className={`w-full py-3 rounded-lg text-white font-semibold ${
          selectedCategory
            ? "bg-green-600"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Analyzing...
          </div>
        ) : (
          "Get Recommendations →"
        )}
      </button>
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
     </>
    )}

  </div>
  </div>
);
}