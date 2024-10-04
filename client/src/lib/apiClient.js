import axios from "axios";
import { useAlertStore } from "@/stores/alert";

axios.interceptors.response.use(function (res) {
  return res.data;
});

const apiClient = {
  async login(credentials) {
    const alertStore = useAlertStore();
    try {
      let res = await axios.post("/api/login", credentials);
      if (res.status === "error") alertStore.error(res.message);
      return res;
    } catch (e) {
      return e;
    }
  },

  async logout() {
    try {
      let res = await axios.get("/api/logout");
      return res;
    } catch (e) {
      return e;
    }
  },

  async sendPasswordToken(email) {
    const alertStore = useAlertStore();
    try {
      let res = await axios.post("/api/user/reset-password", { email });
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
      let res = await axios.post("/api/user/" + id + "/password/" + token, {
        password,
      });
      if (res.status === "success") alertStore.success(res.message);
      else alertStore.error(res.message);
      return res.data.user;
    } catch (e) {
      return e;
    }
  },

  async createUser(user, mode) {
    const alertStore = useAlertStore();
    let res;
    try {
      if (mode == "admin") res = await axios.post("/api/user/create", user);
      else res = await axios.post("/api/user/register", user);
      if (res.status === "success") alertStore.success(res.message);
      else alertStore.error(res.message);
      return res.data.user;
    } catch (e) {
      return e;
    }
  },

  async getUserList() {
    const alertStore = useAlertStore();
    try {
      let res = await axios.get("/api/user/list");
      if (res.status === "error") alertStore.error(res.message);
      return res.data.users;
    } catch (e) {
      return e;
    }
  },

  async getUser(id) {
    const alertStore = useAlertStore();
    try {
      let res = await axios.get("/api/user/" + id);
      if (res.status === "error") alertStore.error(res.message);
      return res.data.user;
    } catch (e) {
      return e;
    }
  },

  async updateUser(user) {
    const alertStore = useAlertStore();
    try {
      let res = await axios.post("/api/user/" + user._id + "/update", user);
      if (res.status === "error") alertStore.error(res.message);
      else alertStore.success(res.message);
      return res.data.user;
    } catch (e) {
      return e;
    }
  },
};

export default apiClient;
