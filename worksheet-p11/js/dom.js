import {
  buatPerkenalan,
  formatKeahlian,
  periksaForm,
} from "./data.js";

export const elemen = {
  filter: document.querySelector("#filter"),
  daftar: document.querySelector("#daftar"),
  pesanKosong: document.querySelector("#pesan-kosong"),

  tema: document.querySelector("#tema"),

  form: document.querySelector("#form-koleksi"),
  tombolSimpan: document.querySelector("#tombol-simpan"),
  pesanSimpan: document.querySelector("#pesan-simpan"),

  daftarKoleksi: document.querySelector("#daftar-koleksi"),

  tombolBerita: document.querySelector("#muat-berita"),
  daftarBerita: document.querySelector("#daftar-berita"),
  statusBerita: document.querySelector("#status-berita"),
};

const tombolAturUlang = document.createElement("button");
tombolAturUlang.id = "atur-ulang";
tombolAturUlang.type = "button";
tombolAturUlang.textContent = "Atur ulang pilihan";

const pesanPenyimpanan = document.createElement("p");
pesanPenyimpanan.id = "pesan-penyimpanan";
pesanPenyimpanan.setAttribute("role", "status");
pesanPenyimpanan.setAttribute("aria-live", "polite");

elemen.filter.after(tombolAturUlang, pesanPenyimpanan);

elemen.tombolAturUlang = tombolAturUlang;
elemen.pesanPenyimpanan = pesanPenyimpanan;

const namaKolom = [
  "nama-pesawat",
  "maskapai",
  "tahun-foto",
  "lokasi-foto",
];

const kolomForm = namaKolom.map((nama) => ({
  nama,
  input: document.getElementById(nama),
  pesan: document.getElementById(`galat-${nama}`),
}));

function isiTeks(selector, nilai) {
  document.querySelector(selector).textContent = nilai;
}

function gambarProfil(profil) {
  document.title = `${profil.judul} — ${profil.nama}`;

  isiTeks("#judul-halaman", profil.judul);
  isiTeks("#deskripsi-halaman", profil.deskripsi);
  isiTeks("#perkenalan", buatPerkenalan(profil));
  isiTeks("#tentang-profil", profil.tentang);

  isiTeks(
    "#keahlian",
    `Keahlian: ${formatKeahlian(profil.keahlian)}`
  );

  isiTeks(
    "#identitas-footer",
    `${profil.nama} · ${profil.nim} · ${profil.tahun}`
  );

  isiTeks("#keterangan-foto", profil.fotoUtama);
  document.querySelector("#foto-utama").alt = profil.fotoUtama;
}

function buatKartu(proyek) {
  const kartu = document.createElement("li");
  kartu.className = "kartu";

  const judul = document.createElement("h4");
  judul.textContent = proyek.judul;

  const info = document.createElement("p");
  info.textContent =
    `${proyek.tahun} · Kategori: ${proyek.kategori}`;

  const status = document.createElement("p");
  status.textContent = proyek.selesai
    ? "Status: Selesai"
    : "Status: Belum selesai";

  kartu.append(judul, info, status);
  return kartu;
}

function gambarFilter(state) {
  elemen.filter
    .querySelectorAll("button[data-kategori]")
    .forEach((tombol) => {
      const aktif =
        tombol.dataset.kategori === state.kategoriAktif;

      tombol.classList.toggle("aktif", aktif);
      tombol.setAttribute("aria-pressed", String(aktif));
    });
}

function gambarKoleksi(state) {
  elemen.daftarKoleksi.textContent = "";

  const fragmen = document.createDocumentFragment();

  state.daftarKoleksi.forEach((foto) => {
    const baris = document.createElement("tr");

    [foto.nama, foto.maskapai, foto.lokasi]
      .forEach((nilai, indeks) => {
        const sel = document.createElement(
          indeks === 0 ? "th" : "td"
        );

        if (indeks === 0) {
          sel.scope = "row";
        }

        sel.textContent = nilai;
        baris.append(sel);
      });

    fragmen.append(baris);
  });

  elemen.daftarKoleksi.append(fragmen);

  isiTeks(
    "#jumlah-koleksi",
    `Jumlah koleksi: ${state.daftarKoleksi.length}`
  );
}

