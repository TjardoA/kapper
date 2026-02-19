import { supabase } from "../lib/supabaseClient";

export const fetchServices = () =>
  supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: true });

export const createService = async (payload) => {
  return await supabase.from("services").insert({
    name: payload.name,
    description: payload.description,
    price: payload.price,
    duration: payload.duration,
  });
};

export const updateService = async (id, payload) => {
  return await supabase
    .from("services")
    .update({
      name: payload.name,
      description: payload.description,
      price: payload.price,
      duration: payload.duration,
    })
    .eq("id", id);
};

export const removeService = (id) =>
  supabase.from("services").delete().eq("id", id);
