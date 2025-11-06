import supabase, { supabaseUrl } from "./supabase";
export async function getUni(uniId) {
    
  const { data, error } = await supabase.from("universities").select("name").eq("id", uniId ).single();
  if(error){
    console.error(error)
    throw new Error ("University can't be received")
  }
  return data;
}
