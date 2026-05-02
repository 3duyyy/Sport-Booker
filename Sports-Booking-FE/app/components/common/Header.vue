<script setup lang="ts">
import { computed, ref } from "vue"
import { storeToRefs } from "pinia"
import { useAuthStore } from "~/stores/auth.store"
import {
  mdiAccount,
  mdiAccountCircleOutline,
  mdiAccountOutline,
  mdiBellOutline,
  mdiCalendarCheckOutline,
  mdiClose,
  mdiLogout,
  mdiMagnify,
  mdiMenu,
  mdiShieldCheckOutline,
  mdiSoccer,
  mdiWeatherNight,
  mdiWeatherSunny,
} from "@mdi/js"

const authStore = useAuthStore()
const { isAuthenticated, user } = storeToRefs(authStore)

const searchQuery = ref("")
const mobileDrawer = ref(false)

const isDark = useDark()
const toggleDark = useToggle(isDark)

const toggleTheme = () => {
  toggleDark()
}

const navigationUnauth = [
  { name: "Trang chủ", to: "/" },
  { name: "Tìm sân", to: "/search-facilities" },
  { name: "Hỗ trợ", to: "/ho-tro" },
]

const navigationAuth = computed(() => {
  return [
    { name: "Trang chủ", to: "/" },
    { name: "Tìm sân", to: "/search-facilities" },
    { name: "Lịch đặt của tôi", to: "/my-bookings" },
    { name: "Sân của tôi", to: "/owner" },
  ]
})

const navigationItems = computed(() => {
  return isAuthenticated.value ? navigationAuth.value : navigationUnauth
})

const handleLogout = () => {
  authStore.clearAuth?.()
  navigateTo("/auth/login")
}
</script>

