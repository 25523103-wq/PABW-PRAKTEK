<script setup>
import { computed, ref } from 'vue';
import { tambahKoleksi } from '../state.js';
// Nama komponen mengikuti worksheet; isinya mempertahankan form Tambah Foto.
const formKosong = () => ({ nama: '', maskapai: '', tahun: '', lokasi: '' });
const form = ref(formKosong());
const sudahDiubah = ref(false);
const pesan = ref('');
const inputNama = ref(null);
const galat = computed(() => {
  const tahun = Number(form.value.tahun);
  return {
    nama: form.value.nama.trim() ? '' : 'Nama pesawat wajib diisi.',
    maskapai: form.value.maskapai.trim() ? '' : 'Maskapai wajib diisi.',
    tahun: String(form.value.tahun).trim() && Number.isInteger(tahun) && tahun >= 1900 && tahun <= 2026
      ? '' : 'Tahun harus bilangan bulat antara 1900 dan 2026.',
    lokasi: form.value.lokasi.trim() ? '' : 'Lokasi wajib diisi.',
  };
});
const formSah = computed(() => Object.values(galat.value).every(pesan => pesan === ''));
function tandaiPerubahan() { sudahDiubah.value = true; pesan.value = ''; }
function kirim() {
  sudahDiubah.value = true;
  if (!formSah.value) return;
  const foto = { nama: form.value.nama.trim(), maskapai: form.value.maskapai.trim(),
    tahun: Number(form.value.tahun), lokasi: form.value.lokasi.trim() };
  tambahKoleksi(foto);
  pesan.value = `${foto.nama} ditambahkan untuk sesi ini. Data kembali ke awal saat halaman dimuat ulang.`;
  form.value = formKosong(); sudahDiubah.value = false;
  inputNama.value?.focus();
}
</script>
<template>
  <section id="tambah" class="panel bawah">
    <h2>Tambah Foto Baru</h2>
    <form id="form-koleksi" novalidate @input="tandaiPerubahan" @submit.prevent="kirim">
      <div class="form-kolom">
        <label for="nama-pesawat">Nama pesawat</label>
        <input id="nama-pesawat" ref="inputNama" v-model="form.nama" type="text" required aria-describedby="galat-nama" :aria-invalid="sudahDiubah && Boolean(galat.nama)" />
        <small id="galat-nama" class="pesan-galat" :hidden="!sudahDiubah || !galat.nama">{{ galat.nama }}</small>
      </div>
      <div class="form-kolom">
        <label for="maskapai">Maskapai</label>
        <input id="maskapai" v-model="form.maskapai" type="text" required aria-describedby="galat-maskapai" :aria-invalid="sudahDiubah && Boolean(galat.maskapai)" />
        <small id="galat-maskapai" class="pesan-galat" :hidden="!sudahDiubah || !galat.maskapai">{{ galat.maskapai }}</small>
      </div>
      <div class="form-kolom">
        <label for="tahun-foto">Tahun foto</label>
        <input id="tahun-foto" v-model="form.tahun" type="number" min="1900" max="2026" required aria-describedby="galat-tahun" :aria-invalid="sudahDiubah && Boolean(galat.tahun)" />
        <small id="galat-tahun" class="pesan-galat" :hidden="!sudahDiubah || !galat.tahun">{{ galat.tahun }}</small>
      </div>
      <div class="form-kolom">
        <label for="lokasi-foto">Lokasi foto</label>
        <input id="lokasi-foto" v-model="form.lokasi" type="text" required aria-describedby="galat-lokasi" :aria-invalid="sudahDiubah && Boolean(galat.lokasi)" />
        <small id="galat-lokasi" class="pesan-galat" :hidden="!sudahDiubah || !galat.lokasi">{{ galat.lokasi }}</small>
      </div>
      <button id="tombol-simpan" type="submit" :disabled="!formSah">Simpan</button>
      <p id="pesan-simpan" role="status" aria-live="polite">{{ pesan }}</p>
    </form>
  </section>
</template>
