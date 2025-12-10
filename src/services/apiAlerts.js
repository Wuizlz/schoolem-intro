import supabase from "./supabase";

export async function getNotifications(userId) {
  const { data, error } = await supabase.rpc("get_my_notifications", {
    p_user_id: userId,
  });

  if (error) {
    console.error(error);
    throw new Error("Notifications could not be loaded");
  }

  return data;
}