<template>
  <div>
    <v-app-bar elevation="0" color="white" height="76" class="app-header border-b">
      <v-container max-width="1280" class="px-4 px-md-6 d-flex align-center justify-space-between">
        <!-- Left -->
        <div class="d-flex align-center ga-4 ga-md-6 min-w-0">
          <NuxtLink to="/" class="logo-link d-flex align-center ga-3 text-decoration-none">
            <div class="logo-mark">
              <v-icon size="25" color="success" :icon="mdiShieldCheckOutline" />
            </div>

            <div class="logo-text-wrap">
              <span class="logo-text">SportBooker</span>
            </div>
          </NuxtLink>

          <div class="header-search d-none">
            <v-text-field
              v-model="searchQuery"
              density="comfortable"
              variant="solo-filled"
              flat
              hide-details
              rounded="pill"
              :prepend-inner-icon="mdiMagnify"
              placeholder="Tìm kiếm..."
              class="search-field"
            />
          </div>
        </div>

        <nav class="nav-desktop d-none d-lg-flex align-center">
          <NuxtLink v-for="item in navigationItems" :key="item.to" :to="item.to" class="nav-link" active-class="nav-link-active">
            {{ item.name }}
          </NuxtLink>
        </nav>

        <div class="d-flex align-center ga-2 ga-md-3">
          <template v-if="!isAuthenticated">
            <div class="d-none d-md-flex align-center ga-2">
              <NuxtLink to="/auth/register" class="text-decoration-none">
                <v-btn variant="text" class="text-none font-weight-bold"> Đăng ký </v-btn>
              </NuxtLink>

              <NuxtLink to="/auth/login" class="text-decoration-none">
                <v-btn color="success" rounded="lg" class="text-none font-weight-bold px-5"> Đăng nhập </v-btn>
              </NuxtLink>
            </div>

            <v-btn icon variant="tonal" color="success" class="d-none d-md-inline-flex">
              <v-icon :icon="mdiAccountOutline" />
            </v-btn>
          </template>

          <template v-else>
            <v-btn icon variant="text" class="action-btn d-none d-md-inline-flex" @click="toggleTheme">
              <v-icon :icon="isDark ? mdiWeatherSunny : mdiWeatherNight" />
            </v-btn>

            <v-btn icon variant="text" class="action-btn d-none d-md-inline-flex">
              <v-badge dot color="error" offset-x="3" offset-y="3">
                <v-icon :icon="mdiBellOutline" />
              </v-badge>
            </v-btn>

            <v-menu location="bottom end" offset="10">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon variant="text" class="avatar-btn">
                  <v-avatar size="42" color="grey-lighten-3">
                    <v-img v-if="user?.avatarUrl" :src="user.avatarUrl" alt="Avatar" cover />
                    <v-icon v-else :icon="mdiAccount" color="grey-darken-1" />
                  </v-avatar>
                </v-btn>
              </template>

              <v-card min-width="240" rounded="xl" elevation="8">
                <v-list class="py-2">
                  <v-list-item>
                    <template #prepend>
                      <v-avatar size="38" color="grey-lighten-3">
                        <v-img v-if="user?.avatarUrl" :src="user.avatarUrl" alt="Avatar" cover />
                        <v-icon v-else :icon="mdiAccount" color="grey-darken-1" />
                      </v-avatar>
                    </template>

                    <v-list-item-title class="font-weight-bold">
                      {{ user?.fullName || "Người dùng" }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ user?.email || "Tài khoản SportBooker" }}
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-divider class="my-2" />

                  <v-list-item :prepend-icon="mdiAccountCircleOutline" title="Thông tin cá nhân" to="/profile" rounded="lg" />
                  <v-list-item :prepend-icon="mdiCalendarCheckOutline" title="Lịch đặt của tôi" to="/lich-dat" rounded="lg" />
                  <v-list-item :prepend-icon="mdiSoccer" title="Sân của tôi" to="/san-cua-toi" rounded="lg" />

                  <v-divider class="my-2" />

                  <v-list-item :prepend-icon="mdiLogout" title="Đăng xuất" rounded="lg" @click="handleLogout" />
                </v-list>
              </v-card>
            </v-menu>
          </template>

          <!-- Mobile menu -->
          <v-btn icon variant="text" class="d-inline-flex d-lg-none" @click="mobileDrawer = !mobileDrawer">
            <v-icon :icon="mdiMenu" />
          </v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <!-- Mobile drawer -->
    <v-navigation-drawer v-model="mobileDrawer" location="right" temporary width="300">
      <div class="pa-4">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="d-flex align-center ga-3">
            <div class="logo-mark">
              <v-icon size="20" color="success" :icon="mdiShieldCheckOutline" />
            </div>
            <span class="logo-text text-body-1">SportBooker</span>
          </div>

          <v-btn icon variant="text" @click="mobileDrawer = false">
            <v-icon :icon="mdiClose" />
          </v-btn>
        </div>

        <v-text-field
          v-model="searchQuery"
          density="comfortable"
          variant="solo-filled"
          flat
          hide-details
          rounded="pill"
          :prepend-inner-icon="mdiMagnify"
          placeholder="Tìm kiếm..."
          class="mb-4"
        />

        <v-list nav class="py-0">
          <v-list-item
            v-for="item in navigationItems"
            :key="item.to"
            :title="item.name"
            :to="item.to"
            rounded="lg"
            class="mb-1"
            @click="mobileDrawer = false"
          />
        </v-list>

        <div class="mt-4">
          <template v-if="!isAuthenticated">
            <div class="d-flex flex-column ga-3">
              <NuxtLink to="/register" class="text-decoration-none" @click="mobileDrawer = false">
                <v-btn block variant="outlined" rounded="lg" class="text-none font-weight-bold"> Đăng ký </v-btn>
              </NuxtLink>

              <NuxtLink to="/login" class="text-decoration-none" @click="mobileDrawer = false">
                <v-btn block color="success" rounded="lg" class="text-none font-weight-bold"> Đăng nhập </v-btn>
              </NuxtLink>
            </div>
          </template>

          <template v-else>
            <v-list nav class="py-0">
              <v-list-item :prepend-icon="mdiBellOutline" title="Thông báo" rounded="lg" />
              <v-list-item
                :prepend-icon="mdiAccountCircleOutline"
                title="Tài khoản"
                to="/tai-khoan"
                rounded="lg"
                @click="mobileDrawer = false"
              />
              <v-list-item :prepend-icon="mdiLogout" title="Đăng xuất" rounded="lg" @click="handleLogout" />
            </v-list>
          </template>
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<style scoped>
.app-header {
  backdrop-filter: blur(10px);
}

.logo-link {
  min-width: fit-content;
}

.logo-mark {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e8f9ee;
  border: 1px solid #c8f0d4;
}

.logo-text-wrap {
  display: flex;
  align-items: center;
}

.logo-text {
  color: #0f172a;
  font-size: 1.9rem;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.header-search {
  width: 300px;
}

:deep(.search-field .v-field) {
  border-radius: 999px !important;
  background: #f8fafc !important;
  box-shadow: none !important;
  border: 1px solid #e5e7eb;
}

:deep(.search-field .v-field__input) {
  font-weight: 500;
}

.nav-desktop {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  gap: 4px;
}

.nav-link {
  padding: 10px 16px;
  border-radius: 12px;
  color: #475569;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 700;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.nav-link:hover {
  color: #0f172a;
  background: #f8fafc;
}

.nav-link-active {
  color: #0f172a !important;
  background: #f1f5f9;
}

.action-btn {
  color: #475569;
}

.avatar-btn {
  padding: 0 !important;
}

.border-b {
  border-bottom: 1px solid #f1f5f9;
}

@media (max-width: 1279px) {
  .header-search {
    width: 240px;
  }
}

@media (max-width: 959px) {
  .logo-text {
    font-size: 1.45rem;
  }
}
</style>
