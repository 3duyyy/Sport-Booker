<template>
  <div class="search-page-header">
    <v-breadcrumbs :items="breadcrumbItems" class="px-0 py-0 mb-2">
      <template #divider>
        <span class="text-medium-emphasis">/</span>
      </template>
    </v-breadcrumbs>

    <h1 class="search-page-header__title">Sân thể thao tại {{ city }}</h1>
    <p class="search-page-header__subtitle">Tìm thấy {{ total }} địa điểm phù hợp với tiêu chí của bạn</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

interface Props {
  city: string
  total: number
}

const props = defineProps<Props>()

const breadcrumbItems = computed(() => [
  { title: "Trang chủ", disabled: false, to: "/" },
  { title: "Tìm sân", disabled: false, to: "/search-facilities" },
  { title: props.city, disabled: true },
])
</script>

<style scoped>
.search-page-header {
  margin-bottom: 22px;
}

.search-page-header__title {
  margin: 0;
  color: #0f172a;
  font-size: 2rem;
  font-weight: 900;
  line-height: 1.2;
}

.search-page-header__subtitle {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 0.98rem;
  font-weight: 500;
}
</style>
