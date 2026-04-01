<template>
  <div class="search-filter-section">
    <div class="search-filter-section__title">
      {{ title }}
    </div>

    <div class="search-filter-section__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<style scoped>
.search-filter-section + .search-filter-section {
  margin-top: 28px;
}

.search-filter-section__title {
  margin-bottom: 14px;
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.search-filter-section__content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
