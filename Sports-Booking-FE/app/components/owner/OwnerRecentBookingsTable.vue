<template>
  <v-card rounded="xl" class="border border-slate-200 shadow-sm">
    <v-card-text class="pa-0">
      <div class="flex items-center justify-between px-5 py-4">
        <div>
          <h3 class="text-lg font-bold text-slate-900">Lịch đặt gần đây</h3>
          <p class="mt-1 text-sm text-slate-500">Các lượt đặt mới phát sinh trong hôm nay.</p>
        </div>

        <NuxtLink to="/chu-san/lich-dat" class="text-sm font-semibold text-primary hover:underline"> Xem tất cả </NuxtLink>
      </div>

      <v-divider />

      <div class="overflow-x-auto">
        <table class="w-full min-w-[720px]">
          <thead class="bg-slate-50">
            <tr>
              <th class="table-head text-left">Mã đặt</th>
              <th class="table-head text-left">Khách hàng</th>
              <th class="table-head text-left">Sân</th>
              <th class="table-head text-left">Khung giờ</th>
              <th class="table-head text-left">Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="booking in items" :key="booking.id" class="border-t border-slate-100">
              <td class="table-cell font-semibold text-slate-700">
                {{ booking.id }}
              </td>

              <td class="table-cell text-slate-700">
                {{ booking.customerName }}
              </td>

              <td class="table-cell">
                <div class="font-medium text-slate-700">
                  {{ booking.fieldName }}
                </div>
                <div class="text-sm text-slate-400">
                  {{ booking.sportName }}
                </div>
              </td>

              <td class="table-cell text-slate-700">
                {{ booking.timeLabel }}
              </td>

              <td class="table-cell">
                <v-chip size="small" rounded="pill" variant="flat" :color="getStatusColor(booking.status)">
                  {{ getStatusLabel(booking.status) }}
                </v-chip>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-5 py-4 flex items-center justify-between gap-3 flex-wrap">
        <p class="text-sm text-slate-500">Hiển thị {{ startItem }} - {{ endItem }} trên tổng {{ pagination.total }} lượt đặt</p>

        <v-pagination
          v-model="internalPage"
          :length="pagination.totalPages"
          :total-visible="5"
          rounded="circle"
          density="comfortable"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { OwnerBookingStatus, OwnerPaginationMeta, OwnerRecentBookingItem } from "~/types/owner"

const props = defineProps<{
  items: OwnerRecentBookingItem[]
  pagination: OwnerPaginationMeta
}>()

const emit = defineEmits<{
  (e: "update:page", page: number): void
}>()

const internalPage = ref(props.pagination.page)

watch(
  () => props.pagination.page,
  (nextPage) => {
    internalPage.value = nextPage
  },
)

watch(internalPage, (nextPage) => {
  if (nextPage !== props.pagination.page) {
    emit("update:page", nextPage)
  }
})

const startItem = computed(() => {
  if (!props.pagination.total) return 0
  return (props.pagination.page - 1) * props.pagination.limit + 1
})

const endItem = computed(() => {
  return Math.min(props.pagination.page * props.pagination.limit, props.pagination.total)
})

const getStatusColor = (status: OwnerBookingStatus) => {
  switch (status) {
    case "confirmed":
      return "success"
    case "pending":
      return "warning"
    case "cancelled":
      return "error"
    case "completed":
      return "info"
    default:
      return "default"
  }
}

const getStatusLabel = (status: OwnerBookingStatus) => {
  switch (status) {
    case "confirmed":
      return "Đã xác nhận"
    case "pending":
      return "Chờ xác nhận"
    case "cancelled":
      return "Đã hủy"
    case "completed":
      return "Hoàn thành"
    default:
      return "Không xác định"
  }
}
</script>

<style scoped>
.table-head {
  padding: 14px 20px;
  font-size: 13px;
  font-weight: 700;
  color: rgb(100 116 139);
  white-space: nowrap;
}

.table-cell {
  padding: 16px 20px;
  font-size: 14px;
  vertical-align: middle;
}
</style>
