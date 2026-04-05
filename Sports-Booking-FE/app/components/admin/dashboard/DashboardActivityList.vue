<template>
  <v-card rounded="xl" elevation="0" class="dashboard-panel">
    <v-card-text class="pa-5">
      <div class="dashboard-panel__header">
        <div>
          <h3 class="dashboard-panel__title">Hoạt động hệ thống</h3>
          <p class="dashboard-panel__desc">Các sự kiện nổi bật gần đây</p>
        </div>

        <button class="dashboard-panel__link" type="button">Xem log</button>
      </div>

      <div class="activity-list">
        <div v-for="activity in items" :key="activity.id" class="activity-item">
          <div class="activity-item__icon" :class="`activity-item__icon--${activity.type}`">
            <v-icon size="18">{{ activity.icon }}</v-icon>
          </div>

          <div class="activity-item__content">
            <p class="activity-item__title">{{ activity.title }}</p>
            <p class="activity-item__desc">{{ activity.description }}</p>
            <p class="activity-item__time">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { AdminActivityItem } from "~/types/admin"

defineProps<{
  items: AdminActivityItem[]
}>()
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

.dashboard-panel__link {
  border: none;
  background: transparent;
  color: #14b8a6;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  gap: 12px;
}

.activity-item__icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.activity-item__icon--success {
  background: #dcfce7;
  color: #16a34a;
}

.activity-item__icon--neutral {
  background: #e5e7eb;
  color: #475569;
}

.activity-item__icon--danger {
  background: #fee2e2;
  color: #dc2626;
}

.activity-item__icon--primary {
  background: #dbeafe;
  color: #2563eb;
}

.activity-item__title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

.activity-item__desc {
  margin: 4px 0 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
}

.activity-item__time {
  margin: 4px 0 0;
  font-size: 11px;
  color: #94a3b8;
  font-weight: 700;
  text-transform: uppercase;
}
</style>
