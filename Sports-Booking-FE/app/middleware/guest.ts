export default defineNuxtRouteMiddleware(() => {
  if (import.meta.client) {
    const token = localStorage.getItem("access_token")
    if (token) return navigateTo("/")
  }
})
