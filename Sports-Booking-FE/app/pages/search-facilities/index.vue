<template>
  <div class="container-layout search-page">
    <v-container class="max-w-7xl">
      <div class="search-layout">
        <aside class="search-layout__sidebar">
          <SearchFilterSidebar v-model="filters" @reset="handleResetFilters" />
        </aside>

        <section class="search-layout__content">
          <SearchPageHeader v-if="isFromSearchHome" :city="keywordFromQuery || ''" :total="total!" />

          <SearchResultsToolbar v-model:sort-by="sortBy" v-model:view-mode="viewMode" />

          <div v-if="isLoading" class="flex items-center justify-center">
            <v-progress-circular indeterminate color="success" size="64" />
            <p>Đang tải...</p>
          </div>

          <div v-else-if="error" class="flex items-center justify-center">
            <v-alert type="error" variant="tonal">
              {{ error }}
            </v-alert>
          </div>

          <SearchResultsGrid :facilities="facilities" :view-mode="viewMode" @book="handleBookNow" />

          <SearchPagination v-if="viewMode === 'grid'" v-model="page" :length="totalPages" />
        </section>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/vue-query"
import { ref, watch } from "vue"
import type { SearchFilterValue } from "~/components/search/FilterSidebar.vue"
import { facilityService } from "~/services/facilityService"
import type { FacilityItem, PublicFacilityQueryParams } from "~/types/facility"

definePageMeta({
  layout: "default",
})

const route = useRoute()

const keywordFromQuery = computed(() => route.query.keyword as string | undefined)
const dateFromQuery = computed(() => route.query.date as string | undefined)
const isFromSearchHome = computed(() => !!keywordFromQuery.value || !!dateFromQuery.value)

const page = ref<number>(1)
const perPage = 6
const sortBy = ref("recommended")
const viewMode = ref<"grid" | "map">("grid")

const filters = ref<SearchFilterValue>({
  districts: [],
  sports: [],
  minPrice: null,
  maxPrice: null,
  amenities: [],
})

const districtMap: Record<string, string> = {
  "ba-dinh": "Ba Đình",
  "hoan-kiem": "Hoàn Kiếm",
  "dong-da": "Quận Đống Đa",
  "cau-giay": "Quận Cầu Giấy",
  "thanh-xuan": "Quận Thanh Xuân",
  "hoang-mai": "Quận Hoàng Mai",
  "long-bien": "Quận Long Biên",
  "tay-ho": "Quận Tây Hồ",
}

const sportIdMap: Record<string, number> = {
  football: 1,
  tennis: 2,
  basketball: 3,
  swimming: 4,
}

const sortMap: Record<string, "newest" | "price_asc" | "price_desc" | "rating" | undefined> = {
  "price-asc": "price_asc",
  "price-desc": "price_desc",
  "rating-desc": "rating",
  recommended: undefined,
}

const debouncedMinPrice = useDebounce(
  computed(() => filters.value.minPrice),
  500,
)
const debouncedMaxPrice = useDebounce(
  computed(() => filters.value.maxPrice),
  500,
)

const fetchFacilitiesFn = async () => {
  const mappedDistricts = filters.value.districts.map((d) => districtMap[d]).filter((d): d is string => Boolean(d))

  const mappedSportIds = filters.value.sports.map((s) => sportIdMap[s]).filter((s): s is number => Boolean(s))

  const params: PublicFacilityQueryParams = {
    page: page.value,
    limit: perPage,
    ...(mappedDistricts.length > 0 && { districts: mappedDistricts }),
    ...(mappedSportIds.length > 0 && { sportIds: mappedSportIds }),
    ...(filters.value.minPrice !== null && { minPrice: filters.value.minPrice }),
    ...(filters.value.maxPrice !== null && { maxPrice: filters.value.maxPrice }),
    ...(sortMap[sortBy.value] && { sort: sortMap[sortBy.value] }),
    ...(keywordFromQuery.value && { q: keywordFromQuery.value }),
  }

  const response = await facilityService.getPublicFacilities(params)
  return response.data
}

const { data, isLoading, isError, error } = useQuery({
  queryKey: computed(() => [
    "publicFacilities",
    {
      page: page.value,
      filters: {
        ...filters.value,
        minPrice: debouncedMinPrice.value,
        maxPrice: debouncedMaxPrice.value,
      },
      sort: sortBy.value,
      keyword: keywordFromQuery.value,
    },
  ]),
  queryFn: fetchFacilitiesFn,
  staleTime: 5 * 60 * 1000,
  placeholderData: keepPreviousData,
})
const facilities = computed(() => data.value?.data || [])
const total = computed(() => data.value?.pagination.total)
const totalPages = computed(() => data.value?.pagination.totalPages || 1)

watch(
  [filters, sortBy, keywordFromQuery],
  () => {
    page.value = 1
  },
  { deep: true },
)

function handleResetFilters() {
  filters.value = {
    districts: [],
    sports: [],
    minPrice: null,
    maxPrice: null,
    amenities: [],
  }
}

function handleBookNow(facility: FacilityItem) {
  console.log("Book facility:", facility)
}
</script>

<style scoped>
.search-page {
  min-height: calc(100vh - 64px);
  background: #f8fafc;
}

.search-layout {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 28px;
  align-items: start;
}

.search-layout__sidebar,
.search-layout__content {
  min-width: 0;
}

@media (max-width: 1100px) {
  .search-layout {
    grid-template-columns: 1fr;
  }
}
</style>
