// js/auth.js
import { supabase } from "./supabase.js";

export async function logout() {
  await supabase.auth.signOut();
  window.location.href = "login.html";
}

export async function getRole() {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return data?.role;
}
