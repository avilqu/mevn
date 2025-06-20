import { createRouter, createWebHistory } from "vue-router";

import en from "@/locales/en.json";
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
    meta: {
      title: `${en.title} | ${en.auth.login.title}`,
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/ProfileView.vue"),
    meta: {
      title: `${en.title} | ${en.common.navigation.profile}`,
    },
  },
  {
    path: "/user/list",
    name: "user-list",
    component: () => import("@/views/UserListView.vue"),
    meta: {
      title: `${en.title} | ${en.user.list}`,
    },
  },
  {
    path: "/user/create",
    name: "user-create",
    component: () => import("@/views/UserCreateView.vue"),
    meta: {
      title: `${en.title} | ${en.user.create}`,
    },
  },
  {
    path: "/user/:id",
    name: "user-details",
    component: () => import("@/views/ProfileView.vue"),
    meta: {
      title: `${en.title} | ${en.common.navigation.profile}`,
    },
  },
  {
    path: "/user/:id/password/:token",
    component: () => import("@/views/CreatePasswordView.vue"),
    meta: {
      title: `${en.title} | ${en.auth.resetPassword.title}`,
    },
  },
  {
    path: "/plans",
    name: "subscription-plans",
    component: () => import("@/views/SubscriptionPlansView.vue"),
    meta: {
      title: `${en.title} | ${en.subscription.page.title}`,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const alertStore = useAlertStore();
  alertStore.reset();

  if (to.state?.alert) {
    alertStore[to.state.alert.type](to.state.alert.message);
  }

  document.title = to.meta.title || en.title;

  next();
});

export default router;
