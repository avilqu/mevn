<script setup>
import { useRoute } from "vue-router";
const route = useRoute();

import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
</script>

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
          {{ $t("sections.admin") }}
        </a>
        <ul class="dropdown-menu">
          <li>
            <h5 class="dropdown-header">{{ $t("sections.users.title") }}</h5>
          </li>
          <li>
            <router-link
              to="/user/list"
              class="dropdown-item nav-link text-muted __link"
              href="#"
            >
              {{ $t("sections.users.list") }}
            </router-link>
          </li>
          <li>
            <router-link
              to="/user/create"
              class="dropdown-item nav-link text-muted __link"
              href="#"
            >
              {{ $t("sections.users.create") }}
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
          {{ $t("sections.items") }}
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
            {{ $t("sections.profile") }}
          </router-link>
        </li>
        <li>
          <a
            class="dropdown-item nav-link text-muted __link"
            @click="authStore.logout()"
          >
            {{ $t("actions.logout") }}
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
        {{ $t("actions.login") }}
      </router-link>
    </div>
  </nav>
</template>

<style>
@import "@/assets/css/header.css";
</style>
