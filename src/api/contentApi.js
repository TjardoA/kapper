import { supabase } from "../lib/supabaseClient";

// USPs
export const fetchUsps = () =>
  supabase.from("usps").select("*").order("position", { ascending: true });

export const addUsp = (text, position = 0) =>
  supabase.from("usps").insert([{ text, position }]);

export const deleteUsp = (id) => supabase.from("usps").delete().eq("id", id);

// Reviews
export const fetchReviews = () =>
  supabase.from("reviews").select("*").order("created_at", { ascending: true });

export const addReview = (payload) => supabase.from("reviews").insert([payload]);

export const deleteReview = (id) => supabase.from("reviews").delete().eq("id", id);

// Gallery
export const fetchGallery = () =>
  supabase.from("gallery_images").select("*").order("position", { ascending: true });

export const addGalleryImage = (url, position = 0) =>
  supabase.from("gallery_images").insert([{ url, position }]);

export const deleteGalleryImage = (id) =>
  supabase.from("gallery_images").delete().eq("id", id);

// Site info (singleton row id=1)
export const fetchSiteInfo = () =>
  supabase.from("site_info").select("*").eq("id", 1).single();

export const updateSiteInfo = (payload) =>
  supabase.from("site_info").update(payload).eq("id", 1);
