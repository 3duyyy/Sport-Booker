<template>
  <div class="admin-facilities-header">
    <div>
      <h1 class="admin-facilities-header__title">Quản lý sân bãi</h1>
      <p class="admin-facilities-header__desc">Theo dõi và quản lý cơ sở thể thao trên toàn hệ thống</p>
    </div>

    <v-btn color="success" rounded="lg" class="text-none"> + Thêm mới </v-btn>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.admin-facilities-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.admin-facilities-header__title {
  margin: 0;
  font-weight: 700;
  color: #0f172a;
}

.admin-facilities-header__desc {
  margin: 6px 0 0;
  font-size: 14px;
  color: #64748b;
}

@media (max-width: 768px) {
  .admin-facilities-header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
