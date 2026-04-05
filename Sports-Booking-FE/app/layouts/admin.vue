<template>
  <v-app>
    <div class="admin-layout">
      <AdminSidebar />

      <main class="admin-layout__content">
        <div class="admin-layout__inner">
          <slot />
        </div>
      </main>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import AdminSidebar from "~/components/admin/AdminSidebar.vue"
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  background: #f6f8fc;
}

.admin-layout__content {
  flex: 1;
  min-width: 0;
  padding: 24px;
}

.admin-layout__inner {
  min-height: calc(100vh - 48px);
}
</style>
