<template>
  <v-card rounded="xl" elevation="0" class="border border-slate-200">
    <v-card-text class="pa-0">
      <div class="table-wrap">
        <v-table class="financial-table">
          <thead>
            <tr>
              <th>Mã booking</th>
              <th>Khách hàng</th>
              <th>Sân & khu vực</th>
              <th>Loại thanh toán</th>
              <th class="text-right">Số tiền</th>
              <th class="text-center">Trạng thái</th>
              <th>Thời gian chuyển</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in paginatedRows" :key="item.id">
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
                    :disabled="item.status !== 'pending'"
                  >
                    Duyệt
                  </v-btn>

                  <v-btn
                    color="error"
                    variant="tonal"
                    rounded="lg"
                    class="text-none"
                    size="small"
                    :disabled="item.status !== 'pending'"
                  >
                    Từ chối
                  </v-btn>
                </div>
              </td>
            </tr>

            <tr v-if="!paginatedRows.length">
              <td colspan="8" class="text-center py-6 text-slate-500">Chưa có dữ liệu xác minh thanh toán</td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <v-divider />

      <div class="d-flex align-center justify-space-between px-5 py-4 flex-wrap ga-3">
        <div class="text-body-2 text-slate-500">Hiển thị {{ startItem }} - {{ endItem }} trên tổng {{ rows.length }} yêu cầu</div>

        <v-pagination v-model="page" :length="totalPages" :total-visible="5" rounded="circle" density="comfortable" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { PaymentVerificationRow } from "~/types/admin"

const props = defineProps<{
  rows: PaymentVerificationRow[]
}>()

const page = ref(1)
const itemsPerPage = 5

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.rows.length / itemsPerPage))
})

const paginatedRows = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return props.rows.slice(start, end)
})

const startItem = computed(() => {
  if (!props.rows.length) return 0
  return (page.value - 1) * itemsPerPage + 1
})

const endItem = computed(() => {
  return Math.min(page.value * itemsPerPage, props.rows.length)
})

watch(
  () => props.rows.length,
  () => {
    if (page.value > totalPages.value) {
      page.value = totalPages.value
    }
  },
)

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
</script>

<style scoped>
.table-wrap {
  overflow-x: auto;
}

.financial-table {
  min-width: 1180px;
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
