<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "admin",
})
await navigateTo("/admin/dashboard", { replace: true })
</script>

<style scoped></style>
