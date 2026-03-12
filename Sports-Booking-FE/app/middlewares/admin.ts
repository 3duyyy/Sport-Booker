export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (import.meta.client) {
    const token = localStorage.getItem("access_token")

    if (!token || authStore.user?.roleId !== 1) return navigateTo("/")
  }

  if (import.meta.server && (authStore.user?.roleId !== 1 || !authStore.isAuthenticated)) {
    return navigateTo("/")
  }
})
