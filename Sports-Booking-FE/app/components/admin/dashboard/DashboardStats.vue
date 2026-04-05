<template>
  <section class="dashboard-stats">
    <v-card
      v-for="item in items"
      :key="item.key"
      rounded="xl"
      elevation="0"
      class="dashboard-stat-card"
      :class="{ 'dashboard-stat-card--primary': item.tone === 'primary' }"
    >
      <v-card-text class="dashboard-stat-card__content">
        <p class="dashboard-stat-card__label">{{ item.label }}</p>
        <h2 class="dashboard-stat-card__value">{{ item.value }}</h2>
        <p
          class="dashboard-stat-card__sub"
          :class="{
            'dashboard-stat-card__sub--success': item.tone === 'success',
            'dashboard-stat-card__sub--error': item.tone === 'error',
          }"
        >
          {{ item.subText }}
        </p>
      </v-card-text>
    </v-card>
  </section>
</template>

<script setup lang="ts">
import type { AdminDashboardStatItem } from "~/types/admin"

defineProps<{
  items: AdminDashboardStatItem[]
}>()
</script>

<style scoped>
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.dashboard-stat-card {
  border: 1px solid #e5e7eb;
  background: #ffffff;
}

.dashboard-stat-card--primary {
  position: relative;
  overflow: hidden;
}

.dashboard-stat-card--primary::after {
  content: "";
  position: absolute;
  inset: auto 0 0 0;
  height: 3px;
  background: #2563eb;
}

.dashboard-stat-card__content {
  padding: 20px !important;
}

.dashboard-stat-card__label {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.dashboard-stat-card__value {
  margin: 0;
  font-size: 34px;
  line-height: 1.1;
  font-weight: 800;
  color: #0f172a;
}

.dashboard-stat-card__sub {
  margin: 10px 0 0;
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
}

.dashboard-stat-card__sub--success {
  color: #14b8a6;
}

.dashboard-stat-card__sub--error {
  color: #ef4444;
}

@media (max-width: 1280px) {
  .dashboard-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
}
</style>
