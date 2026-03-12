<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <!-- Header -->
    <v-app-bar elevation="1">
      <v-app-bar-title>Sports Booker</v-app-bar-title>
      <v-spacer />
      <v-btn :icon="isDark ? mdiWhiteBalanceSunny : mdiMoonWaningCrescent" @click="toggleDark()" />
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>

    <v-footer elevation="1">
      <v-container fluid class="d-flex align-center justify-space-between">
        <span class="text-caption text-medium-emphasis"> © {{ currentYear }} Sports Booking. All rights reserved. </span>
        <span class="text-caption text-medium-emphasis"> v1.0.0 </span>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { mdiWhiteBalanceSunny, mdiMoonWaningCrescent } from "@mdi/js"

const isDark = useDark()
const toggleDark = useToggle(isDark)

const currentYear = new Date().getFullYear()
</script>
