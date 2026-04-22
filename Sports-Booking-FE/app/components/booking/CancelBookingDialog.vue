<template>
  <v-dialog v-model="model" max-width="560">
    <v-card rounded="xl">
      <v-card-title class="text-lg font-bold pt-5 px-5"> Xác nhận hủy lịch đặt </v-card-title>

      <v-card-text class="px-5 pb-2">
        <p class="text-slate-600 mb-3">Bạn sắp hủy lịch {{ bookingCode ? "#" + bookingCode : "" }}. Vui lòng nhập lý do hủy.</p>

        <v-textarea
          v-model="reason"
          label="Lý do hủy"
          placeholder="Ví dụ: Bận việc đột xuất, không thể tham gia đúng giờ..."
          variant="outlined"
          rows="3"
          counter="500"
          :error-messages="reasonError ? [reasonError] : []"
        />
      </v-card-text>

      <v-card-actions class="px-5 pb-5 pt-2 justify-end">
        <v-btn color="success" variant="flat" class="text-none rounded-md" @click="handleCancel"> Đóng </v-btn>

        <v-btn color="error" variant="flat" class="text-none rounded-md" :loading="isLoading" @click="handleConfirm">
          Xác nhận hủy
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const model = defineModel<boolean>({ default: false })

const props = withDefaults(
  defineProps<{
    bookingCode?: string
    isLoading?: boolean
  }>(),
  {
    bookingCode: "",
    isLoading: false,
  },
)

const emit = defineEmits<{
  (e: "submit", payload: { reason: string }): void
  (e: "cancel"): void
}>()

const reason = ref("")
const reasonError = ref("")

watch(
  () => model.value,
  (open) => {
    if (open) {
      reason.value = ""
      reasonError.value = ""
    }
  },
)

function handleCancel() {
  emit("cancel")
  model.value = false
}

function handleConfirm() {
  const value = reason.value.trim()

  if (!value) {
    reasonError.value = "Vui lòng nhập lý do hủy"
    return
  }

  if (value.length > 500) {
    reasonError.value = "Lý do hủy tối đa 500 ký tự"
    return
  }

  emit("submit", { reason: value })
}
</script>
