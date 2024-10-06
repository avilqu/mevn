<template>
  <nav class="navbar fixed-top bg-black shadow">
    <router-link to="/" class="navbar-brand">
      <img src="@/assets/logo.png" />
      MEVN
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
            <li><h5 class="dropdown-header">Users</h5></li>
            <li>
              <router-link
                to="/user/list"
                class="dropdown-item nav-link"
                href="#"
              >
                User list
              </router-link>
            </li>
            <li>
              <router-link
                to="/user/create"
                class="dropdown-item nav-link"
                href="#"
              >
                Create user
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <div class="dropdown nav ms-auto" v-if="authStore.user._id">
      <button
        type="button"
        class="btn btn-success dropdown-toggle"
        data-bs-toggle="dropdown"
      >
        {{ authStore.user.name }}
      </button>
      <ul class="dropdown-menu">
        <li>
          <router-link to="/profile" class="dropdown-item nav-link">
            Profile
          </router-link>
        </li>
        <li>
          <a
            class="dropdown-item nav-link __pointer"
            @click="authStore.logout()"
          >
            Logout
          </a>
        </li>
      </ul>
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
