<template>
  <div class="col-sm-12">
    <form class="form-signin text-center">
      <h1 class="h3 mb-3 font-weight-normal text-center">Create a password</h1>
      <input
        type="password"
        id="inputPassword"
        class="form-control bg-dark text-light __input-top"
        :class="{ 'is-invalid': v$.password.$error === true }"
        placeHolder="New password"
        required
        autofocus
        v-model="state.password"
      />
      <input
        type="password"
        id="inputPasswordConfirmation"
        class="form-control bg-dark text-light __input-bottom"
        :class="{ 'is-invalid': v$.confirmation.$error === true }"
        placeHolder="Password confirmation"
        required
        v-model="state.confirmation"
      />
      <br />
      <button
        class="btn btn-outline-success btn-block"
        @click.prevent="createPassword()"
      >
        Save
      </button>
    </form>
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
