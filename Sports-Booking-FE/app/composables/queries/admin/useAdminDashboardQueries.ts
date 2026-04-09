import { useQuery } from "@tanstack/vue-query"
import { adminService, type GetAdminDashboardParams } from "~/services/adminService"

export const adminQueryKeys = {
  all: ["admin"] as const,
  dashboard: (params: { days: number; topPage: number; topLimit: number; activityLimit: number }) =>
    [...adminQueryKeys.all, "dashboard", params] as const,
}

export function useAdminDashboardQuery(params: MaybeRef<GetAdminDashboardParams>) {
  return useQuery({
    queryKey: computed(() =>
      adminQueryKeys.dashboard({
        days: unref(params).days ?? 30,
        topPage: unref(params).topPage ?? 1,
        topLimit: unref(params).topLimit ?? 10,
        activityLimit: unref(params).activityLimit ?? 10,
      }),
    ),
    queryFn: async () => {
      const response = await adminService.getDashboardOverview({
        days: unref(params).days ?? 30,
        topPage: unref(params).topPage ?? 1,
        topLimit: unref(params).topLimit ?? 5,
        activityLimit: unref(params).activityLimit ?? 5,
      })
      return response.data.data
    },
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
