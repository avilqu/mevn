import { defineStore } from "pinia";
import router from "@/router";

import apiClient from "@/lib/apiClient";
import { useAlertStore } from "@/stores/alert";
import { useItemStore } from "@/stores/item";

const user = JSON.parse(localStorage.getItem("user"));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: {}, user: {} };

export const useAuthStore = defineStore("auth", {
  state: () => initialState,

  actions: {
    async login(credentials) {
      const res = await apiClient.login(credentials);
      if (res.status == "success") {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        this.status = { loggedIn: true };
        this.user = res.data.user;
        const itemStore = useItemStore();
        await itemStore.load();
        router.push("/");
      } else {
        const alert = useAlertStore();
        alert.error(res.message);
        this.status = {};
        this.user = {};
      }
    },

    async oAuthCallback() {
      const res = await apiClient.getActiveUser();
      if (res.status === "success") {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        this.status = { loggedIn: true };
        this.user = res.data.user;
      } else {
        const alert = useAlertStore();
        alert.error(res.message);
        this.status = {};
        this.user = {};
      }
    },

    async logout() {
      const res = await apiClient.logout();
      if (res.status === "success") {
        localStorage.removeItem("user");
        this.status = {};
        this.user = {};
        router.push("/");
      }
    },

    async refresh() {
      const res = await apiClient.getActiveUser();
      if (res.status === "success") {
        this.update(res.data.user);
      }
    },

    async update(user) {
      localStorage.setItem("user", JSON.stringify(user));
      this.user = user;
    },
  },
});
