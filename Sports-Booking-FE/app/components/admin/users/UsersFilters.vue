<template>
  <v-card rounded="xl" elevation="0" class="admin-users-filters-card">
    <v-card-text class="pa-5">
      <div class="admin-users-filters">
        <v-text-field
          v-model="localModel.keyword"
          placeholder="Tìm kiếm theo tên, email hoặc số điện thoại"
          variant="solo-filled"
          density="comfortable"
          rounded="lg"
          flat
          hide-details
          :prepend-inner-icon="mdiMagnify"
          class="admin-users-filters__search"
        />

        <v-select
          v-model="localModel.role"
          :items="roleOptions"
          item-title="label"
          item-value="value"
          placeholder="Vai trò"
          variant="solo-filled"
          density="comfortable"
          rounded="lg"
          flat
          hide-details
          class="admin-users-filters__select"
        />

        <v-select
          v-model="localModel.status"
          :items="statusOptions"
          item-title="label"
          item-value="value"
          placeholder="Trạng thái"
          variant="solo-filled"
          density="comfortable"
          rounded="lg"
          flat
          hide-details
          class="admin-users-filters__select"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { mdiMagnify } from "@mdi/js"
import { computed } from "vue"
import type { AdminUserFilterForm, AdminUserRoleFilter, AdminUserStatusFilter } from "~/types/admin"

const model = defineModel<AdminUserFilterForm>({
  required: true,
})

const localModel = computed({
  get: () => model.value,
  set: (value) => {
    model.value = value
  },
})

const roleOptions: Array<{ label: string; value: AdminUserRoleFilter }> = [
  { label: "Tất cả vai trò", value: "all" },
  { label: "Khách hàng", value: 3 },
  { label: "Chủ sân", value: 2 },
  { label: "Admin", value: 1 },
]

const statusOptions: Array<{ label: string; value: AdminUserStatusFilter }> = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Hoạt động", value: "active" },
  { label: "Bị khóa", value: "banned" },
  { label: "Chờ duyệt", value: "pending_approve" },
]
</script>

<style scoped>
.admin-users-filters-card {
  border: 1px solid #e5e7eb;
  background: #ffffff;
}

.admin-users-filters {
  display: flex;
  gap: 12px;
}

.admin-users-filters__search {
  flex: 1;
}

.admin-users-filters__select {
  width: 190px;
  flex: 0 0 190px;
}

@media (max-width: 1024px) {
  .admin-users-filters {
    flex-wrap: wrap;
  }

  .admin-users-filters__search {
    flex: 1 1 100%;
    width: 100%;
  }

  .admin-users-filters__select {
    flex: 1 1 calc(50% - 6px);
    width: calc(50% - 6px);
  }
}

@media (max-width: 768px) {
  .admin-users-filters__select {
    flex: 1 1 100%;
    width: 100%;
  }
}
</style>
