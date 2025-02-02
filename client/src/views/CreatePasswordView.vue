<script setup>
import { reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, sameAs } from "@vuelidate/validators";
import { useRoute } from "vue-router";
import apiClient from "@/lib/apiClient";

const state = reactive({
  password: "",
  confirmation: "",
  isLoading: false,
});

const rules = {
  password: { required, minLength: minLength(6) },
  confirmation: {
    required,
    sameAs: sameAs(computed(() => state.password)),
  },
};

const v$ = useVuelidate(rules, state);
const route = useRoute();

async function createPassword() {
  state.isLoading = true;
  v$.value.$validate();
  if (!v$.value.$invalid)
    await apiClient.createPassword(
      route.params.id,
      route.params.token,
      state.password
    );
  state.isLoading = false;
}
</script>

<template>
  <div class="row">
    <div class="col-xl-4 col-md-6 col-sm-9 mx-auto">
      <div class="card bg-black border-0 shadow">
        <div class="card-body p-4">
          <h1 class="h2 mb-5 mt-3">{{ $env.VUE_APP_CREATE_PASSWORD }}</h1>
          <form class="text-center p-4">
            <input
              type="password"
              class="form-control p-3 __input-top"
              :class="{ 'is-invalid': v$.password.$error === true }"
              :placeHolder="$env.VUE_APP_NEW_PASSWORD"
              autofocus
              v-model="state.password"
            />
            <input
              type="password"
              class="form-control p-3 __input-bottom"
              :class="{ 'is-invalid': v$.confirmation.$error === true }"
              :placeHolder="$env.VUE_APP_CONFIRM_PASSWORD"
              v-model="state.confirmation"
            />
            <button
              class="btn btn-outline-success mt-4"
              @click.prevent="createPassword()"
              :disabled="state.isLoading"
            >
              <span
                class="spinner-border spinner-border-sm"
                :hidden="!state.isLoading"
              ></span>
              <span :hidden="state.isLoading">{{ $env.VUE_APP_SAVE }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import "@/assets/css/login.css";
</style>
