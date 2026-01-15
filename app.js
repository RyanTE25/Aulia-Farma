alert("SCRIPT JS KELOAD");

import { createClient } from
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://pjlxqdlbvtzgijjnwcql.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqbHhxZGxidnR6Z2lqam53Y3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NDMzNzgsImV4cCI6MjA4NDAxOTM3OH0.6htasW1ob6fxFPNQtZjr7It9ztbOkjNE0sDpAaSBmuw"
);

async function loadObat() {
  const { data, error } = await supabase
    .from("obat")
    .select("*")
    .order("nama_barang");

  if (error) {
    console.error(error);
    return;
  }

  const tbody = document.getElementById("hasil");
  tbody.innerHTML = "";

  data.forEach(o => {
    tbody.innerHTML += `
      <tr>
        <td>${o.nama_barang}</td>
        <td>${o.satuan}</td>
        <td>Rp ${Number(o.harga_jual).toLocaleString("id-ID")}</td>
        <td>${o.stok}</td>
        <td>
          <button onclick="tambahStok(${o.id})">+</button>
          <button onclick="kurangStok(${o.id}, ${o.stok})">−</button>
        </td>
      </tr>
    `;
  });
}

async function tambahStok(id) {
  const { data, error } = await supabase
    .from("obat")
    .select("stok")
    .eq("id", id)
    .single();

  if (error) return console.error(error);

  await supabase
    .from("obat")
    .update({ stok: data.stok + 1 })
    .eq("id", id);

  loadObat();
}

async function kurangStok(id, stok) {
  if (stok <= 0) return alert("Stok habis");

  await supabase
    .from("obat")
    .update({ stok: stok - 1 })
    .eq("id", id);

  loadObat();
}


