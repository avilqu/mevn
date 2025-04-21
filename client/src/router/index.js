import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import ProfileView from "@/views/ProfileView.vue";
import UserListView from "@/views/UserListView.vue";
import CreatePasswordView from "@/views/CreatePasswordView.vue";
import UserCreateView from "@/views/UserCreateView.vue";
import SubscriptionPlansView from "@/views/SubscriptionPlansView.vue";
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
    component: LoginView,
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
  },
  {
    path: "/user/list",
    name: "user-list",
    component: UserListView,
  },
  {
    path: "/user/create",
    name: "user-create",
    component: UserCreateView,
  },
  {
    path: "/user/:id",
    name: "user-details",
    component: ProfileView,
  },
  {
    path: "/user/:id/password/:token",
    component: CreatePasswordView,
  },
  {
    path: "/plans",
    name: "subscription-plans",
    component: SubscriptionPlansView,
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
