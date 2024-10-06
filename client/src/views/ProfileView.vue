<template>
  <div class="row">
    <div class="col-md-10">
      <div v-if="route.path != '/profile'">
        <router-link to="/user/list">
          <i class="bi bi-arrow-left"></i>Back to list
        </router-link>
        <br /><br />
      </div>
      <div class="col-sm-12">
        <h2>{{ state.user.name }}</h2>
        <p class="text-secondary">ID: {{ state.user._id }}</p>

        <br />

        <table class="table table-striped table-borderless">
          <tbody>
            <tr>
              <td class="p-3"><strong>User name</strong></td>
              <td v-if="state.displayMode == 'edit'">
                <input
                  type="name"
                  id="userName"
                  class="form-control"
                  required
                  v-model="state.user.name"
                />
              </td>
              <td v-else class="align-middle text-muted">
                {{ state.user.name }}
              </td>
            </tr>

            <tr>
              <td class="p-3"><strong>Email address</strong></td>
              <td class="align-middle text-muted">{{ state.user.email }}</td>
            </tr>

            <tr>
              <td class="p-3"><strong>Role</strong></td>
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
              <td v-else class="align-middle text-muted">
                {{ state.user.role }}
              </td>
            </tr>

            <tr>
              <td class="p-3"><strong>Added on</strong></td>
              <td class="align-middle text-muted">
                <DateDisplay :value="state.user.added" />
              </td>
            </tr>

            <tr>
              <td class="p-3"><strong>Last updated</strong></td>
              <td class="align-middle text-muted">
                <DateDisplay :value="state.user.updated" />
              </td>
            </tr>

            <tr>
              <td class="p-3"><strong>Last connected</strong></td>
              <td class="align-middle text-muted">
                <DateDisplay :value="state.user.lastConnected" />
              </td>
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
        <div v-else>
          <button
            class="btn btn-outline-success btn-block"
            @click="updateUser()"
          >
            Save
          </button>
          &nbsp;
          <button
            class="btn btn-outline-danger btn-block"
            @click="deleteUser()"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import apiClient from "@/lib/apiClient";
import DateDisplay from "@/components/DateDisplay";

const state = reactive({
  user: {},
  displayMode: "",
});

const route = useRoute();
const authStore = useAuthStore();

async function updateUser() {
  await apiClient.updateUser(state.user);
  state.displayMode = "";
}

async function deleteUser() {
  await apiClient.deleteUser(state.user._id);
  state.displayMode = "";
  router.push("/user/list");
}

async function refresh() {
  if (route.path == "/profile") state.user = authStore.user;
  else state.user = await apiClient.getUser(route.params.id);
}

watch(route, refresh);
onMounted(refresh);
</script>
