# Hasil pemeriksaan

## Sudah diperiksa secara statis

- Struktur tag HTML berpasangan dengan benar, ID unik, dan tautan internal menuju ID yang tersedia.
- Lima file CSS terhubung dan foto Citilink tersedia.
- Isi tabel, foto, formulir, dan data identitas P4 tetap tersedia.
- `tokens.css`, `base.css`, dan `tema.css` identik dengan P4.
- `layout.css` dan `komponen.css` tidak memakai deklarasi margin, float, atau !important.
- Lebar kolom tidak menggunakan ukuran piksel.
- Kerangka memiliki aturan tiga baris grid dan area bernama.
- Aturan galeri memakai auto-fit tanpa media query untuk galeri.
- Penerapan file tahap B, C, D, dan E pada salinan P4 menghasilkan kode yang identik dengan versi final.

## Belum dapat diperiksa secara visual

Browser pengujian tidak tersedia dan unduhannya gagal. Karena itu, hasil di bawah belum dinyatakan lulus: tampilan 360 px dan 1280 px, pergantian jumlah kolom, tinggi kartu aktual, overflow aktual, dan interaksi tema gelap. Pemeriksaan kode tidak menggantikan pengujian di browser.

## Langkah uji di Chrome / Firefox

1. Buka `profil.html`, lalu DevTools (F12).
2. Aktifkan mode perangkat/responsive dan masukkan lebar 360 px.
3. Pastikan sidebar, koleksi, dan formulir tersusun ke bawah. Galeri diharapkan satu kolom.
4. Ganti lebar menjadi 1280 px. Sidebar diharapkan di kiri, koleksi/formulir di kanan, dan galeri dua kolom.
5. Pastikan halaman tidak bergulir horizontal. Di Console jalankan:

```js
({
  lebarLayar: document.documentElement.clientWidth,
  lebarIsi: document.documentElement.scrollWidth,
  tidakMeluber: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
  kolomGaleri: getComputedStyle(document.querySelector('.galeri')).gridTemplateColumns
})
```

6. Uji teks tanpa spasi yang panjang melalui DevTools. Pastikan teks membungkus dan `tidakMeluber` tetap true. Muat ulang untuk mengembalikan teks asli.
7. Pada 1280 px, bandingkan tinggi kedua kartu dan posisi kaki kartunya.
8. Centang Mode gelap. Lepas centang untuk kembali ke tema sistem. Jika sistem sudah gelap, kedua keadaan bisa sama; ubah emulasi `prefers-color-scheme` menjadi light untuk menguji pilihan manual.
9. Fokuskan pengalih tema menggunakan Tab, lalu tekan Space; periksa indikator fokus tetap terlihat.
10. Setelah benar-benar lulus, centang pemeriksaan visual pada F.1 dan lengkapi nilai mandiri F.3.
