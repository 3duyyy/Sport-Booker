<template>
  <v-card rounded="xl" class="border border-slate-200 shadow-sm bg-white">
    <v-card-text class="pa-8">
      <div class="flex flex-col items-center text-center max-w-xl mx-auto">
        <div class="intro-icon mb-5">
          <v-icon size="40" color="success">
            {{ mdiSoccer }}
          </v-icon>
        </div>

        <h2 class="text-2xl font-bold text-slate-900">Trở thành chủ sân</h2>

        <p class="mt-3 text-sm text-slate-500 leading-7">
          Bạn hiện đang là khách hàng. Để bắt đầu quản lý cơ sở thể thao, tạo sân và nhận đặt lịch từ người chơi, hãy tạo sân đầu
          tiên của bạn ngay bây giờ.
        </p>

        <div class="mt-6 w-full space-y-3 text-left">
          <div class="intro-item">
            <v-icon size="18" color="success">{{ mdiCheckCircle }}</v-icon>
            <span>Quản lý nhiều cơ sở thể thao trong một hệ thống</span>
          </div>

          <div class="intro-item">
            <v-icon size="18" color="success">{{ mdiCheckCircle }}</v-icon>
            <span>Theo dõi lịch đặt sân theo thời gian thực</span>
          </div>

          <div class="intro-item">
            <v-icon size="18" color="success">{{ mdiCheckCircle }}</v-icon>
            <span>Quản lý thanh toán và lịch sử giao dịch</span>
          </div>

          <div class="intro-item">
            <v-icon size="18" color="success">{{ mdiCheckCircle }}</v-icon>
            <span>Nhận đánh giá từ khách hàng</span>
          </div>
        </div>

        <div class="mt-8 flex flex-col sm:flex-row gap-3">
          <v-btn color="success" rounded="xl" size="large" class="text-none px-6" @click="handleCreateFacility">
            Tạo sân mới
          </v-btn>

          <v-btn variant="outlined" rounded="xl" size="large" class="text-none px-6" @click="handleGoHome"> Về trang chủ </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { mdiSoccer, mdiCheckCircle } from "@mdi/js"

const router = useRouter()

const emit = defineEmits<{ (e: "create"): void }>()

const handleCreateFacility = () => {
  emit("create")
}

const handleGoHome = () => {
  router.push("/")
}
</script>

<style scoped>
.intro-icon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: rgba(34, 197, 94, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: rgb(71 85 105);
}
</style>
