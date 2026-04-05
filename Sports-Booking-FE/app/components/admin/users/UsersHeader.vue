<template>
  <div class="admin-users-header">
    <div>
      <h1 class="admin-users-header__title">Quản lý người dùng</h1>
      <p class="admin-users-header__desc">Quản lý tài khoản trong hệ thống</p>
    </div>

    <v-btn color="success" rounded="lg" class="text-none"> + Thêm mới </v-btn>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.admin-users-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.admin-users-header__title {
  margin: 0;
  font-weight: 700;
  color: #0f172a;
}

.admin-users-header__desc {
  margin: 6px 0 0;
  font-size: 14px;
  color: #64748b;
}

@media (max-width: 768px) {
  .admin-users-header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
