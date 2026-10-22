<script setup>
import { state, ubahTema } from '../state.js';
const props = defineProps({ profil: { type: Object, required: true } });
</script>
<template>
  <header class="site-header">
    <div class="header-baris">
      <div>
        <p class="eyebrow">Koleksi Penerbangan</p>
        <h1 id="judul-halaman">{{ props.profil.judul }}</h1>
        <p id="deskripsi-halaman">{{ props.profil.deskripsi }}</p>
      </div>
      <label class="tema-pilihan" for="tema">
        <input id="tema" class="pengalih-tema" type="checkbox" :checked="state.temaGelap" @change="ubahTema($event.target.checked)" />
        <span class="tombol-tema">Mode gelap</span>
      </label>
    </div>
    <nav class="main-nav" aria-label="Navigasi utama">
      <ul class="navbar">
        <li><a href="#koleksi">Beranda</a></li><li><a href="#koleksi">Koleksi Foto</a></li>
        <li><a href="#tentang">Tentang Saya</a></li><li><a href="#tambah">Tambah Foto</a></li>
      </ul>
    </nav>
  </header>
</template>
