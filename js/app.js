import { supabase } from "./supabase.js";
import { getRole } from "./auth.js";

// =======================
// ROLE CHECK
// =======================
const role = await getRole();
if (role !== "admin") {
  document.querySelector(".admin-only")?.remove();
}

// =======================
// PAGINATION
// =======================
let currentPage = 1;
const perPage = 10;

window.prevPage = () => {
  if (currentPage > 1) {
    currentPage--;
    loadObat();
  }
};

window.nextPage = () => {
  currentPage++;
  loadObat();
};

// =======================
// LOAD OBAT
// =======================
async function loadObat(keyword = "") {
  const from = (currentPage - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("obat")
    .select("*", { count: "exact" })
    .order("nama_barang", { ascending: true })
    .range(from, to);

  if (keyword) {
    query = query.ilike("nama_barang", `%${keyword}%`);
  }

  const { data, count, error } = await query;
  if (error) {
    console.error(error);
    return;
  }

  const tbody = document.getElementById("hasil");
  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">Data kosong</td></tr>`;
    return;
  }

  data.forEach(o => {
    tbody.innerHTML += `
      <tr>
        <td>${o.nama_barang}</td>
        <td>${o.satuan || "-"}</td>
        <td>Rp ${o.harga_jual.toLocaleString("id-ID")}</td>
        <td>${o.stok}</td>
        <td>
          <input type="number" id="qty-${o.id}" value="1" min="1" style="width:60px">
          <button onclick="tambahStok(${o.id})">+</button>
          <button onclick="kurangStok(${o.id})">−</button>
          ${role === "admin" ? `<button onclick="editHarga(${o.id}, ${o.harga_jual})">💰</button>` : ""}
        </td>
      </tr>
    `;
  });

  document.getElementById("pageInfo").innerText =
    `Page ${currentPage} / ${Math.ceil(count / perPage)}`;
}

// =======================
// TAMBAH OBAT
// =======================
async function tambahObat() {
  const nama = document.getElementById("namaInput").value.trim();
  const satuan = document.getElementById("satuanInput").value.trim();
  const harga = Number(document.getElementById("hargaInput").value);
  const stok = Number(document.getElementById("stokInput").value);

  if (!nama || !harga) return alert("Nama & harga wajib");

  const { error } = await supabase.from("obat").insert({
    nama_barang: nama,
    satuan,
    harga_jual: harga,
    stok
  });

  if (error) {
    alert(error.message);
    return;
  }

  loadObat();
}

// =======================
// STOK & HARGA
// =======================
window.tambahStok = async id => {
  const qty = Number(document.getElementById(`qty-${id}`).value);
  const { data } = await supabase.from("obat").select("stok").eq("id", id).single();
  await supabase.from("obat").update({ stok: data.stok + qty }).eq("id", id);
  loadObat();
};

window.kurangStok = async id => {
  const qty = Number(document.getElementById(`qty-${id}`).value);
  const { data } = await supabase.from("obat").select("stok").eq("id", id).single();
  if (data.stok < qty) return alert("Stok kurang");
  await supabase.from("obat").update({ stok: data.stok - qty }).eq("id", id);
  loadObat();
};

window.editHarga = async (id, lama) => {
  const baru = prompt("Harga baru:", lama);
  if (!baru) return;
  await supabase.from("obat").update({ harga_jual: Number(baru) }).eq("id", id);
  loadObat();
};

// =======================
// LOGOUT (INI FIX UTAMA)
// =======================
window.logout = async () => {
  console.log("LOGOUT CLICKED");
  await supabase.auth.signOut();
  location.href = "login.html";
};

// =======================
window.loadObat = loadObat;
window.tambahObat = tambahObat;

loadObat();
