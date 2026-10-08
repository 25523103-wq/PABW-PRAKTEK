// C: fungsi murni hanya membaca argumen dan mengembalikan nilai.
export function buatPerkenalan({ nama, peran }) {
    return `${nama} — ${peran}`;
}
export const formatKeahlian = (daftar) => {
    return daftar.join(" · ");
};
export function hitungProyekSelesai(daftar) {
    return daftar.reduce((jumlah, proyek) => jumlah + (proyek.selesai === true ? 1 : 0), 0);
}
export function ubahTahun(teks) {
    if (teks.trim() === "") return null;
    const tahun = Number(teks);
    return Number.isInteger(tahun) && tahun >= 1900 && tahun <= 2026 ? tahun : null;
}
