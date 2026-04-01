<template>
  <v-card rounded="xl" class="border border-slate-200 shadow-sm">
    <v-card-text class="pa-5">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-3">
            <h3 class="text-lg font-bold text-slate-900">
              {{ facility.name }}
            </h3>

            <v-chip size="small" rounded="pill" variant="flat" :color="facilityStatusColor">
              {{ facilityStatusLabel }}
            </v-chip>
          </div>

          <div class="mt-3 flex flex-col gap-2 text-sm text-slate-500">
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span class="inline-flex items-center gap-1">
                <v-icon :icon="mdiSoccer" size="16" />
                {{ facility.sportName }}
              </span>

              <span class="inline-flex items-center gap-1">
                <v-icon :icon="mdiMapMarkerOutline" size="16" />
                {{ facility.address }}, {{ facility.district }}, {{ facility.city }}
              </span>
            </div>

            <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span class="inline-flex items-center gap-1">
                <v-icon :icon="mdiClockOutline" size="16" />
                {{ facility.openTime }} - {{ facility.closeTime }}
              </span>

              <span class="inline-flex items-center gap-1">
                <v-icon :icon="mdiViewGridOutline" size="16" />
                {{ facility.fieldsCount }} sân
              </span>
            </div>
          </div>
        </div>

        <div class="flex shrink-0 flex-wrap gap-2">
          <v-btn variant="outlined" rounded="xl" class="text-none" :to="`/chu-san/co-so/${facility.id}`"> Xem chi tiết </v-btn>

          <v-btn color="success" rounded="xl" class="text-none" :to="`/chu-san/co-so/${facility.id}/chinh-sua`">
            Chỉnh sửa
          </v-btn>
        </div>
      </div>

      <v-alert v-if="facility.status === 'pending_approve'" variant="tonal" color="warning" rounded="lg" class="mt-4">
        Cơ sở này đang chờ admin duyệt. Trong thời gian này, sân có thể chưa hiển thị công khai cho khách hàng.
      </v-alert>

      <div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div v-for="field in facility.fields" :key="field.id" class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="truncate text-base font-semibold text-slate-900">
                {{ field.name }}
              </p>

              <p class="mt-2 text-sm text-slate-500">Giá từ {{ formatCurrency(field.priceFrom) }}</p>
            </div>

            <v-chip size="x-small" rounded="pill" variant="flat" :color="getFieldStatusColor(field.status)">
              {{ getFieldStatusLabel(field.status) }}
            </v-chip>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { mdiClockOutline, mdiMapMarkerOutline, mdiSoccer, mdiViewGridOutline } from "@mdi/js"
import type { OwnerFacilityItem, OwnerFacilityStatus, OwnerFieldStatus } from "~/types/owner"

const props = defineProps<{
  facility: OwnerFacilityItem
}>()

const facilityStatusLabelMap: Record<OwnerFacilityStatus, string> = {
  pending_approve: "Chờ duyệt",
  active: "Đang hoạt động",
  inactive: "Tạm ngưng",
}

const facilityStatusColorMap: Record<OwnerFacilityStatus, string> = {
  pending_approve: "warning",
  active: "success",
  inactive: "default",
}

const facilityStatusLabel = computed(() => facilityStatusLabelMap[props.facility.status])
const facilityStatusColor = computed(() => facilityStatusColorMap[props.facility.status])

const getFieldStatusLabel = (status: OwnerFieldStatus) => {
  switch (status) {
    case "active":
      return "Hoạt động"
    case "maintenance":
      return "Bảo trì"
    case "inactive":
      return "Tạm ngưng"
    default:
      return "Không xác định"
  }
}

const getFieldStatusColor = (status: OwnerFieldStatus) => {
  switch (status) {
    case "active":
      return "success"
    case "maintenance":
      return "warning"
    case "inactive":
      return "default"
    default:
      return "default"
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
}
</script>

<style scoped></style>
