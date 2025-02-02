<script setup>
import { defineProps } from "vue";
defineProps({ value: String });
</script>

<template>
  <p style="display: inline">
    {{
      new Date(value).toLocaleDateString("en-NZ", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
    }}
  </p>
</template>
