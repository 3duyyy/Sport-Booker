<template>
  <v-card rounded="xl" elevation="2" class="pa-5">
    <div class="flex items-center justify-between gap-4 flex-wrap mb-4">
      <h3 class="text-lg font-bold">Chọn sân và khung giờ</h3>

      <div class="date-box">
        <v-text-field
          :model-value="selectedDate"
          type="date"
          density="comfortable"
          variant="outlined"
          hide-details
          @update:model-value="$emit('update:selectedDate', String($event))"
        />
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2 mb-5">
      <v-chip size="small" color="success" variant="outlined">Trống</v-chip>
      <v-chip size="small" color="grey-lighten-2" variant="flat">Đã đặt</v-chip>
      <v-chip size="small" color="success" variant="flat">Đang chọn</v-chip>
    </div>

    <div class="space-y-5">
      <div v-for="field in fields" :key="field.id" class="rounded-2xl border border-slate-200 p-4">
        <div class="flex items-center justify-between gap-4 mb-3">
          <div>
            <h4 class="font-bold text-base">{{ field.name }}</h4>
            <p v-if="field.description" class="mt-1 text-sm text-slate-500">
              {{ field.description }}
            </p>
          </div>

          <span class="text-sm text-slate-500"> Giá từ {{ formatPrice(field.fromPrice) }} </span>
        </div>

        <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          <button
            v-for="slot in field.slots"
            :key="slot.id"
            type="button"
            class="slot-btn"
            :class="getSlotClass(field.id, slot.id, slot.isBooked || isSlotPassed(slot.startTime))"
            :disabled="slot.isBooked || isSlotPassed(slot.startTime)"
            @click="toggleSlot(field.id, field.name, slot)"
          >
            <span class="slot-btn__time">{{ slot.startTime }} - {{ slot.endTime }}</span>
            <span class="slot-btn__price">{{ formatPrice(slot.price) }}</span>
          </button>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { mdiCalendarMonthOutline } from "@mdi/js"
import dayjs from "dayjs"
import type { FacilityDetailField, FacilityDetailSlot } from "~/types/facility"

const props = defineProps<{
  fields: FacilityDetailField[]
  selectedDate: string
  selectedFieldId: number | null
  selectedSlotIds: string[]
}>()

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
}

function toggleSlot(fieldId: number, fieldName: string, slot: FacilityDetailSlot) {
  emit("toggle-slot", { fieldId, fieldName, slot })
}

const emit = defineEmits<{
  (e: "update:selectedDate", value: string): void
  (
    e: "toggle-slot",
    payload: {
      fieldId: number
      fieldName: string
      slot: FacilityDetailSlot
    },
  ): void
}>()

function getSlotClass(fieldId: number, slotId: string, isBooked: boolean) {
  const isSelected = isSlotSelected(fieldId, slotId)

  return {
    "slot-btn--booked": isBooked,
    "slot-btn--selected": isSelected,
    "slot-btn--available": !isBooked && !isSelected,
  }
}

function isSlotSelected(fieldId: number, slotId: string) {
  return fieldId === props.selectedFieldId && props.selectedSlotIds.includes(slotId)
}

function isSlotPassed(startTime: string) {
  const now = dayjs()
  const selected = dayjs(props.selectedDate)

  // Nếu user lách luật chọn ngày trong quá khứ -> Disable tất
  if (selected.isBefore(now, "day")) {
    return true
  }

  if (selected.isSame(now, "day")) {
    const [hours, minutes] = startTime.split(":").map(Number)
    const slotTime = selected.hour(hours!).minute(minutes!).second(0)

    // Nếu giờ bắt đầu đã lố giờ hiện tại thì disable
    return slotTime.isBefore(now)
  }

  // Ngày tương lai thì ok
  return false
}
</script>

<style scoped>
.slot-btn {
  min-height: 68px;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.slot-btn__time {
  font-size: 13px;
  font-weight: 700;
}

.slot-btn__price {
  font-size: 11px;
  color: #64748b;
}

.slot-btn--available:hover {
  border-color: rgb(var(--v-theme-success));
  background: #f0fdf4;
}

.slot-btn--booked {
  background: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
}

.slot-btn--selected {
  background: rgb(var(--v-theme-success));
  border-color: rgb(var(--v-theme-success));
  color: white;
}

.slot-btn--selected .slot-btn__price {
  color: rgba(255, 255, 255, 0.88);
}
</style>
