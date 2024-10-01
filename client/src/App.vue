<template>
  <div class="container-fluid">
    <TheHeader />
    <AlertMessage />
    <router-view />
  </div>
</template>

<script setup>
import TheHeader from "@/components/TheHeader.vue";
import AlertMessage from "@/components/AlertMessage.vue";
</script>

<style>
@import "@/assets/css/main.css";
</style>
