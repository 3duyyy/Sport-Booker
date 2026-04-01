<template>
  <div class="space-y-5">
    <div
      class="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h2 class="text-xl font-bold text-slate-900">Cơ sở thể thao của bạn</h2>
        <p class="mt-1 text-sm text-slate-500">Quản lý danh sách cơ sở, theo dõi trạng thái duyệt và cập nhật thông tin sân.</p>
      </div>

      <v-btn color="success" rounded="xl" class="text-none" to="/chu-san/co-so/tao-moi"> Tạo sân mới </v-btn>
    </div>

    <div v-if="items.length > 0" class="space-y-4">
      <OwnerFacilityCard v-for="facility in items" :key="facility.id" :facility="facility" />
    </div>

    <v-card v-else rounded="xl" class="border border-dashed border-slate-300 bg-white py-14 text-center shadow-none">
      <p class="text-base font-semibold text-slate-700">Bạn chưa có cơ sở thể thao nào.</p>

      <p class="mt-2 text-sm text-slate-500">Hãy tạo cơ sở đầu tiên để bắt đầu quản lý sân và nhận đặt lịch từ khách hàng.</p>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { OwnerFacilityItem } from "~/types/owner"

defineProps<{
  items: OwnerFacilityItem[]
}>()
</script>

<style scoped></style>
