<template>
  <nav
    class="navbar bg-dark border-bottom mb-4 fixed-top justify-content-start"
  >
    <router-link to="/" class="navbar-brand">
      <img src="@/assets/logo.png" />
    </router-link>

    <div v-if="authStore.user.role == 'admin'">
      <ul class="nav">
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Admin
          </a>
          <ul class="dropdown-menu">
            <li>
              <strong>Users</strong>
            </li>
            <li>
              <router-link to="/user/list" class="dropdown-item" href="#">
                User list
              </router-link>
            </li>
            <li>
              <router-link to="/user/create" class="dropdown-item" href="#">
                Create user
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <div v-if="authStore.user._id" class="dropdown ms-auto">
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
        <router-link to="/profile" class="dropdown-item __link">
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
@import "@/assets/css/header.css";
</style>
