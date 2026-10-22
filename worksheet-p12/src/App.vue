<script setup>
import { onMounted, ref, watch } from 'vue';
import KepalaProfil from './components/KepalaProfil.vue';
import TombolFilter from './components/TombolFilter.vue';
import DaftarProyek from './components/DaftarProyek.vue';
import FormKontak from './components/FormKontak.vue';
import { profil } from './data.js';
import { state } from './state.js';
import { muat, simpan, aturUlang } from './simpanan.js';
import { ambilBerita } from './api.js';
import fotoUtama from './assets/Citilinka330neo.jpg';
const pesanSimpanan = ref('');
async function muatBerita() {
  if (state.sedangMemuat) return;
  state.sedangMemuat = true; state.galatBerita = ''; state.berita = [];
  try {
    const data = await ambilBerita();
    state.berita = data.results;
  } catch (galat) { state.galatBerita = galat.message; }
  finally { state.sedangMemuat = false; }
}
onMounted(() => {
  const isi = muat();
  if (isi) { state.kategoriAktif = isi.kategoriAktif; state.temaGelap = isi.temaGelap; }
  muatBerita();
});
watch(() => [state.kategoriAktif, state.temaGelap], () => {
  pesanSimpanan.value = simpan(state) ? '' : 'Pilihan tidak dapat disimpan pada browser ini.';
});
function aturUlangPilihan() {
  aturUlang(); state.kategoriAktif = 'semua'; state.temaGelap = false;
  pesanSimpanan.value = simpan(state) ? 'Pilihan kembali ke nilai bawaan.' : 'Pilihan berubah, tetapi belum dapat disimpan.';
}
</script>
<template>
  <KepalaProfil :profil="profil" />
  <main class="isi content">
    <aside id="tentang" class="panel sisi sidebar">
      <h2>Tentang Saya</h2>
      <p id="perkenalan">{{ profil.nama }} — {{ profil.peran }}</p>
      <p id="tentang-profil">{{ profil.tentang }}</p>
      <p id="keahlian">Keahlian: {{ profil.keahlian.join(' · ') }}</p>
      <p id="jumlah-koleksi">Jumlah koleksi: {{ state.daftarKoleksi.length }} foto</p>
      <section aria-labelledby="judul-proyek">
        <h3 id="judul-proyek">Proyek Saya</h3>
        <TombolFilter /><DaftarProyek />
      </section>
      <button type="button" @click="aturUlangPilihan">Atur ulang pilihan</button>
      <p role="status" aria-live="polite">{{ pesanSimpanan }}</p>
      <nav aria-label="Menu samping"><ul class="menu-samping">
        <li><a href="#koleksi">Koleksi foto</a></li><li><a href="#berita">Berita antariksa</a></li><li><a href="#tambah">Tambah foto</a></li>
      </ul></nav>
    </aside>
    <section id="koleksi" class="panel utama">
      <h2>Koleksi Foto Pesawat</h2>
      <div class="katalog galeri grid">
        <article class="kartu">
          <div class="kartu__isi"><div class="table-wrap" tabindex="0" role="region" aria-label="Tabel koleksi pesawat">
            <table><caption class="kartu__judul">Daftar Koleksi</caption>
              <thead><tr><th scope="col">Pesawat</th><th scope="col">Maskapai</th><th scope="col">Lokasi</th></tr></thead>
              <tbody id="daftar-koleksi"><tr v-for="foto in state.daftarKoleksi" :key="foto.id">
                <th scope="row">{{ foto.nama }}</th><td>{{ foto.maskapai }}</td><td>{{ foto.lokasi }}</td>
              </tr></tbody>
            </table>
          </div></div>
          <div class="kartu__kaki"><a href="#tambah">Tambah koleksi</a><a href="#tentang">Tentang saya</a></div>
        </article>
        <article class="kartu">
          <figure class="kartu__isi"><img id="foto-utama" :src="fotoUtama" :alt="profil.fotoUtama" width="640" height="360" loading="lazy" />
            <figcaption id="keterangan-foto" class="kartu__judul">{{ profil.fotoUtama }}</figcaption>
          </figure>
          <div class="kartu__kaki"><a href="#koleksi">Lihat koleksi</a><a href="#tambah">Tambah foto</a></div>
        </article>
      </div>
      <section id="berita" aria-labelledby="judul-berita">
        <h3 id="judul-berita">Berita Antariksa</h3>
        <button id="muat-berita" type="button" :disabled="state.sedangMemuat" @click="muatBerita">Muat berita</button>
        <p id="status-berita" role="status" aria-live="polite">
          <template v-if="state.sedangMemuat">Memuat berita...</template>
          <template v-else-if="state.galatBerita">Gagal memuat berita: {{ state.galatBerita }}</template>
          <template v-else-if="state.berita.length === 0">Belum ada berita.</template>
          <template v-else>Berhasil memuat {{ state.berita.length }} berita.</template>
        </p>
        <ul id="daftar-berita" :aria-busy="state.sedangMemuat">
          <li v-for="berita in state.berita" :key="berita.id" class="kartu-berita"><article>
            <h4>{{ berita.title }}</h4><p class="kartu-berita__sumber">{{ berita.news_site || 'Sumber tidak tersedia' }}</p>
            <p>{{ berita.summary || 'Ringkasan tidak tersedia.' }}</p>
          </article></li>
        </ul>
      </section>
    </section>
    <FormKontak />
  </main>
  <footer><p id="identitas-footer">{{ profil.nama }} · {{ profil.nim }} · {{ profil.tahun }}</p></footer>
</template>
