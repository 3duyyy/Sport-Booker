<template>
  <v-card class="search-sidebar">
    <div class="d-flex align-center justify-space-between mb-3">
      <h2 class="text-[#0f172a] text-[1.4rem] font-bold">Bộ lọc</h2>
      <v-btn variant="text" color="success" class="text-none font-weight-bold px-0" rounded="lg" @click="$emit('reset')">
        Đặt lại
      </v-btn>
    </div>

    <SearchFilterSection title="Khu vực">
      <div class="flex flex-col gap-1">
        <div v-for="district in hanoiDistricts" :key="district.value" class="flex items-center justify-between">
          <v-checkbox
            v-model="filters.districts"
            :value="district.value"
            :label="district.label"
            hide-details
            density="compact"
            color="success"
            class="search-checkbox"
          />
        </div>
      </div>
    </SearchFilterSection>

    <SearchFilterSection title="Môn thể thao">
      <div class="sport-chip-grid">
        <v-chip
          v-for="sport in sportOptions"
          :key="sport.value"
          :color="filters.sports.includes(sport.value) ? 'success' : undefined"
          :variant="filters.sports.includes(sport.value) ? 'flat' : 'outlined'"
          rounded="lg"
          class="font-weight-bold"
          @click="toggleArrayValue('sports', sport.value)"
        >
          {{ sport.label }}
        </v-chip>
      </div>
    </SearchFilterSection>

    <SearchFilterSection title="Khoảng giá">
      <div class="price-grid">
        <v-text-field
          v-model.number="filters.minPrice"
          label="Từ"
          type="number"
          variant="outlined"
          density="comfortable"
          hide-details
          rounded="lg"
          bg-color="white"
        />

        <v-text-field
          v-model.number="filters.maxPrice"
          label="Đến"
          type="number"
          variant="outlined"
          density="comfortable"
          hide-details
          rounded="lg"
          bg-color="white"
        />
      </div>
    </SearchFilterSection>

    <SearchFilterSection title="Tiện ích">
      <div class="flex flex-col gap-1">
        <v-checkbox
          v-for="amenity in amenityOptions"
          :key="amenity.value"
          :label="amenity.label"
          v-model="filters.amenities"
          :value="amenity.value"
          hide-details
          density="compact"
          color="success"
          class="search-checkbox"
        />
      </div>
    </SearchFilterSection>
  </v-card>
</template>

<script setup lang="ts">
export interface SearchFilterValue {
  districts: string[]
  sports: string[]
  minPrice: number | null
  maxPrice: number | null
  amenities: string[]
}

defineEmits<{ reset: [] }>()

const filters = defineModel<SearchFilterValue>({ required: true })

const hanoiDistricts = [
  { value: "ba-dinh", label: "Quận Ba Đình" },
  { value: "hoan-kiem", label: "Quận Hoàn Kiếm" },
  { value: "dong-da", label: "Quận Đống Đa" },
  { value: "cau-giay", label: "Quận Cầu Giấy" },
  { value: "thanh-xuan", label: "Quận Thanh Xuân" },
  { value: "hoang-mai", label: "Quận Hoàng Mai" },
  { value: "long-bien", label: "Quận Long Biên" },
  { value: "tay-ho", label: "Quận Tây Hồ" },
  { value: "nam-tu-liem", label: "Quận Nam Từ Liêm" },
  { value: "ha-dong", label: "Quận Hà Đông" },
  { value: "dong-anh", label: "Huyện Đông Anh" },
]

const sportOptions = [
  { label: "Bóng đá", value: "football" },
  { label: "Cầu lông", value: "badminton" },
  { label: "Tennis", value: "tennis" },
  { label: "Bóng rổ", value: "basketball" },
  { label: "Pickleball", value: "pickleball" },
]

const amenityOptions = [
  { label: "Wifi miễn phí", value: "wifi" },
  { label: "Bãi đỗ xe", value: "parking" },
  { label: "Phòng tắm", value: "shower" },
  { label: "Thuê dụng cụ", value: "equipment" },
  { label: "Căn tin / Cafe", value: "canteen" },
]

const toggleArrayValue = (key: "districts" | "sports" | "amenities", value: string) => {
  const current = filters.value[key]
  const exists = current.includes(value)

  filters.value = {
    ...filters.value,
    [key]: exists ? current.filter((item) => item !== value) : [...current, value],
  }
}
</script>

<style scoped>
.search-sidebar {
  position: sticky;
  top: 96px;
  padding: 20px 18px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
}

.search-sidebar__title {
  margin: 0;
  color: #0f172a;
  font-size: 1.2rem;
  font-weight: 900;
}

.search-sidebar__count {
  color: #94a3b8;
  font-size: 0.82rem;
  font-weight: 700;
}

.sport-chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.price-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

:deep(.search-checkbox .v-label) {
  color: #334155;
  font-size: 0.95rem;
  font-weight: 500;
  opacity: 1;
}
</style>
