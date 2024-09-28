<template>
  <div class="col-sm-12">
    <h2>User list</h2>

    <br />

    <table class="table">
      <thead>
        <tr class="__tableHead">
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Added</th>
          <th>Updated</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in userList" :key="user._id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.added }}</td>
          <td>{{ user.updated }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import apiClient from "@/lib/apiClient";

const userList = ref([]);

onMounted(async () => {
  userList.value = await apiClient.getUserList();
});
</script>
