<template>
  <div class="grid grid-cols-12 gap-3">
    <div class="col-span-12 lg:col-span-6">
      <div class="gallery-main">
        <NuxtImg :src="currentImage" :alt="facility.name" class="gallery-image" width="1200" height="900" />
      </div>
    </div>

    <div class="col-span-12 lg:col-span-6">
      <div class="grid grid-cols-2 gap-3 h-full">
        <button
          v-for="image in sideImages"
          :key="image.id"
          type="button"
          class="gallery-sub"
          @click="$emit('update:modelValue', image.imageUrl)"
        >
          <NuxtImg :src="image.imageUrl" :alt="facility.name" class="gallery-image" width="1000" height="1000" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FacilityDetailData } from "~/types/facility"

const props = defineProps<{
  facility: FacilityDetailData
  modelValue: string
}>()

defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

const currentImage = computed(() => props.modelValue || props.facility.images[0]?.imageUrl || "")
const sideImages = computed(() => props.facility.images.slice(1, 5))
</script>

<style scoped>
.gallery-main,
.gallery-sub {
  overflow: hidden;
  border-radius: 18px;
  background: #e2e8f0;
}

.gallery-main {
  min-height: 414px;
  max-height: 414px;
  object-fit: cover;
}

.gallery-sub {
  max-height: 200px;
  min-height: 200px;

  border: 1px solid #ccc;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
