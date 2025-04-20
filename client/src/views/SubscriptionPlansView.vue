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
      <div class="mb-4">
        <router-link to="/profile" class="__link text-muted">
          <fa :icon="['fas', 'arrow-left-long']" size="2x" />
        </router-link>
      </div>

      <h1>Choose Your Plan</h1>
      <p class="text-muted">Select the plan that best fits your needs</p>

      <div class="row mt-4">
        <div class="col-md-6" v-for="plan in state.plans" :key="plan.name">
          <div class="card h-100">
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
                :class="
                  plan.name === 'paid' ? 'btn-success' : 'btn-outline-primary'
                "
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
