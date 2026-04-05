<template>
  <v-card rounded="xl" elevation="0" class="admin-facilities-filters-card">
    <v-card-text class="pa-5">
      <div class="admin-facilities-filters">
        <v-text-field
          v-model="localModel.keyword"
          placeholder="Tìm theo tên sân, chủ sân hoặc địa điểm"
          variant="solo-filled"
          density="comfortable"
          rounded="lg"
          flat
          hide-details
          prepend-inner-icon="mdi-magnify"
          class="admin-facilities-filters__search"
        />

        <v-select
          v-model="localModel.sportId"
          :items="sportOptions"
          item-title="label"
          item-value="value"
          placeholder="Môn thể thao"
          variant="solo-filled"
          density="comfortable"
          rounded="lg"
          flat
          hide-details
          class="admin-facilities-filters__select"
        />

        <v-select
          v-model="localModel.performance"
          :items="performanceOptions"
          item-title="label"
          item-value="value"
          placeholder="Hiệu suất"
          variant="solo-filled"
          density="comfortable"
          rounded="lg"
          flat
          hide-details
          class="admin-facilities-filters__select"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { AdminFacilityFilterForm, AdminFacilityPerformanceFilter, AdminFacilitySportOption } from "~/types/admin"

const props = defineProps<{
  sportOptions: AdminFacilitySportOption[]
}>()

const model = defineModel<AdminFacilityFilterForm>({
  required: true,
})

const localModel = computed({
  get: () => model.value,
  set: (value) => {
    model.value = value
  },
})

const performanceOptions: Array<{ label: string; value: AdminFacilityPerformanceFilter }> = [
  { label: "Tất cả hiệu suất", value: "all" },
  { label: "Hiệu suất cao", value: "high" },
  { label: "Hiệu suất bình thường", value: "normal" },
  { label: "Hiệu suất thấp", value: "low" },
]
</script>

<style scoped>
.admin-facilities-filters-card {
  border: 1px solid #e5e7eb;
  background: #ffffff;
}

.admin-facilities-filters {
  display: flex;
  gap: 12px;
}

.admin-facilities-filters__search {
  flex: 1;
}

.admin-facilities-filters__select {
  width: 200px;
  flex: 0 0 200px;
}

@media (max-width: 1024px) {
  .admin-facilities-filters {
    flex-wrap: wrap;
  }

  .admin-facilities-filters__search {
    flex: 1 1 100%;
    width: 100%;
  }

  .admin-facilities-filters__select {
    flex: 1 1 calc(50% - 6px);
    width: calc(50% - 6px);
  }
}

@media (max-width: 768px) {
  .admin-facilities-filters__select {
    flex: 1 1 100%;
    width: 100%;
  }
}
</style>
