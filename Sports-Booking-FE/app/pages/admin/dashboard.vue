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

    <DashboardStats :items="stats" />

    <section class="dashboard-grid">
      <DashboardRevenueChart :items="revenueBySport" />
      <DashboardActivityList :items="activities" />
    </section>

    <DashboardTopFacilitiesTable :items="topFacilities" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { mdiDownload } from "@mdi/js"
import DashboardActivityList from "~/components/admin/dashboard/DashboardActivityList.vue"
import DashboardRevenueChart from "~/components/admin/dashboard/DashboardRevenueChart.vue"
import DashboardStats from "~/components/admin/dashboard/DashboardStats.vue"
import DashboardTopFacilitiesTable from "~/components/admin/dashboard/DashboardTopFacilitiesTable.vue"
import {
  adminDashboardActivitiesMock,
  adminDashboardBookingsMock,
  adminDashboardFacilitiesMock,
  adminDashboardRefundRequestsMock,
  adminDashboardReviewsMock,
  adminDashboardSportsMock,
  adminDashboardTransactionsMock,
  adminDashboardUsersMock,
} from "~/mockData/admin.mock"
import type { AdminDashboardStatItem, AdminRevenueBySportItem, AdminTopFacilityItem } from "~/types/admin"

definePageMeta({
  layout: "admin",
  middleware: "admin",
})

const totalRevenue = computed(() => {
  return adminDashboardTransactionsMock.filter((item) => item.status === "success").reduce((sum, item) => sum + item.amount, 0)
})

const activeBookings = computed(() => {
  return adminDashboardBookingsMock.filter((item) => item.status === "pending" || item.status === "confirmed").length
})

const occupancyRate = computed(() => {
  if (adminDashboardBookingsMock.length === 0) return 0
  return Math.round((activeBookings.value / adminDashboardBookingsMock.length) * 100)
})

const pendingFacilities = computed(() => {
  return adminDashboardFacilitiesMock.filter((item) => item.status === "pending_approve").length
})

const pendingRefunds = computed(() => {
  return adminDashboardRefundRequestsMock.filter((item) => item.status === "pending").length
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
}

const stats = computed<AdminDashboardStatItem[]>(() => [
  {
    key: "revenue",
    label: "Tổng doanh thu",
    value: formatCurrency(totalRevenue.value),
    subText: "+12.4% so với tháng trước",
    tone: "primary",
  },
  {
    key: "active-bookings",
    label: "Lượt đặt đang hoạt động",
    value: activeBookings.value,
    subText: `${occupancyRate.value}% booking đang ở trạng thái pending / confirmed`,
    tone: "default",
  },
  {
    key: "pending-facilities",
    label: "Sân chờ duyệt",
    value: pendingFacilities.value,
    subText: "Cần admin xem xét",
    tone: "error",
  },
  {
    key: "pending-refunds",
    label: "Yêu cầu hoàn tiền",
    value: pendingRefunds.value,
    subText: "Đang chờ xử lý",
    tone: "default",
  },
])

const revenueBySport = computed<AdminRevenueBySportItem[]>(() => {
  const revenueMap = adminDashboardSportsMock.map((sport) => {
    const sportFacilityIds = adminDashboardFacilitiesMock
      .filter((facility) => facility.sportId === sport.id)
      .map((facility) => facility.id)

    const sportBookingIds = adminDashboardBookingsMock
      .filter((booking) => sportFacilityIds.includes(booking.facilityId))
      .map((booking) => booking.id)

    const revenue = adminDashboardTransactionsMock
      .filter((transaction) => transaction.status === "success" && sportBookingIds.includes(transaction.bookingId))
      .reduce((sum, item) => sum + item.amount, 0)

    return {
      sportId: sport.id,
      sportName: sport.name,
      revenue,
    }
  })

  const total = revenueMap.reduce((sum, item) => sum + item.revenue, 0)

  return revenueMap.map((item) => ({
    ...item,
    percent: total > 0 ? Math.round((item.revenue / total) * 100) : 0,
  }))
})

const activities = computed(() => adminDashboardActivitiesMock)

const topFacilities = computed<AdminTopFacilityItem[]>(() => {
  return adminDashboardFacilitiesMock
    .filter((facility) => facility.status !== "inactive")
    .map((facility) => {
      const owner = adminDashboardUsersMock.find((user) => user.id === facility.ownerId)
      const sport = adminDashboardSportsMock.find((item) => item.id === facility.sportId)

      const facilityBookings = adminDashboardBookingsMock.filter((booking) => booking.facilityId === facility.id)
      const facilityBookingIds = facilityBookings.map((booking) => booking.id)

      const revenue = adminDashboardTransactionsMock
        .filter((transaction) => transaction.status === "success" && facilityBookingIds.includes(transaction.bookingId))
        .reduce((sum, item) => sum + item.amount, 0)

      const facilityReviews = adminDashboardReviewsMock.filter((review) => review.facilityId === facility.id)

      const rating =
        facilityReviews.length > 0 ? facilityReviews.reduce((sum, item) => sum + item.rating, 0) / facilityReviews.length : 0

      return {
        id: facility.id,
        name: facility.name,
        ownerName: owner?.fullName || "Chưa rõ",
        sportName: sport?.name || "Chưa rõ",
        location: `${facility.district}, ${facility.city}`,
        bookingCount: facilityBookings.length,
        revenue,
        rating,
        thumbnail: facility.thumbnail,
      }
    })
    .sort((a, b) => b.revenue - a.revenue)
})
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
