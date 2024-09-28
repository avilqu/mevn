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
      console.log(res);
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

  async createUser(user) {
    const alertStore = useAlertStore();
    try {
      let res = await axios.post("/api/user/create", user);
      if (res.status === "success") alertStore.success(res.message);
      else alertStore.error(res.message);
      return res.data.user;
    } catch (e) {
      return e;
    }
  },
};

export default apiClient;
