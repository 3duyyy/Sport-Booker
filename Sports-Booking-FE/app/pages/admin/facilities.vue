<template>
  <div class="admin-facilities-page">
    <FacilitiesHeader />
    <FacilitiesFilters v-model="filters" :sport-options="sportOptions" />

    <div class="admin-facilities-page__table-wrap">
      <AppLoading
        v-if="isLoading && facilities.length === 0"
        :overlay="false"
        :card="true"
        min-height="360px"
        title="Đang tải danh sách cơ sở..."
        description="Vui lòng chờ trong giây lát"
      />

      <template v-else>
        <FacilitiesTable
          :items="facilities"
          @toggle-status-request="openToggleStatusConfirm"
          @approve-request="openApproveConfirm"
        />

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

    <div class="admin-facilities-page__footer">
      <div class="admin-facilities-page__footer-text">
        Hiển thị {{ startItem }} - {{ endItem }} trên tổng {{ pagination.total }} cơ sở
      </div>

      <v-pagination v-model="page" :length="pagination.totalPages" :total-visible="5" rounded="circle" density="comfortable" />
    </div>

    <v-alert v-if="isError" type="error" variant="tonal" rounded="lg">
      {{ errorMessage }}
    </v-alert>

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
import { computed, ref, watch } from "vue"
import { useQuery } from "@tanstack/vue-query"
import AppLoading from "~/components/common/AppLoading.vue"
import FacilitiesFilters from "~/components/admin/facilities/FacilitiesFilters.vue"
import FacilitiesHeader from "~/components/admin/facilities/FacilitiesHeader.vue"
import FacilitiesTable from "~/components/admin/facilities/FacilitiesTable.vue"
import {
  useAdminApproveFacilityMutation,
  useAdminFacilitiesQuery,
  useAdminUpdateFacilityStatusMutation,
} from "~/composables/queries/admin/useAdminFacilitiesQueries"
import { sportService } from "~/services/sportService"
import type {
  AdminFacilityFilterForm,
  AdminFacilityListItem,
  AdminFacilitySportOption,
  FacilityStatus,
  PaginationMeta,
} from "~/types/admin"
import { toast } from "vue-sonner"
import ConfirmDialog from "~/components/common/ConfirmDialog.vue"

definePageMeta({
  layout: "admin",
  middleware: "admin",
})

const page = ref(1)
const limit = ref(5)

const filters = ref<AdminFacilityFilterForm>({
  keyword: "",
  sportId: "all",
  performance: "all",
})

const debouncedKeyword = useDebounce(
  computed(() => filters.value.keyword.trim()),
  400,
)

const facilityQueryParams = computed(() => ({
  page: page.value,
  limit: limit.value,
  keyword: debouncedKeyword.value || undefined,
  sportId: filters.value.sportId === "all" ? undefined : filters.value.sportId,
  performance: filters.value.performance === "all" ? undefined : filters.value.performance,
  sortBy: "createdAt" as const,
  sortOrder: "desc" as const,
}))

const { data, isLoading, isFetching, isError, error } = useAdminFacilitiesQuery(facilityQueryParams)

const facilities = computed<AdminFacilityListItem[]>(() => data.value?.data ?? [])

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

const { data: sportsData } = useQuery({
  queryKey: ["sports-options-admin-facilities"],
  queryFn: async () => {
    const response = await sportService.getAllSports()
    return response.data.data
  },
  staleTime: 5 * 60 * 1000,
})

const sportOptions = computed<AdminFacilitySportOption[]>(() => {
  const dynamicOptions =
    sportsData.value?.map((sport) => ({
      label: sport.name,
      value: sport.id,
    })) ?? []

  return [{ label: "Tất cả môn thể thao", value: "all" }, ...dynamicOptions]
})

const errorMessage = computed(() => {
  const err = error.value as unknown
  if (!err) return "Không thể tải danh sách cơ sở"
  if (typeof err === "string") return err
  if (err instanceof Error) return err.message
  return "Không thể tải danh sách cơ sở"
})

// Handle toggle facility status
const { mutateAsync: updateFacilityStatus, isPending: isUpdatingStatus } = useAdminUpdateFacilityStatusMutation()
const { mutateAsync: approveFacility, isPending: isApprovingFacility } = useAdminApproveFacilityMutation()

const pendingStatusAction = ref<null | { facilityId: number; nextStatus: "active" | "inactive" }>(null)
const pendingApproveFacilityId = ref<number | null>(null)

const confirmDialog = ref({
  open: false,
  title: "Xác nhận thao tác",
  message: "",
  confirmText: "Xác nhận",
  confirmColor: "error",
  cancelColor: "success",
})

const openToggleStatusConfirm = (payload: { facilityId: number; currentStatus: FacilityStatus; facilityName: string }) => {
  if (payload.currentStatus === "pending_approve") {
    toast.info("Cơ sở đang chờ duyệt, chưa thể tạm ngưng/kích hoạt.")
    return
  }

  const nextStatus: "active" | "inactive" = payload.currentStatus === "inactive" ? "active" : "inactive"
  const isDeactivate = nextStatus === "inactive"

  pendingStatusAction.value = { facilityId: payload.facilityId, nextStatus }

  confirmDialog.value = {
    open: true,
    title: isDeactivate ? "Xác nhận tạm ngưng cơ sở" : "Xác nhận kích hoạt lại cơ sở",
    message: isDeactivate
      ? "Bạn có chắc muốn tạm ngưng cơ sở " + payload.facilityName + "?"
      : "Bạn có chắc muốn kích hoạt lại cơ sở " + payload.facilityName + "?",
    confirmText: isDeactivate ? "Tạm ngưng" : "Kích hoạt",
    confirmColor: isDeactivate ? "error" : "success",
    cancelColor: isDeactivate ? "success" : "error",
  }
}

const openApproveConfirm = (payload: { facilityId: number; facilityName: string }) => {
  pendingStatusAction.value = null
  pendingApproveFacilityId.value = payload.facilityId

  confirmDialog.value = {
    open: true,
    title: "Xác nhận phê duyệt cơ sở",
    message: "Bạn có chắc muốn phê duyệt cơ sở " + payload.facilityName + "?",
    confirmText: "Phê duyệt",
    confirmColor: "success",
    cancelColor: "error",
  }
}

const resetConfirmDialog = () => {
  confirmDialog.value.open = false
  pendingStatusAction.value = null
  pendingApproveFacilityId.value = null
}

const confirmToggleStatus = async () => {
  try {
    if (pendingApproveFacilityId.value) {
      await approveFacility(pendingApproveFacilityId.value)
      toast.success("Phê duyệt cơ sở thành công")
      return
    }

    if (!pendingStatusAction.value) return

    await updateFacilityStatus({
      facilityId: pendingStatusAction.value.facilityId,
      data: { status: pendingStatusAction.value.nextStatus },
    })

    toast.success(
      pendingStatusAction.value.nextStatus === "inactive" ? "Tạm ngưng cơ sở thành công" : "Kích hoạt lại cơ sở thành công",
    )
  } catch (err) {
    console.error(err)
  } finally {
    resetConfirmDialog()
  }
}

watch(
  () => [debouncedKeyword.value, filters.value.sportId, filters.value.performance],
  () => {
    page.value = 1
  },
)
</script>

<style scoped>
.admin-facilities-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.admin-facilities-page__table-wrap {
  position: relative;
  min-height: 220px;
}

.admin-facilities-page__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.admin-facilities-page__footer-text {
  font-size: 14px;
  color: #64748b;
}
</style>
