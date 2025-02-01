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
              <h1 class="h2 mb-5 mt-3">{{ $env.VUE_APP_TXT_SIGN_IN }}</h1>
              <input
                type="email"
                class="form-control p-3 __input-top"
                :class="{
                  'is-invalid': v$.loginCredentials.email.$error === true,
                }"
                :placeholder="$env.VUE_APP_TXT_EMAIL_ADDRESS"
                autofocus
                v-model="state.loginCredentials.email"
              />
              <input
                type="password"
                class="form-control p-3 __input-bottom"
                :class="{
                  'is-invalid': v$.loginCredentials.password.$error === true,
                }"
                :placeholder="$env.VUE_APP_TXT_PASSWORD"
                v-model="state.loginCredentials.password"
              />
              <button
                class="btn btn-outline-success mt-4"
                @click.prevent="login()"
                :disabled="state.isLoading"
              >
                <span
                  class="spinner-border spinner-border-sm"
                  :hidden="!state.isLoading"
                ></span>
                <span :hidden="state.isLoading">{{
                  $env.VUE_APP_TXT_LOGIN
                }}</span>
              </button>
              <p class="mt-5 mb-3 text-muted">
                <span
                  class="fw-light __link"
                  @click="state.displayMode = 'register'"
                >
                  {{ $env.VUE_APP_TXT_REGISTER }}
                </span>
                |
                <span
                  class="fw-light __link"
                  @click="state.displayMode = 'reset'"
                >
                  {{ $env.VUE_APP_TXT_FORGOTTEN_PASSWORD }}
                </span>
              </p>

              <div class="divider d-flex align-items-center my-4">
                <p class="text-center mx-3 mb-0 text-secondary">
                  {{ $env.VUE_APP_TXT_OR }}
                </p>
              </div>
              <fa
                :icon="['fab', 'google']"
                size="3x"
                class="__link text-muted p-3"
                @click="oAuthLogin('google')"
              />
              <fa
                :icon="['fab', 'facebook']"
                size="3x"
                class="__link text-muted p-3"
                @click="oAuthLogin('facebook')"
              />
            </div>

            <div v-if="state.displayMode == 'reset'">
              <h1 class="h3 mb-5 mt-3">
                {{ $env.VUE_APP_TXT_SEND_PASSWORD_LINK }}
              </h1>
              <p class="my-5 text-muted">
                {{ $env.VUE_APP_TXT_PASSWORD_LINK_DETAILS }}
              </p>
              <input
                type="email"
                class="form-control p-3"
                :class="{ 'is-invalid': v$.passwordTokenEmail.$error === true }"
                :placeholder="$env.VUE_APP_TXT_EMAIL_ADDRESS"
                autofocus
                v-model="state.passwordTokenEmail"
              />
              <button
                class="btn btn-outline-success mt-4"
                @click.prevent="sendPasswordToken()"
                :disabled="state.isLoading"
              >
                <span
                  class="spinner-border spinner-border-sm"
                  :hidden="!state.isLoading"
                ></span>
                <span :hidden="state.isLoading">
                  {{ $env.VUE_APP_TXT_SEND }}
                </span>
              </button>
              <p
                class="mt-5 mb-3 text-muted __link"
                @click="state.displayMode = 'login'"
              >
                {{ $env.VUE_APP_TXT_BACK_TO_LOGIN }}
              </p>
            </div>

            <div v-if="state.displayMode == 'register'">
              <h1 class="h3 mb-5 mt-3">New user</h1>
              <p class="my-5 text-muted">
                {{ $env.VUE_APP_TXT_PASSWORD_LINK_DETAILS }}
              </p>
              <input
                type="text"
                class="form-control p-3 __input-top"
                :class="{
                  'is-invalid': v$.registerCredentials.name.$error === true,
                }"
                :placeholder="$env.VUE_APP_TXT_NAME"
                autofocus
                v-model="state.registerCredentials.name"
              />
              <input
                type="email"
                class="form-control p-3 __input-bottom"
                :class="{
                  'is-invalid': v$.registerCredentials.email.$error === true,
                }"
                :placeholder="$env.VUE_APP_TXT_EMAIL_ADDRESS"
                v-model="state.registerCredentials.email"
              />
              <button
                class="btn btn-outline-success mt-4"
                @click.prevent="createUser()"
                :disabled="state.isLoading"
              >
                <span
                  class="spinner-border spinner-border-sm"
                  :hidden="!state.isLoading"
                ></span>
                <span :hidden="state.isLoading">
                  {{ $env.VUE_APP_TXT_REGISTER }}
                </span>
              </button>
              <p
                class="mt-5 mb-3 text-muted __link"
                @click="state.displayMode = 'login'"
              >
                {{ $env.VUE_APP_TXT_BACK_TO_LOGIN }}
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
  isLoading: false,
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

async function login() {
  state.isLoading = true;
  v$.value.loginCredentials.email.$touch();
  v$.value.loginCredentials.password.$touch();
  if (
    !v$.value.loginCredentials.email.$invalid &&
    !v$.value.loginCredentials.password.$invalid
  )
    await authStore.login(state.loginCredentials);
  state.isLoading = false;
}

function oAuthLogin(strategy) {
  window.location.href = `/api/login/${strategy}`;
}

async function createUser() {
  state.isLoading = true;
  v$.value.registerCredentials.email.$touch();
  v$.value.registerCredentials.name.$touch();
  if (
    !v$.value.registerCredentials.email.$invalid &&
    !v$.value.registerCredentials.name.$invalid
  )
    await apiClient.createUser(state.registerCredentials);
  state.isLoading = false;
}

async function sendPasswordToken() {
  state.isLoading = true;
  v$.value.passwordTokenEmail.$touch();
  if (!v$.value.passwordTokenEmail.$invalid)
    await apiClient.sendPasswordToken(state.passwordTokenEmail);
  state.isLoading = false;
}
</script>

<style>
@import "@/assets/css/login.css";
</style>
