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
      <li class="nav-item">
        <router-link
          to="/items/list"
          class="nav-link text-muted __link"
          href="#"
        >
          {{ $t("common.navigation.items") }}
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
        <li class="dropdown-header">{{ $t("subscription.header.title") }}</li>
        <li class="px-3 py-1">
          <small class="text-muted"
            >{{ $t("subscription.header.plan") }}:
          </small>
          <small class="text-capitalize">
            {{ authStore.user.subscription?.type || "free" }}
          </small>
        </li>
        <li
          v-if="
            authStore.user.subscription?.type === 'paid' &&
            authStore.user.subscription?.endDate
          "
          class="px-3 py-1"
        >
          <small class="text-muted">{{ $t("common.dates.until") }}: </small>
          <small
            >{{
              new Date(
                authStore.user.subscription?.endDate
              ).toLocaleDateString()
            }}
          </small>
        </li>
        <li
          v-if="
            authStore.user.subscription?.type === 'paid' &&
            !authStore.user.subscription?.autoRenew
          "
          class="px-3 py-1"
        >
          <small class="text-danger">{{
            $t("subscription.header.willNotRenew")
          }}</small>
        </li>
        <li class="px-3 py-2">
          <router-link
            to="/plans"
            class="btn btn-sm w-100"
            :class="
              authStore.user.subscription?.type === 'free'
                ? 'btn-success'
                : 'btn-danger'
            "
          >
            {{
              authStore.user.subscription?.type === "free"
                ? $t("common.actions.upgrade")
                : $t("common.actions.cancel")
            }}
          </router-link>
        </li>
        <li class="dropdown-divider"></li>
        <template v-if="authStore.user.role === 'admin'">
          <li class="dropdown-header">{{ $t("auth.user.admin") }}</li>
          <li>
            <router-link
              to="/user/list"
              class="dropdown-item nav-link text-muted __link"
              href="#"
            >
              {{ $t("auth.user.list") }}
            </router-link>
          </li>
          <li>
            <router-link
              to="/user/create"
              class="dropdown-item nav-link text-muted __link"
              href="#"
            >
              {{ $t("auth.user.create") }}
            </router-link>
          </li>
          <li class="dropdown-divider"></li>
        </template>
        <li>
          <router-link
            to="/profile"
            class="dropdown-item nav-link text-muted __link"
          >
            {{ $t("common.navigation.profile") }}
          </router-link>
        </li>
        <li>
          <a
            class="dropdown-item nav-link text-muted __link"
            @click="authStore.logout()"
          >
            {{ $t("auth.login.logout") }}
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
        {{ $t("auth.login.title") }}
      </router-link>
    </div>
  </nav>
</template>

<style>
@import "@/assets/css/header.css";
</style>
