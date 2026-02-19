import { supabase } from "../lib/supabaseClient";

// =====================
// USPs
// =====================

export const fetchUsps = () =>
  supabase.from("usps").select("*").order("position", { ascending: true });

export const addUsp = async (text, position = 0) => {
  return await supabase.from("usps").insert({
    text,
    position,
  });
};

export const deleteUsp = (id) => supabase.from("usps").delete().eq("id", id);

// =====================
// Reviews
// =====================

export const fetchReviews = () =>
  supabase.from("reviews").select("*").order("created_at", { ascending: true });

export const addReview = async (payload) => {
  return await supabase.from("reviews").insert({
    name: payload.name,
    text: payload.text,
    rating: payload.rating,
  });
};

export const deleteReview = (id) =>
  supabase.from("reviews").delete().eq("id", id);

// =====================
// Gallery
// =====================

export const fetchGallery = () =>
  supabase
    .from("gallery_images")
    .select("*")
    .order("position", { ascending: true });

export const addGalleryImage = async (url, position = 0) => {
  return await supabase.from("gallery_images").insert({
    url,
    position,
  });
};

export const deleteGalleryImage = (id) =>
  supabase.from("gallery_images").delete().eq("id", id);

// =====================
// Site info (UUID singleton)
// =====================

// Pak gewoon de eerste rij
export const fetchSiteInfo = () =>
  supabase.from("site_info").select("*").limit(1).single();

// Update op basis van bestaande id
export const updateSiteInfo = async (payload) => {
  const { data } = await supabase
    .from("site_info")
    .select("id")
    .limit(1)
    .single();

  if (!data?.id) return { error: { message: "Geen site_info rij gevonden" } };

  return await supabase.from("site_info").update(payload).eq("id", data.id);
};
