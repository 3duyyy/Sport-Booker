<template>
  <div class="admin-users-page">
    <UsersHeader />
    <UsersFilters v-model="filters" />
    <UsersTable :items="users" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import UsersFilters from "~/components/admin/users/UsersFilters.vue"
import UsersHeader from "~/components/admin/users/UsersHeader.vue"
import UsersTable from "~/components/admin/users/UsersTable.vue"
import { adminUsersMock } from "~/mockData/admin.mock"
import type { AdminUserFilterForm } from "~/types/admin"

definePageMeta({
  layout: "admin",
  middleware: "admin",
})

const filters = ref<AdminUserFilterForm>({
  keyword: "",
  role: "all",
  status: "all",
})

const users = adminUsersMock
</script>

<style scoped>
.admin-users-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
