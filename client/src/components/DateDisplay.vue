<script setup>
defineProps({ value: String });
</script>

<template>
  <p v-if="value" style="display: inline">
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
