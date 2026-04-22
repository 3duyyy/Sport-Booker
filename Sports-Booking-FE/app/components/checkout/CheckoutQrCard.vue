<template>
  <v-card rounded="xl" elevation="2" class="pa-4">
    <h3 class="text-lg font-bold text-center">Quét mã để thanh toán</h3>
    <p class="text-sm text-slate-500 text-center mt-1">Mở app ngân hàng và quét mã QR bên dưới</p>

    <div class="qr-box mt-4">
      <img
        src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=SPORTBOOKER_PAYMENT"
        alt="QR thanh toán"
        class="qr-image"
      />
    </div>

    <div class="mt-5 space-y-3">
      <div class="flex items-center justify-between text-sm">
        <span class="text-slate-500">Số tiền</span>
        <span class="font-bold">{{ formatPrice(amount) }}</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-slate-500">Nội dung</span>
        <span class="font-medium">{{ transferContent }}</span>
      </div>
    </div>

    <div class="mt-5 flex flex-col gap-4">
      <v-btn
        block
        color="success"
        rounded="xl"
        class="text-none font-weight-bold pa-6"
        :prepend-icon="mdiCheckCircleOutline"
        :loading="loading"
        @click="$emit('confirm-paid')"
      >
        Tôi đã chuyển khoản
      </v-btn>

      <v-btn
        block
        variant="flat"
        color="error"
        rounded="xl"
        class="text-none font-weight-bold pa-6"
        :prepend-icon="mdiCloseCircleOutline"
        @click="$emit('cancel')"
      >
        Hủy thanh toán
      </v-btn>
    </div>

    <p class="mt-3 text-center text-caption text-slate-500">Hệ thống sẽ kiểm tra và cập nhật thanh toán.</p>
  </v-card>
</template>

<script setup lang="ts">
import { mdiCheckCircleOutline, mdiCloseCircleOutline } from "@mdi/js"

defineProps<{
  amount: number
  transferContent: string
  loading?: boolean
}>()

defineEmits<{
  (e: "confirm-paid"): void
  (e: "cancel"): void
}>()

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
}
</script>

<style scoped>
.qr-box {
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-image {
  width: 220px;
  height: 220px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 12px;
  background: white;
}
</style>
