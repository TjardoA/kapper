import { supabase } from "../lib/supabaseClient";

export const fetchOpening = () =>
  supabase.from("opening_hours").select("*").order("day", { ascending: true });

export const saveOpening = (payload) =>
  supabase.from("opening_hours").upsert([payload]);

export const deleteOpening = (id) =>
  supabase.from("opening_hours").delete().eq("id", id);
