import { supabase } from "../lib/supabaseClient";

export const fetchTeam = () =>
  supabase
    .from("team_members")
    .select("*")
    .order("created_at", { ascending: true });

export const saveTeam = async (payload) => {
  if (payload.id) {
    const updateData = {};
    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.bio !== undefined) updateData.bio = payload.bio;
    if (payload.image_url !== undefined) updateData.image_url = payload.image_url;
    if (payload.focal_y !== undefined) updateData.focal_y = payload.focal_y;
    return await supabase
      .from("team_members")
      .update(updateData)
      .eq("id", payload.id);
  }

  return await supabase.from("team_members").insert({
    name: payload.name,
    bio: payload.bio,
    image_url: payload.image_url,
    focal_y: payload.focal_y ?? 50,
  });
};

export const deleteTeam = (id) =>
  supabase.from("team_members").delete().eq("id", id);
