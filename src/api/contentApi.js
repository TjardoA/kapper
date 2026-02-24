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

export const updateUsp = async (id, payload) => {
  return await supabase
    .from("usps")
    .update({
      text: payload.text,
      position: payload.position ?? 0,
    })
    .eq("id", id);
};

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

export const addGalleryImage = async (payload) => {
  return await supabase.from("gallery_images").insert({
    url: payload.url,
    position: payload.position ?? 0,
    focal_x: payload.focal_x ?? 50,
    focal_y: payload.focal_y ?? 50,
  });
};

export const updateGalleryImage = (id, payload) =>
  supabase.from("gallery_images").update(payload).eq("id", id);

export const deleteGalleryImage = (id) =>
  supabase.from("gallery_images").delete().eq("id", id);

// =====================
// Site info (UUID singleton)
// =====================

export const fetchSiteInfo = () =>
  supabase.from("site_info").select("*").limit(1).single();

// Update op basis van bestaande id (GEEN id updaten!)
export const updateSiteInfo = async (payload) => {
  // Eerst huidige id ophalen
  const { data: existing, error: fetchError } = await supabase
    .from("site_info")
    .select("id")
    .limit(1)
    .single();

  if (fetchError) {
    return { error: fetchError };
  }

  if (!existing?.id) {
    return { error: { message: "Geen site_info rij gevonden" } };
  }

  // id en created_at verwijderen uit payload
  const { id, created_at, ...cleanPayload } = payload;

  return await supabase
    .from("site_info")
    .update(cleanPayload)
    .eq("id", existing.id);
};
