<script setup>
import { state, kategoriTersedia, pilihKategori } from '../state.js';
</script>
<template>
  <div id="filter" aria-label="Filter kategori proyek">
    <button v-for="kategori in kategoriTersedia" :key="kategori.nilai" type="button"
      :class="{ aktif: state.kategoriAktif === kategori.nilai }"
      :aria-pressed="state.kategoriAktif === kategori.nilai" @click="pilihKategori(kategori.nilai)">
      {{ kategori.label }}
    </button>
  </div>
</template>
