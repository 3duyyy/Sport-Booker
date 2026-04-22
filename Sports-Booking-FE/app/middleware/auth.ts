export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) {
    authStore.initAuth()
  }

  const token = localStorage.getItem("access_token")
  if (!token) return navigateTo("/auth/login")
})
