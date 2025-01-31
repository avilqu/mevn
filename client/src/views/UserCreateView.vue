<template>
  <div class="row">
    <div class="col-xl-4 col-md-6 col-sm-9 mx-auto">
      <div class="card bg-black border-0 shadow">
        <div class="card-body p-4">
          <h1 class="h2 mb-5 mt-3">New user</h1>
          <p class="text-muted">
            A secure link will be sent to the registered email address to create
            a password. This link will be valid 24 hours.
          </p>
          <form class="text-center p-4">
            <input
              type="text"
              class="form-control p-3 __input-top"
              :class="{ 'is-invalid': v$.name.$error === true }"
              placeholder="Name"
              autofocus
              v-model="state.name"
            />
            <input
              type="email"
              id="registerEmail"
              class="form-control p-3 __input-middle"
              :class="{
                'is-invalid': v$.email.$error === true,
              }"
              placeholder="Email address"
              v-model="state.email"
            />
            <div class="form-group">
              <select
                class="form-select p-3 __input-bottom"
                :class="{
                  'is-invalid': v$.role.$error === true,
                }"
                id="role-selection"
                v-model="state.role"
              >
                <option value="">Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              class="btn btn-outline-success mt-4"
              @click.prevent="createUser()"
              :disabled="state.isLoading"
            >
              <span
                class="spinner-border spinner-border-sm"
                :hidden="!state.isLoading"
              ></span>
              <span :hidden="state.isLoading">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import apiClient from "@/lib/apiClient";

const state = reactive({
  name: "",
  email: "",
  role: "",
  isLoading: false,
});

const rules = {
  name: { required },
  email: { required, email },
  role: { required },
};

const v$ = useVuelidate(rules, state);

async function createUser() {
  state.isLoading = true;
  v$.value.$validate();
  if (
    !v$.value.email.$invalid &&
    !v$.value.name.$invalid &&
    !v$.value.role.$invalid
  )
    await apiClient.createUser(state, true);
  state.isLoading = false;
}
</script>

<style>
@import "@/assets/css/login.css";
</style>
