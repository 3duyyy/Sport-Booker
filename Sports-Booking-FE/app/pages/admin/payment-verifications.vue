<template>
  <div class="admin-payments-page">
    <div>
      <h1 class="admin-payments-header__title">Xác minh thanh toán</h1>
      <p class="admin-payments-header__desc">Theo dõi và quản lý thanh toán của khách hàng trên toàn hệ thống</p>
    </div>

    <div class="admin-payments-filters">
      <v-text-field
        v-model="filters.keyword"
        label="Tìm theo khách hàng, booking, giao dịch, cơ sở"
        variant="outlined"
        density="comfortable"
        hide-details
        clearable
      />
      <v-select
        v-model="filters.status"
        :items="statusOptions"
        label="Trạng thái"
        variant="outlined"
        density="comfortable"
        hide-details
      />
      <v-select
        v-model="filters.verificationType"
        :items="typeOptions"
        label="Loại thanh toán"
        variant="outlined"
        density="comfortable"
        hide-details
      />
    </div>

    <div class="admin-payments-page__table-wrap">
      <AppLoading
        v-if="isLoading && rows.length === 0"
        :overlay="false"
        :card="true"
        min-height="360px"
        title="Đang tải danh sách xác minh..."
        description="Vui lòng chờ trong giây lát"
      />

      <template v-else>
        <PaymentVerificationTable
          :rows="rows"
          :approving-id="approvingId"
          :rejecting-id="rejectingId"
          @approve="onApprove"
          @reject="onReject"
        />

        <AppLoading
          v-if="isFetching"
          :visible="true"
          :overlay="true"
          :persistent="false"
          :card="true"
          title="Đang cập nhật dữ liệu..."
          description=""
          :size="42"
        />
      </template>
    </div>

    <div class="admin-payments-page__footer">
      <div class="admin-payments-page__footer-text">
        Hiển thị {{ startItem }} - {{ endItem }} trên tổng {{ pagination.total }} yêu cầu
      </div>

      <v-pagination v-model="page" :length="pagination.totalPages" :total-visible="5" rounded="circle" density="comfortable" />
    </div>

    <v-alert v-if="isError" type="error" variant="tonal" rounded="lg">
      {{ listErrorMessage }}
    </v-alert>

    <v-alert v-if="actionErrorMessage" type="error" variant="tonal" rounded="lg">
      {{ actionErrorMessage }}
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import AppLoading from "~/components/common/AppLoading.vue"
import PaymentVerificationTable from "~/components/admin/payment-verifications/PaymentVerificationTable.vue"
import {
  useAdminPaymentVerificationsQuery,
  useApprovePaymentVerificationMutation,
  useRejectPaymentVerificationMutation,
} from "~/composables/queries/admin/useAdminPaymentVerificationQueries"
import type { PaymentVerificationRow, PaginationMeta } from "~/types/admin"

definePageMeta({
  layout: "admin",
  middleware: "admin",
})

const page = ref(1)
const limit = ref(5)

const filters = ref({
  keyword: "",
  status: "all" as "all" | "pending" | "approved" | "rejected",
  verificationType: "all" as "all" | "full_payment" | "deposit",
})

const statusOptions = [
  { title: "Tất cả trạng thái", value: "all" },
  { title: "Chờ xác minh", value: "pending" },
  { title: "Đã duyệt", value: "approved" },
  { title: "Đã từ chối", value: "rejected" },
]

const typeOptions = [
  { title: "Tất cả loại thanh toán", value: "all" },
  { title: "Thanh toán toàn bộ", value: "full_payment" },
  { title: "Đặt cọc", value: "deposit" },
]

const debouncedKeyword = useDebounce(
  computed(() => filters.value.keyword.trim()),
  400,
)

const queryParams = computed(() => ({
  page: page.value,
  limit: limit.value,
  keyword: debouncedKeyword.value || undefined,
  status: filters.value.status === "all" ? undefined : filters.value.status,
  verificationType: filters.value.verificationType === "all" ? undefined : filters.value.verificationType,
  sortBy: "transferredAt" as const,
  sortOrder: "desc" as const,
}))

const { data, isLoading, isFetching, isError, error } = useAdminPaymentVerificationsQuery(queryParams)

const rows = computed<PaymentVerificationRow[]>(() => data.value?.data ?? [])

const pagination = computed<PaginationMeta>(() => {
  return (
    data.value?.pagination ?? {
      page: 1,
      limit: limit.value,
      total: 0,
      totalPages: 1,
    }
  )
})

const startItem = computed(() => {
  if (!pagination.value.total) return 0
  return (pagination.value.page - 1) * pagination.value.limit + 1
})

const endItem = computed(() => {
  return Math.min(pagination.value.page * pagination.value.limit, pagination.value.total)
})

const { mutateAsync: approveMutate } = useApprovePaymentVerificationMutation()
const { mutateAsync: rejectMutate } = useRejectPaymentVerificationMutation()

const approvingId = ref<number | null>(null)
const rejectingId = ref<number | null>(null)
const actionErrorMessage = ref("")

const parseErrorMessage = (err: unknown, fallback: string) => {
  if (!err) return fallback
  if (typeof err === "string") return err
  if (err instanceof Error) return err.message
  return fallback
}

const listErrorMessage = computed(() => parseErrorMessage(error.value, "Không thể tải danh sách xác minh thanh toán"))

const onApprove = async (row: PaymentVerificationRow) => {
  actionErrorMessage.value = ""
  try {
    approvingId.value = row.transactionId
    await approveMutate(row.transactionId)
  } catch (err) {
    actionErrorMessage.value = parseErrorMessage(err, "Duyệt giao dịch thất bại")
  } finally {
    approvingId.value = null
  }
}

const onReject = async (row: PaymentVerificationRow) => {
  actionErrorMessage.value = ""
  try {
    if (!import.meta.client) return

    const reason = window.prompt("Nhập lý do từ chối (không bắt buộc):")
    if (reason === null) return

    rejectingId.value = row.transactionId
    await rejectMutate({
      transactionId: row.transactionId,
      reason: reason.trim() || undefined,
    })
  } catch (err) {
    actionErrorMessage.value = parseErrorMessage(err, "Từ chối giao dịch thất bại")
  } finally {
    rejectingId.value = null
  }
}

watch(
  () => [debouncedKeyword.value, filters.value.status, filters.value.verificationType],
  () => {
    page.value = 1
  },
)

useHead({
  title: "Xác minh thanh toán | Admin",
})
</script>

<style scoped>
.admin-payments-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

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

.admin-payments-filters {
  display: grid;
  grid-template-columns: minmax(320px, 1fr) 220px 220px;
  gap: 12px;
}

.admin-payments-page__table-wrap {
  position: relative;
  min-height: 220px;
}

.admin-payments-page__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.admin-payments-page__footer-text {
  font-size: 14px;
  color: #64748b;
}

@media (max-width: 1024px) {
  .admin-payments-filters {
    grid-template-columns: 1fr;
  }
}
</style>
