export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const token = localStorage.getItem("access_token")
  if (!token) return

  let roleId: number | undefined
  try {
    const rawUser = localStorage.getItem("user")
    if (rawUser) roleId = (JSON.parse(rawUser) as { roleId?: number }).roleId
  } catch {
    roleId = undefined
  }

  if (roleId === 1) return navigateTo("/admin/dashboard")
  return navigateTo("/")
})
