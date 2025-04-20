<script setup>
import { onUpdated } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();

import TheHeader from "@/components/TheHeader.vue";
import AlertMessage from "@/components/AlertMessage.vue";

import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();

import { useAlertStore } from "@/stores/alert";
const alertStore = useAlertStore();

onUpdated(() => {
  alertStore.reset();
  if (route.fullPath == "/?auth") authStore.oAuthCallback();
});
</script>

<template>
  <div class="container-fluid">
    <div
      v-if="$env.VUE_APP_MAINTENANCE_MODE === 'true'"
      class="alert-warning alert fade show text-center mt-3"
    >
      {{ $t("common.maintenanceMode") }}
    </div>
    <div v-else-if="route.path == '/login'">
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

<style>
@import "@/assets/css/main.css";
</style>
