<template>
  <div class="col-sm-12">
    <h1 class="h3 mb-3 font-weight-normal">New user</h1>
    <p class="text-muted text-left">
      A secure link will be sent to the registered email address to create a
      password. This link will be valid 24 hours.
    </p>
    <form class="form-signin form-inline text-center">
      <input
        type="name"
        id="registerName"
        class="form-control bg-dark text-light __input-top"
        :class="{ 'is-invalid': v$.name.$error === true }"
        placeholder="Name"
        required
        autofocus
        v-model="state.name"
      />
      <input
        type="email"
        id="registerEmail"
        class="form-control bg-dark text-light __input-bottom"
        :class="{
          'is-invalid': v$.email.$error === true,
        }"
        placeholder="Email address"
        required
        autofocus
        v-model="state.email"
      />
      <div class="form-group">
        <label for="role-selection">Role: </label>
        <select
          class="form-select"
          :class="{
            'is-invalid': v$.role.$error === true,
          }"
          id="role-selection"
          v-model="state.role"
        >
          <option value="user" selected>User</option>
          <option value="admin">Admin</option>
        </select>
        <br />
      </div>
      <button
        class="btn btn-outline-success btn-block"
        @click.prevent="createUser()"
      >
        Send
      </button>
    </form>
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
});

const rules = {
  name: { required },
  email: { required, email },
  role: { required },
};

const v$ = useVuelidate(rules, state);

function createUser() {
  this.v$.$validate();
  if (
    !this.v$.email.$invalid &&
    !this.v$.name.$invalid &&
    !this.v$.role.$invalid
  )
    apiClient.createUser(state, "admin");
}
</script>

<style>
@import "./../assets/css/login.css";
</style>
