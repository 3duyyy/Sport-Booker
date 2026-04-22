<template>
  <div class="space-y-5">
    <v-card rounded="xl" class="border border-slate-200 shadow-sm">
      <v-card-text class="pa-5">
        <div class="mb-4">
          <h2 class="text-xl font-bold text-slate-900">Check-in khách hàng</h2>
          <p class="mt-1 text-sm text-slate-500">Nhập mã đặt sân để tìm kiếm thông tin và xác nhận khách đã đến sân.</p>
        </div>

        <div class="flex flex-col gap-3 md:flex-row">
          <v-text-field
            v-model="keyword"
            variant="outlined"
            density="comfortable"
            rounded="xl"
            hide-details
            placeholder="Nhập mã đặt sân, ví dụ: BK-2023-892"
            class="flex-1"
            @keydown.enter="handleSearch"
          />

          <v-btn
            color="success"
            rounded="xl"
            class="text-none"
            size="large"
            :loading="isSearching"
            :disabled="isSearching"
            @click="handleSearch"
          >
            Tìm kiếm
          </v-btn>
        </div>

        <v-alert v-if="errorMessage" type="error" variant="tonal" rounded="lg" class="mt-4">
          {{ errorMessage }}
        </v-alert>
      </v-card-text>
    </v-card>

    <v-card v-if="searched && activeBooking" rounded="xl" class="border border-slate-200 shadow-sm">
      <v-card-text class="pa-0">
        <div class="flex items-center justify-between gap-3 border-b border-slate-100 bg-green-50 px-5 py-4">
          <div>
            <p class="text-base font-bold text-slate-900">#{{ activeBooking.bookingCode }}</p>
            <p class="mt-1 text-sm text-slate-500">
              {{ activeBooking.isCheckedIn ? "Đã xác nhận check-in" : "Đã tìm thấy thông tin đặt sân" }}
            </p>
          </div>

          <v-chip size="small" rounded="pill" variant="flat" :color="getPaymentStatusColor(activeBooking.paymentStatus)">
            {{ getPaymentStatusLabel(activeBooking.paymentStatus) }}
          </v-chip>
        </div>

        <div class="grid grid-cols-1 gap-5 p-5 lg:grid-cols-12">
          <div class="lg:col-span-7">
            <div class="rounded-2xl border border-slate-200 p-5">
              <h3 class="text-sm font-bold uppercase tracking-wide text-slate-500">Thông tin khách hàng</h3>

              <div class="mt-4 space-y-4">
                <div>
                  <p class="text-lg font-bold text-slate-900">{{ activeBooking.customerName }}</p>
                  <p class="mt-1 text-sm text-slate-500">{{ activeBooking.customerPhone }}</p>
                </div>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Sân</p>
                    <p class="mt-1 text-sm font-medium text-slate-900">{{ activeBooking.fieldName }}</p>
                  </div>

                  <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Ngày</p>
                    <p class="mt-1 text-sm font-medium text-slate-900">{{ activeBooking.bookingDate }}</p>
                  </div>

                  <div class="md:col-span-2">
                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Khung giờ</p>
                    <p class="mt-1 text-sm font-medium text-slate-900">{{ activeBooking.timeLabel }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 class="text-sm font-bold uppercase tracking-wide text-slate-500">Thông tin thanh toán</h3>

              <div class="mt-4 space-y-3">
                <div class="flex items-center justify-between gap-4">
                  <span class="text-sm text-slate-500">Tổng tiền</span>
                  <span class="text-sm font-semibold text-slate-900">{{ formatCurrency(activeBooking.totalAmount) }}</span>
                </div>

                <div class="flex items-center justify-between gap-4">
                  <span class="text-sm text-slate-500">Đã cọc</span>
                  <span class="text-sm font-semibold text-green-600"> -{{ formatCurrency(activeBooking.depositAmount) }} </span>
                </div>

                <div class="flex items-center justify-between gap-4 border-t border-slate-200 pt-3">
                  <span class="text-base font-bold text-slate-900">Còn lại</span>
                  <span class="text-xl font-bold text-red-500">
                    {{ formatCurrency(activeBooking.remainingAmount) }}
                  </span>
                </div>
              </div>

              <v-alert v-if="activeBooking.remainingAmount > 0" variant="tonal" color="error" rounded="lg" class="mt-4">
                Vui lòng thu phần tiền còn lại trước khi hoàn thành check-in.
              </v-alert>

              <div class="mt-4">
                <v-checkbox
                  v-model="isRemainingCollected"
                  density="comfortable"
                  hide-details
                  :disabled="activeBooking.remainingAmount === 0 || activeBooking.isCheckedIn || isCompleting"
                >
                  <template #label>
                    <span class="text-sm text-slate-600">
                      Tôi xác nhận đã thu {{ formatCurrency(activeBooking.remainingAmount) }}
                    </span>
                  </template>
                </v-checkbox>
              </div>

              <v-btn
                block
                color="success"
                rounded="xl"
                size="large"
                class="mt-4 text-none"
                :loading="isCompleting"
                :disabled="isCheckInDisabled"
                @click="handleCompleteCheckIn"
              >
                Hoàn thành check-in
              </v-btn>

              <p v-if="activeBooking.isCheckedIn" class="mt-3 text-center text-sm font-medium text-slate-500">
                Lượt đặt này đã được xác nhận check-in trước đó.
              </p>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <v-card
      v-else-if="searched && !isSearching && !activeBooking"
      rounded="xl"
      class="border border-dashed border-slate-300 bg-white py-14 text-center shadow-none"
    >
      <p class="text-base font-semibold text-slate-700">Không tìm thấy lượt đặt phù hợp.</p>
      <p class="mt-2 text-sm text-slate-500">Vui lòng kiểm tra lại mã đặt sân và thử tìm kiếm lại.</p>
    </v-card>

    <v-card rounded="xl" class="border border-slate-200 shadow-sm">
      <v-card-text class="pa-0">
        <div class="px-5 py-4">
          <h3 class="text-lg font-bold text-slate-900">Lịch sử check-in hôm nay</h3>
        </div>

        <v-divider />

        <div class="overflow-x-auto">
          <table class="w-full min-w-[640px]">
            <thead class="bg-slate-50">
              <tr>
                <th class="table-head text-left">Thời gian</th>
                <th class="table-head text-left">Khách hàng</th>
                <th class="table-head text-left">Sân</th>
                <th class="table-head text-left">Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="historyLoading" class="border-t border-slate-100">
                <td class="table-cell text-center text-slate-500" colspan="4">Đang tải lịch sử check-in...</td>
              </tr>

              <tr v-else-if="!historyItems.length" class="border-t border-slate-100">
                <td class="table-cell text-center text-slate-500" colspan="4">Chưa có dữ liệu check-in hôm nay.</td>
              </tr>

              <tr v-for="item in historyItems" :key="item.id" class="border-t border-slate-100">
                <td class="table-cell text-slate-700">{{ item.checkedInTime }}</td>
                <td class="table-cell text-slate-700">{{ item.customerName }}</td>
                <td class="table-cell text-slate-700">{{ item.fieldName }}</td>
                <td class="table-cell">
                  <v-chip size="small" rounded="pill" variant="flat" color="success"> Đã check-in </v-chip>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import type { OwnerCheckInBookingItem, OwnerCheckInHistoryItem } from "~/types/owner"

const props = defineProps<{
  bookingItem: OwnerCheckInBookingItem | null
  historyItems: OwnerCheckInHistoryItem[]
  historyLoading?: boolean
  isSearching?: boolean
  isCompleting?: boolean
  errorMessage?: string
}>()

const emit = defineEmits<{
  (e: "search", keyword: string): void
  (e: "complete", payload: { bookingId: number; collectedRemaining: boolean }): void
}>()

const keyword = ref("")
const searched = ref(false)
const isRemainingCollected = ref(false)

const normalizedKeyword = computed(() => keyword.value.trim())
const activeBooking = computed(() => props.bookingItem)
const isSearching = computed(() => Boolean(props.isSearching))
const isCompleting = computed(() => Boolean(props.isCompleting))
const historyLoading = computed(() => Boolean(props.historyLoading))
const errorMessage = computed(() => props.errorMessage ?? "")

const isCheckInDisabled = computed(() => {
  if (!activeBooking.value) return true
  if (isCompleting.value) return true
  if (activeBooking.value.isCheckedIn) return true
  if (activeBooking.value.remainingAmount === 0) return false
  return !isRemainingCollected.value
})

watch(
  () => activeBooking.value?.id,
  () => {
    isRemainingCollected.value = false
  },
)

const handleSearch = () => {
  searched.value = true
  emit("search", normalizedKeyword.value)
}

const handleCompleteCheckIn = () => {
  if (!activeBooking.value || isCheckInDisabled.value) return

  emit("complete", {
    bookingId: activeBooking.value.id,
    collectedRemaining: isRemainingCollected.value,
  })
}

const getPaymentStatusLabel = (status: OwnerCheckInBookingItem["paymentStatus"]) => {
  switch (status) {
    case "paid":
      return "Đã thanh toán"
    case "partially_paid":
      return "Thanh toán một phần"
    case "unpaid":
      return "Chưa thanh toán"
    case "refunded":
      return "Đã hoàn tiền"
    default:
      return "Không xác định"
  }
}

const getPaymentStatusColor = (status: OwnerCheckInBookingItem["paymentStatus"]) => {
  switch (status) {
    case "paid":
      return "success"
    case "partially_paid":
      return "warning"
    case "unpaid":
      return "error"
    case "refunded":
      return "default"
    default:
      return "default"
  }
}

const formatCurrency = (value: number | null | undefined) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0))
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
