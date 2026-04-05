<template>
  <div class="admin-facilities-page">
    <FacilitiesHeader />
    <FacilitiesFilters v-model="filters" :sport-options="sportOptions" />
    <FacilitiesTable :items="facilities" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import FacilitiesFilters from "~/components/admin/facilities/FacilitiesFilters.vue"
import FacilitiesHeader from "~/components/admin/facilities/FacilitiesHeader.vue"
import FacilitiesTable from "~/components/admin/facilities/FacilitiesTable.vue"
import { adminFacilitiesMock, adminFacilitySportOptionsMock } from "~/mockData/admin.mock"
import type { AdminFacilityFilterForm } from "~/types/admin"

definePageMeta({
  layout: "admin",
  middleware: "admin",
})

const filters = ref<AdminFacilityFilterForm>({
  keyword: "",
  sportId: "all",
  performance: "all",
})

const facilities = adminFacilitiesMock
const sportOptions = adminFacilitySportOptionsMock
</script>

<style scoped>
.admin-facilities-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
