<template>
  <v-card rounded="xl" elevation="0" class="admin-users-card">
    <v-card-text class="pa-5">
      <v-table class="admin-table">
        <thead>
          <tr>
            <th>Người dùng</th>
            <th>Liên hệ</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Đã xác minh</th>
            <th>Ngày tạo</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="user in items" :key="user.id">
            <td>
              <div class="user-cell">
                <v-avatar size="40">
                  <v-img :src="user.avatarUrl || fallbackAvatar" cover />
                </v-avatar>

                <div>
                  <p class="user-name">{{ user.fullName }}</p>
                  <p class="user-id">ID: {{ user.id }}</p>
                </div>
              </div>
            </td>

            <td>
              <div class="contact-cell">
                <p>{{ user.email }}</p>
                <p>{{ user.phone || "-" }}</p>
              </div>
            </td>

            <td>
              <v-chip size="small" rounded="lg" variant="tonal" class="font-weight-medium">
                {{ getRoleLabel(user.roleId) }}
              </v-chip>
            </td>

            <td>
              <v-chip size="small" rounded="lg" :color="getStatusColor(user.status)" variant="flat" class="font-weight-medium">
                {{ getStatusLabel(user.status) }}
              </v-chip>
            </td>

            <td>
              <v-chip
                size="small"
                rounded="lg"
                :color="user.isVerified ? 'success' : 'grey'"
                :variant="user.isVerified ? 'tonal' : 'outlined'"
                class="font-weight-medium"
              >
                {{ user.isVerified ? "Đã xác minh" : "Chưa xác minh" }}
              </v-chip>
            </td>

            <td class="created-at-cell">
              {{ formatDate(user.createdAt) }}
            </td>

            <td>
              <div class="actions">
                <v-tooltip text="Xem chi tiết" location="top" open-delay="80">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon size="small" variant="text">
                      <v-icon size="18">{{ mdiEyeOutline }}</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="Chỉnh sửa người dùng" location="top" open-delay="80">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon size="small" variant="text">
                      <v-icon size="18">{{ mdiAccountEditOutline }}</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip
                  :text="user.status === 'banned' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'"
                  location="top"
                  open-delay="80"
                >
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      size="small"
                      variant="text"
                      :color="user.status === 'banned' ? 'success' : 'error'"
                    >
                      <v-icon size="18">
                        {{ user.status === "banned" ? mdiCheckCircleOutline : mdiBlockHelper }}
                      </v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </div>
            </td>
          </tr>

          <tr v-if="items.length === 0">
            <td colspan="7" class="empty-cell">Không có người dùng</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { mdiAccountEditOutline, mdiBlockHelper, mdiCheckCircleOutline, mdiEyeOutline } from "@mdi/js"
import type { AdminUserListItem, UserStatus } from "~/types/admin"

defineProps<{
  items: AdminUserListItem[]
}>()

const fallbackAvatar = "https://ui-avatars.com/api/?name=User&background=E2E8F0&color=334155"

const getRoleLabel = (roleId: number) => {
  if (roleId === 1) return "Khách hàng"
  if (roleId === 2) return "Chủ sân"
  if (roleId === 3) return "Admin"
  return "Không xác định"
}

const getStatusLabel = (status: UserStatus) => {
  if (status === "active") return "Hoạt động"
  if (status === "banned") return "Bị khóa"
  return "Chờ duyệt"
}

const getStatusColor = (status: UserStatus) => {
  if (status === "active") return "success"
  if (status === "banned") return "error"
  return "warning"
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("vi-VN")
}
</script>

<style scoped>
.admin-users-card {
  border: 1px solid #e5e7eb;
  background: #ffffff;
}

.admin-table {
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  overflow: hidden;
}

.admin-table :deep(th) {
  background: #f8fafc;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.admin-table :deep(td) {
  vertical-align: middle;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.user-id {
  margin: 4px 0 0;
  font-size: 12px;
  color: #94a3b8;
}

.contact-cell p {
  margin: 0;
  font-size: 13px;
  color: #475569;
}

.contact-cell p + p {
  margin-top: 4px;
}

.created-at-cell {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.empty-cell {
  text-align: center;
  padding: 32px 16px !important;
  color: #64748b;
  font-size: 14px;
}
</style>
