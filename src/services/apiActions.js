import supabase from "./supabase";

export async function createFollower(followerId, followeeId) {
  if (!(followerId && followeeId))
    throw new Error("Need both follower and followee to perform action");

  const { error } = await supabase.from("followings").insert({
    follower_id: followerId,
    followee_id: followeeId,
  });

  if (error) throw error;
}

export async function removeFollow(follower_id, followee_id) {
  if (!(follower_id && followee_id))
    throw new Error("Need both follower and followee to perform action");

  const { error } = await supabase
    .from("followings")
    .delete()
    .eq("follower_id", follower_id)
    .eq("followee_id", followee_id);
  if (error) throw error;


}

export async function amIfollowing(followerId, followeeId) {
  if (!(followerId && followeeId)) throw new Error("No users to act on");

  const { data, error } = await supabase
    .from("followings")
    .select("id")
    .eq("follower_id", followerId)
    .eq("followee_id", followeeId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") throw error;
  return !!data;
}
