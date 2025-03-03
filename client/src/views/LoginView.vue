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
              <h1 class="h2 mb-5 mt-3">{{ $t("sections.signIn") }}</h1>
              <input
                type="email"
                class="form-control p-3 __input-top"
                :class="{
                  'is-invalid': v$.loginCredentials.email.$error === true,
                }"
                :placeholder="$t('fields.email')"
                autofocus
                v-model="state.loginCredentials.email"
              />
              <input
                type="password"
                class="form-control p-3 __input-bottom"
                :class="{
                  'is-invalid': v$.loginCredentials.password.$error === true,
                }"
                :placeholder="$t('fields.password')"
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
                <span :hidden="state.isLoading">{{ $t("actions.login") }}</span>
              </button>
              <p class="mt-5 mb-3 text-muted">
                <span
                  class="fw-light __link"
                  @click="state.displayMode = 'register'"
                >
                  {{ $t("actions.register") }}
                </span>
                |
                <span
                  class="fw-light __link"
                  @click="state.displayMode = 'reset'"
                >
                  {{ $t("auth.forgottenPassword") }}
                </span>
              </p>

              <div class="divider d-flex align-items-center my-4">
                <p class="text-center mx-3 mb-0 text-secondary">
                  {{ $t("misc.or") }}
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
                {{ $t("actions.sendPasswordLink") }}
              </h1>
              <p class="my-5 text-muted">
                {{ $t("misc.passwordLinkDetails") }}
              </p>
              <input
                type="email"
                class="form-control p-3"
                :class="{ 'is-invalid': v$.passwordTokenEmail.$error === true }"
                :placeholder="$t('fields.email')"
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
                  {{ $t("actions.send") }}
                </span>
              </button>
              <p
                class="mt-5 mb-3 text-muted __link"
                @click="state.displayMode = 'login'"
              >
                {{ $t("actions.backToLogin") }}
              </p>
            </div>

            <div v-if="state.displayMode == 'register'">
              <h1 class="h3 mb-5 mt-3">{{ $t("sections.users.new") }}</h1>
              <p class="my-5 text-muted">
                {{ $t("misc.newUserDetails") }}
              </p>
              <input
                type="text"
                class="form-control p-3 __input-top"
                :class="{
                  'is-invalid': v$.registerCredentials.name.$error === true,
                }"
                :placeholder="$t('fields.name')"
                autofocus
                v-model="state.registerCredentials.name"
              />
              <input
                type="email"
                class="form-control p-3 __input-bottom"
                :class="{
                  'is-invalid': v$.registerCredentials.email.$error === true,
                }"
                :placeholder="$t('fields.email')"
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
                  {{ $t("actions.register") }}
                </span>
              </button>
              <p
                class="mt-5 mb-3 text-muted __link"
                @click="state.displayMode = 'login'"
              >
                {{ $t("actions.backToLogin") }}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import "@/assets/css/login.css";
</style>
