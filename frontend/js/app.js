
fetch("https://GANTI_URL_BACKEND/api/get_obat.php")
.then(r=>r.json())
.then(r=>{
  const t=document.getElementById("hasil");
  r.data.forEach(o=>{
    t.innerHTML+=`<tr>
      <td>${o.nama_barang}</td>
      <td>${o.satuan}</td>
      <td>${o.harga_rupiah}</td>
      <td>${o.stok}</td>
    </tr>`;
  });
});
