import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { adminService } from "~/services/adminService"
import type { AdminPaymentVerificationsQueryParams, AdminRejectPaymentVerificationPayload } from "~/types/admin"

export const adminPaymentVerificationQueryKeys = {
  all: ["admin-payment-verifications"] as const,
  list: (params: {
    page: number
    limit: number
    keyword: string
    status?: "pending" | "approved" | "rejected"
    verificationType?: "full_payment" | "deposit"
    sortBy: "transferredAt" | "amount"
    sortOrder: "asc" | "desc"
  }) => [...adminPaymentVerificationQueryKeys.all, "list", params] as const,
}

export function useAdminPaymentVerificationsQuery(params: MaybeRef<AdminPaymentVerificationsQueryParams>) {
  return useQuery({
    queryKey: computed(() =>
      adminPaymentVerificationQueryKeys.list({
        page: unref(params).page ?? 1,
        limit: unref(params).limit ?? 10,
        keyword: unref(params).keyword ?? "",
        status: unref(params).status,
        verificationType: unref(params).verificationType,
        sortBy: unref(params).sortBy ?? "transferredAt",
        sortOrder: unref(params).sortOrder ?? "desc",
      }),
    ),
    queryFn: async () => {
      const response = await adminService.getPaymentVerifications({
        page: unref(params).page ?? 1,
        limit: unref(params).limit ?? 10,
        keyword: unref(params).keyword ?? "",
        status: unref(params).status,
        verificationType: unref(params).verificationType,
        sortBy: unref(params).sortBy ?? "transferredAt",
        sortOrder: unref(params).sortOrder ?? "desc",
      })
      return response.data
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

export function useApprovePaymentVerificationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (transactionId: number) => {
      const response = await adminService.approvePaymentVerification(transactionId)
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminPaymentVerificationQueryKeys.all })
    },
  })
}

export function useRejectPaymentVerificationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { transactionId: number } & AdminRejectPaymentVerificationPayload) => {
      const response = await adminService.rejectPaymentVerification(payload.transactionId, {
        reason: payload.reason,
      })
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminPaymentVerificationQueryKeys.all })
    },
  })
}
