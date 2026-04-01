<template>
  <div class="container-layout !pt-0 checkout-page">
    <v-container class="max-w-7xl py-8">
      <div v-if="!bookingStore.draft">
        <v-alert type="warning" variant="tonal" rounded="xl"> Không có dữ liệu booking để thanh toán. </v-alert>
      </div>

      <template v-else>
        <div class="mb-6">
          <h1 class="text-4xl font-extrabold text-slate-900">Thanh toán</h1>
          <p class="text-slate-500 mt-2">Kiểm tra thông tin booking và chọn hình thức thanh toán phù hợp.</p>
        </div>

        <div class="checkout-layout">
          <div class="checkout-layout__left">
            <CheckoutBookingSummary :draft="bookingStore.draft" />

            <CheckoutPolicyCard class="mt-4" />
          </div>

          <div class="checkout-layout__right">
            <CheckoutPaymentType
              v-model="bookingStore.paymentOption"
              :deposit-amount="bookingStore.depositAmount"
              :total-price="bookingStore.draft.totalPrice"
            />

            <CheckoutQrCard
              class="mt-4"
              :amount="bookingStore.payableAmount"
              :transfer-content="transferContent"
              @confirm-paid="handleConfirmPaid"
              @cancel="openDialog"
            />
          </div>

          <CommonConfirmDialog
            v-model="isCancelDialogOpen"
            title="Xác nhận hủy thanh toán"
            message="Nếu hủy lúc này, thông tin sân và khung giờ đã chọn sẽ bị xóa. Bạn có chắc chắn muốn hủy không?"
            cancel-color="success"
            cancel-variant="flat"
            cancel-text="Hủy"
            confirm-color="error"
            confirm-variant="flat"
            confirm-text="Xác nhận"
            @confirm="handleCancel"
          />
        </div>
      </template>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useBookingStore } from "~/stores/booking.store"

definePageMeta({
  layout: "default",
})

const bookingStore = useBookingStore()
const router = useRouter()

const isCancelDialogOpen = ref(false)

const transferContent = computed(() => {
  const draft = bookingStore.draft
  if (!draft) return "SPORTBOOKER"

  return `SB-${draft.facilityId}-${draft.fieldId}`
})

function handleConfirmPaid() {
  // mock trước
  // sau này sẽ gọi API xác nhận / kiểm tra transaction
  router.push("/dat-san/thanh-cong")
}

function openDialog() {
  isCancelDialogOpen.value = true
}

function handleCancel() {
  bookingStore.clearDraft()

  if (window.history.length > 1) {
    router.back()
    return
  }

  router.push("/tim-san")
}
</script>

<style scoped>
.checkout-page {
  background: #f8fafc;
}

.checkout-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 24px;
  align-items: start;
}

.checkout-layout__left,
.checkout-layout__right {
  min-width: 0;
}

@media (max-width: 1100px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }
}
</style>
