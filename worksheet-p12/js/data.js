export const profil = {
  nama: "Herizky Ganesha",
  nim: "25523103",
  peran: "Mahasiswa Informatika yang belajar front-end",
  judul: "Koleksi Foto Pesawat Favorit",
  deskripsi:
    "Kumpulan foto pesawat favorit saya beserta informasi maskapai dan lokasinya.",
  tentang:
    "Saya tertarik dengan dunia penerbangan dan mengoleksi foto pesawat yang menurut saya menarik.",
  keahlian: ["HTML", "CSS", "JavaScript"],
  tahun: 2026,
  fotoUtama: "Airbus A330-900neo Citilink",
};

export const daftarProyek = [
  {
    judul: "Halaman Profil P6",
    tahun: 2026,
    selesai: true,
    kategori: "web",
  },
  {
    judul: "Koleksi Pesawat P8",
    tahun: 2026,
    selesai: true,
    kategori: "web",
  },
  {
    judul: "Album Foto Penerbangan",
    tahun: 2026,
    selesai: false,
    kategori: "foto",
  },
];

export const daftarKoleksi = [
  {
    nama: "Airbus A330-300",
    maskapai: "Garuda Indonesia",
    lokasi: "Bandara Soekarno-Hatta",
    tahun: 2026,
  },
  {
    nama: "Boeing 777-300ER",
    maskapai: "Singapore Airlines",
    lokasi: "Bandara Changi",
    tahun: 2026,
  },
  {
    nama: "Airbus A350-900",
    maskapai: "Japan Airlines",
    lokasi: "Bandara Haneda",
    tahun: 2026,
  },
];

export function buatPerkenalan({ nama, peran }) {
  return `${nama} — ${peran}`;
}

export function formatKeahlian(daftar) {
  return daftar.join(" · ");
}

export function hitungProyekSelesai(daftar) {
  return daftar.reduce(
    (jumlah, proyek) => jumlah + (proyek.selesai ? 1 : 0),
    0
  );
}

export function ubahTahun(teks) {
  if (String(teks).trim() === "") {
    return null;
  }

  const tahun = Number(teks);

  return Number.isInteger(tahun) && tahun >= 1900 && tahun <= 2026
    ? tahun
    : null;
}

export function buatFormKosong() {
  return {
    "nama-pesawat": "",
    maskapai: "",
    "tahun-foto": "",
    "lokasi-foto": "",
  };
}

export function periksaForm(form) {
  return {
    "nama-pesawat": form["nama-pesawat"].trim() !== "",
    maskapai: form.maskapai.trim() !== "",
    "tahun-foto": ubahTahun(form["tahun-foto"]) !== null,
    "lokasi-foto": form["lokasi-foto"].trim() !== "",
  };
}