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
        <tr
          @click="getUser(user._id)"
          v-for="user in state.userList"
          :key="user._id"
          class="__pointer"
        >
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
import { onMounted, reactive } from "vue";
import apiClient from "@/lib/apiClient";
import router from "@/router";

const state = reactive({
  userList: [],
});

function getUser(id) {
  router.push("/user/" + id);
}

onMounted(async () => {
  state.userList = await apiClient.getUserList();
});
</script>
