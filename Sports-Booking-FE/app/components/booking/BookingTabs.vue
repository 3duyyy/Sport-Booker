<template>
  <div class="booking-history-tabs-wrapper">
    <v-tabs v-model="model" align-tabs="start" gap color="success" slider-color="success" class="booking-history-tabs">
      <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value" class="text-none">
        <div class="d-flex align-center ga-2">
          <span class="tab-label">
            {{ tab.label }}
          </span>

          <v-chip
            size="x-small"
            rounded="pill"
            :color="model === tab.value ? tab.chipColor : 'default'"
            :variant="model === tab.value ? 'tonal' : 'tonal'"
            class="tab-count-chip"
          >
            {{ counts[tab.value] }}
          </v-chip>
        </div>
      </v-tab>
    </v-tabs>
  </div>
</template>

<script setup lang="ts">
import type { CustomerBookingTab } from "~/types/booking"

const model = defineModel<CustomerBookingTab>({ default: "upcoming" })

defineProps<{
  counts: Record<CustomerBookingTab, number>
}>()

const tabs: Array<{
  label: string
  value: CustomerBookingTab
  chipColor: string
}> = [
  {
    label: "Chờ xác nhận",
    value: "pending_confirmation",
    chipColor: "warning",
  },
  {
    label: "Sắp tới",
    value: "upcoming",
    chipColor: "success",
  },
  {
    label: "Hoàn thành",
    value: "completed",
    chipColor: "info",
  },
  {
    label: "Đã hủy",
    value: "cancelled",
    chipColor: "error",
  },
]
</script>

<style scoped>
.booking-history-tabs-wrapper {
  width: 100%;
}

.booking-history-tabs :deep(.v-slide-group__content) {
  gap: 10px;
}

.booking-history-tabs :deep(.v-tab) {
  min-width: unset;
  padding-inline: 0;
  opacity: 1;
  letter-spacing: 0;

  padding: 0px 10px 0px 10px;
  border-radius: 10px;
}

.booking-history-tabs :deep(.v-btn__content) {
  font-weight: 700;
  color: rgb(71 85 105);
}

.booking-history-tabs :deep(.v-tab--selected .v-btn__content) {
  color: rgb(15 23 42);
}

.tab-label {
  line-height: 1;
}

.tab-count-chip {
  font-weight: 700;
}

.booking-history-tabs :deep(.v-tab__slider) {
  height: 3px;
  border-radius: 999px;
}
</style>
