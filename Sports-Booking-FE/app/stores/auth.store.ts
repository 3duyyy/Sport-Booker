interface User {
  id: number
  email: string
  fullName: string
  phone: string | null
  avatarUrl: string | null
  roleId: number
  status: string
  isVerified: boolean
}

interface AuthState {
  user: User | null
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
  }),
  getters: {
    isAuthenticated: (state): boolean => !!state.user,
    isAdmin: (state): boolean => state.user?.roleId === 1,
    isOwner: (state): boolean => state.user?.roleId === 2,
    isCustomer: (state): boolean => state.user?.roleId === 3,
  },
  actions: {
    setUser(user: User | null) {
      this.user = user
      if (import.meta.client) {
        if (user) {
          localStorage.setItem("user", JSON.stringify(user))
        } else {
          localStorage.removeItem("user")
        }
      }
    },

    clearAuth() {
      this.user = null
      if (import.meta.client) {
        localStorage.removeItem("access_token")
        localStorage.removeItem("user")
      }
    },

    initAuth() {
      if (!import.meta.client) return
      const raw = localStorage.getItem("user")
      if (raw) {
        this.user = JSON.parse(raw)
      }
    },
  },
  persist: true,
})
