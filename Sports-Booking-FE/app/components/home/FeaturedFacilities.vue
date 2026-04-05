<template>
  <section class="section-block">
    <div class="section-header">
      <h2 class="section-title">Cơ sở nổi bật</h2>

      <NuxtLink to="/search-facilities" class="view-all-link">
        Xem tất cả
        <v-icon :icon="mdiArrowRight" size="18" />
      </NuxtLink>
    </div>

    <div v-if="isLoading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <v-skeleton-loader v-for="item in 4" :key="item" type="image, article" class="rounded-3xl" />
    </div>

    <v-alert v-else-if="isError" type="error" variant="tonal" rounded="xl">Không thể tải danh sách nổi bật</v-alert>

    <v-row v-else>
      <v-col v-for="facility in facilities" :key="facility.id" cols="12" sm="6" lg="3">
        <facility-card :facility="facility" @book="emit('book', $event)" />
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
import { mdiArrowRight } from "@mdi/js"
import { useQuery } from "@tanstack/vue-query"
import { facilityService } from "~/services/facilityService"
import type { FacilityItem } from "~/types/facility"

const { data, isLoading, isError } = useQuery({
  queryKey: ["featured-facilities"],
  queryFn: facilityService.getFeaturedFacilities,
})

const facilities = computed(() => data.value ?? [])

const emit = defineEmits<{
  book: [facility: FacilityItem]
}>()
</script>

<style scoped>
.section-block {
  margin-top: 40px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.section-title {
  margin: 0;
  color: #0f172a;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #16a34a;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
}
</style>
