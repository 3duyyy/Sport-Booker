export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()

  if (import.meta.server) return

  const token = localStorage.getItem("access_token")

  if (!token) {
    return navigateTo("/")
  }

  if (!authStore.isAuthenticated || authStore.user?.roleId !== 1) {
    return navigateTo("/")
  }
})
