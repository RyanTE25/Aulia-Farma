import { createClient } from
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://pjlxqdlbvtzgijjnwcql.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqbHhxZGxidnR6Z2lqam53Y3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NDMzNzgsImV4cCI6MjA4NDAxOTM3OH0.6htasW1ob6fxFPNQtZjr7It9ztbOkjNE0sDpAaSBmuw"
);

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) alert(error.message);
  else window.location.href = "index.html";
}

window.login = login;
