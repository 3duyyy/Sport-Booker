<template>
  <v-card rounded="xl" elevation="2" class="pa-4">
    <div class="flex gap-4">
      <div class="summary-image">
        <img :src="draft.facilityImage!" alt="Sân" class="summary-image__img" />
      </div>

      <div class="flex-1 min-w-0">
        <div v-if="draft.sportName" class="mb-2">
          <v-chip size="x-small" color="success" variant="tonal" rounded="lg">
            {{ draft.sportName }}
          </v-chip>
        </div>

        <h3 class="text-base font-bold text-slate-900">{{ draft.fieldName }} - {{ draft.facilityName }}</h3>

        <div class="mt-2 text-sm text-slate-500 space-y-1">
          <div>{{ formattedDate }}</div>
          <div>{{ slotLabel }} ({{ slotCount }} khung giờ)</div>
        </div>

        <div class="mt-4 flex items-end justify-between gap-4">
          <div>
            <p class="text-xs text-slate-500">Giá mỗi giờ từ</p>
            <p class="font-semibold text-slate-900">
              {{ formattedAveragePrice }}
            </p>
          </div>

          <div class="text-right">
            <p class="text-xs text-slate-500">Tổng tiền</p>
            <p class="text-lg font-extrabold text-success">
              {{ formatPrice(draft.totalPrice) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { BookingDraft } from "~/types/booking"

const props = defineProps<{
  draft: BookingDraft
}>()

const slotCount = computed(() => props.draft.slots.length)

const slotLabel = computed(() => {
  const sorted = [...props.draft.slots].sort((a, b) => a.startTime.localeCompare(b.startTime))

  const first = sorted.at(0)
  const last = sorted.at(-1)

  if (!first || !last) return "--"

  return `${first.startTime} - ${last.endTime}`
})

const formattedDate = computed(() => {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(props.draft.date))
})

const formattedAveragePrice = computed(() => {
  if (props.draft.slots.length === 0) return formatPrice(0)
  return formatPrice(Math.round(props.draft.totalPrice / props.draft.slots.length))
})

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
}
</script>

<style scoped>
.summary-image {
  width: 112px;
  height: 112px;
  overflow: hidden;
  border-radius: 16px;
  flex-shrink: 0;
}

.summary-image__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
