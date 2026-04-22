import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { adminService } from "~/services/adminService"
import type { AdminFacilitiesQueryParams, AdminUpdateFacilityStatusPayload } from "~/types/admin"

export const adminFacilitiesQueryKeys = {
  all: ["admin-facilities"] as const,
  list: (params: {
    page: number
    limit: number
    keyword: string
    sportId?: number
    performance?: "high" | "normal" | "low"
    sortBy: "createdAt" | "bookingCount" | "name"
    sortOrder: "asc" | "desc"
  }) => [...adminFacilitiesQueryKeys.all, "list", params] as const,
}

export function useAdminFacilitiesQuery(params: MaybeRef<AdminFacilitiesQueryParams>) {
  return useQuery({
    queryKey: computed(() =>
      adminFacilitiesQueryKeys.list({
        page: unref(params).page ?? 1,
        limit: unref(params).limit ?? 10,
        keyword: unref(params).keyword ?? "",
        sportId: unref(params).sportId,
        performance: unref(params).performance,
        sortBy: unref(params).sortBy ?? "createdAt",
        sortOrder: unref(params).sortOrder ?? "desc",
      }),
    ),
    queryFn: async () => {
      const response = await adminService.getFacilities({
        page: unref(params).page ?? 1,
        limit: unref(params).limit ?? 10,
        keyword: unref(params).keyword ?? "",
        sportId: unref(params).sportId,
        performance: unref(params).performance,
        sortBy: unref(params).sortBy ?? "createdAt",
        sortOrder: unref(params).sortOrder ?? "desc",
      })
      return response.data
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

export function useAdminUpdateFacilityStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { facilityId: number; data: AdminUpdateFacilityStatusPayload }) => {
      const response = await adminService.updateFacilityStatus(payload.facilityId, payload.data)
      return response.data.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminFacilitiesQueryKeys.all })
    },
  })
}

export function useAdminApproveFacilityMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (facilityId: number) => {
      const response = await adminService.approveFacility(facilityId)
      return response.data.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminFacilitiesQueryKeys.all })
    },
  })
}
