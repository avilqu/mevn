<script setup>
import { reactive, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import apiClient from "@/lib/apiClient";

const authStore = useAuthStore();
const state = reactive({
  isLoading: false,
  plans: [],
});

async function selectPlan(planType) {
  if (planType === "free") {
    state.isLoading = true;
    const res = await apiClient.cancelSubscription();
    if (res.user) authStore.update(res.user);
    state.isLoading = false;
  } else if (planType === "paid") {
    state.isLoading = true;
    await apiClient.createCheckoutSession();
  }
}

onMounted(async () => {
  state.plans = await apiClient.getSubscriptionPlans();
});
</script>

<template>
  <div class="row">
    <div class="col-lg-8">
      <h1>{{ $t("subscription.pageTitle") }}</h1>
      <p class="text-muted">{{ $t("subscription.pageDescription") }}</p>

      <div class="row mt-4">
        <div class="col-md-6" v-for="plan in state.plans" :key="plan.name">
          <div
            class="card h-100"
            :class="{
              'border-success':
                authStore.user.subscription?.type === plan.name &&
                authStore.user.subscription?.status === 'active',
            }"
          >
            <div class="card-body">
              <h5 class="card-title">{{ plan.name }}</h5>
              <h2 class="card-subtitle mb-2 text-muted">
                ${{ plan.price }}/{{ plan.interval }}
              </h2>
              <ul class="list-unstyled mt-3">
                <li
                  v-for="feature in plan.features"
                  :key="feature"
                  class="mb-2"
                >
                  <fa :icon="['fas', 'check']" class="text-success me-2" />
                  {{ feature }}
                </li>
              </ul>
            </div>
            <div v-if="plan.name === 'paid'" class="card-footer bg-transparent">
              <button
                class="btn w-100 mb-2"
                :class="[
                  'btn-success',
                  authStore.user.subscription?.type === plan.name &&
                  authStore.user.subscription?.status === 'active'
                    ? 'btn-outline-secondary'
                    : '',
                ]"
                @click="selectPlan(plan.name)"
                :disabled="
                  (authStore.user.subscription?.type === plan.name &&
                    authStore.user.subscription?.status === 'active') ||
                  state.isLoading
                "
              >
                <span
                  class="spinner-border spinner-border-sm"
                  :hidden="!state.isLoading"
                ></span>
                <span :hidden="state.isLoading">
                  {{
                    authStore.user.subscription?.type === plan.name &&
                    authStore.user.subscription?.status === "active"
                      ? $t("subscription.buttonCurrentPlan")
                      : $t("subscription.buttonSelectPlan")
                  }}
                </span>
              </button>
              <button
                v-if="
                  authStore.user.subscription?.type === plan.name &&
                  authStore.user.subscription?.status === 'active'
                "
                class="btn btn-outline-danger w-100"
                @click="selectPlan('free')"
                :disabled="state.isLoading"
              >
                <span
                  class="spinner-border spinner-border-sm"
                  :hidden="!state.isLoading"
                ></span>
                <span :hidden="state.isLoading">
                  {{ $t("subscription.cancel") }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
