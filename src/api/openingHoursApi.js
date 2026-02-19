import { supabase } from "../lib/supabaseClient";

export const fetchOpening = () =>
  supabase.from("opening_hours").select("*").order("day", { ascending: true });

export const saveOpening = async (payload) => {
  if (payload.id) {
    // BESTAANDE rij → update
    return await supabase
      .from("opening_hours")
      .update({
        day: payload.day,
        open_time: payload.open_time,
        close_time: payload.close_time,
      })
      .eq("id", payload.id);
  }

  // NIEUWE rij → insert (GEEN id meesturen)
  return await supabase.from("opening_hours").insert({
    day: payload.day,
    open_time: payload.open_time,
    close_time: payload.close_time,
  });
};

export const deleteOpening = (id) =>
  supabase.from("opening_hours").delete().eq("id", id);
