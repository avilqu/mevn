import { defineStore } from "pinia";

import apiClient from "@/lib/apiClient";

const items = (() => {
  try {
    return JSON.parse(localStorage.getItem("items")) || null;
  } catch (e) {
    return null;
  }
})();

const initialState = items
  ? {
      status: { loaded: true },
      items: items.items,
    }
  : { status: {}, items: [] };

export const useItemStore = defineStore("item", {
  state: () => initialState,

  actions: {
    update(items) {
      localStorage.setItem("items", JSON.stringify(items));
      this.items = items.items;
    },

    async load() {
      const res = await apiClient.getAllItems();
      this.update({
        items: res.items,
      });
    },
  },
});
