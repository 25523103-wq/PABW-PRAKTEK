import { profil, daftarProyek, daftarKoleksi } from "./data.js";

import {
    buatPerkenalan,
    formatKeahlian,
    hitungProyekSelesai,
} from "./fungsi.js";

export { profil, daftarProyek, daftarKoleksi };

const jumlahProyek = daftarProyek.length;

const kota = profil.alamat?.kota ?? "Belum diisi";

const judulProyek = daftarProyek.map((proyek) => proyek.judul);

const proyekSelesai = daftarProyek.filter(
    (proyek) => proyek.selesai === true
);

const proyekPilihan = daftarProyek.find(
    (proyek) => proyek.judul === "Koleksi Pesawat P8"
);

const proyekUrut = [...daftarProyek].sort(
    (a, b) => a.judul.localeCompare(b.judul)
);

const salinanProfil = {
    ...profil,
    nama: "Nama pada salinan",
};

console.log(buatPerkenalan(profil));

console.log(formatKeahlian(profil.keahlian));

console.log(
    `Ada ${jumlahProyek} proyek; ` +
    `${hitungProyekSelesai(daftarProyek)} selesai. Kota: ${kota}`
);

console.table(profil.keahlian);

console.table(daftarProyek);

console.table(proyekSelesai);

console.log("Hasil map:", judulProyek);

console.log("Hasil find:", proyekPilihan);

console.log("Urutan salinan:", proyekUrut);

console.log("Urutan asli:", daftarProyek);

console.log("Salinan profil:", salinanProfil);