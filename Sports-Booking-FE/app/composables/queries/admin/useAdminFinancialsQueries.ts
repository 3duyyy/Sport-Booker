import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { adminService } from "~/services/adminService"
import type { AdminPayoutsQueryParams, AdminRefundsQueryParams } from "~/types/admin"

export const adminFinancialsQueryKeys = {
  all: ["admin-financials"] as const,
  summary: () => [...adminFinancialsQueryKeys.all, "summary"] as const,
  payouts: (params: {
    page: number
    limit: number
    keyword: string
    sortBy: "createdAt" | "amount"
    sortOrder: "asc" | "desc"
  }) => [...adminFinancialsQueryKeys.all, "payouts", params] as const,
  refunds: (params: {
    page: number
    limit: number
    keyword: string
    sortBy: "createdAt" | "amount"
    sortOrder: "asc" | "desc"
  }) => [...adminFinancialsQueryKeys.all, "refunds", params] as const,
}

export function useAdminFinancialsSummaryQuery() {
  return useQuery({
    queryKey: adminFinancialsQueryKeys.summary(),
    queryFn: async () => {
      const response = await adminService.getFinancialSummary()
      return response.data.data
    },
    staleTime: 30 * 1000,
  })
}

export function useAdminPayoutsQuery(params: MaybeRef<AdminPayoutsQueryParams>) {
  return useQuery({
    queryKey: computed(() =>
      adminFinancialsQueryKeys.payouts({
        page: unref(params).page ?? 1,
        limit: unref(params).limit ?? 10,
        keyword: unref(params).keyword ?? "",
        sortBy: unref(params).sortBy ?? "createdAt",
        sortOrder: unref(params).sortOrder ?? "desc",
      }),
    ),
    queryFn: async () => {
      const response = await adminService.getPayouts({
        page: unref(params).page ?? 1,
        limit: unref(params).limit ?? 10,
        keyword: unref(params).keyword ?? "",
        sortBy: unref(params).sortBy ?? "createdAt",
        sortOrder: unref(params).sortOrder ?? "desc",
      })
      return response.data
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

export function useAdminRefundsQuery(params: MaybeRef<AdminRefundsQueryParams>) {
  return useQuery({
    queryKey: computed(() =>
      adminFinancialsQueryKeys.refunds({
        page: unref(params).page ?? 1,
        limit: unref(params).limit ?? 10,
        keyword: unref(params).keyword ?? "",
        sortBy: unref(params).sortBy ?? "createdAt",
        sortOrder: unref(params).sortOrder ?? "desc",
      }),
    ),
    queryFn: async () => {
      const response = await adminService.getRefunds({
        page: unref(params).page ?? 1,
        limit: unref(params).limit ?? 10,
        keyword: unref(params).keyword ?? "",
        sortBy: unref(params).sortBy ?? "createdAt",
        sortOrder: unref(params).sortOrder ?? "desc",
      })
      return response.data
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

export function useSettlePayoutMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ownerId: number) => adminService.settlePayout(ownerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminFinancialsQueryKeys.all })
    },
  })
}

export function useApproveRefundMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (refundId: number) => adminService.approveRefund(refundId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminFinancialsQueryKeys.all })
    },
  })
}
