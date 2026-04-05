<template>
  <v-card rounded="xl" elevation="0" class="financial-summary-card border border-slate-200">
    <v-card-text class="pa-5">
      <div class="text-caption font-weight-bold text-uppercase text-slate-500 mb-2">
        {{ title }}
      </div>

      <div class="text-h4 font-weight-bold text-slate-900 mb-2">
        {{ value }}
      </div>

      <div class="text-body-2 text-slate-500">
        {{ subtitle }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string
  subtitle: string
}>()
</script>

<style scoped>
.financial-summary-card {
  min-height: 148px;
}
</style>
