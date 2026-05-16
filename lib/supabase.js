import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export async function signInWithGoogle() {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/onboarding`,
    },
  });
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function saveUserPreferences({
  userId,
  selectedCategory,
  weights,
}) {

  const { data, error } = await supabase
    .from("user_preferences")
    .insert([
      {
        user_id: userId,
        selected_category: selectedCategory,

        price_sensitivity: weights["Price sensitivity"],
        delivery_speed: weights["Delivery speed"],
        sustainability: weights["Sustainability"],
        review_depth: weights["Review depth"],
        brand_trust: weights["Brand trust"],
      },
    ]);

  if (error) {
    console.error("Error saving preferences:", error);
  }

  return data;
}

export async function fetchUserPreferences(userId) {

  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching preferences:", error);
    return null;
  }

  return data;
}

export async function saveRecommendationSession({
  userId,
  category,
  recommendationData,
}) {

  const topRecommendation =
    recommendationData.top_recommendation;

  const { data, error } = await supabase
    .from("recommendation_sessions")
    .insert([
      {
        user_id: userId,

        category,

        top_product_name:
          topRecommendation?.name || "",

        top_product_score:
          topRecommendation?.score || 0,

        recommendation_payload:
          recommendationData,
      },
    ]);

  if (error) {
    console.error(
      "Error saving recommendation session:",
      error
    );
  }

  return data;
}

export async function fetchRecommendationSessions(userId) {

  const { data, error } = await supabase
    .from("recommendation_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(
      "Error fetching recommendation sessions:",
      error
    );

    return [];
  }

  return data;
}