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
  isLoading: false,
});

const route = useRoute();
const authStore = useAuthStore();

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
          {{ $env.VUE_APP_TXT_BACK_TO_LIST }}
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
                <strong>{{ $env.VUE_APP_TXT_NAME }}</strong>
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
                <strong>{{ $env.VUE_APP_TXT_EMAIL_ADDRESS }}</strong>
              </td>
              <td class="align-middle text-muted">{{ state.user.email }}</td>
            </tr>

            <tr>
              <td class="p-3">
                <strong>{{ $env.VUE_APP_TXT_ROLE }}</strong>
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
                    {{ $env.VUE_APP_TXT_ROLE_USER }}
                  </option>
                  <option value="admin">{{ $env.VUE_APP_TXT_ADMIN }}</option>
                </select>
              </td>
              <td v-else class="align-middle text-muted">
                {{ state.user.role }}
              </td>
            </tr>

            <tr>
              <td class="p-3">
                <strong>{{ $env.VUE_APP_TXT_ADDED_ON }}</strong>
              </td>
              <td class="align-middle text-muted">
                <DateDisplay :value="state.user.added" />
              </td>
            </tr>

            <tr>
              <td class="p-3">
                <strong>{{ $env.VUE_APP_TXT_UPDATED_ON }}</strong>
              </td>
              <td class="align-middle text-muted">
                <DateDisplay :value="state.user.updated" />
              </td>
            </tr>

            <tr>
              <td class="p-3">
                <strong>{{ $env.VUE_APP_TXT_CONNECTED_ON }}</strong>
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
          {{ $env.VUE_APP_TXT_EDIT }}
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
            <span :hidden="state.isLoading">{{ $env.VUE_APP_TXT_SAVE }}</span>
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
            <span :hidden="state.isLoading">{{ $env.VUE_APP_TXT_DELETE }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
