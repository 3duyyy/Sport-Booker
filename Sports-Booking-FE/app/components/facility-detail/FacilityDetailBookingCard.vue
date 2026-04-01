<template>
  <div class="sticky top-24">
    <v-card rounded="xl" elevation="3" class="pa-5">
      <h3 class="text-lg font-bold mb-5">Tóm tắt đặt sân</h3>

      <div class="space-y-4">
        <div class="summary-row">
          <div class="summary-label">
            <v-icon :icon="mdiCalendarMonthOutline" size="18" />
            <span>{{ formatDate(selectedDate) }}</span>
          </div>
        </div>

        <div class="summary-row">
          <div class="summary-label">
            <v-icon :icon="mdiSoccerField" size="18" />
            <span>{{ selectedFieldName || "Chưa chọn sân" }}</span>
          </div>
        </div>

        <div class="summary-row">
          <div class="summary-label">
            <v-icon :icon="mdiClockOutline" size="18" />
            <span>{{ selectedSlotLabel || "Chưa chọn khung giờ" }}</span>
          </div>
        </div>

        <div class="summary-row">
          <div class="summary-label">
            <v-icon :icon="mdiViewListOutline" size="18" />
            <span>{{ selectedSlotCountText }}</span>
          </div>
        </div>
      </div>

      <v-divider class="my-5" />

      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-slate-500">Tiền sân</span>
          <span>{{ formatPrice(price) }}</span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-slate-500">Phí dịch vụ</span>
          <span>{{ formatPrice(serviceFee) }}</span>
        </div>

        <div class="flex items-center justify-between text-lg font-bold">
          <span>Tổng cộng</span>
          <span class="text-success">{{ formatPrice(total) }}</span>
        </div>
      </div>

      <v-btn
        block
        color="success"
        rounded="xl"
        size="large"
        class="mt-5 text-none font-weight-bold"
        :disabled="!canConfirm"
        @click="emit('confirm')"
      >
        Xác nhận đặt sân
      </v-btn>

      <p class="mt-3 text-center text-caption text-slate-500">Có thể chọn nhiều khung giờ liên tiếp trong cùng một sân.</p>
    </v-card>

    <v-card rounded="xl" elevation="2" class="pa-4 mt-4">
      <div class="direction-box">
        <v-btn color="white" rounded="xl" :prepend-icon="mdiMapMarkerOutline" @click="openGGMap"> Chỉ đường </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { mdiCalendarMonthOutline, mdiClockOutline, mdiMapMarkerOutline, mdiSoccerField, mdiViewListOutline } from "@mdi/js"

const props = defineProps<{
  selectedDate: string
  selectedFieldName: string | null
  selectedSlotLabel: string | null
  selectedSlotCount: number
  price: number
  latitude?: number | null
  longitude?: number | null
  address?: string | null
}>()

const emit = defineEmits<{
  (e: "confirm"): void
}>()

const serviceFee = computed(() => 0)
const total = computed(() => props.price + serviceFee.value)
const canConfirm = computed(() => {
  return Boolean(props.selectedFieldName && props.selectedSlotLabel && props.selectedSlotCount > 0)
})

const selectedSlotCountText = computed(() => {
  if (!props.selectedSlotCount) return "Chưa chọn slot"
  return `${props.selectedSlotCount} khung giờ đã chọn`
})

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value: string) {
  if (!value) return "--"

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value))
}

function openGGMap() {
  if (props.latitude && props.longitude) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${props.latitude},${props.longitude}`
    window.open(url, "_blank")
    return
  }

  if (props.address) {
    const fullAddress = encodeURIComponent(props.address)
    const url = `https://www.google.com/maps/search/?api=1&query=${fullAddress}`
    window.open(url, "_blank")
  }
}
</script>

<style scoped>
.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.direction-box {
  min-height: 180px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(rgba(34, 197, 94, 0.12), rgba(34, 197, 94, 0.12)),
    url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop") center/cover no-repeat;
}
</style>
