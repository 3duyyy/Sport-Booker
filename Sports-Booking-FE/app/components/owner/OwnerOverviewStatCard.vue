<template>
  <v-card rounded="xl" class="border border-slate-200 shadow-sm h-100">
    <v-card-text class="pa-4">
      <div class="flex items-start justify-between gap-4">
        <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
          <v-icon :icon="item.icon" size="22" class="text-primary" />
        </div>

        <v-chip size="small" rounded="pill" variant="flat" :color="chipColor" class="font-medium">
          {{ item.changeText }}
        </v-chip>
      </div>

      <p class="mt-4 text-sm font-medium text-slate-500">
        {{ item.title }}
      </p>

      <p class="mt-2 text-2xl font-bold text-slate-900">
        {{ item.value }}
      </p>

      <p v-if="item.subtitle" class="mt-1 text-xs text-slate-400">
        {{ item.subtitle }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { OwnerStatItem } from "~/types/owner"

const props = defineProps<{
  item: OwnerStatItem
}>()

const chipColor = computed(() => {
  if (props.item.changeText?.toLowerCase().includes("cần")) return "orange"
  return "success"
})
</script>

<style scoped>
.h-100 {
  height: 100%;
}
</style>
