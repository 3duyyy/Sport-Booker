<template>
  <div class="d-flex justify-center mt-8">
    <v-pagination
      v-model="pageModel"
      :length="length"
      rounded="circle"
      density="comfortable"
      active-color="success"
      total-visible="7"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  length: number
}>()

const pageModel = defineModel<number>({ required: true })
</script>
