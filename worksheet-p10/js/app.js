import { profil, daftarProyek, daftarKoleksi } from "./data.js";
import { hitungProyekSelesai } from "./fungsi.js";
import { ambilBerita } from "./api.js";
export { profil, daftarProyek, daftarKoleksi };

// Latihan pengolahan array P8–P9, tanpa memodifikasi data asli.
console.log("Judul proyek:", daftarProyek.map((p) => p.judul));
console.log("Proyek selesai:", daftarProyek.filter((p) => p.selesai));
console.log("Proyek pilihan:", daftarProyek.find((p) => p.kategori === "web"));
console.log("Urutan judul:", [...daftarProyek].sort((a, b) => a.judul.localeCompare(b.judul)));
console.log("Jumlah selesai:", hitungProyekSelesai(daftarProyek));

// P10 B: pemanggil menangani penolakan dari api.js.
export async function muatBerita() {
  try {
    const data = await ambilBerita();
    return { data, galat: null };
  } catch (galat) {
    return { data: null, galat: galat.message };
  }
}
