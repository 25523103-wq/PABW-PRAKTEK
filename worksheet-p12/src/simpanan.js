const KUNCI = 'pabw-p11';
const VERSI = 2;
const KATEGORI_SAH = ['semua', 'web', 'data'];
export function simpan(state) {
  try {
    localStorage.setItem(KUNCI, JSON.stringify({
      versi: VERSI, kategoriAktif: state.kategoriAktif, temaGelap: state.temaGelap,
    }));
    return true;
  } catch { return false; }
}
export function aturUlang() {
  try { localStorage.removeItem(KUNCI); return true; }
  catch { return false; }
}
export function muat() {
  try {
    const teks = localStorage.getItem(KUNCI);
    if (teks === null) return null;
    const isi = JSON.parse(teks);
    const sah = isi !== null && typeof isi === 'object' && isi.versi === VERSI
      && KATEGORI_SAH.includes(isi.kategoriAktif) && typeof isi.temaGelap === 'boolean';
    if (!sah) { aturUlang(); return null; }
    return { kategoriAktif: isi.kategoriAktif, temaGelap: isi.temaGelap };
  } catch { aturUlang(); return null; }
}
