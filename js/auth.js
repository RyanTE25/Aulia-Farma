import { supabase } from "./supabase.js";

export async function cekLogin() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) location.href = "login.html";
  return session;
}

export async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);

  location.href = "index.html";
}

export async function getRole() {
  const session = await cekLogin();

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (error) throw error;
  return data.role;
}

export async function logout() {
  await supabase.auth.signOut();
  location.href = "login.html";
}

window.login = login;
