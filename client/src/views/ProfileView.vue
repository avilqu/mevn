<template>
  <div class="col-sm-12">
    <div v-if="route.path != '/profile'">
      <router-link to="/user/list">Back to list</router-link>
      <br /><br />
    </div>
    <div class="col-sm-12">
      <h2>{{ state.user.name }}</h2>
      <p class="secondary">ID: {{ state.user._id }}</p>

      <br />

      <table class="table">
        <tbody>
          <tr>
            <td><strong>User name</strong></td>
            <td v-if="state.displayMode == 'edit'">
              <input
                type="name"
                id="userName"
                class="form-control bg-dark text-light"
                required
                v-model="state.user.name"
              />
            </td>
            <td v-else>{{ state.user.name }}</td>
          </tr>

          <tr>
            <td><strong>Email address</strong></td>
            <td>{{ state.user.email }}</td>
          </tr>

          <tr>
            <td><strong>Role</strong></td>
            <td
              v-if="
                state.displayMode == 'edit' && authStore.user.role == 'admin'
              "
            >
              <select
                class="form-select"
                id="role-selection"
                v-model="state.user.role"
              >
                <option value="user" selected>User</option>
                <option value="admin">Admin</option>
              </select>
            </td>
            <td v-else>{{ state.user.role }}</td>
          </tr>

          <tr>
            <td><strong>Added on</strong></td>
            <td>{{ state.user.added }}</td>
          </tr>

          <tr>
            <td><strong>Last connected</strong></td>
            <td>{{ state.user.lastConnected }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <br />
    <div>
      <button
        v-if="state.displayMode != 'edit'"
        class="btn btn-outline-secondary btn-block"
        @click="state.displayMode = 'edit'"
      >
        Edit
      </button>
      <button
        v-else
        class="btn btn-outline-success btn-block"
        @click="updateUser()"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import apiClient from "@/lib/apiClient";

const state = reactive({
  user: {},
  displayMode: "",
});

const route = useRoute();
const authStore = useAuthStore();

function updateUser() {
  apiClient.updateUser(state.user);
  state.displayMode = "";
}

onMounted(async () => {
  if (route.path == "/profile") state.user = authStore.user;
  else state.user = await apiClient.getUser(route.params.id);
});
</script>
