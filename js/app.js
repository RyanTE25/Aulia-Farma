import { createClient } from
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://pjlxqdlbvtzgijjnwcql.supabase.co",
  "ANON_PUBLIC_KEY_KAMU"
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

window.tambahStok = async function(id) {
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
};

window.kurangStok = async function(id, stok) {
  if (stok <= 0) return alert("Stok habis");

  await supabase
    .from("obat")
    .update({ stok: stok - 1 })
    .eq("id", id);

  loadObat();
};

loadObat();




