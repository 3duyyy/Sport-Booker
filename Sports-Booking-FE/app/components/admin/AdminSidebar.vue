<template>
  <aside class="admin-sidebar">
    <div class="admin-sidebar__top">
      <div class="admin-sidebar__brand">
        <div class="admin-sidebar__logo">SB</div>

        <div>
          <p class="admin-sidebar__brand-title">Sport Booker</p>
          <p class="admin-sidebar__brand-subtitle">Admin Console</p>
        </div>
      </div>

      <div class="admin-sidebar__admin-card">
        <v-avatar size="44" class="admin-sidebar__avatar">
          <v-img src="https://i.pravatar.cc/100?img=12" cover />
        </v-avatar>

        <div class="min-w-0">
          <p class="admin-sidebar__admin-name">{{ userData?.fullName }}</p>
          <p class="admin-sidebar__admin-role">{{ userData?.roleId === 1 ? "Quản trị viên" : "Lỗi" }}</p>
        </div>

        <v-btn icon variant="text" size="small" class="admin-sidebar__notify-btn">
          <v-badge dot color="error" offset-x="3" offset-y="3">
            <v-icon size="20">{{ mdiBellOutline }}</v-icon>
          </v-badge>
        </v-btn>
      </div>
    </div>

    <div class="admin-sidebar__menu">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.title"
        :to="item.to"
        class="admin-sidebar__link"
        :class="{ 'admin-sidebar__link--active': isActive(item.to) }"
      >
        <v-icon size="18" class="admin-sidebar__link-icon">
          {{ item.icon }}
        </v-icon>
        <span>{{ item.title }}</span>
      </NuxtLink>
    </div>

    <div class="admin-sidebar__bottom">
      <v-btn variant="text" class="admin-sidebar__logout" prepend-icon="" @click="handleLogout">
        <template #prepend>
          <v-icon size="18">{{ mdiLogout }}</v-icon>
        </template>
        Đăng xuất
      </v-btn>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import {
  mdiBellOutline,
  mdiViewDashboardOutline,
  mdiAccountGroupOutline,
  mdiSoccerField,
  mdiCashMultiple,
  mdiCogOutline,
  mdiLogout,
  mdiCheckCircleOutline,
} from "@mdi/js"
import type { User } from "~/stores/auth.store"

const authStore = useAuthStore()

const route = useRoute()
const userData = ref<User | null>(null)

const menuItems = computed(() => [
  {
    title: "Tổng quan",
    to: "/admin/dashboard",
    icon: mdiViewDashboardOutline,
  },
  {
    title: "Người dùng",
    to: "/admin/users",
    icon: mdiAccountGroupOutline,
  },
  {
    title: "Sân bãi",
    to: "/admin/facilities",
    icon: mdiSoccerField,
  },
  {
    title: "Xác minh thanh toán",
    to: "/admin/payment-verifications",
    icon: mdiCheckCircleOutline,
  },
  {
    title: "Tài chính",
    to: "/admin/financials",
    icon: mdiCashMultiple,
  },
  {
    title: "Cài đặt",
    to: "/admin/settings",
    icon: mdiCogOutline,
  },
])

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(`${path}/`)
}

const getUserDataFromStorage = () => {
  if (!import.meta.client) return null
  try {
    const raw = localStorage.getItem("user")
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const handleLogout = () => {
  authStore.clearAuth?.()
  navigateTo("/auth/login")
}

onMounted(() => {
  userData.value = getUserDataFromStorage()
})
</script>

<style scoped>
.admin-sidebar {
  width: 320px;
  min-width: 320px;
  min-height: 100vh;
  background: linear-gradient(180deg, #0f172a 0%, #111827 100%);
  color: white;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 20px 16px;
}

.admin-sidebar__top {
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.admin-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.admin-sidebar__logo {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 14px;
  background: linear-gradient(135deg, #4caf50 0%, #4caf59 100%);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.28);
}

.admin-sidebar__brand-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.admin-sidebar__brand-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
  margin: 0;
}

.admin-sidebar__admin-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.06);
}

.admin-sidebar__avatar {
  flex-shrink: 0;
}

.admin-sidebar__admin-name {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.admin-sidebar__admin-role {
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.68);
}

.admin-sidebar__notify-btn {
  margin-left: auto;
  color: white;
}

.admin-sidebar__menu {
  flex: 1;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.admin-sidebar__link {
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 14px;
  color: rgba(255, 255, 255, 0.76);
  text-decoration: none;
  transition: all 0.2s ease;
}

.admin-sidebar__link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.admin-sidebar__link--active {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.22) 0%, rgba(29, 78, 216, 0.28) 100%);
  color: white;
  box-shadow: inset 0 0 0 1px rgba(96, 165, 250, 0.18);
}

.admin-sidebar__link-icon {
  flex-shrink: 0;
}

.admin-sidebar__bottom {
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.admin-sidebar__logout {
  justify-content: flex-start;
  width: 100%;
  color: rgba(255, 255, 255, 0.76);
  text-transform: none;
  border-radius: 14px;
}

.admin-sidebar__logout:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}
</style>
