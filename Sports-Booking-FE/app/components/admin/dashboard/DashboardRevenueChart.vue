<template>
  <v-card rounded="xl" elevation="0" class="dashboard-panel">
    <v-card-text class="pa-5">
      <div class="dashboard-panel__header">
        <div>
          <h3 class="dashboard-panel__title">Doanh thu theo môn thể thao</h3>
          <p class="dashboard-panel__desc">Tổng hợp từ transactions thành công</p>
        </div>

        <v-chip size="small" rounded="lg" variant="tonal"> 30 ngày gần đây </v-chip>
      </div>

      <div class="revenue-category-list">
        <div v-for="item in items" :key="item.sportId" class="revenue-category-item">
          <div class="revenue-category-item__top">
            <p class="revenue-category-item__name">{{ item.sportName }}</p>
            <p class="revenue-category-item__value">{{ formatCurrency(item.revenue) }} ({{ item.percent }}%)</p>
          </div>

          <v-progress-linear :model-value="item.percent" rounded height="8" />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { AdminRevenueBySportItem } from "~/types/admin"

defineProps<{
  items: AdminRevenueBySportItem[]
}>()

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
  margin-bottom: 18px;
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

.revenue-category-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.revenue-category-item__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.revenue-category-item__name {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  text-transform: uppercase;
}

.revenue-category-item__value {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
}
</style>
