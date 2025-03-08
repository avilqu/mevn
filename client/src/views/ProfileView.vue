<script setup>
import { reactive, onMounted, watch } from "vue";

import router from "@/router";
import { useRoute } from "vue-router";
const route = useRoute();

import DateDisplay from "@/components/DateDisplay";

import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();

const state = reactive({
  user: {},
  displayMode: "",
  isLoading: false,
});

async function updateUser() {
  state.isLoading = true;
  await apiClient.updateItem("user", state.user);
  authStore.update(authStore.user);
  state.displayMode = "";
  state.isLoading = false;
}

async function deleteUser() {
  state.isLoading = true;
  await apiClient.deleteItem("user", state.user._id);
  state.displayMode = "";
  state.isLoading = false;
  router.push("/user/list");
}

async function refresh() {
  if (route.path == "/profile") state.user = authStore.user;
  else state.user = await apiClient.getItem("user", route.params.id);
}

watch(route, refresh);
onMounted(refresh);
</script>

<template>
  <div class="row">
    <div class="col-lg-6">
      <div v-if="route.path != '/profile'" class="mb-4">
        <router-link to="/user/list" class="__link text-muted">
          {{ $t("actions.backToList") }}
        </router-link>
      </div>
      <div class="col-sm-12">
        <h1>{{ state.user.name }}</h1>
        <p class="text-secondary">{{ state.user._id }}</p>

        <br />

        <table class="table table-striped table-borderless">
          <tbody>
            <tr>
              <td class="p-3">
                <strong>{{ $t("fields.name") }}</strong>
              </td>
              <td v-if="state.displayMode == 'edit'">
                <input
                  type="text"
                  class="form-control"
                  v-model="state.user.name"
                />
              </td>
              <td v-else class="align-middle text-muted">
                {{ state.user.name }}
              </td>
            </tr>

            <tr>
              <td class="p-3">
                <strong>{{ $t("fields.email") }}</strong>
              </td>
              <td class="align-middle text-muted">{{ state.user.email }}</td>
            </tr>

            <tr>
              <td class="p-3">
                <strong>{{ $t("fields.role") }}</strong>
              </td>
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
                  <option value="user" selected>
                    {{ $t("roles.user") }}
                  </option>
                  <option value="admin">{{ $t("roles.admin") }}</option>
                </select>
              </td>
              <td v-else class="align-middle text-muted">
                {{ state.user.role }}
              </td>
            </tr>

            <tr>
              <td class="p-3">
                <strong>{{ $t("timestamps.addedOn") }}</strong>
              </td>
              <td class="align-middle text-muted">
                <DateDisplay :value="state.user.added" />
              </td>
            </tr>

            <tr>
              <td class="p-3">
                <strong>{{ $t("timestamps.updatedOn") }}</strong>
              </td>
              <td class="align-middle text-muted">
                <DateDisplay :value="state.user.updated" />
              </td>
            </tr>

            <tr>
              <td class="p-3">
                <strong>{{ $t("timestamps.connectedOn") }}</strong>
              </td>
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
          {{ $t("actions.edit") }}
        </button>
        <div v-else>
          <button
            class="btn btn-outline-success btn-block"
            @click="updateUser()"
            :disabled="state.isLoading"
          >
            <span
              class="spinner-border spinner-border-sm"
              :hidden="!state.isLoading"
            ></span>
            <span :hidden="state.isLoading">{{ $t("actions.save") }}</span>
          </button>
          &nbsp;
          <button
            class="btn btn-outline-danger btn-block"
            @click="deleteUser()"
            :disabled="state.isLoading"
          >
            <span
              class="spinner-border spinner-border-sm"
              :hidden="!state.isLoading"
            ></span>
            <span :hidden="state.isLoading">{{ $t("actions.delete") }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
