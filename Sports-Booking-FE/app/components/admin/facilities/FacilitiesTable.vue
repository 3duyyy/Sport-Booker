<template>
  <v-card rounded="xl" elevation="0" class="admin-facilities-card">
    <v-card-text class="pa-5">
      <div class="admin-facilities-card__header">
        <div>
          <h3 class="admin-facilities-card__title">Danh sách sân bãi</h3>
          <p class="admin-facilities-card__desc">Quản lý thông tin cơ sở, trạng thái hoạt động và hiệu suất</p>
        </div>
      </div>

      <v-table class="admin-facilities-table">
        <thead>
          <tr>
            <th>Cơ sở</th>
            <th>Chủ sân</th>
            <th>Địa điểm</th>
            <th>Môn thể thao</th>
            <th>Trạng thái</th>
            <th>Hiệu suất</th>
            <th>Sân con</th>
            <th>Lượt đặt</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="facility in items" :key="facility.id">
            <td>
              <div class="facility-cell">
                <v-avatar size="42" rounded="lg">
                  <v-img :src="facility.thumbnailUrl || fallbackThumbnail" cover />
                </v-avatar>

                <div>
                  <p class="facility-cell__name">{{ facility.name }}</p>
                  <p class="facility-cell__id">ID: {{ facility.id }}</p>
                </div>
              </div>
            </td>

            <td class="admin-facilities-table__text">
              {{ facility.ownerName }}
            </td>

            <td class="admin-facilities-table__text">{{ facility.district }}, {{ facility.city }}</td>

            <td>
              <v-chip size="small" rounded="lg" variant="tonal" class="font-weight-medium">
                {{ facility.sportName }}
              </v-chip>
            </td>

            <td>
              <v-chip
                size="small"
                rounded="lg"
                :color="getStatusColor(facility.status)"
                variant="flat"
                class="font-weight-medium"
              >
                {{ getStatusLabel(facility.status) }}
              </v-chip>
            </td>

            <td>
              <v-chip
                size="small"
                rounded="lg"
                :color="getPerformanceColor(facility.performance)"
                variant="tonal"
                class="font-weight-medium"
              >
                {{ getPerformanceLabel(facility.performance) }}
              </v-chip>
            </td>

            <td class="admin-facilities-table__number">
              {{ facility.fieldCount }}
            </td>

            <td class="admin-facilities-table__number">
              {{ facility.bookingCount }}
            </td>

            <td>
              <div class="actions">
                <!-- <v-tooltip text="Xem chi tiết" location="top" open-delay="80">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon size="small" variant="text">
                      <v-icon size="18">{{ mdiEyeOutline }}</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="Quản lý cơ sở" location="top" open-delay="80">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon size="small" variant="text">
                      <v-icon size="18">{{ mdiPencilOutline }}</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip> -->

                <v-tooltip :text="getToggleTooltip(facility.status)" location="top" open-delay="80">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      size="small"
                      variant="text"
                      :disabled="!canToggleStatus(facility.status)"
                      :color="facility.status === 'inactive' ? 'success' : 'error'"
                      @click="
                        emit('toggle-status-request', {
                          facilityId: facility.id,
                          currentStatus: facility.status,
                          facilityName: facility.name,
                        })
                      "
                    >
                      <v-icon size="18">
                        {{ facility.status === "inactive" ? mdiCheckCircleOutline : mdiPower }}
                      </v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </div>
            </td>
          </tr>

          <tr v-if="items.length === 0">
            <td colspan="9" class="empty-cell">Không có cơ sở nào</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { mdiCheckCircleOutline, mdiPower } from "@mdi/js"
import type { AdminFacilityListItem, AdminFacilityPerformance, FacilityStatus } from "~/types/admin"

defineProps<{
  items: AdminFacilityListItem[]
}>()

const emit = defineEmits<{
  (e: "toggle-status-request", payload: { facilityId: number; currentStatus: FacilityStatus; facilityName: string }): void
}>()

const fallbackThumbnail = "https://ui-avatars.com/api/?name=Facility&background=E2E8F0&color=334155"

const getStatusLabel = (status: FacilityStatus) => {
  if (status === "active") return "Đang hoạt động"
  if (status === "inactive") return "Tạm ngưng"
  return "Chờ duyệt"
}

const getStatusColor = (status: FacilityStatus) => {
  if (status === "active") return "success"
  if (status === "inactive") return "error"
  return "warning"
}

const getPerformanceLabel = (performance: AdminFacilityPerformance) => {
  if (performance === "high") return "Cao"
  if (performance === "normal") return "Bình thường"
  return "Thấp"
}

const getPerformanceColor = (performance: AdminFacilityPerformance) => {
  if (performance === "high") return "success"
  if (performance === "normal") return "info"
  return "error"
}

const canToggleStatus = (status: FacilityStatus) => status !== "pending_approve"

const getToggleTooltip = (status: FacilityStatus) => {
  if (status === "pending_approve") return "Cơ sở đang chờ duyệt"
  return status === "inactive" ? "Kích hoạt lại cơ sở" : "Tạm ngưng cơ sở"
}
</script>

<style scoped>
.admin-facilities-card {
  border: 1px solid #e5e7eb;
  background: #ffffff;
}

.admin-facilities-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.admin-facilities-card__title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.admin-facilities-card__desc {
  margin: 6px 0 0;
  font-size: 13px;
  color: #64748b;
}

.admin-facilities-table {
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  overflow: hidden;
}

.admin-facilities-table :deep(th) {
  background: #f8fafc;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.admin-facilities-table :deep(td) {
  vertical-align: middle;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
}

.facility-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.facility-cell__name {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.facility-cell__id {
  margin: 4px 0 0;
  font-size: 12px;
  color: #94a3b8;
}

.admin-facilities-table__text,
.admin-facilities-table__number {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.empty-cell {
  text-align: center;
  padding: 32px 16px !important;
  color: #64748b;
  font-size: 14px;
}
</style>
