import {
  profil,
  daftarProyek,
  daftarKoleksi,
  buatFormKosong,
  periksaForm,
  ubahTahun,
} from "./data.js";

import { render } from "./dom.js";
import { ambilBerita } from "./api.js";

const KUNCI = "pabw-p11";
const VERSI = 2;

const KATEGORI_VALID = ["semua", "web", "data", "foto"];

function hapusSimpanan() {
  try {
    localStorage.removeItem(KUNCI);
    return true;
  } catch {
    return false;
  }
}

export function simpan(keadaan) {
  const isi = {
    versi: VERSI,
    kategoriAktif: keadaan.kategoriAktif,
    temaGelap: keadaan.temaGelap,
  };

  try {
    localStorage.setItem(KUNCI, JSON.stringify(isi));
    return true;
  } catch {
    return false;
  }
}

export function muat() {
  try {
    const teks = localStorage.getItem(KUNCI);

    if (teks === null) {
      return null;
    }

    const isi = JSON.parse(teks);

    const valid =
      isi !== null &&
      typeof isi === "object" &&
      !Array.isArray(isi) &&
      isi.versi === VERSI &&
      KATEGORI_VALID.includes(isi.kategoriAktif) &&
      typeof isi.temaGelap === "boolean";

    if (!valid) {
      hapusSimpanan();
      return null;
    }

    return {
      kategoriAktif: isi.kategoriAktif,
      temaGelap: isi.temaGelap,
    };
  } catch {
    hapusSimpanan();
    return null;
  }
}

const tersimpan = muat();

export const state = {
  profil,
  daftarProyek: daftarProyek.map((proyek) => ({ ...proyek })),
  daftarKoleksi: daftarKoleksi.map((foto) => ({ ...foto })),

  kategoriAktif: tersimpan?.kategoriAktif ?? "semua",
  temaGelap: tersimpan?.temaGelap ?? false,
  pesanPenyimpanan: "",

  form: buatFormKosong(),
  tampilkanGalatForm: false,
  pesanSimpan: "",

  daftarBerita: [],
  statusBerita: "idle",
  pesanGalatBerita: "",
};

function simpanPilihanDanRender() {
  const berhasil = simpan(state);

  state.pesanPenyimpanan = berhasil
    ? ""
    : "Pilihan berubah, tetapi tidak dapat disimpan di peramban.";

  render(state);
}

export function pilihKategori(nilai) {
  if (!KATEGORI_VALID.includes(nilai)) {
    return;
  }

  state.kategoriAktif = nilai;
  simpanPilihanDanRender();
}

export function ubahTema(gelap) {
  state.temaGelap = Boolean(gelap);
  simpanPilihanDanRender();
}

export function aturUlang() {
  const berhasil = hapusSimpanan();

  state.kategoriAktif = "semua";
  state.temaGelap = false;

  state.pesanPenyimpanan = berhasil
    ? "Pilihan dikembalikan ke awal dan simpanannya dihapus."
    : "Pilihan kembali ke awal, tetapi simpanan belum dapat dihapus.";

  render(state);
}

export function ubahKolomForm(nama, nilai) {
  if (!Object.hasOwn(state.form, nama)) {
    return;
  }

  state.form[nama] = nilai;
  state.tampilkanGalatForm = true;
  state.pesanSimpan = "";

  render(state);
}

export function simpanKoleksi() {
  const hasil = periksaForm(state.form);
  const sah = Object.values(hasil).every(Boolean);

  state.tampilkanGalatForm = true;

  if (!sah) {
    render(state);
    return false;
  }

  const foto = {
    nama: state.form["nama-pesawat"].trim(),
    maskapai: state.form.maskapai.trim(),
    tahun: ubahTahun(state.form["tahun-foto"]),
    lokasi: state.form["lokasi-foto"].trim(),
  };

  state.daftarKoleksi.push(foto);
  state.form = buatFormKosong();
  state.tampilkanGalatForm = false;

  state.pesanSimpan =
    `${foto.nama} ditambahkan untuk sesi ini. ` +
    "Data kembali ke awal saat halaman dimuat ulang.";

  render(state);
  return true;
}

export async function muatBerita() {
  if (state.statusBerita === "loading") {
    return;
  }

  state.statusBerita = "loading";
  state.pesanGalatBerita = "";
  state.daftarBerita = [];

  render(state);

  try {
    const data = await ambilBerita();

    state.daftarBerita = data.results;
    state.statusBerita =
      data.results.length === 0 ? "empty" : "success";
  } catch (galat) {
    state.daftarBerita = [];
    state.statusBerita = "error";

    state.pesanGalatBerita =
      galat instanceof Error ? galat.message : String(galat);
  }

  render(state);
}