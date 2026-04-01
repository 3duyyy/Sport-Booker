<template>
  <v-card rounded="xl" elevation="2" class="pa-4">
    <h3 class="text-base font-bold mb-4">Chọn hình thức thanh toán</h3>

    <button
      type="button"
      class="payment-option"
      :class="{ 'payment-option--active': modelValue === 'deposit' }"
      @click="$emit('update:modelValue', 'deposit')"
    >
      <div class="payment-option__left">
        <div class="payment-option__radio" />
        <div>
          <div class="flex items-center gap-2">
            <p class="font-bold">Đặt cọc (30%)</p>
            <v-chip size="x-small" color="success" rounded="lg">Phổ biến</v-chip>
          </div>
          <p class="text-2xl font-extrabold text-slate-900 mt-1">
            {{ formatPrice(depositAmount) }}
          </p>
          <p class="text-sm text-slate-500 mt-1">Thanh toán trước một phần để giữ sân</p>
        </div>
      </div>
    </button>

    <button
      type="button"
      class="payment-option mt-3"
      :class="{ 'payment-option--active': modelValue === 'full' }"
      @click="$emit('update:modelValue', 'full')"
    >
      <div class="payment-option__left">
        <div class="payment-option__radio" />
        <div>
          <p class="font-bold">Thanh toán toàn bộ (100%)</p>
          <p class="text-2xl font-extrabold text-slate-900 mt-1">
            {{ formatPrice(totalPrice) }}
          </p>
          <p class="text-sm text-slate-500 mt-1">Hoàn tất thanh toán cho booking</p>
        </div>
      </div>
    </button>
  </v-card>
</template>

<script setup lang="ts">
import type { PaymentOption } from "~/types/booking"

defineProps<{
  modelValue: PaymentOption
  depositAmount: number
  totalPrice: number
}>()

defineEmits<{
  (e: "update:modelValue", value: PaymentOption): void
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
.payment-option {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  text-align: left;
  transition: all 0.2s ease;
  background: white;
}

.payment-option--active {
  border-color: rgb(var(--v-theme-success));
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.12);
}

.payment-option__left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.payment-option__radio {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: rgb(var(--v-theme-success));
  margin-top: 6px;
  flex-shrink: 0;
}
</style>
