<script setup>
import { onMounted, reactive } from "vue";
import router from "@/router";

import apiClient from "@/lib/apiClient";
import DateDisplay from "@/components/DateDisplay";

import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
DataTable.use(DataTablesCore);

const state = reactive({
  userList: [],
  loaded: false,
});

const tableOptions = {
  columnDefs: [
    {
      targets: [4, 5],
      type: "date",
    },
  ],
  order: [[4, "desc"]],
};

onMounted(async () => {
  const users = await apiClient.getItemList("user");
  state.userList = users;
  state.loaded = true;
});
</script>

<template>
  <div class="row">
    <div class="col-lg-10">
      <h1 class="mb-5">{{ $t("user.list") }}</h1>

      <DataTable
        v-if="state.loaded"
        :options="tableOptions"
        class="table table-striped table-hover"
      >
        <thead class="table-secondary">
          <tr>
            <th>{{ $t("auth.fields.name") }}</th>
            <th>{{ $t("auth.fields.email") }}</th>
            <th>{{ $t("auth.fields.role") }}</th>
            <th>{{ $t("subscription.header.plan") }}</th>
            <th>{{ $t("common.dates.addedOn") }}</th>
            <th>{{ $t("common.dates.connectedOn") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in state.userList"
            :key="user._id"
            class="__pointer"
            :class="{
              'table-info': user.role === 'admin',
              'table-success': user.subscription.type !== 'free',
            }"
            @click="router.push(`/user/${user._id}`)"
          >
            <td class="p-3">{{ user.name }}</td>
            <td class="p-3">{{ user.email }}</td>
            <td class="p-3">{{ user.role }}</td>
            <td class="p-3">{{ user.subscription.type }}</td>
            <td class="p-3">
              <DateDisplay :value="user.added" />
            </td>
            <td class="p-3">
              <DateDisplay :value="user.lastConnected" />
            </td>
          </tr>
        </tbody>
      </DataTable>
    </div>
  </div>
</template>
