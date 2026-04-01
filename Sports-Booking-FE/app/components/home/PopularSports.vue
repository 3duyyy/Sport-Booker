<template>
  <section class="section-block">
    <div class="section-header">
      <h2 class="section-title">Các loại sân thể thao phổ biến</h2>
    </div>

    <div class="sports-list">
      <v-chip v-for="sport in sports" :key="sport.id" color="white" variant="flat" rounded="pill" class="sport-chip">
        <v-icon :icon="sport.icon" size="18" start />
        {{ sport.name }}
      </v-chip>
    </div>
  </section>
</template>

<script setup lang="ts">
import { mdiBadminton, mdiBaseball, mdiSoccer, mdiTennis } from "@mdi/js"
import { sportService } from "~/services/sportService"
import type { SportResponse } from "~/types/common"

interface PopularSportItem {
  id: number
  name: string
  icon: string
}

const sports = ref<PopularSportItem[]>([])

const sportIconMap: Record<string, string> = {
  "bong da": mdiSoccer,
  "cau long": mdiBadminton,
  tennis: mdiTennis,
  "bong ro": mdiBaseball,
  "bong chuyen": mdiBaseball,
  pickleball: mdiTennis,
}

const normalizeSportName = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()

const getSportIcon = (name: string) => sportIconMap[normalizeSportName(name)] || mdiSoccer

const loadSports = async () => {
  try {
    const response = await sportService.getAllSports()
    const apiSports = response.data?.data || []

    sports.value = apiSports.map((sport: SportResponse) => ({
      id: sport.id,
      name: sport.name,
      icon: getSportIcon(sport.name),
    }))
  } catch {
    sports.value = []
  }
}

onMounted(loadSports)
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

.sports-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.sport-chip {
  border: 1px solid #e5e7eb !important;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
  color: #334155 !important;
  font-weight: 600;
}
</style>
