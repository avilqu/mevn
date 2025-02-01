<template>
  <nav class="navbar fixed-top bg-black shadow">
    <router-link to="/" class="navbar-brand">
      <img src="@/assets/logo.png" />
      {{ $env.VUE_APP_NAME }}
    </router-link>

    <ul class="nav" v-if="authStore.user._id">
      <li class="nav-item dropdown" v-if="authStore.user.role == 'admin'">
        <a
          class="nav-link text-muted dropdown-toggle"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {{ $env.VUE_APP_TXT_ADMIN }}
        </a>
        <ul class="dropdown-menu">
          <li>
            <h5 class="dropdown-header">{{ $env.VUE_APP_TXT_USERS }}</h5>
          </li>
          <li>
            <router-link
              to="/user/list"
              class="dropdown-item nav-link text-muted __link"
              href="#"
            >
              {{ $env.VUE_APP_TXT_USER_LIST }}
            </router-link>
          </li>
          <li>
            <router-link
              to="/user/create"
              class="dropdown-item nav-link text-muted __link"
              href="#"
            >
              {{ $env.VUE_APP_TXT_CREATE_USER }}
            </router-link>
          </li>
        </ul>
      </li>
      <li class="nav-item">
        <router-link
          to="/items/list"
          class="nav-link text-muted __link"
          href="#"
        >
          {{ $env.VUE_APP_TXT_ITEMS }}
        </router-link>
      </li>
    </ul>

    <div class="dropdown nav ms-auto" v-if="authStore.user._id">
      <button
        type="button"
        class="btn btn-success dropdown-toggle"
        data-bs-toggle="dropdown"
      >
        {{ authStore.user.name }}
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li>
          <router-link
            to="/profile"
            class="dropdown-item nav-link text-muted __link"
          >
            {{ $env.VUE_APP_TXT_PROFILE }}
          </router-link>
        </li>
        <li>
          <a
            class="dropdown-item nav-link text-muted __link"
            @click="authStore.logout()"
          >
            {{ $env.VUE_APP_TXT_LOGOUT }}
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
        {{ $env.VUE_APP_TXT_LOGIN }}
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
