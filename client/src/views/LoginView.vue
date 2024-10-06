<template>
  <div class="row">
    <div class="col-xl-4 col-md-6 col-sm-9 mx-auto">
      <div class="card bg-black border-0 shadow mt-5">
        <div class="card-body">
          <form class="text-center p-4">
            <router-link to="/">
              <img src="@/assets/logo.png" width="72" height="72" />
            </router-link>
            <div v-if="state.displayMode == 'login'">
              <h1 class="h2 mb-5 mt-3">Sign in</h1>
              <input
                type="email"
                id="inputEmail"
                class="form-control p-3 __input-top"
                :class="{
                  'is-invalid': v$.loginCredentials.email.$error === true,
                }"
                placeholder="Email address"
                required
                autofocus
                v-model="state.loginCredentials.email"
              />
              <input
                type="password"
                id="inputPassword"
                class="form-control p-3 __input-bottom"
                :class="{
                  'is-invalid': v$.loginCredentials.password.$error === true,
                }"
                placeholder="Password"
                required
                v-model="state.loginCredentials.password"
              />
              <button
                class="btn btn-outline-success mt-4"
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
              <h1 class="h3 mb-5 mt-3">Send reset link</h1>
              <p class="my-5 text-muted">
                A secure link with instructions to reset your password will be
                sent by email.
              </p>
              <input
                type="email"
                id="resetEmail"
                class="form-control p-3"
                :class="{ 'is-invalid': v$.passwordTokenEmail.$error === true }"
                placeholder="Email address"
                required
                autofocus
                v-model="state.passwordTokenEmail"
              />
              <button
                class="btn btn-outline-success mt-4"
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
              <h1 class="h3 mb-5 mt-3">New user</h1>
              <p class="my-5 text-muted">
                A secure link with instructions to create your password will be
                sent by email.
              </p>
              <input
                type="name"
                id="registerName"
                class="form-control p-3 __input-top"
                :class="{
                  'is-invalid': v$.registerCredentials.name.$error === true,
                }"
                placeholder="Name"
                required
                autofocus
                v-model="state.registerCredentials.name"
              />
              <input
                type="email"
                id="registerEmail"
                class="form-control p-3 __input-bottom"
                :class="{
                  'is-invalid': v$.registerCredentials.email.$error === true,
                }"
                placeholder="Email address"
                required
                v-model="state.registerCredentials.email"
              />
              <button
                class="btn btn-outline-success mt-4"
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
      </div>
    </div>
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
