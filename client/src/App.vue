<template>
  <div class="container-fluid">
    <div v-if="route.path == '/login'">
      <AlertMessage />
      <router-view />
    </div>
    <div v-else>
      <TheHeader v-if="route.path != '/login'" />
      <div class="__clear-header">
        <AlertMessage />
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
const route = useRoute();

import TheHeader from "@/components/TheHeader.vue";
import AlertMessage from "@/components/AlertMessage.vue";
</script>

<style>
@import "@/assets/css/main.css";
</style>
