export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()

  if (import.meta.server) return

  const token = localStorage.getItem("access_token")

  if (!token) {
    return navigateTo("/")
  }

  let roleId: number | undefined = authStore.user?.roleId
  if (roleId === undefined) {
    try {
      const rawUser = localStorage.getItem("user")
      if (rawUser) roleId = (JSON.parse(rawUser) as { roleId?: number }).roleId
    } catch {
      roleId = undefined
    }
  }

  if (roleId !== 1) {
    return navigateTo("/")
  }
})
