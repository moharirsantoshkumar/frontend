export const API = {
  RECOMMENDATIONS: "/recommendations",
  HEALTH: "/",
};
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getRecommendations(payload) {
  const response = await fetch(`${API_URL}${API.RECOMMENDATIONS}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch recommendations");
  }

  return response.json();
}

export async function getHealth() {
  const response = await fetch(`${API_URL}${API.HEALTH}`);

  if (!response.ok) {
    throw new Error("Backend is unavailable");
  }

  return response.json();
}