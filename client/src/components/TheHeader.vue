<template>
  <nav class="navbar bg-dark mb-4 fixed-top shadow">
    <router-link to="/" class="navbar-brand">
      <img src="./../assets/logo.png" />
    </router-link>

    <div v-if="authStore.user" class="dropdown">
      <button
        class="btn btn-success dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        v-once
      >
        {{ authStore.user.name }}
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <router-link to="'/user/' + user._id" class="dropdown-item __link">
          Profile
        </router-link>
        <a class="dropdown-item __link" @click="authStore.logout()"> Logout </a>
      </div>
    </div>

    <div v-else>
      <router-link
        v-if="route.path != '/login'"
        to="/login"
        class="btn btn-outline-success"
      >
        Login
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const route = useRoute();
</script>

<style>
@import "./../assets/css/header.css";
</style>
