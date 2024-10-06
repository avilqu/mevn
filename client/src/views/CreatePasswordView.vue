<template>
  <div class="row">
    <div class="col-xl-4 col-md-6 col-sm-9 mx-auto">
      <div class="card bg-black border-0 shadow">
        <div class="card-body p-4">
          <h1 class="h2 mb-5 mt-3">Create a password</h1>
          <form class="text-center p-4">
            <input
              type="password"
              id="inputPassword"
              class="form-control p-3 __input-top"
              :class="{ 'is-invalid': v$.password.$error === true }"
              placeHolder="New password"
              required
              autofocus
              v-model="state.password"
            />
            <input
              type="password"
              id="inputPasswordConfirmation"
              class="form-control p-3 __input-bottom"
              :class="{ 'is-invalid': v$.confirmation.$error === true }"
              placeHolder="Password confirmation"
              required
              v-model="state.confirmation"
            />
            <button
              class="btn btn-outline-success mt-4"
              @click.prevent="createPassword()"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, sameAs } from "@vuelidate/validators";
import { useRoute } from "vue-router";
import apiClient from "@/lib/apiClient";

const state = reactive({
  password: "",
  confirmation: "",
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

function createPassword() {
  this.v$.$validate();
  if (!this.v$.$invalid)
    apiClient.createPassword(
      route.params.id,
      route.params.token,
      state.password
    );
}
</script>

<style>
@import "@/assets/css/login.css";
</style>
