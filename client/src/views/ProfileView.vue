<script setup>
import { reactive, onMounted, watch } from "vue";

import router from "@/router";
import { useRoute } from "vue-router";
const route = useRoute();

import DateDisplay from "@/components/DateDisplay";
import ConfirmationModal from "@/components/ConfirmationModal";

import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();

const state = reactive({
  user: {},
  displayMode: "",
  isLoading: false,
  showDeleteModal: false,
});

async function updateUser() {
  state.isLoading = true;
  await apiClient.updateItem("user", state.user);
  authStore.update(authStore.user);
  state.displayMode = "";
  state.isLoading = false;
}

async function confirmDelete() {
  state.isLoading = true;
  const isSelfDeletion = state.user._id === authStore.user._id;
  await apiClient.deleteItem("user", state.user._id);
  state.displayMode = "";
  state.isLoading = false;

  if (isSelfDeletion) {
    await authStore.logout();
    router.push("/login");
  } else {
    router.push("/user/list");
  }
}

async function sendPasswordToken() {
  state.isLoading = true;
  await apiClient.sendPasswordToken(state.user.email);
  state.displayMode = "";
  state.isLoading = false;
}

async function refresh() {
  if (route.path == "/profile") state.user = authStore.user;
  else state.user = await apiClient.getItem("user", route.params.id);
}

onMounted(async () => {
  if (route.query.session_id) {
    await authStore.refresh();
  }
  await refresh();
});

watch(route, refresh);
</script>

<template>
  <div class="row">
    <div class="col-lg-6">
      <div
        v-if="route.path != '/profile'"
        class="mb-4 d-flex align-items-center"
      >
        <router-link to="/user/list" class="__link text-muted me-4">
          <fa :icon="['fas', 'arrow-left-long']" size="2x" />
        </router-link>
        <div>
          <h1 class="mb-0">{{ state.user.name }}</h1>
          <p class="text-secondary mb-0">{{ state.user._id }}</p>
        </div>
      </div>
      <div v-else class="mb-4">
        <h1>{{ state.user.name }}</h1>
        <p class="text-secondary">{{ state.user._id }}</p>
      </div>
      <div class="col-sm-12">
        <br />

        <table class="table table-striped table-borderless">
          <tbody>
            <tr>
              <td class="p-3">
                <strong>{{ $t("common.fields.name") }}</strong>
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
                <strong>{{ $t("common.fields.email") }}</strong>
              </td>
              <td class="align-middle text-muted">{{ state.user.email }}</td>
            </tr>

            <tr>
              <td class="p-3">
                <strong>{{ $t("common.fields.role") }}</strong>
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
                    {{ $t("user.single") }}
                  </option>
                  <option value="admin">{{ $t("auth.roles.admin") }}</option>
                </select>
              </td>
              <td v-else class="align-middle text-muted">
                {{ state.user.role }}
              </td>
            </tr>

            <tr>
              <td class="p-3">
                <strong>{{ $t("common.dates.addedOn") }}</strong>
              </td>
              <td class="align-middle text-muted">
                <DateDisplay :value="state.user.added" />
              </td>
            </tr>

            <tr>
              <td class="p-3">
                <strong>{{ $t("common.dates.updatedOn") }}</strong>
              </td>
              <td class="align-middle text-muted">
                <DateDisplay :value="state.user.updated" />
              </td>
            </tr>

            <tr>
              <td class="p-3">
                <strong>{{ $t("common.dates.connectedOn") }}</strong>
              </td>
              <td class="align-middle text-muted">
                <DateDisplay :value="state.user.lastConnected" />
              </td>
            </tr>

            <tr>
              <td class="p-3">
                <strong>{{ $t("subscription.header.title") }}</strong>
              </td>
              <td class="align-middle">
                <div v-if="state.user.subscription">
                  <span class="text-muted"
                    >{{ $t("subscription.header.plan") }}:
                  </span>
                  <span class="text-capitalize">{{
                    state.user.subscription.type
                  }}</span>
                  <br />
                  <span class="text-muted"
                    >{{ $t("common.dates.from") }}:
                  </span>
                  <DateDisplay :value="state.user.subscription.startDate" />
                  <br />
                  <span
                    v-if="state.user.subscription.endDate"
                    class="text-muted"
                    >{{ $t("common.dates.until") }}:
                  </span>
                  <DateDisplay
                    v-if="state.user.subscription.endDate"
                    :value="state.user.subscription.endDate"
                  />
                  <br />
                  <span
                    v-if="state.user.subscription.nextPaymentDate"
                    class="text-muted"
                    >{{ $t("subscription.header.nextPayment") }}:
                  </span>
                  <DateDisplay
                    v-if="state.user.subscription.nextPaymentDate"
                    :value="state.user.subscription.nextPaymentDate"
                  />
                </div>
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
          {{ $t("common.actions.edit") }}
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
            <span :hidden="state.isLoading">{{
              $t("common.actions.save")
            }}</span>
          </button>
          &nbsp;
          <button
            class="btn btn-outline-danger btn-block"
            @click="state.showDeleteModal = true"
            :disabled="state.isLoading"
          >
            <span
              class="spinner-border spinner-border-sm"
              :hidden="!state.isLoading"
            ></span>
            <span :hidden="state.isLoading">{{
              $t("common.actions.delete")
            }}</span>
          </button>
          &nbsp;
          <button
            class="btn btn-outline-secondary btn-block"
            @click="sendPasswordToken()"
            :disabled="state.isLoading"
          >
            <span
              class="spinner-border spinner-border-sm"
              :hidden="!state.isLoading"
            ></span>
            <span :hidden="state.isLoading">{{
              $t("auth.resetPassword.link")
            }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <ConfirmationModal
    v-model:show="state.showDeleteModal"
    :title="$t('common.messages.warning')"
    :message="$t('common.messages.deleteConfirmation')"
    :confirmText="$t('common.actions.delete')"
    variant="danger"
    @confirm="confirmDelete"
  />
</template>
