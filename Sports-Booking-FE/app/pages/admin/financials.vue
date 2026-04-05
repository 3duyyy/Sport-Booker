<template>
  <div class="admin-financials-page">
    <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-6">
      <div>
        <h1 class=".admin-financials-page__title">Tài chính</h1>
        <p class="text-body-2 text-slate-500 mb-0">Theo dõi chi trả cho chủ sân và các yêu cầu hoàn tiền của khách hàng.</p>
      </div>

      <v-btn color="primary" variant="flat" rounded="lg" class="text-none"> Xử lý hàng loạt chi trả </v-btn>
    </div>

    <v-row class="mb-2">
      <v-col v-for="(item, index) in statItems" :key="index" cols="12" md="4">
        <FinancialSummaryCard :title="item.title" :value="item.value" :subtitle="item.subtitle" />
      </v-col>
    </v-row>

    <div class="d-flex flex-column ga-6">
      <PayoutsTable :rows="payoutRows" />
      <RefundsTable :rows="refundRows" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import FinancialSummaryCard from "~/components/admin/financials/FinancialSummaryCard.vue"
import PayoutsTable from "~/components/admin/financials/PayoutsTable.vue"
import RefundsTable from "~/components/admin/financials/RefundsTable.vue"
import {
  formatAdminCurrency,
  getAdminFinancialPayoutRows,
  getAdminFinancialRefundRows,
  getAdminFinancialStats,
} from "~/mockData/admin.mock"

definePageMeta({
  layout: "admin",
  middleware: "admin",
})

const stats = computed(() => getAdminFinancialStats())
const payoutRows = computed(() => getAdminFinancialPayoutRows())
const refundRows = computed(() => getAdminFinancialRefundRows())

const statItems = computed(() => [
  {
    title: "Tổng tiền chờ chi trả",
    value: formatAdminCurrency(stats.value.pendingPayoutAmount),
    subtitle: `${stats.value.pendingPayoutCount} booking chờ chi trả`,
  },
  {
    title: "Booking chờ chi trả",
    value: String(stats.value.pendingPayoutCount),
    subtitle: "Các booking đã thanh toán và đủ điều kiện đối soát",
  },
  {
    title: "Hoàn tiền chờ xử lý",
    value: formatAdminCurrency(stats.value.pendingRefundAmount),
    subtitle: `${stats.value.pendingRefundCount} yêu cầu đang chờ xử lý`,
  },
])
</script>

<style scoped>
.admin-financials-page__title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
}
</style>
