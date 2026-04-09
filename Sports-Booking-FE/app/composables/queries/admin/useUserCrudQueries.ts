import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { adminService } from "~/services/adminService"
import type { AdminCreateUserPayload, AdminUpdateUserPayload, AdminUpdateUserStatusPayload } from "~/types/admin"
import { adminUsersQueryKeys } from "./useAdminUsersQueries"

export const adminUserDetailQueryKey = (userId: number) => ["admin-users", "detail", userId] as const

export function useAdminUserDetailQuery(userId: MaybeRef<number | null>) {
  return useQuery({
    queryKey: computed(() => adminUserDetailQueryKey(unref(userId) ?? 0)),
    enabled: computed(() => Boolean(unref(userId))),
    queryFn: async () => {
      const id = unref(userId)
      if (!id) throw new Error("Thiếu userId")
      const response = await adminService.getUserDetail(id)
      return response.data.data
    },
    staleTime: 30 * 1000,
  })
}

export function useAdminCreateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AdminCreateUserPayload) => {
      const response = await adminService.createUser(payload)
      return response.data.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminUsersQueryKeys.all })
    },
  })
}

export function useAdminUpdateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { userId: number; data: AdminUpdateUserPayload }) => {
      const response = await adminService.updateUser(payload.userId, payload.data)
      return response.data.data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: adminUsersQueryKeys.all })
      await queryClient.invalidateQueries({ queryKey: adminUserDetailQueryKey(data.id) })
    },
  })
}

export function useAdminUpdateUserStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { userId: number; data: AdminUpdateUserStatusPayload }) => {
      const response = await adminService.updateUserStatus(payload.userId, payload.data)
      return response.data.data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: adminUsersQueryKeys.all })
      await queryClient.invalidateQueries({ queryKey: adminUserDetailQueryKey(data.id) })
    },
  })
}
