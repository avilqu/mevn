<template>
  <div class="container-fluid">
    <TheHeader />
    <AlertMessage />
    <router-view />
  </div>
</template>

<!-- <script>
import TheHeader from "./components/TheHeader.vue";
import AlertMessage from "./components/AlertMessage.vue";

export default {
  components: {
    "app-the-header": TheHeader,
    "app-alert-message": AlertMessage,
  },
};
</script> -->

<script setup>
import TheHeader from "./components/TheHeader.vue";
import AlertMessage from "./components/AlertMessage.vue";
</script>

<style>
@import "./assets/css/main.css";
</style>
