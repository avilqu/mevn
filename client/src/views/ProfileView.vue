<template>
  <div class="col-sm-12">
    <h2>{{ authStore.user.name }}</h2>
    <p class="__secondary">ID: {{ authStore.user._id }}</p>

    <br />

    <table class="table">
      <tbody>
        <tr>
          <td><strong>User name</strong></td>
          <td>{{ authStore.user.name }}</td>
        </tr>

        <tr>
          <td><strong>Email address</strong></td>
          <td>{{ authStore.user.email }}</td>
        </tr>

        <tr>
          <td><strong>Role</strong></td>
          <td>{{ authStore.user.role }}</td>
        </tr>

        <tr>
          <td><strong>Added on</strong></td>
          <td>{{ authStore.user.added }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
</script>
