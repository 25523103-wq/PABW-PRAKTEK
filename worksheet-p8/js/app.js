import { profil, daftarProyek, daftarKoleksi } from "./data.js";
import { buatPerkenalan, formatKeahlian, hitungProyekSelesai, ubahTahun } from "./fungsi.js";

// B: angka tetap angka; akses aman bila alamat belum diisi.
const jumlahProyek = daftarProyek.length;
const kota = profil.alamat?.kota ?? "Belum diisi";
let jumlahKoleksi = daftarKoleksi.length;
const koleksiAktif = daftarKoleksi.map((foto) => ({ ...foto }));

// D: map mengubah, filter menyaring, find mengambil satu objek.
const judulProyek = daftarProyek.map((proyek) => proyek.judul);
const proyekSelesai = daftarProyek.filter((proyek) => proyek.selesai === true);
const proyekPilihan = daftarProyek.find((proyek) => proyek.judul === "Koleksi Pesawat P8");
const proyekUrut = [...daftarProyek].sort((a, b) => a.judul.localeCompare(b.judul));
const salinanProfil = { ...profil, nama: "Nama pada salinan" };
console.log(buatPerkenalan(profil));
console.log(formatKeahlian(profil.keahlian));
console.log(`Ada ${jumlahProyek} proyek; ${hitungProyekSelesai(daftarProyek)} selesai. Kota: ${kota}`);
console.table(profil.keahlian);
console.table(daftarProyek);
console.table(proyekSelesai);
console.table(daftarKoleksi);
console.log("Hasil map:", judulProyek);
console.log("Hasil find:", proyekPilihan);
console.log("Find tidak ditemukan:", daftarProyek.find((p) => p.judul === "Tidak ada"));
console.log("Urutan salinan:", proyekUrut);
console.log("Asli tetap:", daftarProyek);
console.log("Salinan profil:", salinanProfil, "Asli:", profil.nama);

// Modul tidak membuat variabel global. Gunakan import di Console:
// const m = await import('./js/data.js'); m.profil
function isiTeks(selector, nilai) {
    document.querySelector(selector).textContent = nilai;
}
isiTeks("#judul-halaman", profil.judul);
document.title = `${profil.judul} — ${profil.nama}`;
isiTeks("#deskripsi-halaman", profil.deskripsi);
isiTeks("#perkenalan", buatPerkenalan(profil));
isiTeks("#tentang-profil", profil.tentang);
isiTeks("#keahlian", `Keahlian: ${formatKeahlian(profil.keahlian)}`);
isiTeks("#identitas-footer", `${profil.nama} · ${profil.nim} · ${profil.tahun}`);
isiTeks("#keterangan-foto", profil.fotoUtama);
document.querySelector("#foto-utama").alt = profil.fotoUtama;
const daftar = document.querySelector("#daftar-proyek");
daftar.replaceChildren(...daftarProyek.map((proyek) => {
    const item = document.createElement("li");
    item.textContent = `${proyek.judul} (${proyek.tahun}) — ${proyek.selesai ? "Selesai" : "Belum selesai"}`;
    return item;
}));
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
    isiTeks("#jumlah-koleksi", `Jumlah koleksi: ${jumlahKoleksi}`);
}
tampilkanKoleksi(koleksiAktif);
// Form P6 kini berfungsi lokal; data latihan disimpan sampai halaman dimuat ulang.
document.querySelector("#form-koleksi").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const nama = form.elements["nama-pesawat"].value.trim();
    const maskapai = form.elements.maskapai.value.trim();
    const lokasi = form.elements["lokasi-foto"].value.trim();
    const tahun = ubahTahun(form.elements["tahun-foto"].value);
    if (nama === "" || maskapai === "" || lokasi === "" || tahun === null) {
        isiTeks("#pesan-simpan", "Isi semua kolom dan masukkan tahun 1900–2026.");
        return;
    }
    koleksiAktif.push({ nama, maskapai, lokasi, tahun });
    jumlahKoleksi = koleksiAktif.length;
    tampilkanKoleksi(koleksiAktif);
    isiTeks("#pesan-simpan", `${nama} ditambahkan untuk sesi ini. Data kembali ke awal saat halaman dimuat ulang.`);
    form.reset();
});
