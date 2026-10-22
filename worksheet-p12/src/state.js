import { reactive } from 'vue';
import { daftarProyek, daftarKoleksi } from './data.js';
export const kategoriTersedia = [
  { nilai: 'semua', label: 'Semua' },
  { nilai: 'web', label: 'Web' },
  { nilai: 'data', label: 'Data' },
];
export const state = reactive({
  daftarProyek: daftarProyek.map(proyek => ({ ...proyek })),
  daftarKoleksi: daftarKoleksi.map(foto => ({ ...foto })),
  kategoriAktif: 'semua', temaGelap: false,
  berita: [], sedangMemuat: false, galatBerita: '',
});
export function pilihKategori(nilai) {
  if (kategoriTersedia.some(kategori => kategori.nilai === nilai)) state.kategoriAktif = nilai;
}
export function ubahTema(nilai) { state.temaGelap = Boolean(nilai); }
let nomorKoleksi = daftarKoleksi.length + 1;
export function tambahKoleksi(foto) {
  state.daftarKoleksi.push({ ...foto, id: `foto-${nomorKoleksi++}` });
}
