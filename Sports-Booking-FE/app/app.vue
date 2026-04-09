<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster rich-colors position="bottom-left" />
</template>
<script setup lang="ts">
import { Toaster } from "vue-sonner"
import "vue-sonner/style.css"

useSeoMeta({
  title: "Sport Booker",
  description: "Đặt sân thể thao online nhanh chóng, tiện lợi",
})
</script>
