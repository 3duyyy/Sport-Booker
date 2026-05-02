import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { userService, type UpdateProfilePayload } from "~/services/userService"

export const userQueryKeys = {
  all: ["user"] as const,
  profile: () => [...userQueryKeys.all, "profile"] as const,
}

export function useUserProfileQuery() {
  return useQuery({
    queryKey: userQueryKeys.profile(),
    queryFn: async () => {
      const response = await userService.getMe()
      return response.data.data
    },
    // Tránh việc nó gọi lại API quá nhiều lần khi user chuyển tab liên tục
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateUserProfileMutation() {
  const queryClient = useQueryClient()
  const authStore = useAuthStore()

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const response = await userService.updateMe(payload)
      return response.data.data
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() })

      if (authStore.user) {
        authStore.setUser({
          ...authStore.user,
          fullName: updatedUser.fullName,
          phone: updatedUser.phone,
          avatarUrl: updatedUser.avatarUrl,
          bankName: updatedUser.bankName,
          bankAccount: updatedUser.bankAccount,
          accountHolder: updatedUser.accountHolder,
        })
      }
    },
  })
}
