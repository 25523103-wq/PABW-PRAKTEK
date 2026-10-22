<script setup>
import { computed } from 'vue';
import { state } from '../state.js';
const proyekTerpilih = computed(() => state.daftarProyek.filter(proyek =>
  state.kategoriAktif === 'semua' || proyek.kategori === state.kategoriAktif));
</script>
<template>
  <ul id="daftar">
    <li v-for="proyek in proyekTerpilih" :key="proyek.id" class="kartu">
      <h4 class="kartu__judul">{{ proyek.judul }}</h4>
      <p>{{ proyek.tahun }} · {{ proyek.kategori }}</p>
      <p>Status: {{ proyek.selesai ? 'Selesai' : 'Belum selesai' }}</p>
    </li>
  </ul>
  <p v-if="proyekTerpilih.length === 0" id="pesan-kosong" role="status">Belum ada proyek pada kategori ini.</p>
</template>
