<template>
  <div class="flex flex-col gap-6">
    <div>
      <h1 class="admin-payments-header__title">Quản lý sân bãi</h1>
      <p class="admin-payments-header__desc">Theo dõi và quản lý cơ sở thể thao trên toàn hệ thống</p>
    </div>
    <PaymentVerificationTable :rows="rows" />
  </div>
</template>

<script setup lang="ts">
import PaymentVerificationTable from "~/components/admin/payment-verifications/PaymentVerificationTable.vue"
import { paymentVerificationRowsMock } from "~/mockData/admin.mock"

definePageMeta({
  layout: "admin",
  middleware: "admin",
})

const rows = computed(() => paymentVerificationRowsMock)

useHead({
  title: "Xác minh thanh toán | Admin",
})
</script>

<style scoped>
.admin-payments-header__title {
  margin: 0;
  font-weight: 700;
  color: #0f172a;
}

.admin-payments-header__desc {
  margin: 6px 0 0;
  font-size: 14px;
  color: #64748b;
}
</style>
