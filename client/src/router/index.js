import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import { useAlertStore } from "@/stores/alert";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/ProfileView.vue"),
  },
  {
    path: "/user/list",
    name: "user-list",
    component: () => import("@/views/UserListView.vue"),
  },
  {
    path: "/user/create",
    name: "user-create",
    component: () => import("@/views/UserCreateView.vue"),
  },
  {
    path: "/user/:id",
    name: "user-details",
    component: () => import("@/views/ProfileView.vue"),
  },
  {
    path: "/user/:id/password/:token",
    component: () => import("@/views/CreatePasswordView.vue"),
  },
  {
    path: "/plans",
    name: "subscription-plans",
    component: () => import("@/views/SubscriptionPlansView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Add global navigation guard
router.beforeEach((to, from, next) => {
  console.log("Navigation from:", from.path, "to:", to.path);
  console.log("Navigation state:", to.state);

  const alertStore = useAlertStore();
  alertStore.reset();

  if (to.state?.alert) {
    alertStore[to.state.alert.type](to.state.alert.message);
  }

  next();
});

export default router;
