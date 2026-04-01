<template>
  <div @click="handleRedirect(facility.id!)" class="cursor-pointer">
    <v-card class="facility-card" rounded="xl" elevation="3">
      <div class="facility-image-wrap">
        <NuxtImg :src="displayImage" :alt="facility.name" class="facility-image" width="800" height="600" />

        <div class="facility-rating">
          <v-icon :icon="mdiStar" size="14" color="#f59e0b" />
          <span>{{ facility.avgRating?.toFixed(1) ?? 0 }}</span>
        </div>
      </div>

      <v-card-text class="pa-4">
        <h3 class="facility-title">
          {{ facility.name }}
        </h3>

        <p class="facility-location">
          <v-icon :icon="mdiMapMarkerOutline" size="16" />
          {{ fullAddress }}
        </p>

        <div class="facility-tags">
          <span class="facility-tag">
            {{ facility.sport?.name }}
          </span>
        </div>

        <div class="facility-footer">
          <div>
            <div class="facility-price-label">Giá từ</div>
            <div class="facility-price">{{ formattedPrice }}</div>
          </div>
        </div>
      </v-card-text>
      <v-card-actions style="padding-bottom: 12px">
        <v-btn
          color="success"
          variant="tonal"
          rounded="lg"
          class="text-none font-weight-bold w-100"
          @click="$emit('book', facility)"
        >
          Đặt ngay
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { mdiMapMarkerOutline, mdiStar } from "@mdi/js"
import type { FacilityItem } from "~/types/facility"

interface Props {
  facility: FacilityItem
}

const props = defineProps<Props>()

defineEmits<{
  book: [facility: FacilityItem]
}>()

const router = useRouter()

const displayImage = computed(() => {
  const images = props.facility.facilityImages
  if (!images?.length) {
    return "https://www.istockphoto.com/vi/c%C3%A1c-b%E1%BB%A9c-%E1%BA%A3nh-s%E1%BA%B5n-c%C3%B3/th%E1%BB%83-thao-v%C3%A0-gi%E1%BA%A3i-tr%C3%AD"
  }

  const thumbnail = images.find((img) => img.isThumbnail)
  return thumbnail?.imageUrl || images[0]?.imageUrl
})

const fullAddress = computed(() => {
  return [props.facility.address, props.facility.district, props.facility.city].filter(Boolean).join(", ")
})

const formattedPrice = computed(() => {
  if (!props.facility.minPrice) return "Liên hệ"

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(props.facility.minPrice)
})

const handleRedirect = (id: number) => {
  return router.push(`/search-facilities/${id}`)
}
</script>

<style scoped>
.facility-card {
  overflow: hidden;
  border: 1px solid #edf1f3;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.facility-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 35px rgba(15, 23, 42, 0.1) !important;
}

.facility-image-wrap {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.facility-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.facility-rating {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  font-size: 0.8rem;
  font-weight: 700;
  color: #0f172a;
}

.facility-title {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  margin: 0;
  color: #0f172a;
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.4;

  min-height: 2.8em;
}

.facility-location {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.8rem;

  display: flex;
  align-items: center;
  gap: 4px;
  margin: 8px 0 0;
  color: #64748b;
  font-size: 0.93rem;
}

.facility-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.facility-tag {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
  font-size: 0.78rem;
  font-weight: 600;
}

.facility-footer {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 14px;
  margin-top: 18px;
}

.facility-price-label {
  color: #94a3b8;
  font-size: 0.78rem;
}

.facility-price {
  color: #16a34a;
  font-size: 1.1rem;
  font-weight: 900;
}
</style>
