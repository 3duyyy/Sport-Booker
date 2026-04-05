<template>
  <v-card rounded="xl" elevation="0" class="dashboard-panel">
    <v-card-text class="pa-5">
      <div class="dashboard-panel__header dashboard-panel__header--facility">
        <div>
          <h3 class="dashboard-panel__title">Cơ sở hoạt động nổi bật</h3>
          <p class="dashboard-panel__desc">Tổng hợp theo số booking, doanh thu và điểm đánh giá trung bình</p>
        </div>

        <div class="dashboard-view-actions">
          <v-btn icon variant="text" size="small">
            <v-icon size="18">{{ mdiViewGridOutline }}</v-icon>
          </v-btn>

          <v-btn icon variant="text" size="small">
            <v-icon size="18">{{ mdiFormatListBulleted }}</v-icon>
          </v-btn>
        </div>
      </div>

      <v-table class="dashboard-table">
        <thead>
          <tr>
            <th>Cơ sở</th>
            <th>Môn thể thao</th>
            <th>Địa điểm</th>
            <th>Lượt đặt</th>
            <th>Doanh thu</th>
            <th>Đánh giá</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="facility in paginatedItems" :key="facility.id">
            <td>
              <div class="facility-cell">
                <v-avatar size="42" rounded="lg">
                  <v-img :src="facility.thumbnail" cover />
                </v-avatar>

                <div>
                  <p class="facility-cell__name">{{ facility.name }}</p>
                  <p class="facility-cell__owner">Chủ sân: {{ facility.ownerName }}</p>
                </div>
              </div>
            </td>

            <td>
              <v-chip size="small" rounded="lg" variant="tonal">
                {{ facility.sportName }}
              </v-chip>
            </td>

            <td class="dashboard-table__text">
              {{ facility.location }}
            </td>

            <td class="dashboard-table__number">
              {{ facility.bookingCount }}
            </td>

            <td class="dashboard-table__revenue">
              {{ formatCurrency(facility.revenue) }}
            </td>

            <td>
              <div class="facility-rating">
                <v-icon size="16" color="warning">{{ mdiStar }}</v-icon>
                <span>{{ facility.rating.toFixed(1) }}</span>
              </div>
            </td>
          </tr>

          <tr v-if="!paginatedItems.length">
            <td colspan="6" class="dashboard-table__empty">Chưa có dữ liệu cơ sở</td>
          </tr>
        </tbody>
      </v-table>

      <v-divider class="mt-2" />

      <div class="dashboard-pagination">
        <div class="dashboard-pagination__text">Hiển thị {{ startItem }} - {{ endItem }} trên tổng {{ props.items.length }} cơ sở</div>

        <v-pagination v-model="page" :length="totalPages" :total-visible="5" rounded="circle" density="comfortable" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { mdiFormatListBulleted, mdiStar, mdiViewGridOutline } from "@mdi/js"
import type { AdminTopFacilityItem } from "~/types/admin"

const props = defineProps<{
  items: AdminTopFacilityItem[]
}>()

const page = ref(1)
const itemsPerPage = 5

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.items.length / itemsPerPage))
})

const paginatedItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return props.items.slice(start, end)
})

const startItem = computed(() => {
  if (!props.items.length) return 0
  return (page.value - 1) * itemsPerPage + 1
})

const endItem = computed(() => {
  return Math.min(page.value * itemsPerPage, props.items.length)
})

watch(
  () => props.items.length,
  () => {
    if (page.value > totalPages.value) {
      page.value = totalPages.value
    }
  },
)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
}
</script>

<style scoped>
.dashboard-panel {
  border: 1px solid #e5e7eb;
  background: #ffffff;
}

.dashboard-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.dashboard-panel__header--facility {
  margin-bottom: 20px;
}

.dashboard-panel__title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.dashboard-panel__desc {
  margin: 6px 0 0;
  font-size: 13px;
  color: #64748b;
}

.dashboard-view-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dashboard-table {
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  overflow: hidden;
}

.dashboard-table :deep(th) {
  background: #f8fafc;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.dashboard-table :deep(td) {
  vertical-align: middle;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
}

.facility-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.facility-cell__name {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.facility-cell__owner {
  margin: 4px 0 0;
  font-size: 12px;
  color: #94a3b8;
}

.dashboard-table__text,
.dashboard-table__number {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.dashboard-table__revenue {
  font-size: 13px;
  font-weight: 700;
  color: #10b981;
}

.facility-rating {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 700;
  color: #334155;
}

.dashboard-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 14px;
  flex-wrap: wrap;
}

.dashboard-pagination__text {
  font-size: 14px;
  color: #64748b;
}

.dashboard-table__empty {
  text-align: center;
  color: #64748b;
  padding: 24px 12px !important;
}
</style>
