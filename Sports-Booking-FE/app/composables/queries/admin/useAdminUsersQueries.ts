import { keepPreviousData, useQuery } from "@tanstack/vue-query"
import { adminService } from "~/services/adminService"
import type { AdminUsersQueryParams } from "~/types/admin"

export const adminUsersQueryKeys = {
  all: ["admin-users"] as const,
  list: (params: {
    page: number
    limit: number
    keyword: string
    roleId?: 1 | 2 | 3
    status?: "active" | "banned" | "pending_approve"
  }) => [...adminUsersQueryKeys.all, "list", params] as const,
}

export function useAdminUsersQuery(params: MaybeRef<AdminUsersQueryParams>) {
  return useQuery({
    queryKey: computed(() =>
      adminUsersQueryKeys.list({
        page: unref(params).page ?? 1,
        limit: unref(params).limit ?? 10,
        keyword: unref(params).keyword ?? "",
        roleId: unref(params).roleId,
        status: unref(params).status,
      }),
    ),
    queryFn: async () => {
      const response = await adminService.getUsers({
        page: unref(params).page ?? 1,
        limit: unref(params).limit ?? 10,
        keyword: unref(params).keyword ?? "",
        roleId: unref(params).roleId,
        status: unref(params).status,
        sortBy: "createdAt",
        sortOrder: "desc",
      })
      return response.data
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}
