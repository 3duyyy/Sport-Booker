<template>
  <v-card rounded="xl" elevation="0" class="border border-slate-200">
    <v-card-text class="pa-0">
      <div class="table-wrap">
        <v-table class="financial-table">
          <thead>
            <tr>
              <th>Mã booking</th>
              <th>Khách hàng</th>
              <th>Sân và khu vực</th>
              <th>Trạng thái đặt sân</th>
              <th>Loại thanh toán</th>
              <th class="text-right">Số tiền</th>
              <th class="text-center">Trạng thái</th>
              <th>Thời gian chuyển</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in rows" :key="item.id">
              <td>
                <div class="font-weight-bold text-slate-900">#BK-{{ item.bookingId }}</div>
                <div class="text-caption text-slate-500">GD #{{ item.transactionId }}</div>
              </td>

              <td>
                <div class="flex items-center gap-3 min-w-[190px]">
                  <v-avatar size="36">
                    <v-img v-if="item.customerAvatarUrl" :src="item.customerAvatarUrl" cover />
                    <span v-else>{{ getInitials(item.customerName) }}</span>
                  </v-avatar>

                  <div class="font-weight-medium text-slate-900">
                    {{ item.customerName }}
                  </div>
                </div>
              </td>

              <td>
                <div class="min-w-[220px]">
                  <div class="font-weight-medium text-slate-900">{{ item.facilityName }}</div>
                  <div class="text-caption text-slate-500">{{ item.fieldName }}</div>
                </div>
              </td>

              <td>
                <v-chip
                  :color="getBookingStatusMeta(item.bookingStatus).color"
                  variant="tonal"
                  rounded="lg"
                  size="small"
                  class="font-weight-medium"
                >
                  {{ getBookingStatusMeta(item.bookingStatus).label }}
                </v-chip>
              </td>

              <td>
                <v-chip
                  :color="item.verificationType === 'full_payment' ? 'primary' : 'orange-darken-2'"
                  variant="tonal"
                  rounded="lg"
                  size="small"
                  class="font-weight-medium"
                >
                  {{ item.verificationType === "full_payment" ? "Thanh toán toàn bộ" : "Đặt cọc" }}
                </v-chip>
              </td>

              <td class="text-right font-weight-bold text-slate-900">
                {{ formatCurrency(item.amount) }}
              </td>

              <td class="text-center">
                <v-chip
                  :color="getStatusMeta(item.status).color"
                  variant="tonal"
                  rounded="lg"
                  size="small"
                  class="font-weight-medium"
                >
                  {{ getStatusMeta(item.status).label }}
                </v-chip>
              </td>

              <td>
                <div class="min-w-[140px] text-body-2 text-slate-700">
                  {{ formatDateTime(item.transferredAt) }}
                </div>
              </td>

              <td>
                <div class="flex items-center justify-center gap-2 min-w-[170px]">
                  <v-btn
                    color="success"
                    variant="flat"
                    rounded="lg"
                    class="text-none"
                    size="small"
                    :loading="approvingId === item.transactionId"
                    :disabled="!isPending(item) || rejectingId === item.transactionId"
                    @click="$emit('approve', item)"
                  >
                    Duyệt
                  </v-btn>

                  <v-btn
                    color="error"
                    variant="tonal"
                    rounded="lg"
                    class="text-none"
                    size="small"
                    :loading="rejectingId === item.transactionId"
                    :disabled="!isPending(item) || approvingId === item.transactionId"
                    @click="$emit('reject', item)"
                  >
                    Từ chối
                  </v-btn>
                </div>
              </td>
            </tr>

            <tr v-if="!rows.length">
              <td colspan="9" class="text-center py-6 text-slate-500">Chưa có dữ liệu xác minh thanh toán</td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { PaymentVerificationRow } from "~/types/admin"

defineProps<{
  rows: PaymentVerificationRow[]
  approvingId: number | null
  rejectingId: number | null
}>()

defineEmits<{
  (e: "approve", row: PaymentVerificationRow): void
  (e: "reject", row: PaymentVerificationRow): void
}>()

const isPending = (row: PaymentVerificationRow) => row.status === "pending"

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
}

const formatDateTime = (value: string) => {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value))
}

const getInitials = (fullName: string) => {
  return fullName
    .trim()
    .split(" ")
    .slice(-2)
    .map((item) => item.charAt(0).toUpperCase())
    .join("")
}

const getStatusMeta = (status: PaymentVerificationRow["status"]) => {
  switch (status) {
    case "approved":
      return { label: "Đã duyệt", color: "success" }
    case "rejected":
      return { label: "Đã từ chối", color: "error" }
    default:
      return { label: "Chờ xác minh", color: "warning" }
  }
}

const getBookingStatusMeta = (status: string) => {
  switch (status) {
    case "confirmed":
      return { label: "Đã xác nhận", color: "success" }
    case "completed":
      return { label: "Hoàn thành", color: "info" }
    case "cancelled":
      return { label: "Đã hủy", color: "error" }
    case "rejected":
      return { label: "Bị từ chối", color: "grey" }
    default:
      return { label: "Chờ xác nhận", color: "warning" }
  }
}
</script>

<style scoped>
.table-wrap {
  overflow-x: auto;
}

.financial-table {
  min-width: 1320px;
}

.financial-table :deep(th) {
  white-space: nowrap;
  color: rgb(100 116 139);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  background: rgb(248 250 252);
}

.financial-table :deep(td) {
  vertical-align: middle;
  border-bottom: 1px solid rgb(226 232 240);
}
</style>
