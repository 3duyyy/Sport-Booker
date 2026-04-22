<template>
  <v-card rounded="xl" class="border border-slate-200 shadow-sm">
    <v-card-text class="pa-5">
      <div class="mb-4">
        <h3 class="text-lg font-bold text-slate-900">Lịch hôm nay</h3>
        <p class="mt-1 text-sm text-slate-500">Theo dõi các hoạt động và lượt đặt trong ngày.</p>
      </div>

      <div class="space-y-4">
        <div v-for="item in items" :key="item.id" class="flex items-center gap-3">
          <div class="mt-1 h-3 w-3 rounded-full" :class="getDotClass(item.status)" />

          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-slate-700">
              {{ item.time }}
            </p>
            <p class="mt-1 text-sm font-medium text-slate-900">
              {{ item.title }}
            </p>
            <p class="mt-1 text-sm text-slate-500">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>

      <v-btn v-if="items.length > 5" block variant="outlined" rounded="xl" class="mt-5 text-none" @click="$emit('toggle-full')">
        {{ isFull ? "Thu gọn lịch" : "Xem lịch đầy đủ" }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { OwnerScheduleItem } from "~/types/owner"

defineProps<{
  items: OwnerScheduleItem[]
  isFull: boolean
}>()

defineEmits<{
  (e: "toggle-full"): void
}>()

const getDotClass = (status: OwnerScheduleItem["status"]) => {
  switch (status) {
    case "success":
      return "bg-green-500"
    case "warning":
      return "bg-amber-400"
    default:
      return "bg-slate-300"
  }
}
</script>

<style scoped></style>
