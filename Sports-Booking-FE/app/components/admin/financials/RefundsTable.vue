<template>
  <v-card rounded="xl" elevation="0" class="border border-slate-200">
    <v-card-text class="pa-0">
      <div class="px-5 pt-5 pb-3">
        <div class="text-h6 font-weight-bold text-slate-900">Hoàn tiền cho khách hàng</div>
        <div class="text-body-2 text-slate-500 mt-1">Danh sách yêu cầu hoàn tiền được tạo từ bảng refund_requests.</div>

        <v-text-field
          class="mt-3"
          label="Tìm theo khách hàng, email, mã booking, tài khoản ngân hàng"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          :model-value="keyword"
          @update:model-value="$emit('update:keyword', String($event ?? ''))"
        />
      </div>

      <v-divider />

      <div class="table-wrap">
        <v-table class="financial-table">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Booking gốc</th>
              <th>Phương thức hoàn tiền</th>
              <th class="text-right">Số tiền hoàn</th>
              <th class="text-center">Trạng thái</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in rows" :key="item.id">
              <td>
                <div class="font-weight-bold text-slate-900">{{ item.customerName }}</div>
                <div class="text-body-2 text-slate-500 mt-1">{{ item.customerEmail }}</div>
              </td>

              <td class="font-weight-medium text-slate-700">{{ item.bookingCode }}</td>

              <td class="text-slate-800">{{ item.refundMethodLabel }}</td>

              <td class="text-right font-weight-bold text-red-darken-1">
                {{ formatCurrency(item.refundAmount) }}
              </td>

              <td class="text-center">
                <v-chip
                  :color="getRefundStatusColor(item.status)"
                  size="small"
                  variant="flat"
                  rounded="pill"
                  class="font-weight-bold text-none"
                >
                  {{ getRefundStatusLabel(item.status) }}
                </v-chip>
              </td>

              <td class="text-center">
                <template v-if="item.status === 'pending'">
                  <v-btn color="error" variant="flat" rounded="lg" class="text-none" size="small">Xác nhận hoàn tiền</v-btn>
                </template>

                <template v-else>
                  <span class="text-body-2 text-slate-500">
                    {{ formatDateTime(item.createdAt) }}
                  </span>
                </template>
              </td>
            </tr>

            <tr v-if="rows.length === 0">
              <td colspan="6" class="text-center py-8 text-slate-500">Chưa có yêu cầu hoàn tiền.</td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <v-divider />

      <div class="d-flex align-center justify-space-between px-5 py-4 flex-wrap ga-3">
        <div class="text-body-2 text-slate-500">
          Hiển thị {{ startItem }} - {{ endItem }} trên tổng {{ pagination.total }} yêu cầu
        </div>

        <v-pagination
          :model-value="page"
          :length="pagination.totalPages"
          :total-visible="5"
          rounded="circle"
          density="comfortable"
          @update:model-value="$emit('update:page', Number($event))"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { PaginationMeta, RefundRow, RefundStatus } from "~/types/admin"

const props = defineProps<{
  rows: RefundRow[]
  keyword: string
  page: number
  pagination: PaginationMeta
  isFetching?: boolean
}>()

defineEmits<{
  (e: "update:keyword", value: string): void
  (e: "update:page", value: number): void
}>()

const startItem = computed(() => {
  if (!props.pagination.total) return 0
  return (props.pagination.page - 1) * props.pagination.limit + 1
})

const endItem = computed(() => {
  return Math.min(props.pagination.page * props.pagination.limit, props.pagination.total)
})

function getRefundStatusLabel(status: RefundStatus) {
  switch (status) {
    case "pending":
      return "Chờ xử lý"
    case "approved":
      return "Đã duyệt"
    case "rejected":
      return "Từ chối"
    default:
      return "Không xác định"
  }
}

function getRefundStatusColor(status: RefundStatus) {
  switch (status) {
    case "pending":
      return "warning"
    case "approved":
      return "success"
    case "rejected":
      return "error"
    default:
      return "grey"
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
}

const formatDateTime = (value: string) => {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}
</script>

<style scoped>
.table-wrap {
  overflow-x: auto;
}

.financial-table :deep(th) {
  white-space: nowrap;
  color: rgb(100 116 139);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.financial-table :deep(td) {
  padding-top: 18px !important;
  padding-bottom: 18px !important;
  vertical-align: middle;
}
</style>
