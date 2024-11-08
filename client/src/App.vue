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
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
const route = useRoute();

import TheHeader from "@/components/TheHeader.vue";
import AlertMessage from "@/components/AlertMessage.vue";

function oAuthCallbackCheck() {
  // if (route.path == "/auth") authStore.oAuthCallback();
  authStore.oAuthCallback();
}

// watch(route, oAuthCallbackCheck);
onMounted(oAuthCallbackCheck);
</script>

<style>
@import "@/assets/css/main.css";
</style>
