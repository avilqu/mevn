<script setup>
import { useAlertStore } from "@/stores/alert";
const alertStore = useAlertStore();
</script>

<template>
  <div
    v-if="alertStore.message"
    :class="`alert-${alertStore.type}`"
    class="alert alert-dismissible fade show text-center mt-3"
    role="alert"
  >
    {{ alertStore.message }}
    <button
      type="button"
      class="btn-close"
      data-dismiss="alert"
      aria-label="Close"
      @click="alertStore.reset()"
    ></button>
  </div>
</template>
