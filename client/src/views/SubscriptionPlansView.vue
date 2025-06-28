<script setup>
import { reactive, onMounted, ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import apiClient from "@/lib/apiClient";
import ConfirmationModal from "@/components/ConfirmationModal.vue";

const authStore = useAuthStore();
const state = reactive({
  isLoading: false,
  plans: [],
  showCancelModal: false,
});

const formattedEndDate = computed(() => {
  if (!authStore.user.subscription?.endDate) return "";
  const date = new Date(authStore.user.subscription.endDate);
  return date.toLocaleDateString();
});

async function selectPlan(planType) {
  if (planType === "free") {
    state.showCancelModal = true;
  } else if (planType === "paid") {
    state.isLoading = true;
    await apiClient.createCheckoutSession();
    state.isLoading = false;
  }
}

async function reactivatePlan() {
  state.isLoading = true;
  const res = await apiClient.updateUser({
    _id: authStore.user._id,
    "subscription.autoRenew": true,
  });
  console.log(res);
  if (res) {
    await authStore.refresh();
  }
  state.isLoading = false;
}

async function confirmCancel() {
  state.isLoading = true;
  const res = await apiClient.cancelSubscription();
  if (res.user) authStore.update(res.user);
  state.isLoading = false;
  state.showCancelModal = false;
}

onMounted(async () => {
  state.plans = await apiClient.getSubscriptionPlans();
});
</script>

<template>
  <div class="row">
    <div class="col-lg-8">
      <h1>{{ $t("subscription.page.title") }}</h1>
      <p class="text-muted">{{ $t("subscription.page.description") }}</p>

      <div
        v-if="
          authStore.user.subscription?.type === 'paid' &&
          !authStore.user.subscription?.autoRenew
        "
        class="alert alert-info mb-4"
      >
        {{ $t("subscription.page.cancelScheduled") }} {{ formattedEndDate }}.
      </div>

      <div class="row mt-4">
        <div class="col-md-6" v-for="plan in state.plans" :key="plan.name">
          <div
            class="card h-100"
            :class="{
              'border-success': authStore.user.subscription?.type === plan.name,
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
                  authStore.user.subscription?.type === plan.name
                    ? 'btn-outline-secondary'
                    : '',
                ]"
                @click="selectPlan(plan.name)"
                :disabled="
                  authStore.user.subscription?.type === plan.name ||
                  state.isLoading
                "
              >
                <span
                  class="spinner-border spinner-border-sm"
                  :hidden="!state.isLoading"
                ></span>
                <span :hidden="state.isLoading">
                  {{
                    authStore.user.subscription?.type === plan.name
                      ? $t("subscription.page.buttonCurrentPlan")
                      : $t("subscription.page.buttonSelectPlan")
                  }}
                </span>
              </button>
              <button
                v-if="
                  authStore.user.subscription?.type === plan.name &&
                  !authStore.user.subscription?.autoRenew
                "
                class="btn btn-outline-success w-100 mb-2"
                @click="reactivatePlan"
                :disabled="state.isLoading"
              >
                <span
                  class="spinner-border spinner-border-sm"
                  :hidden="!state.isLoading"
                ></span>
                <span :hidden="state.isLoading">
                  {{ $t("subscription.page.reactivateSubscription") }}
                </span>
              </button>
              <button
                v-if="
                  authStore.user.subscription?.type === plan.name &&
                  authStore.user.subscription?.autoRenew
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
                  {{ $t("subscription.page.cancel") }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ConfirmationModal
    :show="state.showCancelModal"
    :title="$t('subscription.cancelModal.title')"
    :message="$t('subscription.cancelModal.message')"
    :confirm-text="$t('subscription.cancelModal.confirm')"
    :cancel-text="$t('common.actions.cancel')"
    @confirm="confirmCancel"
    @cancel="state.showCancelModal = false"
  />
</template>
