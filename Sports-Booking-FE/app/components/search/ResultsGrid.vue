<template>
  <div v-if="viewMode === 'grid'" class="results-grid">
    <FacilityCard v-for="facility in facilities" :key="facility.id" :facility="facility" @book="$emit('book', $event)" />
  </div>

  <v-card v-else rounded="xl" elevation="0" class="map-placeholder">
    <div class="map-placeholder__inner">Chế độ bản đồ sẽ được tích hợp ở bước tiếp theo.</div>
  </v-card>
</template>

<script setup lang="ts">
import type { FacilityItem } from "~/types/facility"

interface Props {
  facilities: FacilityItem[]
  viewMode: "grid" | "map"
}

defineProps<Props>()

defineEmits<{
  book: [facility: FacilityItem]
}>()
</script>

<style scoped>
.results-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.map-placeholder {
  min-height: 560px;
  border: 1px dashed #cbd5e1;
  background: linear-gradient(180deg, rgba(240, 253, 244, 0.8), rgba(255, 255, 255, 1));
}

.map-placeholder__inner {
  min-height: 560px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: #64748b;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
}

@media (max-width: 1260px) {
  .results-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .results-grid {
    grid-template-columns: 1fr;
  }
}
</style>
