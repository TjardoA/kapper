import { supabase } from "../lib/supabaseClient";

export const fetchTeam = () =>
  supabase
    .from("team_members")
    .select("*")
    .order("created_at", { ascending: true });

export const saveTeam = async (payload) => {
  if (payload.id) {
    return await supabase
      .from("team_members")
      .update({
        name: payload.name,
        bio: payload.bio,
        image_url: payload.image_url,
      })
      .eq("id", payload.id);
  }

  return await supabase.from("team_members").insert({
    name: payload.name,
    bio: payload.bio,
    image_url: payload.image_url,
  });
};

export const deleteTeam = (id) =>
  supabase.from("team_members").delete().eq("id", id);
