import { supabase } from "../lib/supabaseClient";

export const fetchServices = () =>
  supabase.from("services").select("*").order("created_at", { ascending: true });

export const createService = (payload) =>
  supabase.from("services").insert([payload]);

export const updateService = (id, payload) =>
  supabase.from("services").update(payload).eq("id", id);

export const removeService = (id) =>
  supabase.from("services").delete().eq("id", id);
