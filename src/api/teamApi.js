import { supabase } from "../lib/supabaseClient";

export const fetchTeam = () =>
  supabase.from("team_members").select("*").order("created_at", { ascending: true });

export const saveTeam = (payload) => supabase.from("team_members").upsert([payload]);

export const deleteTeam = (id) => supabase.from("team_members").delete().eq("id", id);
