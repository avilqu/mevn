<script setup>
import { reactive, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import apiClient from "@/lib/apiClient";
import router from "@/router";

const authStore = useAuthStore();
const state = reactive({
  plans: [],
});

async function selectPlan(planType) {
  if (planType === "free") {
    const res = await apiClient.cancelSubscription();
    authStore.update(res.user);
    router.push("/profile");
  } else if (planType === "paid") {
    const res = await apiClient.upgradeSubscription();
    authStore.update(res.user);
    router.push("/profile");
    // window.location.href = response.data.url;
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
            <div class="card-footer bg-transparent">
              <button
                class="btn w-100"
                :class="[
                  plan.name === 'paid'
                    ? 'btn-success'
                    : 'btn-outline-secondary',
                  authStore.user.subscription?.type === plan.name &&
                  authStore.user.subscription?.status === 'active'
                    ? 'btn-outline-secondary'
                    : '',
                ]"
                @click="selectPlan(plan.name)"
                :disabled="
                  authStore.user.subscription?.type === plan.name &&
                  authStore.user.subscription?.status === 'active'
                "
              >
                {{
                  authStore.user.subscription?.type === plan.name &&
                  authStore.user.subscription?.status === "active"
                    ? "Current Plan"
                    : `Select ${plan.name} Plan`
                }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
