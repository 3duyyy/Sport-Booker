<template>
  <div
    v-if="!overlay"
    class="app-loading"
    :class="{
      'app-loading--fullscreen': fullscreen,
      'app-loading--inline': !fullscreen,
    }"
    :style="wrapperStyles"
  >
    <div class="app-loading__content" :class="{ 'app-loading__content--card': card }">
      <v-progress-circular :size="size" :width="5" indeterminate color="primary" />

      <div v-if="title" class="app-loading__title">
        {{ title }}
      </div>

      <div v-if="description" class="app-loading__description">
        {{ description }}
      </div>
    </div>
  </div>

  <v-overlay
    v-else
    :model-value="visible"
    :persistent="persistent"
    :scrim="scrim"
    class="app-loading-overlay"
    content-class="app-loading-overlay__content"
  >
    <div class="app-loading__content" :class="{ 'app-loading__content--card': card }">
      <v-progress-circular :size="size" :width="5" indeterminate color="primary" />

      <div v-if="title" class="app-loading__title">
        {{ title }}
      </div>

      <div v-if="description" class="app-loading__description">
        {{ description }}
      </div>
    </div>
  </v-overlay>
</template>

<script setup lang="ts">
import { computed } from "vue"

interface Props {
  visible?: boolean
  overlay?: boolean
  fullscreen?: boolean
  persistent?: boolean
  card?: boolean
  scrim?: string | boolean
  title?: string
  description?: string
  minHeight?: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  visible: true,
  overlay: false,
  fullscreen: false,
  persistent: true,
  card: true,
  scrim: "rgba(15, 23, 42, 0.32)",
  title: "Đang tải dữ liệu...",
  description: "Vui lòng chờ trong giây lát",
  minHeight: "220px",
  size: 52,
})

const wrapperStyles = computed(() => {
  if (props.fullscreen) return {}

  return {
    minHeight: props.minHeight,
  }
})
</script>

<style scoped>
.app-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.app-loading--fullscreen {
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(4px);
}

.app-loading--inline {
  border-radius: 20px;
}

.app-loading__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
  padding: 24px;
}

.app-loading__content--card {
  min-width: 260px;
  max-width: 360px;
  border: 1px solid rgba(226, 232, 240, 1);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.app-loading__title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.6;
  color: rgb(15, 23, 42);
}

.app-loading__description {
  font-size: 14px;
  line-height: 1.6;
  color: rgb(100, 116, 139);
}

.app-loading-overlay :deep(.v-overlay__scrim) {
  opacity: 1 !important;
}

.app-loading-overlay__content {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
