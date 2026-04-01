<template>
  <section class="hero-section">
    <div class="hero-overlay" />

    <NuxtImg :src="heroImage" alt="Sân thể thao" class="hero-image" width="1600" height="900" />

    <div class="hero-content">
      <div class="hero-badge">Đặt sân nhanh chóng - hiện đại - tiện lợi</div>

      <h1 class="hero-title">Tìm Và Đặt Sân Thể Thao Gần Bạn</h1>

      <p class="hero-subtitle">
        Bóng đá, cầu lông, tennis và nhiều bộ môn khác. Đặt sân nhanh chóng cho trận đấu tiếp theo của bạn.
      </p>

      <v-card class="search-card" rounded="xl" elevation="12">
        <v-row class="ma-0" align="center">
          <v-col cols="12" md="6" class="pa-2">
            <v-text-field
              :model-value="keyword"
              variant="outlined"
              density="comfortable"
              :prepend-inner-icon="mdiMagnify"
              placeholder="Địa điểm, môn thể thao hoặc tên sân"
              hide-details
              rounded="lg"
              bg-color="white"
              @update:model-value="emit('update:keyword', String($event ?? ''))"
            />
          </v-col>

          <v-col cols="12" md="3" class="pa-2">
            <v-text-field
              :model-value="bookingDate"
              type="date"
              variant="outlined"
              density="comfortable"
              :prepend-inner-icon="mdiCalendarMonthOutline"
              hide-details
              rounded="lg"
              bg-color="white"
              @update:model-value="emit('update:bookingDate', String($event ?? ''))"
            />
          </v-col>

          <v-col cols="12" md="3" class="pa-2">
            <v-btn
              block
              color="success"
              size="large"
              rounded="lg"
              class="search-btn text-none font-weight-bold"
              @click="emit('search')"
            >
              <v-icon start :icon="mdiMagnify" />
              Tìm kiếm
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </section>
</template>

<script setup lang="ts">
import { mdiCalendarMonthOutline, mdiMagnify } from "@mdi/js"

interface Props {
  keyword: string
  bookingDate: string
  heroImage?: string
}

withDefaults(defineProps<Props>(), {
  heroImage:
    "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=1600&q=80",
})

const emit = defineEmits<{
  "update:keyword": [value: string]
  "update:bookingDate": [value: string]
  search: []
}>()
</script>

<style scoped>
.hero-section {
  display: flex;
  flex-direction: column;
  gap: 10px;

  position: relative;
  overflow: hidden;
  min-height: 540px;
  border-radius: 28px;
  box-shadow: 0 18px 60px rgba(15, 23, 42, 0.16);
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(circle at top, rgba(34, 197, 94, 0.2), transparent 32%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.35), rgba(2, 6, 23, 0.72));
}

.hero-content {
  position: relative;
  z-index: 2;
  min-height: 540px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 32px;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  backdrop-filter: blur(8px);
}

.hero-title {
  max-width: 760px;
  margin: 0;
  color: #fff;
  font-size: clamp(2.1rem, 4vw, 4rem);
  line-height: 1.1;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  max-width: 760px;
  margin: 0;
  color: rgba(255, 255, 255, 0.86);
  font-size: 1rem;
  line-height: 1.7;
}

.search-card {
  width: 100%;
  max-width: 980px;
  margin-top: 12px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.94) !important;
  backdrop-filter: blur(10px);
}

.search-btn {
  min-height: 56px;
}

@media (max-width: 959px) {
  .hero-section {
    min-height: 620px;
  }

  .hero-content {
    min-height: 620px;
    padding: 24px 18px;
  }
}
</style>
