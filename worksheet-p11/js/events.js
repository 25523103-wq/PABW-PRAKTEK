import {
  elemen,
  fokusNamaPesawat,
  fokusKolomTidakSah,
} from "./dom.js";

import {
  pilihKategori,
  ubahTema,
  ubahKolomForm,
  simpanKoleksi,
  muatBerita,
  aturUlang,
} from "./state.js";

export function pasangPendengar() {
  elemen.filter.addEventListener("click", (event) => {
    const tombol = event.target.closest(
      "button[data-kategori]"
    );

    if (!tombol || !elemen.filter.contains(tombol)) {
      return;
    }

    pilihKategori(tombol.dataset.kategori);
  });

  elemen.tema.addEventListener("change", (event) => {
    ubahTema(event.target.checked);
  });

  elemen.tombolAturUlang.addEventListener("click", () => {
    aturUlang();
  });

  elemen.form.addEventListener("input", (event) => {
    const input = event.target;

    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    ubahKolomForm(input.id, input.value);
  });

  elemen.form.addEventListener("submit", (event) => {
    event.preventDefault();

    const berhasil = simpanKoleksi();

    if (berhasil) {
      fokusNamaPesawat();
    } else {
      fokusKolomTidakSah();
    }
  });

  elemen.tombolBerita.addEventListener("click", () => {
    muatBerita();
  });
}