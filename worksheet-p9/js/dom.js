import { profil, daftarProyek, daftarKoleksi } from "./app.js";

import {
    buatPerkenalan,
    formatKeahlian,
    ubahTahun,
} from "./fungsi.js";

const wadah = document.querySelector("#daftar");
const barisFilter = document.querySelector("#filter");
const kosong = document.querySelector("#pesan-kosong");

const formKoleksi = document.querySelector("#form-koleksi");
const kolomNama = document.querySelector("#nama-pesawat");
const kolomMaskapai = document.querySelector("#maskapai");
const kolomTahun = document.querySelector("#tahun-foto");
const kolomLokasi = document.querySelector("#lokasi-foto");

const koleksiAktif = daftarKoleksi.map((foto) => ({ ...foto }));
let jumlahKoleksi = koleksiAktif.length;

function isiTeks(selector, nilai) {
    const elemen = document.querySelector(selector);
    elemen.textContent = nilai;
}

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

function tampilkanKoleksi(data) {
    const baris = data.map((foto) => {
        const tr = document.createElement("tr");

        [foto.nama, foto.maskapai, foto.lokasi].forEach(
            (nilai, indeks) => {
                const sel = document.createElement(
                    indeks === 0 ? "th" : "td"
                );

                if (indeks === 0) {
                    sel.scope = "row";
                }

                sel.textContent = nilai;
                tr.append(sel);
            }
        );

        return tr;
    });

    document.querySelector("#daftar-koleksi").replaceChildren(...baris);

    isiTeks("#jumlah-koleksi", `Jumlah koleksi: ${jumlahKoleksi}`);
}

tampilkanKoleksi(koleksiAktif);

// D — Elemen tombol dan pesan validasi.
const tombolSimpan = document.querySelector("#tombol-simpan");

const aturanKolom = [
    {
        input: kolomNama,
        pesan: document.querySelector("#galat-nama"),
        pesanKosong: "Isi nama pesawat, misalnya Airbus A330-300.",
    },
    {
        input: kolomMaskapai,
        pesan: document.querySelector("#galat-maskapai"),
        pesanKosong: "Isi nama maskapai, misalnya Garuda Indonesia.",
    },
    {
        input: kolomTahun,
        pesan: document.querySelector("#galat-tahun"),
        pesanKosong: "Isi tahun foto antara 1900 dan 2026.",
    },
    {
        input: kolomLokasi,
        pesan: document.querySelector("#galat-lokasi"),
        pesanKosong: "Isi lokasi foto, misalnya Bandara Soekarno-Hatta.",
    },
];

// Menentukan pesan kesalahan satu kolom.
function ambilPesanGalat(aturan) {
    const nilai = aturan.input.value.trim();

    if (nilai === "") {
        return aturan.pesanKosong;
    }

    if (
        aturan.input === kolomTahun &&
        ubahTahun(nilai) === null
    ) {
        return "Gunakan tahun bulat antara 1900 dan 2026.";
    }

    return "";
}

// Memeriksa semua kolom dan memperbarui tombol.
function validasiForm(tampilkanPesan = true) {
    const hasil = aturanKolom.map((aturan) => {
        const pesan = ambilPesanGalat(aturan);
        const sah = pesan === "";

        if (tampilkanPesan) {
            aturan.pesan.textContent = pesan;
            aturan.pesan.hidden = sah;

            aturan.input.setAttribute(
                "aria-invalid",
                String(!sah)
            );
        } else {
            aturan.pesan.textContent = "";
            aturan.pesan.hidden = true;
            aturan.input.removeAttribute("aria-invalid");
        }

        return sah;
    });

    const semuaSah = hasil.every((sah) => sah);

    tombolSimpan.disabled = !semuaSah;

    return semuaSah;
}

// Memeriksa ulang ketika pengguna mengetik.
formKoleksi.addEventListener("input", () => {
    validasiForm();
    isiTeks("#pesan-simpan", "");
});

// Mencegah reload dan memproses data yang valid.
formKoleksi.addEventListener("submit", (event) => {
    event.preventDefault();

    const sah = validasiForm();

    if (!sah) {
        const pertamaBermasalah = aturanKolom.find(
            (aturan) => ambilPesanGalat(aturan) !== ""
        );

        pertamaBermasalah.input.focus();
        return;
    }

    const fotoBaru = {
        nama: kolomNama.value.trim(),
        maskapai: kolomMaskapai.value.trim(),
        tahun: ubahTahun(kolomTahun.value),
        lokasi: kolomLokasi.value.trim(),
    };

    koleksiAktif.push(fotoBaru);

    jumlahKoleksi = koleksiAktif.length;
    tampilkanKoleksi(koleksiAktif);

    isiTeks(
        "#pesan-simpan",
        `${fotoBaru.nama} berhasil ditambahkan untuk sesi ini. ` +
        "Data kembali ke awal saat halaman dimuat ulang."
    );

    formKoleksi.reset();
    validasiForm(false);
    kolomNama.focus();
});

validasiForm(false);

function buatKartu(proyek) {
    const li = document.createElement("li");
    li.className = "kartu";

    const judul = document.createElement("h4");
    judul.className = "kartu__judul";
    judul.textContent = proyek.judul;

    const informasi = document.createElement("p");
    informasi.textContent =
        `${proyek.tahun} · Kategori: ${proyek.kategori}`;

    const status = document.createElement("p");
    status.textContent = proyek.selesai
        ? "Status: Selesai"
        : "Status: Belum selesai";

    li.append(judul, informasi, status);

    return li;
}

function render(data) {
    wadah.textContent = "";

    kosong.hidden = data.length !== 0;

    if (data.length === 0) {
        return;
    }

    const fragmen = document.createDocumentFragment();
    const kartu = data.map((proyek) => buatKartu(proyek));

    fragmen.append(...kartu);
    wadah.append(fragmen);
}

render(daftarProyek);
function tandaiTombolAktif(tombolAktif) {
    barisFilter.querySelectorAll("button").forEach((tombol) => {
        const aktif = tombol === tombolAktif;

        tombol.classList.toggle("aktif", aktif);
        tombol.setAttribute("aria-pressed", String(aktif));
    });
}
barisFilter.addEventListener("click", (event) => {
    const tombol = event.target.closest("button");

    if (!tombol || !barisFilter.contains(tombol)) {
        return;
    }

    const kategori = tombol.dataset.kategori;

    const terpilih = daftarProyek.filter((proyek) => {
        return kategori === "semua" || proyek.kategori === kategori;
    });

    tandaiTombolAktif(tombol);
    render(terpilih);
});
