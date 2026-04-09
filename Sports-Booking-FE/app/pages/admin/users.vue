<template>
  <div class="admin-users-page">
    <UsersHeader @create="openCreate" />
    <UsersFilters v-model="filters" />

    <div class="admin-users-page__table-wrap">
      <AppLoading
        v-if="isLoading && users.length === 0"
        :overlay="false"
        :card="true"
        min-height="360px"
        title="Đang tải danh sách người dùng..."
        description="Vui lòng chờ trong giây lát"
      />

      <template v-else>
        <UsersTable :items="users" @view="openView" @edit="openEdit" @toggle-status-request="openToggleStatusConfirm" />

        <AppLoading
          v-if="isFetching"
          :visible="true"
          :overlay="true"
          :persistent="false"
          :card="true"
          title="Đang cập nhật dữ liệu..."
          description=""
          :size="42"
        />
      </template>
    </div>

    <div class="admin-users-page__footer">
      <div class="admin-users-page__footer-text">
        Hiển thị {{ startItem }} - {{ endItem }} trên tổng {{ pagination.total }} người dùng
      </div>

      <v-pagination v-model="page" :length="pagination.totalPages" :total-visible="5" rounded="circle" density="comfortable" />
    </div>

    <v-alert v-if="isError" type="error" variant="tonal" rounded="lg">
      {{ errorMessage }}
    </v-alert>

    <v-alert v-if="detailError" type="error" variant="tonal" rounded="lg">
      {{ parseError(detailError, "Không thể tải thông tin người dùng") }}
    </v-alert>

    <UsersActionDialog
      :open="dialogOpen"
      :mode="dialogMode"
      :submitting="submitting || isDetailFetching"
      :initial-data="detailUser"
      @close="closeDialog"
      @submit="submitDialog"
    />

    <ConfirmDialog
      v-model="confirmDialog.open"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :confirm-text="confirmDialog.confirmText"
      :confirm-color="confirmDialog.confirmColor"
      :cancel-color="confirmDialog.cancelColor"
      :cancel-text="'Hủy'"
      :is-loading="isUpdatingStatus"
      @confirm="confirmToggleStatus"
      @cancel="resetConfirmDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import AppLoading from "~/components/common/AppLoading.vue"
import UsersFilters from "~/components/admin/users/UsersFilters.vue"
import UsersHeader from "~/components/admin/users/UsersHeader.vue"
import UsersTable from "~/components/admin/users/UsersTable.vue"
import { useAdminUsersQuery } from "~/composables/queries/admin/useAdminUsersQueries"
import type {
  AdminCreateUserPayload,
  AdminUpdateUserPayload,
  AdminUserFilterForm,
  AdminUserFormMode,
  AdminUserListItem,
  PaginationMeta,
  UserStatus,
} from "~/types/admin"
import {
  useAdminCreateUserMutation,
  useAdminUpdateUserMutation,
  useAdminUpdateUserStatusMutation,
  useAdminUserDetailQuery,
} from "~/composables/queries/admin/useUserCrudQueries"
import UsersActionDialog from "~/components/admin/users/UsersActionDialog.vue"
import ConfirmDialog from "~/components/common/ConfirmDialog.vue"

definePageMeta({
  layout: "admin",
  middleware: "admin",
})

const page = ref(1)
const limit = ref(5)

const pagination = computed<PaginationMeta>(() => {
  return (
    data.value?.pagination ?? {
      page: 1,
      limit: limit.value,
      total: 0,
      totalPages: 1,
    }
  )
})

const startItem = computed(() => {
  if (!pagination.value.total) return 0
  return (pagination.value.page - 1) * pagination.value.limit + 1
})

const endItem = computed(() => {
  return Math.min(pagination.value.page * pagination.value.limit, pagination.value.total)
})

const filters = ref<AdminUserFilterForm>({
  keyword: "",
  role: "all",
  status: "all",
})

const debouncedKeyword = useDebounce(
  computed(() => filters.value.keyword.trim()),
  400,
)

const queryParams = computed(() => ({
  page: page.value,
  limit: limit.value,
  keyword: debouncedKeyword.value || undefined,
  roleId: filters.value.role === "all" ? undefined : filters.value.role,
  status: filters.value.status === "all" ? undefined : filters.value.status,
  sortBy: "createdAt" as const,
  sortOrder: "desc" as const,
}))

