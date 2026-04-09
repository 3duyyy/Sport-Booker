export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const token = localStorage.getItem("access_token")
  if (!token) return

  const authStore = useAuthStore()

  let roleId: number | undefined = authStore.user?.roleId

  // fallback khi store chưa hydrate xong
  if (roleId === undefined) {
    try {
      const rawUser = localStorage.getItem("user")
      if (rawUser) {
        const parsed = JSON.parse(rawUser) as { roleId?: number }
        roleId = parsed.roleId
      }
    } catch {
      roleId = undefined
    }
  }

  // Chỉ áp dụng rule "khóa route" cho admin
  if (roleId !== 1) return

  const isAdminRoot = to.path === "/admin"
  const isAdminChild = to.path.startsWith("/admin/")
  const isAdminRoute = isAdminRoot || isAdminChild

  // Nếu admin cố vào route ngoài /admin/** thì ép về dashboard admin
  if (!isAdminRoute) {
    return navigateTo("/admin/dashboard")
  }

  // Chuẩn hóa /admin thành /admin/dashboard
  if (isAdminRoot) {
    return navigateTo("/admin/dashboard")
  }
})
