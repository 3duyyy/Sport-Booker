<template>
  <div class="results-toolbar">
    <v-btn-toggle v-model="viewModeModel" mandatory rounded="lg" color="success" density="comfortable">
      <v-btn value="grid" class="text-none font-weight-bold"> Danh sách </v-btn>
      <v-btn value="map" class="text-none font-weight-bold"> Bản đồ </v-btn>
    </v-btn-toggle>

    <div class="d-flex align-center ga-3">
      <span class="results-toolbar__label">Sắp xếp theo</span>

      <v-select
        v-model="sortByModel"
        :items="sortOptions"
        item-title="title"
        item-value="value"
        variant="outlined"
        density="comfortable"
        hide-details
        rounded="lg"
        class="results-toolbar__select"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const sortByModel = defineModel<string>("sortBy", { required: true })
const viewModeModel = defineModel<"grid" | "map">("viewMode", { required: true })

const sortOptions = [
  { title: "Đề xuất", value: "recommended" },
  { title: "Giá thấp đến cao", value: "price-asc" },
  { title: "Giá cao đến thấp", value: "price-desc" },
  { title: "Đánh giá cao nhất", value: "rating-desc" },
]
</script>

<style scoped>
.results-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
  margin-top: 22px;
}

.results-toolbar__label {
  color: #64748b;
  font-size: 0.92rem;
  font-weight: 700;
}

.results-toolbar__select {
  width: 220px;
}
</style>