const { data, isLoading, isFetching, isError, error } = useAdminUsersQuery(queryParams)

const users = computed<AdminUserListItem[]>(() => data.value?.data ?? [])

const errorMessage = computed(() => {
  const err = error.value as unknown

  if (!err) return "Không thể tải danh sách người dùng"
  if (typeof err === "string") return err
  if (err instanceof Error) return err.message

  return "Không thể tải danh sách người dùng"
})

// dialog crud
const dialogOpen = ref(false)
const dialogMode = ref<AdminUserFormMode>("create")
const selectedUserId = ref<number | null>(null)

const { data: detailData, isFetching: isDetailFetching, error: detailError } = useAdminUserDetailQuery(selectedUserId)
const { mutateAsync: createUser, isPending: isCreating } = useAdminCreateUserMutation()
const { mutateAsync: updateUser, isPending: isUpdating } = useAdminUpdateUserMutation()

const submitting = computed(() => isCreating.value || isUpdating.value)
const detailUser = computed(() => detailData.value ?? null)

const parseError = (err: unknown, fallback: string) => {
  if (!err) return fallback
  if (typeof err === "string") return err
  if (err instanceof Error) return err.message
  return fallback
}

const openCreate = () => {
  selectedUserId.value = null
  dialogMode.value = "create"
  dialogOpen.value = true
}

const openView = (userId: number) => {
  selectedUserId.value = userId
  dialogMode.value = "view"
  dialogOpen.value = true
}

const openEdit = (userId: number) => {
  selectedUserId.value = userId
  dialogMode.value = "edit"
  dialogOpen.value = true
}

const closeDialog = () => {
  dialogOpen.value = false
}

const submitDialog = async (payload: { createData?: AdminCreateUserPayload; updateData?: AdminUpdateUserPayload }) => {
  try {
    if (dialogMode.value === "create" && payload.createData) {
      await createUser(payload.createData)
      closeDialog()
      return
    }

    if (dialogMode.value === "edit" && payload.updateData && selectedUserId.value) {
      await updateUser({
        userId: selectedUserId.value,
        data: payload.updateData,
      })
      closeDialog()
    }
  } catch (err) {
    console.error(err)
  }
}

// Confirm dialog
const { mutateAsync: updateUserStatus, isPending: isUpdatingStatus } = useAdminUpdateUserStatusMutation()

const confirmDialog = ref({
  open: false,
  title: "Xác nhận thao tác",
  message: "",
  confirmText: "Xác nhận",
  confirmColor: "error",
  cancelColor: "success",
})

const pendingStatusAction = ref<null | { userId: number; nextStatus: "active" | "banned" }>(null)

const openToggleStatusConfirm = (payload: { userId: number; currentStatus: UserStatus; fullName: string }) => {
  const nextStatus: "active" | "banned" = payload.currentStatus === "banned" ? "active" : "banned"
  const isBan = nextStatus === "banned"

  pendingStatusAction.value = { userId: payload.userId, nextStatus }

  confirmDialog.value = {
    open: true,
    title: isBan ? "Xác nhận khóa tài khoản" : "Xác nhận mở khóa tài khoản",
    message: isBan
      ? `Bạn có chắc muốn khóa tài khoản ${payload.fullName}?`
      : `Bạn có chắc muốn mở khóa tài khoản ${payload.fullName}?`,
    confirmText: isBan ? "Khóa tài khoản" : "Mở khóa",
    confirmColor: isBan ? "error" : "success",
    cancelColor: isBan ? "success" : "error",
  }
}

const resetConfirmDialog = () => {
  confirmDialog.value.open = false
  pendingStatusAction.value = null
}

const confirmToggleStatus = async () => {
  if (!pendingStatusAction.value) return

  try {
    await updateUserStatus({
      userId: pendingStatusAction.value.userId,
      data: { status: pendingStatusAction.value.nextStatus },
    })
  } finally {
    resetConfirmDialog()
  }
}

watch(
  () => [debouncedKeyword.value, filters.value.role, filters.value.status],
  () => {
    page.value = 1
  },
)
</script>

<style scoped>
.admin-users-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.admin-users-page__table-wrap {
  position: relative;
  min-height: 220px;
}

.admin-users-page__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.admin-users-page__footer-text {
  font-size: 14px;
  color: #64748b;
}
</style>
