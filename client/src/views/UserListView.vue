<template>
  <div class="row">
    <div class="col-lg-10">
      <h1 class="mb-5">User list</h1>
      <table class="table table-hover table-dark">
        <thead class="table-secondary">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Added</th>
            <th>Last connected</th>
          </tr>
        </thead>
        <tbody>
          <tr
            @click="router.push(`/user/${user._id}`)"
            v-for="user in state.userList"
            :key="user._id"
            class="__pointer"
          >
            <td class="p-3">{{ user.name }}</td>
            <td class="p-3">{{ user.email }}</td>
            <td class="p-3">{{ user.role }}</td>
            <td class="p-3"><DateDisplay :value="user.added" /></td>
            <td class="p-3"><DateDisplay :value="user.lastConnected" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import router from "@/router";
import apiClient from "@/lib/apiClient";
import DateDisplay from "@/components/DateDisplay";

const state = reactive({
  userList: [],
});

onMounted(async () => {
  state.userList = await apiClient.getItemList("user");
});
</script>
