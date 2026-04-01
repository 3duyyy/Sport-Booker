<template>
  <v-card rounded="xl" elevation="2" class="pa-5">
    <h3 class="text-2xl font-bold mb-4">Mô tả</h3>

    <p class="text-body-2 text-slate-600 leading-7 mb-6">
      {{ facility.description }}
    </p>

    <h4 class="text-base font-bold mb-3">Tiện ích</h4>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <div
        v-for="amenity in facility.amenities"
        :key="amenity.id"
        class="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
      >
        <v-icon :icon="mdiCheckCircleOutline" size="18" color="success" />
        <span class="text-sm font-medium">{{ amenity.name }}</span>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { mdiCheckCircleOutline } from "@mdi/js"
import type { FacilityDetailData } from "~/types/facility"

defineProps<{
  facility: FacilityDetailData
}>()
</script>
