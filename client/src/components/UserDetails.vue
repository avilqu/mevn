<template>
  <div class="col-sm-12">
    <h2>{{ user.name }}</h2>
    <p class="secondary">ID: {{ user._id }}</p>

    <br />

    <table class="table">
      <tbody>
        <tr>
          <td><strong>User name</strong></td>
          <td>{{ user.name }}</td>
        </tr>

        <tr>
          <td><strong>Email address</strong></td>
          <td>{{ user.email }}</td>
        </tr>

        <tr>
          <td><strong>Role</strong></td>
          <td>{{ user.role }}</td>
        </tr>

        <tr>
          <td><strong>Added on</strong></td>
          <td>{{ user.added }}</td>
        </tr>

        <tr>
          <td><strong>Last connected</strong></td>
          <td>{{ user.lastConnected }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
defineProps({ user: Object });
</script>
