import axios from "axios";
axios.interceptors.response.use(
  function (res) {
    return res.data;
  }
);

import { useAlertStore } from "@/stores/alert";

const apiClient = {
  async login(credentials) {
    const alertStore = useAlertStore();
    try {
      const res = await axios.post("/api/login", credentials);
      if (res.status === "success") return res;
    } catch (e) {
      alertStore.error(e.message);
      return e;
    }
  },

  async logout() {
    const alertStore = useAlertStore();
    try {
      const res = await axios.get("/api/logout");
      return res;
    } catch (e) {
      alertStore.error(e.message);
      return e;
    }
  },

  async sendPasswordToken(email) {
    const alertStore = useAlertStore();
    try {
      const res = await axios.post("/api/user/reset-password", { email });
      if (res.status === "success") alertStore.success(res.message);
      else alertStore.error(res.message);
      return res.data;
    } catch (e) {
      return e;
    }
  },

  async createPassword(id, token, password) {
    const alertStore = useAlertStore();
    try {
      const res = await axios.post(`/api/user/${id}/password/${token}`, {
        password,
      });
      if (res.status === "success") alertStore.success(res.message);
      return res.data.user;
    } catch (e) {
      alertStore.error(e.message);
      return e;
    }
  },

  async createUser(user, admin = false) {
    const alertStore = useAlertStore();
    let res;
    try {
      if (admin) res = await axios.post("/api/user/create", user);
      else res = await axios.post("/api/user/register", user);
      if (res.status === "success") alertStore.success(res.message);
      return res.data.user;
    } catch (e) {
      alertStore.error(e.message);
      return e;
    }
  },

  async getActiveUser() {
    const alertStore = useAlertStore();
    try {
      const res = await axios.get("/api/user/profile");
      return res;
    } catch (e) {
      alertStore.error(e.message);
      return e;
    }
  },

  async getItem(model, id) {
    const alertStore = useAlertStore();
    try {
      const res = await axios.get(`/api/${model}/${id}`);
      if (res.status === "success") return res.data.item;
    } catch (e) {
      alertStore.error(e.message);
      return e;
    }
  },

  async getItemList(model) {
    const alertStore = useAlertStore();
    try {
      const res = await axios.get(`/api/${model}/list`);
      if (res.status === "success") return res.data.items;
    } catch (e) {
      alertStore.error(e.message);
      return e;
    }
  },

  async getAllItems() {
    try {
      const res = await axios.get(`/api/items/getall`);
      return res.data;
    } catch (e) {
      return e;
    }
  },

  async createItem(model, item) {
    const alertStore = useAlertStore();
    try {
      const res = await axios.post(`/api/${model}/create`, item);
      if (res.status === "success") {
        alertStore.success(res.message);
        return res.data.item;
      }
    } catch (e) {
      alertStore.error(e.message);
      return e;
    }
  },

  async updateItem(model, item) {
    const alertStore = useAlertStore();
    try {
      const res = await axios.post(`/api/${model}/${item._id}/update`, item);
      if (res.status === "success") {
        alertStore.success(res.message);
        return res.data.item;
      }
    } catch (e) {
      alertStore.error(e.message);
      return e;
    }
  },

  async deleteItem(model, id) {
    const alertStore = useAlertStore();
    try {
      const res = await axios.get(`/api/${model}/${id}/delete`);
      if (res.status === "success") {
        alertStore.success(res.message);
        return res.data.item;
      }
    } catch (e) {
      alertStore.error(e.message);
      return e;
    }
  },

  async getSubscriptionPlans() {
    const alertStore = useAlertStore();
    try {
      const res = await axios.get("/api/subscription/plans");
      if (res.status === "success") return res.data;
    } catch (e) {
      alertStore.error(e.message);
      return e;
    }
  },

  async createCheckoutSession() {
    const alertStore = useAlertStore();
    try {
      const res = await axios.get("/api/subscription/checkout");
      if (res.url) window.location.href = res.url;
      return res;
    } catch (e) {
      alertStore.error(e.message);
      return e;
    }
  },

  async cancelSubscription() {
    const alertStore = useAlertStore();
    try {
      const res = await axios.get("/api/subscription/cancel");
      if (res.status === "success") {
        alertStore.success(res.message);
        return res.data;
      }
    } catch (e) {
      alertStore.error(e.message);
      return e;
    }
  },
};

export default apiClient;
