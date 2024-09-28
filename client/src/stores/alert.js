import { defineStore } from "pinia";

export const useAlertStore = defineStore("alert", {
  state: () => {
    return {
      type: null,
      message: null,
    };
  },

  actions: {
    success(message) {
      this.type = "success";
      this.message = message;
    },

    error(message) {
      this.type = "danger";
      this.message = message;
    },

    reset() {
      this.$reset();
    },
  },
});
