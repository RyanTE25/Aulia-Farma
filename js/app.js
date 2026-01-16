import { createClient } from
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://pjlxqdlbvtzgijjnwcql.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqbHhxZGxidnR6Z2lqam53Y3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NDMzNzgsImV4cCI6MjA4NDAxOTM3OH0.6htasW1ob6fxFPNQtZjr7It9ztbOkjNE0sDpAaSBmuw"
);

// 🔐 CEK LOGIN DENGAN SESSION
async function cekLogin() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = "login.html";
    return;
  }

  const role = session.user.role;

  if (role !== "admin") {
    document.querySelector(".admin-only")?.remove();
  }
}

await cekLogin();

async function loadObat(keyword = "") {
  let query = supabase
    .from("obat")
    .select("*")
    .order("nama_barang");

  if (keyword) {
    query = query.ilike("nama_barang", `%${keyword}%`);
  }

  const { data, error } = await query;
  if (error) return console.error(error);

  const tbody = document.getElementById("hasil");
  tbody.innerHTML = "";

  data.forEach(o => {
    tbody.innerHTML += `
      <tr>
        <td class="nama">${o.nama_barang}</td>
        <td>${o.satuan}</td>
        <td>Rp ${Number(o.harga_jual).toLocaleString("id-ID")}</td>
        <td>${o.stok}</td>
        <td>
          <button onclick="tambahStok(${o.id})">+</button>
          <button onclick="kurangStok(${o.id}, ${o.stok})">−</button>
          <button onclick="editHarga(${o.id}, ${o.harga_jual})">...</button>
        </td>
      </tr>
    `;
  });
}

async function tambahObat() {
  const nama = document.getElementById("nama").value;
  const satuan = document.getElementById("satuan").value;
  const harga = document.getElementById("harga").value;

  if (!nama || !harga) return alert("Nama & harga wajib");

  await supabase.from("obat").insert({
    nama_barang: nama,
    satuan,
    harga_jual: harga,
    stok: 0
  });

  loadObat();
}

async function editHarga(id, hargaLama) {
  const hargaBaru = prompt("Harga baru:", hargaLama);
  if (!hargaBaru) return;

  await supabase
    .from("obat")
    .update({ harga_jual: hargaBaru })
    .eq("id", id);

  loadObat();
}

window.tambahStok = async (id) => {
  const { data } = await supabase
    .from("obat")
    .select("stok")
    .eq("id", id)
    .single();

  await supabase
    .from("obat")
    .update({ stok: data.stok + 1 })
    .eq("id", id);

  loadObat();
};

window.kurangStok = async (id, stok) => {
  if (stok <= 0) return alert("Stok habis");

  await supabase
    .from("obat")
    .update({ stok: stok - 1 })
    .eq("id", id);

  loadObat();
};

window.logout = async function () {
  await supabase.auth.signOut();
  window.location.href = "login.html";
};

window.loadObat = loadObat;
window.tambahObat = tambahObat;

cekLogin();
loadObat();








