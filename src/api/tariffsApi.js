import { supabase } from "../lib/supabaseClient";

export const fetchTariffCategories = () =>
  supabase.from("tariff_categories").select("*").order("position", { ascending: true });

export const fetchTariffItems = () =>
  supabase.from("tariff_items").select("*").order("position", { ascending: true });

export const fetchTariffTree = () =>
  supabase
    .from("tariff_categories")
    .select(
      `
      id,
      title,
      position,
      items:tariff_items (
        id,
        name,
        price_numeric,
        price_text,
        position
      )
    `
    )
    .order("position", { ascending: true })
    .order("position", { ascending: true, foreignTable: "items" });

export const createTariffCategory = async (payload) => {
  return await supabase.from("tariff_categories").insert({
    title: payload.title,
    position: payload.position ?? 0,
  });
};

export const updateTariffCategory = async (id, payload) => {
  return await supabase
    .from("tariff_categories")
    .update({
      title: payload.title,
      position: payload.position ?? 0,
    })
    .eq("id", id);
};

export const deleteTariffCategory = (id) =>
  supabase.from("tariff_categories").delete().eq("id", id);

export const createTariffItem = async (payload) => {
  return await supabase.from("tariff_items").insert({
    category_id: payload.category_id,
    name: payload.name,
    price_numeric: payload.price_numeric ?? null,
    price_text: payload.price_text ?? null,
    position: payload.position ?? 0,
  });
};

export const updateTariffItem = async (id, payload) => {
  return await supabase
    .from("tariff_items")
    .update({
      category_id: payload.category_id,
      name: payload.name,
      price_numeric: payload.price_numeric ?? null,
      price_text: payload.price_text ?? null,
      position: payload.position ?? 0,
    })
    .eq("id", id);
};

export const deleteTariffItem = (id) =>
  supabase.from("tariff_items").delete().eq("id", id);
