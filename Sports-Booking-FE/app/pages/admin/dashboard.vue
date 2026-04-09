<template>
  <div class="admin-dashboard-page">
    <div class="admin-dashboard-page__header">
      <div>
        <h1 class="admin-dashboard-page__title">Tổng quan hệ thống</h1>
        <p class="admin-dashboard-page__desc">Theo dõi nhanh tình trạng đặt sân, doanh thu và hoạt động nổi bật trên hệ thống</p>
      </div>

      <div class="admin-dashboard-page__actions">
        <v-btn variant="outlined" rounded="lg" class="text-none">
          <v-icon start size="18">{{ mdiDownload }}</v-icon>
          Xuất Excel
        </v-btn>
      </div>
    </div>

    <v-alert v-if="isError" type="error" variant="tonal" class="mb-4">
      {{ String(error) }}
    </v-alert>

    <AppLoading v-if="isLoading" title="Đang tải..." description="Hệ thống đang lấy dữ liệu mới nhất" />

    <DashboardStats :items="stats" />

    <section class="dashboard-grid">
      <DashboardRevenueChart :items="revenueBySport" />
      <DashboardActivityList :items="activities" />
    </section>

    <DashboardTopFacilitiesTable
      :items="topFacilities"
      :pagination="topFacilitiesPagination"
      @change-page="onTopFacilityPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import dayjs from "dayjs"
import { mdiAlertCircleOutline, mdiBankTransferOut, mdiCheckCircleOutline, mdiDownload, mdiSoccer } from "@mdi/js"
import DashboardActivityList from "~/components/admin/dashboard/DashboardActivityList.vue"
import DashboardRevenueChart from "~/components/admin/dashboard/DashboardRevenueChart.vue"
import DashboardStats from "~/components/admin/dashboard/DashboardStats.vue"
import DashboardTopFacilitiesTable from "~/components/admin/dashboard/DashboardTopFacilitiesTable.vue"
import { useAdminDashboardQuery } from "~/composables/queries/admin/useAdminDashboardQueries"
import type {
  AdminActivityItem,
  AdminDashboardStatItem,
  AdminRevenueBySportItem,
  AdminTopFacilityItem,
  PaginationMeta,
} from "~/types/admin"
import AppLoading from "~/components/common/AppLoading.vue"

definePageMeta({
  layout: "admin",
  middleware: "admin",
})

const days = ref(30)
const topPage = ref(1)
const topLimit = ref(5)
const activityLimit = ref(5)
const topSearch = ref("")

const queryParams = computed(() => ({
  days: days.value,
  topPage: topPage.value,
  topLimit: topLimit.value,
  activityLimit: activityLimit.value,
  topSearch: topSearch.value,
}))

const { data, isLoading, isError, error } = useAdminDashboardQuery(queryParams)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
}

const stats = computed<AdminDashboardStatItem[]>(() => {
  const summary = data.value?.summary
  if (!summary) return []

  const growthText =
    summary.revenueGrowthPercent === null
      ? "Chưa có dữ liệu kỳ trước"
      : `${summary.revenueGrowthPercent > 0 ? "+" : ""}${summary.revenueGrowthPercent}% so với kỳ trước`

  return [
    {
      key: "revenue",
      label: "Tổng doanh thu",
      value: formatCurrency(summary.totalRevenue),
      subText: growthText,
      tone: "primary",
    },
    {
      key: "active-bookings",
      label: "Lượt đặt đang hoạt động",
      value: summary.activeBookings,
      subText: `${summary.occupancyRate}% booking đang ở trạng thái pending / confirmed`,
      tone: "default",
    },
    {
      key: "pending-facilities",
      label: "Sân chờ duyệt",
      value: summary.pendingFacilities,
      subText: "Cần admin xem xét",
      tone: "error",
    },
    {
      key: "pending-refunds",
      label: "Yêu cầu hoàn tiền",
      value: summary.pendingRefunds,
      subText: "Đang chờ xử lý",
      tone: "default",
    },
  ]
})

const revenueBySport = computed<AdminRevenueBySportItem[]>(() => data.value?.revenueBySport ?? [])

const activityIconMap = {
  success: mdiCheckCircleOutline,
  neutral: mdiSoccer,
  danger: mdiAlertCircleOutline,
  primary: mdiBankTransferOut,
} as const

const activities = computed<AdminActivityItem[]>(() =>
  (data.value?.activities ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    time: dayjs(item.createdAt).fromNow(),
    type: item.type,
    icon: activityIconMap[item.type],
  })),
)

const topFacilities = computed<AdminTopFacilityItem[]>(() => data.value?.topFacilities.data ?? [])

const topFacilitiesPagination = computed<PaginationMeta>(() => {
  return (
    data.value?.topFacilities.pagination ?? {
      page: 1,
      limit: topLimit.value,
      total: 0,
      totalPages: 1,
    }
  )
})

const onTopFacilityPageChange = (page: number) => {
  topPage.value = page
}
</script>

<style scoped>
.admin-dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.admin-dashboard-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.admin-dashboard-page__title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
}

.admin-dashboard-page__desc {
  margin: 8px 0 0;
  font-size: 14px;
  color: #64748b;
}

.admin-dashboard-page__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 16px;
}

@media (max-width: 1280px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .admin-dashboard-page__header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