function gambarForm(state) {
  const hasil = periksaForm(state.form);

  kolomForm.forEach(({ nama, input, pesan }) => {
    if (input.value !== state.form[nama]) {
      input.value = state.form[nama];
    }

    pesan.hidden =
      !state.tampilkanGalatForm || hasil[nama];

    if (state.tampilkanGalatForm) {
      input.setAttribute(
        "aria-invalid",
        String(!hasil[nama])
      );
    } else {
      input.removeAttribute("aria-invalid");
    }
  });

  elemen.tombolSimpan.disabled =
    !Object.values(hasil).every(Boolean);

  elemen.pesanSimpan.textContent = state.pesanSimpan;
}

function buatKartuBerita(berita) {
  const item = document.createElement("li");
  item.className = "kartu-berita";

  const kartu = document.createElement("article");

  const judul = document.createElement("h4");
  judul.textContent = berita.title;

  const sumber = document.createElement("p");
  sumber.className = "kartu-berita__sumber";
  sumber.textContent =
    `Sumber: ${berita.news_site || "Tidak tersedia"}`;

  const ringkasan = document.createElement("p");
  ringkasan.textContent =
    berita.summary || "Ringkasan belum tersedia.";

  kartu.append(judul, sumber, ringkasan);
  item.append(kartu);

  return item;
}

function gambarBerita(state) {
  elemen.daftarBerita.textContent = "";

  const sedangMemuat = state.statusBerita === "loading";

  elemen.tombolBerita.disabled = sedangMemuat;
  elemen.daftarBerita.setAttribute(
    "aria-busy",
    String(sedangMemuat)
  );

  if (sedangMemuat) {
    elemen.statusBerita.textContent = "Memuat berita...";
    return;
  }

  if (state.statusBerita === "error") {
    elemen.statusBerita.textContent =
      `Gagal memuat berita: ${state.pesanGalatBerita}`;
    return;
  }

  if (state.statusBerita === "empty") {
    elemen.statusBerita.textContent = "Belum ada berita.";
    return;
  }

  if (state.statusBerita === "idle") {
    elemen.statusBerita.textContent = "";
    return;
  }

  const fragmen = document.createDocumentFragment();

  state.daftarBerita.forEach((berita) => {
    fragmen.append(buatKartuBerita(berita));
  });

  elemen.daftarBerita.append(fragmen);

  elemen.statusBerita.textContent =
    `Berhasil memuat ${state.daftarBerita.length} berita.`;
}

export function fokusNamaPesawat() {
  document.querySelector("#nama-pesawat").focus();
}

export function fokusKolomTidakSah() {
  const input = elemen.form.querySelector(
    '[aria-invalid="true"]'
  );

  input?.focus();
}

function saring(state) {
  if (state.kategoriAktif === "semua") {
    return state.daftarProyek;
  }

  return state.daftarProyek.filter(
    (proyek) => proyek.kategori === state.kategoriAktif
  );
}

export function render(state) {
  // 1. Kosongkan wadah.
  elemen.daftar.textContent = "";

  const tampil = saring(state);

  gambarProfil(state.profil);
  gambarFilter(state);
  gambarKoleksi(state);
  gambarForm(state);
  gambarBerita(state);

  elemen.tema.checked = state.temaGelap;
  elemen.pesanPenyimpanan.textContent =
    state.pesanPenyimpanan;

  // 2. Periksa keadaan kosong.
  if (tampil.length === 0) {
    elemen.pesanKosong.hidden = false;
    return;
  }

  elemen.pesanKosong.hidden = true;

  // 3. Isi ulang kartu.
  const fragmen = document.createDocumentFragment();

  tampil.forEach((proyek) => {
    fragmen.append(buatKartu(proyek));
  });

  elemen.daftar.append(fragmen);
}