<script setup lang="ts">
import AppBreadcrumbs from "~/components/common/AppBreadcrumbs.vue"
import { myBookingsMock } from "~/mockData/my-bookings.mock"
import type { CustomerBookingItem, CustomerBookingTab } from "~/types/booking"

useSeoMeta({
  title: "Lịch đặt của tôi",
})

const activeTab = ref<CustomerBookingTab>("pending_confirmation")

const bookings = ref<CustomerBookingItem[]>(myBookingsMock)

const filteredBookings = computed(() => {
  return bookings.value.filter((item) => item.tab === activeTab.value)
})

const emptyStateMap: Record<CustomerBookingTab, string> = {
  upcoming: "Bạn chưa có lịch đặt sắp tới.",
  pending_confirmation: "Hiện chưa có lịch đặt nào đang chờ xác nhận.",
  completed: "Bạn chưa có lịch đặt đã hoàn thành.",
  cancelled: "Bạn chưa có lịch đặt đã hủy.",
}

const tabCounts = {
  pending_confirmation: 1,
  upcoming: 2,
  completed: 4,
  cancelled: 1,
}
</script>

<template>
  <div class="bg-slate-50 min-h-screen">
    <div class="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <AppBreadcrumbs
        :items="[
          { title: 'Trang chủ', to: '/' },
          { title: 'Lịch đặt của tôi', disabled: true },
        ]"
      />
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-900 md:text-3xl">Lịch đặt của tôi</h1>
        <p class="mt-2 text-sm text-slate-500">Theo dõi các lịch đặt sân, trạng thái thanh toán và lịch sử đặt của bạn.</p>
      </div>

      <div class="mb-6">
        <BookingTabs v-model="activeTab" :counts="tabCounts" />
      </div>

      <div v-if="filteredBookings.length > 0" class="space-y-4">
        <BookingCard v-for="booking in filteredBookings" :key="booking.id" :booking="booking" />
      </div>

      <v-card v-else rounded="xl" class="border border-dashed border-slate-300 bg-white py-14 text-center shadow-none">
        <p class="text-base font-semibold text-slate-700">
          {{ emptyStateMap[activeTab] }}
        </p>
        <p class="mt-2 text-sm text-slate-500">Hãy chọn sân phù hợp để tạo lịch đặt mới.</p>
      </v-card>
    </div>
  </div>
</template>
