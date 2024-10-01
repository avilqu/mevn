<template>
  <div class="col-sm-12">
    <UserDetails :user="state.user" />
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import UserDetails from "@/components/UserDetails.vue";
import { useAuthStore } from "@/stores/auth";
import apiClient from "@/lib/apiClient";

const state = reactive({
  user: {},
});

const route = useRoute();
const authStore = useAuthStore();

onMounted(async () => {
  if (route.path == "/profile") state.user = authStore.user;
  else state.user = await apiClient.getUser(route.params.id);
});
</script>
