<template>
  <v-card rounded="xl" elevation="0" class="border border-slate-200">
    <v-card-text class="pa-0">
      <div class="px-5 pt-5 pb-3">
        <div class="text-h6 font-weight-bold text-slate-900">Chi trả cho chủ sân</div>
        <div class="text-body-2 text-slate-500 mt-1">
          Danh sách booking đã thanh toán, sẵn sàng đối soát và chi trả cho chủ sân.
        </div>

        <v-text-field
          class="mt-3"
          label="Tìm theo chủ sân, cơ sở, mã booking"
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
              <th>Chủ sân</th>
              <th class="text-center">Số booking chưa chi trả</th>
              <th>Thông tin ngân hàng</th>
              <th class="text-right">Tổng tiền chi trả</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in rows" :key="item.id">
              <td>
                <div class="font-weight-bold text-slate-900">{{ item.ownerName }}</div>
              </td>
              <td class="text-center font-weight-medium text-slate-700">
                {{ item.bookingCount }}
              </td>
              <td>
                <div class="text-slate-800">{{ item.bankName }}</div>
                <div class="text-body-2 text-slate-500 mt-1">{{ item.bankAccount }} - {{ item.accountHolder }}</div>
              </td>
              <td class="text-right font-weight-bold text-slate-900">
                {{ formatCurrency(item.payoutAmount) }}
              </td>
              <td class="text-center">
                <v-btn
                  color="success"
                  variant="flat"
                  rounded="lg"
                  class="text-none"
                  size="small"
                  :loading="loadingSettleId"
                  @click="$emit('settle', item.ownerId)"
                >
                  Xác nhận đã chuyển
                </v-btn>
              </td>
            </tr>

            <tr v-if="rows.length === 0">
              <td colspan="5" class="text-center py-8 text-slate-500">Chưa có dữ liệu chi trả.</td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <v-divider />

      <div class="d-flex align-center justify-space-between px-5 py-4 flex-wrap ga-3">
        <div class="text-body-2 text-slate-500">
          Hiển thị {{ startItem }} - {{ endItem }} trên tổng {{ pagination.total }} booking
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
import type { PaginationMeta, PayoutRow } from "~/types/admin"

const props = defineProps<{
  rows: PayoutRow[]
  keyword: string
  page: number
  pagination: PaginationMeta
  isFetching?: boolean
  loadingSettleId?: boolean
}>()

defineEmits<{
  (e: "update:keyword", value: string): void
  (e: "update:page", value: number): void
  (e: "settle", ownerId: number): void
}>()

const startItem = computed(() => {
  if (!props.pagination.total) return 0
  return (props.pagination.page - 1) * props.pagination.limit + 1
})

const endItem = computed(() => {
  return Math.min(props.pagination.page * props.pagination.limit, props.pagination.total)
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
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
