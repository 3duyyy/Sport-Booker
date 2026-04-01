<!-- Breadcrumbs động có thể custom thủ công hoặc auto theo router -->
<template>
  <v-breadcrumbs :items="computedItems" class="px-0 py-2">
    <template #divider>
      <v-icon size="16" :icon="mdiChevronRight"></v-icon>
    </template>

    <template #item="{ item }">
      <NuxtLink v-if="item.to && !item.disabled" :to="item.to" class="text-sm font-medium text-primary hover:underline">
        {{ item.title }}
      </NuxtLink>

      <span v-else class="text-sm text-slate-500">
        {{ item.title }}
      </span>
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
import { mdiChevronRight } from "@mdi/js"
import { computed } from "vue"
import { useRoute } from "vue-router"

interface BreadcrumbItem {
  title: string
  to?: string
  disabled?: boolean
}

const props = defineProps<{
  items?: BreadcrumbItem[]
  auto?: boolean
}>()

const route = useRoute()

const routeMap: Record<string, string> = {
  "/": "Trang chủ",
  "/tim-san": "Tìm sân",
  "/checkout": "Thanh toán",
  "/booking-history": "Lịch sử đặt sân",
}

const autoItems = computed<BreadcrumbItem[]>(() => {
  const pathSegments = route.path.split("/").filter(Boolean)

  const items: BreadcrumbItem[] = [{ title: "Trang chủ", to: "/" }]

  let currentPath = ""

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`

    items.push({
      title: routeMap[currentPath] || segment,
      to: index === pathSegments.length - 1 ? undefined : currentPath,
      disabled: index === pathSegments.length - 1,
    })
  })

  return items
})

const computedItems = computed(() => {
  if (props.items && props.items.length) return props.items
  if (props.auto) return autoItems.value
  return []
})
</script>

<style scoped>
.v-breadcrumbs {
  font-size: 14px;
}
</style>
