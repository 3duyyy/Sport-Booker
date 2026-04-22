<script setup lang="ts">
import { toast } from "vue-sonner"
import CancelBookingDialog from "~/components/booking/CancelBookingDialog.vue"
import AppBreadcrumbs from "~/components/common/AppBreadcrumbs.vue"
import { useCancelMyBookingMutation, useMyBookingsQuery } from "~/composables/queries/my-bookings/useMyBookingQueries"
import type { CustomerBookingItem, CustomerBookingTab } from "~/types/booking"

definePageMeta({
  middleware: "auth",
})

useSeoMeta({
  title: "Lịch đặt của tôi",
})

const activeTab = ref<CustomerBookingTab>("pending_confirmation")
const page = ref(1)
const limit = ref(10)

const queryParams = computed(() => ({
  page: page.value,
  limit: limit.value,
  tab: activeTab.value,
}))

const { data: myBookingsResponse, isLoading, isFetching, isError, error } = useMyBookingsQuery(queryParams)

const bookings = computed<CustomerBookingItem[]>(() => myBookingsResponse.value?.data ?? [])

const tabCounts = computed<Record<CustomerBookingTab, number>>(() => {
  return (
    myBookingsResponse.value?.tabCounts ?? {
      pending_confirmation: 0,
      upcoming: 0,
      completed: 0,
      cancelled: 0,
    }
  )
})

const filteredBookings = computed(() => {
  return bookings.value
})

const isRefreshing = computed(() => isFetching.value && !isLoading.value)

const errorMessage = computed(() => {
  const raw = error.value as unknown
  if (!raw) return "Không thể tải lịch đặt của bạn"
  if (typeof raw === "string") return raw
  if (raw instanceof Error) return raw.message
  return "Không thể tải lịch đặt của bạn"
})

const emptyStateMap: Record<CustomerBookingTab, string> = {
  upcoming: "Bạn chưa có lịch đặt sắp tới.",
  pending_confirmation: "Hiện chưa có lịch đặt nào đang chờ xác nhận.",
  completed: "Bạn chưa có lịch đặt đã hoàn thành.",
  cancelled: "Bạn chưa có lịch đặt đã hủy.",
}

const cancelDialogOpen = ref(false)
const pendingCancel = ref<null | { bookingId: number; bookingCode: string }>(null)

const { mutateAsync: cancelMyBooking, isPending: isCancelling } = useCancelMyBookingMutation()

const openCancelDialog = (payload: { bookingId: number; bookingCode: string }) => {
  const target = bookings.value.find((item) => item.id === payload.bookingId)
  if (!target) return

  if (target.canCancel === false) {
    toast.warning(target.cancelBlockedReason || "Không thể hủy lịch trong vòng 2 tiếng trước giờ bắt đầu")
    return
  }

  pendingCancel.value = payload
  cancelDialogOpen.value = true
}

const closeCancelDialog = () => {
  pendingCancel.value = null
  cancelDialogOpen.value = false
}

const submitCancelBooking = async (payload: { reason: string }) => {
  if (!pendingCancel.value) return

  try {
    await cancelMyBooking({
      bookingId: pendingCancel.value.bookingId,
      data: { reason: payload.reason },
    })
    toast.success("Hủy lịch đặt thành công")
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Hủy lịch thất bại")
  } finally {
    closeCancelDialog()
  }
}

watch(activeTab, () => {
  page.value = 1
})
</script>

<template>
  <div class="container-layout min-h-screen">
    <div class="mx-auto max-w-7xl px-4 md:px-6">
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

      <div v-if="isLoading" class="space-y-4">
        <v-skeleton-loader type="image, article" class="rounded-xl" />
        <v-skeleton-loader type="image, article" class="rounded-xl" />
      </div>

      <div v-else-if="filteredBookings.length > 0" class="space-y-4">
        <BookingCard
          v-for="booking in filteredBookings"
          :key="booking.id"
          :booking="booking"
          @cancel-request="openCancelDialog"
        />

        <div v-if="isRefreshing" class="text-sm text-slate-500 text-right">Đang cập nhật dữ liệu...</div>
      </div>

      <v-card v-else rounded="xl" class="border border-dashed border-slate-300 bg-white py-14 text-center shadow-none">
        <p class="text-base font-semibold text-slate-700">
          {{ emptyStateMap[activeTab] }}
        </p>
        <p class="mt-2 text-sm text-slate-500">Hãy chọn sân phù hợp để tạo lịch đặt mới.</p>
      </v-card>

      <v-alert v-if="isError" type="error" variant="tonal" rounded="lg" class="mt-4">
        {{ errorMessage }}
      </v-alert>

      <CancelBookingDialog
        v-model="cancelDialogOpen"
        :booking-code="pendingCancel?.bookingCode || ''"
        :is-loading="isCancelling"
        @submit="submitCancelBooking"
        @cancel="closeCancelDialog"
      />
    </div>
  </div>
</template>
