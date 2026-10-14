// P10 A: satu alamat untuk seluruh pengambilan data.
const ALAMAT = "https://api.spaceflightnewsapi.net/v4/articles/?limit=3";

export async function ambilBerita() {
  try {
    const respons = await fetch(ALAMAT);
    console.log("Status:", respons.status, "OK:", respons.ok);
    console.log("Content-Type:", respons.headers.get("content-type"));
    if (!respons.ok) throw new Error(`HTTP ${respons.status}`);
    const data = await respons.json();
    if (!Array.isArray(data?.results)) {
      throw new Error("Format data tidak sesuai: results harus berupa array.");
    }
    return data;
  } catch (galat) {
    console.warn("Pengambilan berita gagal:", galat.message);
    throw galat;
  }
}
