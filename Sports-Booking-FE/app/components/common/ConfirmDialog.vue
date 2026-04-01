<template>
  <v-dialog v-model="model" max-width="500">
    <v-card rounded="xl">
      <v-card-title class="text-lg font-bold pt-5 px-5"> {{ title }} </v-card-title>

      <v-card-text class="px-5 pb-2 text-slate-600 leading-7">
        {{ message }}
      </v-card-text>

      <v-card-actions class="px-5 pb-5 pt-2 justify-end">
        <v-btn :variant="cancelVariant" :color="cancelColor" class="text-none rounded-md" @click="handleCancel">
          {{ cancelText }}
        </v-btn>

        <v-btn :variant="confirmVariant" :color="confirmColor" rounded="lg" class="text-none rounded-md" @click="handleConfirm">
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
const model = defineModel<boolean>()

const props = withDefaults(
  defineProps<{
    title?: string
    message?: string
    cancelText?: string
    confirmText?: string
    cancelColor?: string
    confirmColor?: string
    cancelVariant?: "flat" | "text" | "outlined" | "tonal" | "plain"
    confirmVariant?: "flat" | "text" | "outlined" | "tonal" | "plain"
  }>(),
  {
    title: "Xác nhận thao tác",
    message: "Bạn có chắc chắn muốn tiếp tục không?",
    cancelText: "Hủy",
    confirmText: "Xác nhận",
    cancelColor: "success",
    confirmColor: "error",
    cancelVariant: "flat",
    confirmVariant: "flat",
  },
)

const emit = defineEmits<{
  (e: "confirm"): void
  (e: "cancel"): void
}>()

function handleCancel() {
  emit("cancel")
  model.value = false
}

function handleConfirm() {
  emit("confirm")
  model.value = false
}
</script>
