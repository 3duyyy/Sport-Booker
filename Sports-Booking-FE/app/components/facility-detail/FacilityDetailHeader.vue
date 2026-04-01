<template>
  <div class="detail-header">
    <div class="mb-3 text-sm text-slate-500">
      <NuxtLink to="/" class="hover:text-success">Home</NuxtLink>
      <span class="mx-2">/</span>
      <NuxtLink to="/search-facilities" class="hover:text-success">Tìm sân</NuxtLink>
      <span class="mx-2">/</span>
      <span>{{ facility.name }}</span>
    </div>

    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900">
          {{ facility.name }}
        </h1>

        <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
          <div class="flex items-center gap-1">
            <v-icon :icon="mdiMapMarkerOutline" size="18" />
            <span>{{ facility.address }}, {{ facility.district }}, {{ facility.city }}</span>
          </div>

          <div class="flex items-center gap-1">
            <v-icon :icon="mdiStar" size="18" color="amber" />
            <span class="font-semibold text-slate-800">{{ facility.rating.toFixed(1) }}</span>
            <span>({{ facility.reviewCount }} đánh giá)</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <v-btn rounded="lg" variant="outlined" :prepend-icon="mdiShareVariantOutline"> Chia sẻ </v-btn>
        <v-btn rounded="lg" variant="outlined" :prepend-icon="mdiHeartOutline"> Lưu </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mdiHeartOutline, mdiMapMarkerOutline, mdiShareVariantOutline, mdiStar } from "@mdi/js"
import type { FacilityDetailData } from "~/types/facility"

defineProps<{
  facility: FacilityDetailData
}>()
</script>
