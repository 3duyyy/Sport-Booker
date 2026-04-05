// Protect 1 số route cần auth
export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (import.meta.client) {
    const token = localStorage.getItem("access_token")
    if (!token) return navigateTo("/auth/login")
  }

  if (import.meta.server && !authStore.isAuthenticated) {
    return navigateTo("/auth/login")
  }
})
