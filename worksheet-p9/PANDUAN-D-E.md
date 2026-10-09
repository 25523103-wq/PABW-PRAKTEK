# P9 — Bagian D dan E

Buka http://127.0.0.1:8099/worksheet-p9/html/profil.html melalui browser.
Server lokal sudah dijalankan untuk sesi ini. Jika server berhenti, jalankan
`python -m http.server 8099 --bind 127.0.0.1` dari folder `PABW`.
Gunakan alamat HTTP karena halaman memakai modul JavaScript.

## Hasil pengujian D

Diuji pada 9 Oktober 2026 menggunakan Microsoft Edge melalui Playwright,
pada `html/profil.html` dan `profil.html`.

| Yang diperiksa | Hasil pengujian |
|---|---|
| Kondisi awal | Tombol Simpan nonaktif; pesan galat belum ditampilkan. |
| Kirim form kosong melalui `requestSubmit()` | Empat pesan galat muncul, fokus ke Nama Pesawat, dan halaman tidak dimuat ulang. |
| Perbaiki satu kolom | Pesan kolom tersebut langsung hilang setelah event `input`. |
| Isi nama hanya spasi | Tetap tidak valid karena menggunakan `trim()`. |
| Tahun 1899, 2027, dan 2025.5 | Ditolak; muncul pesan tahun bulat antara 1900 dan 2026. |
| Semua kolom valid | Tombol Simpan aktif. |
| Klik Simpan | Tabel bertambah satu baris tanpa reload; muncul pesan berhasil, form kosong kembali, tombol nonaktif, fokus ke Nama Pesawat. |
| Muat ulang | Koleksi kembali ke data awal sesuai penyimpanan untuk sesi halaman. |

### Screenshot D

1. Klik navigasi **Tambah Foto** lalu buka DevTools dengan F12, tab Console.
2. Untuk form kosong, jalankan:

   ```js
   document.querySelector('#form-koleksi').requestSubmit();
   ```

3. Tutup DevTools bila ingin memotret seluruh form beserta pesan galat.
4. Isi Nama Pesawat `Airbus A330-300`, Maskapai `Garuda Indonesia`,
   Tahun Foto `2027`, Lokasi Foto `Bandara Soekarno-Hatta` untuk bukti tahun salah.
5. Ganti tahun menjadi `2026` untuk bukti tombol Simpan aktif.
6. Klik Simpan dan lihat jumlah koleksi serta pesan berhasil.

Screenshot otomatis yang sudah tersedia:

- `bukti/p9-d-kosong.png`
- `bukti/p9-d-tahun.png`
- `bukti/p9-d-valid.png`

## Hasil pengujian E

| Gejala yang diuji | Sebabnya | Perbaikan / hasil |
|---|---|---|
| Selector salah: filter tidak bekerja dan muncul galat terkait `null`. | `#filter-salah` tidak cocok dengan ID `filter` di HTML. | Selector dikembalikan ke `#filter`; Web menampilkan 2 kartu. |
| Satu klik menghasilkan dua pesan percobaan. | Dua pendengar uji ditambahkan melalui Console selain pendengar asli. | Reload menghapus keduanya; tersisa satu pendengar `click` di induk. |
| Kategori Data menghasilkan daftar kosong. | Tidak ada proyek berkategori `data`. | Tidak ada kartu, tombol Data aktif, pesan “Tidak ada proyek pada kategori itu.” terlihat. |
| Web diklik berulang | Render dijalankan berulang kali. | Tetap 2 kartu karena wadah dibersihkan sebelum diisi kembali. |

Percobaan selector salah dijalankan dengan mengganti respons `dom.js` hanya
di browser pengujian. Kondisi salah benar-benar menghasilkan 0 pendengar klik
pada `#filter`, galat `null`, dan 3 kartu yang tidak berubah ketika Web diklik.
Setelah respons asli dipulihkan, ada 1 pendengar klik dan Web menampilkan 2 kartu.
Jumlah pendengar diperiksa melalui Chrome DevTools Protocol.
Kode akhir memakai selector yang benar dan tidak menyimpan pendengar percobaan.

### Screenshot E.1 sebelum perbaikan

Screenshot ini perlu menampilkan DevTools **Elements → Event Listeners**.

1. Di `js/dom.js`, ubah sementara baris:

   ```js
   const barisFilter = document.querySelector("#filter");
   ```

   menjadi:

   ```js
   const barisFilter = document.querySelector("#filter-salah");
   ```

2. Simpan, muat ulang browser, lalu klik **Web**. Tiga kartu tetap terlihat.
3. Buka F12 → **Elements**, cari `id="filter"` dengan Ctrl+F dan pilih elemen tersebut.
4. Buka **Event Listeners**, matikan **Ancestors**. Pendengar `click` pada elemen itu tidak ada.
5. Ambil screenshot halaman beserta panel tersebut sebagai `bukti/p9-e-sebelum.png`.
6. Segera kembalikan selector menjadi `#filter`, simpan, dan muat ulang halaman.

### Screenshot E.1 sesudah perbaikan

1. Klik **Web**: tampil 2 kartu.
2. Pilih kembali `<div id="filter">` di Elements → Event Listeners.
3. Perlihatkan pendengar **click** dan halaman, lalu simpan sebagai `bukti/p9-e-sesudah.png`.

### Percobaan E.2 pendengar ganda

Jalankan kode berikut di Console, lalu klik **Web** satu kali:

```js
(() => {
    const induk = document.querySelector('#filter');
    induk.addEventListener('click', () => {
        console.log('Pendengar uji pertama berjalan');
    });
    induk.addEventListener('click', () => {
        console.log('Pendengar uji kedua berjalan');
    });
})();
```

Kedua pesan muncul untuk satu klik. Muat ulang setelah percobaan agar
dua pendengar uji hilang. Pendengar asli tetap satu dan berada di luar `render()`.

### Screenshot E.3 daftar kosong

Klik **Data**, lalu potret tombol Data aktif beserta pesan daftar kosong.
Screenshot otomatis sudah tersedia di `bukti/p9-e-filter.png`.

Screenshot otomatis hanya memuat halaman, bukan panel DevTools.
`p9-e-sebelum.png` dan `p9-e-sesudah.png` perlu Anda ambil melalui langkah di atas.
