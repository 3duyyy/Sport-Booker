<template>
  <div class="container-layout bg-slate-50 !pt-0 !mt-0">
    <div class="mx-auto max-w-7xl px-4 md:px-6">
      <AppBreadcrumbs
        :items="[
          { title: 'Trang chủ', to: '/' },
          { title: 'Khu vực chủ sân', disabled: true },
        ]"
        class="mb-4"
      />

      <div v-if="!isCustomer" class="mb-6">
        <h1 class="text-2xl font-bold text-slate-900 md:text-3xl">
          {{ pageTitle }}
        </h1>

        <p class="mt-2 text-sm text-slate-500">
          {{ pageDescription }}
        </p>
      </div>

      <OwnerCustomerIntro v-if="isCustomer" />

      <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div class="lg:col-span-4 xl:col-span-3">
          <OwnerSidebar v-model="activeTab" />
        </div>

        <div class="lg:col-span-8 xl:col-span-9">
          <div v-if="activeTab === 'overview'" class="space-y-6">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <OwnerOverviewStatCard v-for="item in overviewData.stats" :key="item.key" :item="item" />
            </div>

            <div class="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div class="xl:col-span-12">
                <OwnerRecentBookingsTable :items="overviewData.recentBookings" />
              </div>

              <div class="xl:col-span-12">
                <OwnerTodayScheduleCard :items="overviewData.todaySchedule" />
              </div>
            </div>
          </div>

          <OwnerFacilitiesSection v-else-if="activeTab === 'facilities'" :items="facilities" />

          <OwnerCalendarSection
            v-else-if="activeTab === 'calendar'"
            :facility-items="calendarFacilities"
            :event-items="calendarEvents"
          />

          <OwnerCheckInSection
            v-else-if="activeTab === 'checkin'"
            :booking-items="checkInBookings"
            :history-items="checkInHistory"
          />

          <v-card v-else rounded="xl" class="border border-dashed border-slate-300 bg-white py-14 text-center shadow-none">
            <p class="text-base font-semibold text-slate-700">Tính năng này đang được hoàn thiện.</p>
            <p class="mt-2 text-sm text-slate-500">
              Trước mắt bạn có thể dùng tab Tổng quan để theo dõi nhanh hoạt động của sân.
            </p>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppBreadcrumbs from "~/components/common/AppBreadcrumbs.vue"
import {
  ownerCalendarEventsMock,
  ownerCalendarFacilitiesMock,
  ownerCheckInBookingsMock,
  ownerCheckInHistoryMock,
  ownerFacilitiesMock,
  ownerOverviewMock,
} from "~/mockData/owner.mock"
import type { OwnerSidebarKey } from "~/types/owner"

useSeoMeta({
  title: "Khu vực chủ sân",
})

definePageMeta({
  layout: "default",
})

const activeTab = ref<OwnerSidebarKey>("overview")
const userRoleName = ref<string | null>(null)
const overviewData = ownerOverviewMock
const facilities = ownerFacilitiesMock
const checkInBookings = ownerCheckInBookingsMock
const checkInHistory = ownerCheckInHistoryMock
const calendarFacilities = ownerCalendarFacilitiesMock
const calendarEvents = ownerCalendarEventsMock

const getRoleNameFromStorage = () => {
  if (!import.meta.client) return null
  try {
    const raw = localStorage.getItem("user")
    if (!raw) return null
    return JSON.parse(raw)?.role?.name ?? null
  } catch {
    return null
  }
}

const isCustomer = computed(() => userRoleName.value === "customer")

const pageTitle = computed(() => {
  return isCustomer.value ? "Trở thành chủ sân" : "Khu vực chủ sân"
})

const pageDescription = computed(() => {
  return isCustomer.value
    ? "Tạo sân đầu tiên để bắt đầu quản lý cơ sở thể thao và vận hành hoạt động kinh doanh của bạn."
    : "Theo dõi tình hình đặt sân, lịch trong ngày và quản lý cơ sở thể thao của bạn."
})

onMounted(() => {
  userRoleName.value = getRoleNameFromStorage()
})
</script>

<style scoped></style>
