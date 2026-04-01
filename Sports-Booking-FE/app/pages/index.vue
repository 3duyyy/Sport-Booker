<script setup lang="ts">
import { toast } from "vue-sonner"
import type { FacilityItem } from "~/types/facility"

useHead({
  title: "Trang chủ | SportBooker",
})

const router = useRouter()

const keyword = ref("")
const bookingDate = ref("")

const handleSearch = () => {
  toast.success("Đã nhận thông tin tìm kiếm")
  console.log({
    keyword: keyword.value,
    bookingDate: bookingDate.value,
  })
}

const handleBookFacility = (facility: FacilityItem) => {
  toast.success(`Chọn sân: ${facility.name}`)
  router.push("/")
}

const handleRegisterOwner = () => {
  toast.success("Chuyển đến trang đăng ký chủ sân")
}

const handleLearnMore = () => {
  toast.info("Hiển thị thêm thông tin dành cho chủ sân")
}
</script>

<template>
  <div class="container-layout home-page">
    <v-container max-width="1280">
      <home-hero-section v-model:keyword="keyword" v-model:bookingDate="bookingDate" @search="handleSearch" />

      <home-popular-sports />

      <home-featured-facilities @book="handleBookFacility" />

      <home-partner-section @register-owner="handleRegisterOwner" @learn-more="handleLearnMore" />
    </v-container>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f5f7f6;
}
</style>
