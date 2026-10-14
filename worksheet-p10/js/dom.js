import { profil, daftarProyek, daftarKoleksi, muatBerita } from "./app.js";
import { buatPerkenalan, formatKeahlian, ubahTahun } from "./fungsi.js";

const isiTeks = (selector, nilai) => {
  document.querySelector(selector).textContent = nilai;
};
isiTeks("#judul-halaman", profil.judul);
document.title = `${profil.judul} — ${profil.nama}`;
isiTeks("#deskripsi-halaman", profil.deskripsi);
isiTeks("#perkenalan", buatPerkenalan(profil));
isiTeks("#tentang-profil", profil.tentang);
isiTeks("#keahlian", `Keahlian: ${formatKeahlian(profil.keahlian)}`);
isiTeks("#identitas-footer", `${profil.nama} · ${profil.nim} · ${profil.tahun}`);
isiTeks("#keterangan-foto", profil.fotoUtama);
document.querySelector("#foto-utama").alt = profil.fotoUtama;

// P9: render dan event delegation untuk filter proyek.
const wadah = document.querySelector("#daftar");
const kosong = document.querySelector("#pesan-kosong");
const barisFilter = document.querySelector("#filter");
function buatKartu(proyek) {
  const kartu = document.createElement("li");
  kartu.className = "kartu";
  const judul = document.createElement("h4");
  judul.textContent = proyek.judul;
  const info = document.createElement("p");
  info.textContent = `${proyek.tahun} · Kategori: ${proyek.kategori}`;
  const status = document.createElement("p");
  status.textContent = proyek.selesai ? "Status: Selesai" : "Status: Belum selesai";
  kartu.append(judul, info, status);
  return kartu;
}
function render(data) {
  wadah.textContent = "";
  kosong.hidden = data.length !== 0;
  const fragmen = document.createDocumentFragment();
  fragmen.append(...data.map(buatKartu));
  wadah.append(fragmen);
}
render(daftarProyek);
barisFilter.addEventListener("click", (event) => {
  const tombol = event.target.closest("button");
  if (!tombol || !barisFilter.contains(tombol)) return;
  barisFilter.querySelectorAll("button").forEach((item) => {
    item.classList.toggle("aktif", item === tombol);
    item.setAttribute("aria-pressed", String(item === tombol));
  });
  render(daftarProyek.filter((p) => tombol.dataset.kategori === "semua" || p.kategori === tombol.dataset.kategori));
});

// P9: validasi form dan penambahan koleksi selama sesi halaman.
const koleksiAktif = daftarKoleksi.map((foto) => ({ ...foto }));
function tampilkanKoleksi(data) {
  const baris = data.map((foto) => {
    const tr = document.createElement("tr");
    [foto.nama, foto.maskapai, foto.lokasi].forEach((nilai, indeks) => {
      const sel = document.createElement(indeks === 0 ? "th" : "td");
      if (indeks === 0) sel.scope = "row";
      sel.textContent = nilai;
      tr.append(sel);
    });
    return tr;
  });
  document.querySelector("#daftar-koleksi").replaceChildren(...baris);
  isiTeks("#jumlah-koleksi", `Jumlah koleksi: ${data.length}`);
}
tampilkanKoleksi(koleksiAktif);
const formKoleksi = document.querySelector("#form-koleksi");
const tombolSimpan = document.querySelector("#tombol-simpan");
const aturanKolom = ["nama-pesawat", "maskapai", "tahun-foto", "lokasi-foto"].map((id) => ({
  input: document.getElementById(id),
  pesan: document.getElementById(`galat-${id}`)
}));
function validasiForm(tampilkanPesan = true) {
  const hasil = aturanKolom.map(({ input, pesan }) => {
    const sah = input.id === "tahun-foto" ? ubahTahun(input.value) !== null : input.value.trim() !== "";
    pesan.hidden = !tampilkanPesan || sah;
    if (tampilkanPesan) input.setAttribute("aria-invalid", String(!sah));
    else input.removeAttribute("aria-invalid");
    return sah;
  });
  const semuaSah = hasil.every(Boolean);
  tombolSimpan.disabled = !semuaSah;
  return semuaSah;
}
formKoleksi.addEventListener("input", () => {
  validasiForm();
  isiTeks("#pesan-simpan", "");
});
formKoleksi.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validasiForm()) {
    formKoleksi.querySelector('[aria-invalid="true"]').focus();
    return;
  }
  const nilai = (id) => document.getElementById(id).value.trim();
  const foto = {
    nama: nilai("nama-pesawat"), maskapai: nilai("maskapai"),
    lokasi: nilai("lokasi-foto"), tahun: ubahTahun(nilai("tahun-foto"))
  };
  koleksiAktif.push(foto);
  tampilkanKoleksi(koleksiAktif);
  isiTeks("#pesan-simpan", `${foto.nama} ditambahkan untuk sesi ini. Data kembali ke awal saat halaman dimuat ulang.`);
  formKoleksi.reset();
  validasiForm(false);
  document.getElementById("nama-pesawat").focus();
});
validasiForm(false);

// P10 D: penggambar hanya menerima array, tanpa permintaan jaringan.
const statusBerita = document.querySelector("#status-berita");
const daftarBerita = document.querySelector("#daftar-berita");
const tombolMuatBerita = document.querySelector("#muat-berita");
export function gambarBerita(daftar) {
  daftarBerita.textContent = "";
  if (daftar.length === 0) {
    statusBerita.textContent = "Belum ada berita.";
    return;
  }
  const fragmen = document.createDocumentFragment();
  daftar.forEach((berita) => {
    const item = document.createElement("li");
    item.className = "kartu-berita";
    const kartu = document.createElement("article");
    const judul = document.createElement("h4");
    judul.textContent = berita.title;
    const sumber = document.createElement("p");
    sumber.className = "kartu-berita__sumber";
    sumber.textContent = `Sumber: ${berita.news_site || "Tidak tersedia"}`;
    const ringkasan = document.createElement("p");
    ringkasan.textContent = berita.summary || "Ringkasan belum tersedia.";
    kartu.append(judul, sumber, ringkasan);
    item.append(kartu);
    fragmen.append(item);
  });
  daftarBerita.append(fragmen);
  statusBerita.textContent = `Berhasil memuat ${daftar.length} berita.`;
}
async function tampilkanBerita() {
  daftarBerita.textContent = "";
  statusBerita.textContent = "Memuat berita...";
  tombolMuatBerita.disabled = true;
  daftarBerita.setAttribute("aria-busy", "true");
  try {
    const hasil = await muatBerita();
    if (hasil.galat !== null) {
      statusBerita.textContent = `Gagal memuat berita: ${hasil.galat}`;
      return;
    }
    const data = hasil.data;
    console.log("Bentuk data API:", data);
    console.table(data.results.map((berita) => ({ id: berita.id, judul: berita.title, unggulan: berita.featured })));
    const teksJSON = JSON.stringify(data);
    console.log("Hasil stringify bertipe:", typeof teksJSON);
    const dataKembali = JSON.parse(teksJSON);
    console.log("Hasil parse:", dataKembali);
    gambarBerita(data.results);
  } catch (galat) {
    daftarBerita.textContent = "";
    statusBerita.textContent = `Gagal menampilkan berita: ${galat.message}`;
  } finally {
    tombolMuatBerita.disabled = false;
    daftarBerita.setAttribute("aria-busy", "false");
  }
}
tombolMuatBerita.addEventListener("click", tampilkanBerita);
tampilkanBerita();
