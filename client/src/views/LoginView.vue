<template>
  <div class="col-sm-12 text-center">
    <form class="form-signin text-center">
      <img class="mb-4" src="@/assets/logo.png" alt="" width="72" height="72" />

      <div v-if="state.displayMode == 'login'">
        <h1 class="h3 mb-3 font-weight-normal">Sign in</h1>
        <input
          type="email"
          id="inputEmail"
          class="form-control bg-dark text-light __input-top"
          :class="{ 'is-invalid': v$.loginCredentials.email.$error === true }"
          placeholder="Email address"
          required
          autofocus
          v-model="state.loginCredentials.email"
        />
        <input
          type="password"
          id="inputPassword"
          class="form-control bg-dark text-light __input-bottom"
          :class="{
            'is-invalid': v$.loginCredentials.password.$error === true,
          }"
          placeholder="Password"
          required
          v-model="state.loginCredentials.password"
        />
        <button
          class="btn btn-outline-success btn-block"
          @click.prevent="login()"
        >
          Login
        </button>
        <p class="mt-5 mb-3 text-muted">
          <span class="__link" @click="state.displayMode = 'register'"
            >Register</span
          >
          |
          <span class="__link" @click="state.displayMode = 'reset'"
            >Forgotten password?</span
          >
        </p>
      </div>

      <div v-if="state.displayMode == 'reset'">
        <h1 class="h3 mb-3 font-weight-normal">Send reset link</h1>
        <p class="mt-5 mb-3 text-muted text-left">
          A secure link with instructions to reset your password will be sent by
          email.
        </p>
        <input
          type="email"
          id="resetEmail"
          class="form-control bg-dark text-light"
          :class="{ 'is-invalid': v$.passwordTokenEmail.$error === true }"
          placeholder="Email address"
          required
          autofocus
          v-model="state.passwordTokenEmail"
        />
        <br />
        <button
          class="btn btn-outline-success btn-block"
          @click.prevent="sendPasswordToken()"
        >
          Send
        </button>
        <p
          class="mt-5 mb-3 text-muted __link"
          @click="state.displayMode = 'login'"
        >
          Back to login
        </p>
      </div>

      <div v-if="state.displayMode == 'register'">
        <h1 class="h3 mb-3 font-weight-normal">New user</h1>
        <p class="mt-5 mb-3 text-muted text-left">
          A secure link with instructions to create your password will be sent
          by email.
        </p>
        <input
          type="name"
          id="registerName"
          class="form-control bg-dark text-light __input-top"
          :class="{ 'is-invalid': v$.registerCredentials.name.$error === true }"
          placeholder="Name"
          required
          autofocus
          v-model="state.registerCredentials.name"
        />
        <input
          type="email"
          id="registerEmail"
          class="form-control bg-dark text-light __input-bottom"
          :class="{
            'is-invalid': v$.registerCredentials.email.$error === true,
          }"
          placeholder="Email address"
          required
          autofocus
          v-model="state.registerCredentials.email"
        />
        <button
          class="btn btn-outline-success btn-block"
          @click.prevent="createUser()"
        >
          Register
        </button>
        <p
          class="mt-5 mb-3 text-muted __link"
          @click="state.displayMode = 'login'"
        >
          Back to login
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { useAuthStore } from "@/stores/auth";
import apiClient from "@/lib/apiClient";

const state = reactive({
  displayMode: "login",
  loginCredentials: {
    email: "",
    password: "",
  },
  registerCredentials: {
    name: "",
    email: "",
  },
  passwordTokenEmail: "",
});

const rules = {
  loginCredentials: {
    email: { required, email },
    password: { required },
  },
  registerCredentials: {
    name: { required },
    email: { required, email },
  },
  passwordTokenEmail: { required, email },
};

const v$ = useVuelidate(rules, state);
const authStore = useAuthStore();

function login() {
  this.v$.loginCredentials.email.$touch();
  this.v$.loginCredentials.password.$touch();
  if (
    !this.v$.loginCredentials.email.$invalid &&
    !this.v$.loginCredentials.password.$invalid
  )
    authStore.login(state.loginCredentials);
}

function createUser() {
  this.v$.registerCredentials.email.$touch();
  this.v$.registerCredentials.name.$touch();
  if (
    !this.v$.registerCredentials.email.$invalid &&
    !this.v$.registerCredentials.name.$invalid
  )
    apiClient.createUser(state.registerCredentials);
}

function sendPasswordToken() {
  this.v$.passwordTokenEmail.$touch();
  if (!this.v$.passwordTokenEmail.$invalid)
    apiClient.sendPasswordToken(state.passwordTokenEmail);
}
</script>

<style>
@import "@/assets/css/login.css";
</style>
