<template>
  <v-card rounded="xl" elevation="2" class="pa-5">
    <div class="flex items-center gap-4 mb-5">
      <h3 class="text-lg font-bold">Đánh giá ({{ reviews.length }})</h3>
    </div>

    <div class="space-y-4">
      <div v-for="review in reviews" :key="review.id" class="rounded-2xl border border-slate-200 p-4">
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <v-avatar size="42" color="success">
              <span class="text-sm font-bold text-white">
                {{ getInitials(review.userName) }}
              </span>
            </v-avatar>

            <div>
              <p class="font-semibold">{{ review.userName }}</p>
              <p class="text-sm text-slate-500">{{ formatDate(review.createdAt) }}</p>
            </div>
          </div>

          <v-rating :model-value="review.rating" readonly density="compact" size="18" color="amber" class="d-flex ga-1" />
        </div>

        <p class="mt-3 text-body-2 text-slate-600">
          {{ review.comment }}
        </p>
      </div>
    </div>

    <v-btn block variant="outlined" rounded="xl" class="mt-5 text-none"> Xem tất cả đánh giá </v-btn>
  </v-card>
</template>

<script setup lang="ts">
import type { FacilityDetailReview } from "~/types/facility"

defineProps<{
  reviews: FacilityDetailReview[]
}>()

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("")
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}
</script>
