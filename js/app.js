import { createClient } from
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://pjlxqdlbvtzgijjnwcql.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqbHhxZGxidnR6Z2lqam53Y3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NDMzNzgsImV4cCI6MjA4NDAxOTM3OH0.6htasW1ob6fxFPNQtZjr7It9ztbOkjNE0sDpAaSBmuw"
);

let currentPage = 1;
const perPage = 10;

// 🔐 CEK LOGIN + ROLE
async function cekLogin() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "login.html";
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (profile.role !== "admin") {
    document.querySelector(".admin-only")?.remove();
  }
}

await cekLogin();

async function loadObat(keyword = "") {
  const from = (currentPage - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("obat")
    .select("*", { count: "exact" })
    .order("nama_barang")
    .range(from, to);

  if (keyword) {
    query = query.ilike("nama_barang", `%${keyword}%`);
  }

  const { data, count, error } = await query;
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
          <input type="number" id="qty-${o.id}" value="1" min="1" style="width:60px">
          <button onclick="tambahStok(${o.id})">+</button>
          <button onclick="kurangStok(${o.id})">−</button>
          <button onclick="editHarga(${o.id}, ${o.harga_jual})">💰</button>
        </td>
      </tr>
    `;
  });

  renderPagination(count);
}

function renderPagination(total) {
  const totalPage = Math.ceil(total / perPage);
  document.getElementById("pageInfo").innerText =
    `Page ${currentPage} / ${totalPage}`;
}

window.nextPage = () => {
  currentPage++;
  loadObat();
};

window.prevPage = () => {
  if (currentPage > 1) {
    currentPage--;
    loadObat();
  }
};

window.editHarga = async (id, hargaLama) => {
  const hargaBaru = prompt("Harga baru:", hargaLama);
  if (!hargaBaru) return;

  await supabase
    .from("obat")
    .update({ harga_jual: hargaBaru })
    .eq("id", id);

  loadObat();
};

window.tambahStok = async id => {
  const qty = Number(document.getElementById(`qty-${id}`).value);
  if (qty <= 0) return;

  const { data } = await supabase
    .from("obat")
    .select("stok")
    .eq("id", id)
    .single();

  await supabase
    .from("obat")
    .update({ stok: data.stok + qty })
    .eq("id", id);

  loadObat();
};

window.kurangStok = async id => {
  const qty = Number(document.getElementById(`qty-${id}`).value);
  if (qty <= 0) return;

  const { data } = await supabase
    .from("obat")
    .select("stok")
    .eq("id", id)
    .single();

  if (data.stok < qty) return alert("Stok tidak cukup");

  await supabase
    .from("obat")
    .update({ stok: data.stok - qty })
    .eq("id", id);

  loadObat();
};

window.logout = async () => {
  await supabase.auth.signOut();
  window.location.href = "login.html";
};

window.loadObat = loadObat;
window.tambahObat = tambahObat;

loadObat();









