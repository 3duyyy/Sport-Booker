<template>
  <div class="admin-financials-page">
    <div class="ga-3 mb-6">
      <h1 class="admin-financials-page__title">Tài chính</h1>
      <p class="text-body-2 text-slate-500 mb-0">Theo dõi chi trả cho chủ sân và các yêu cầu hoàn tiền của khách hàng.</p>
    </div>

    <v-row class="mb-6">
      <v-col v-for="(item, index) in statItems" :key="index" cols="12" md="4">
        <FinancialSummaryCard :title="item.title" :value="item.value" :subtitle="item.subtitle" />
      </v-col>
    </v-row>

    <v-alert v-if="summaryError" type="error" variant="tonal" rounded="lg" class="mb-4">
      {{ summaryError }}
    </v-alert>

    <div class="d-flex flex-column ga-6">
      <PayoutsTable
        :rows="payoutRows"
        :keyword="payoutKeyword"
        :page="payoutPage"
        :pagination="payoutPagination"
        :is-fetching="isPayoutsFetching"
        @update:keyword="onPayoutKeywordChange"
        @update:page="onPayoutPageChange"
      />

      <RefundsTable
        :rows="refundRows"
        :keyword="refundKeyword"
        :page="refundPage"
        :pagination="refundPagination"
        :is-fetching="isRefundsFetching"
        @update:keyword="onRefundKeywordChange"
        @update:page="onRefundPageChange"
      />
    </div>

    <v-alert v-if="listErrorMessage" type="error" variant="tonal" rounded="lg" class="mt-4">
      {{ listErrorMessage }}
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import FinancialSummaryCard from "~/components/admin/financials/FinancialSummaryCard.vue"
import PayoutsTable from "~/components/admin/financials/PayoutsTable.vue"
import RefundsTable from "~/components/admin/financials/RefundsTable.vue"
import {
  useAdminFinancialsSummaryQuery,
  useAdminPayoutsQuery,
  useAdminRefundsQuery,
} from "~/composables/queries/admin/useAdminFinancialsQueries"
import type { PayoutRow, RefundRow, PaginationMeta } from "~/types/admin"

definePageMeta({
  layout: "admin",
  middleware: "admin",
})

const payoutPage = ref(1)
const payoutLimit = ref(5)
const payoutKeyword = ref("")

const refundPage = ref(1)
const refundLimit = ref(5)
const refundKeyword = ref("")

const debouncedPayoutKeyword = useDebounce(
  computed(() => payoutKeyword.value.trim()),
  400,
)

const debouncedRefundKeyword = useDebounce(
  computed(() => refundKeyword.value.trim()),
  400,
)

const payoutParams = computed(() => ({
  page: payoutPage.value,
  limit: payoutLimit.value,
  keyword: debouncedPayoutKeyword.value || undefined,
  sortBy: "createdAt" as const,
  sortOrder: "desc" as const,
}))

const refundParams = computed(() => ({
  page: refundPage.value,
  limit: refundLimit.value,
  keyword: debouncedRefundKeyword.value || undefined,
  sortBy: "createdAt" as const,
  sortOrder: "desc" as const,
}))

const { data: summaryData, error: summaryErr } = useAdminFinancialsSummaryQuery()
const { data: payoutsData, isFetching: isPayoutsFetching, error: payoutsErr } = useAdminPayoutsQuery(payoutParams)

const { data: refundsData, isFetching: isRefundsFetching, error: refundsErr } = useAdminRefundsQuery(refundParams)

const payoutRows = computed<PayoutRow[]>(() => payoutsData.value?.data ?? [])
const refundRows = computed<RefundRow[]>(() => refundsData.value?.data ?? [])

const payoutPagination = computed<PaginationMeta>(() => {
  return (
    payoutsData.value?.pagination ?? {
      page: 1,
      limit: payoutLimit.value,
      total: 0,
      totalPages: 1,
    }
  )
})

const refundPagination = computed<PaginationMeta>(() => {
  return (
    refundsData.value?.pagination ?? {
      page: 1,
      limit: refundLimit.value,
      total: 0,
      totalPages: 1,
    }
  )
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
}

const summary = computed(() => {
  return (
    summaryData.value ?? {
      pendingPayoutAmount: 0,
      pendingPayoutCount: 0,
      pendingRefundAmount: 0,
      pendingRefundCount: 0,
    }
  )
})

const statItems = computed(() => [
  {
    title: "Tổng tiền chờ chi trả",
    value: formatCurrency(summary.value.pendingPayoutAmount),
    subtitle: String(summary.value.pendingPayoutCount) + " booking chờ chi trả",
  },
  {
    title: "Booking chờ chi trả",
    value: String(summary.value.pendingPayoutCount),
    subtitle: "Các booking đã thanh toán và đủ điều kiện đối soát",
  },
  {
    title: "Hoàn tiền chờ xử lý",
    value: formatCurrency(summary.value.pendingRefundAmount),
    subtitle: String(summary.value.pendingRefundCount) + " yêu cầu đang chờ xử lý",
  },
])

const parseError = (err: unknown, fallback: string) => {
  if (!err) return ""
  if (typeof err === "string") return err
  if (err instanceof Error) return err.message
  return fallback
}

const summaryError = computed(() => parseError(summaryErr.value, "Không thể tải số liệu tài chính"))

const listErrorMessage = computed(() => {
  const payoutsError = parseError(payoutsErr.value, "")
  const refundsError = parseError(refundsErr.value, "")
  if (payoutsError && refundsError) return payoutsError + " | " + refundsError
  return payoutsError || refundsError
})

const onPayoutKeywordChange = (value: string) => {
  payoutKeyword.value = value
}

const onRefundKeywordChange = (value: string) => {
  refundKeyword.value = value
}

const onPayoutPageChange = (value: number) => {
  payoutPage.value = value
}

const onRefundPageChange = (value: number) => {
  refundPage.value = value
}

watch(
  () => debouncedPayoutKeyword.value,
  () => {
    payoutPage.value = 1
  },
)

watch(
  () => debouncedRefundKeyword.value,
  () => {
    refundPage.value = 1
  },
)
</script>

<style scoped>
.admin-financials-page__title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
}
</style>
