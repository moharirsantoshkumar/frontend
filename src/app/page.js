"use client";
import { useState } from "react";

const getImage = (name) => {
  const images = {
    "Asus Vivobook 15":
      "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c06576857.png",
    "HP Pavilion 14":
      "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c06576857.png",
    "Lenovo ThinkPad E14":
      "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c06576857.png"
  };

  return images[name] || "https://via.placeholder.com/150";
};

export default function Home() {

  const [weights, setWeights] = useState({
    price: 0.4,
    performance: 0.3,
    battery: 0.2,
    rating: 0.1
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setWeights({ ...weights, [key]: parseFloat(value) });
  };

  const getRecommendation = async () => {
    setLoading(true);

    const res = await fetch("https://backend-mm9y.onrender.com/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ weights })
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-10">

      <h1 className="text-3xl font-bold mb-6">
        ClariCart.ai
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT PANEL */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-lg font-semibold mb-4">
            Preferences
          </h2>

          {Object.keys(weights).map((key) => (
            <div key={key} className="mb-4">
              <label className="block text-sm capitalize">
                {key}: {weights[key]}
              </label>

              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={weights[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full"
              />
            </div>
          ))}

          <button
            onClick={getRecommendation}
            className="w-full mt-4 bg-black text-white py-2 rounded-lg"
          >
            {loading && (
              <div className="text-center mt-16 space-y-3">
                <div className="text-lg font-medium text-gray-800">
                  🔍 Analyzing your preferences
                </div>

                <div className="text-sm text-gray-500">
                  Comparing laptops across multiple factors…
                </div>

                <div className="text-xs text-gray-400">
                  First request may take up to 30 seconds
                </div>
                
                <div className="flex justify-center mt-4">
                  <div className="w-6 h-6 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                </div>

              </div>
            )}
          </button>

        </div>

        {/* RIGHT PANEL */}
        <div className="md:col-span-2">

          {!result && (
            <p className="text-gray-800 mt-20 text-center">
              Adjust preferences and click button
            </p>
          )}

          {result && (
            <div>

              {/* TOP RECOMMENDATION */}
              <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-gray-100 hover:shadow-xl transition">

                <div className="flex items-center gap-4 mb-2">

                  <img
                    src={getImage(result.top_recommendation.name)}
                    className="w-24 h-24 object-cover rounded"
                  />

                  <div>
                    <h2 className="text-xl font-bold">
                      🏆 {result.top_recommendation.name}
                    </h2>

                    <p className="text-green-600 text-sm font-medium">
                      ✔ Best Match for You
                    </p>
                  </div>

                </div>

                <p className="text-sm text-gray-800">
                  {result.top_recommendation.best_for} • {result.top_recommendation.confidence}
                </p>

                <p className="mt-2 font-medium">
                  {result.top_recommendation.decision_summary}
                </p>

                <p className="text-sm text-gray-800 mt-1">
                  {result.top_recommendation.tradeoff_vs_next}
                </p>

                <div className="bg-gray-50 p-3 rounded mt-3 whitespace-pre-line text-sm">
                  {result.top_recommendation.explanation}
                </div>

              </div>

              {/* ALTERNATIVES */}
              <h3 className="font-semibold mb-2">
                Alternatives
              </h3>

              {result.alternatives.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded shadow mb-3"
                >
                  <div className="flex items-center gap-3 mb-2">

                    <img
                      src={getImage(item.name)}
                      className="w-16 h-16 object-cover rounded"
                    />

                    <h4 className="font-medium">
                      {item.name}
                    </h4>

                  </div>

                  <p className="text-sm whitespace-pre-line">
                    {item.explanation}
                  </p>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </main>
  );
}