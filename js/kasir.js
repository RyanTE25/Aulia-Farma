import { supabase } from "./supabase.js";

let cart = [];

async function tambahItem() {
  const id = document.getElementById("kode").value;
  const qty = Number(document.getElementById("qty").value);

  const { data: obat } = await supabase
    .from("obat")
    .select("*")
    .eq("id", id)
    .single();

  if (!obat) return alert("Obat tidak ditemukan");

  const existing = cart.find(i => i.id === obat.id);
  if (existing) {
    existing.qty += qty;
    existing.jumlah += qty * obat.harga_jual;
  } else {
    cart.push({
      id: obat.id,
      nama: obat.nama_barang,
      harga: obat.harga_jual,
      qty,
      jumlah: qty * obat.harga_jual
    });
  }

  renderCart();
}

function renderCart() {
  const tbody = document.getElementById("cart");
  tbody.innerHTML = "";

  let totalItem = 0;
  let totalHarga = 0;

  cart.forEach(i => {
    totalItem += i.qty;
    totalHarga += i.jumlah;

    tbody.innerHTML += `
      <tr>
        <td>${i.nama}</td>
        <td>${i.harga}</td>
        <td>${i.qty}</td>
        <td>${i.jumlah}</td>
      </tr>
    `;
  });

  document.getElementById("totalItem").innerText = totalItem;
  document.getElementById("totalHarga").innerText =
    totalHarga.toLocaleString("id-ID");
}

async function simpanTransaksi() {
  const no = "TRX-" + Date.now();

  const { data: penjualan } = await supabase
    .from("penjualan")
    .insert({
      no_transaksi: no,
      total_item: cart.reduce((a,b)=>a+b.qty,0),
      total_harga: cart.reduce((a,b)=>a+b.jumlah,0)
    })
    .select()
    .single();

  for (const i of cart) {
    const { data: obat } = await supabase
      .from("obat")
      .select("stok")
      .eq("id", i.id)
      .single();

    await supabase
      .from("obat")
      .update({ stok: obat.stok - i.qty })
      .eq("id", i.id);
  }

  alert("Transaksi berhasil");
  window.print();
  cart = [];
  renderCart();
}

window.tambahItem = tambahItem;
window.simpanTransaksi = simpanTransaksi;

window.logout = async () => {
  await supabase.auth.signOut();
  location.href = "login.html";
};

