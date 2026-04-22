<template>
  <div class="space-y-5">
    <div
      class="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h2 class="text-xl font-bold text-slate-900">Cơ sở thể thao của bạn</h2>
        <p class="mt-1 text-sm text-slate-500">Quản lý danh sách cơ sở, theo dõi trạng thái duyệt và cập nhật thông tin sân.</p>
      </div>

      <v-btn color="success" rounded="xl" class="text-none" @click="emit('create')">Tạo cụm sân mới</v-btn>
    </div>

    <div class="grid grid-cols-1 gap-3 md:grid-cols-3 border border-slate-200 bg-white shadow-sm rounded-2xl p-5">
      <v-text-field
        :model-value="keyword"
        @update:model-value="emit('update:keyword', String($event ?? ''))"
        label="Tìm theo tên/địa chỉ"
        placeholder="Nhập từ khóa..."
        variant="outlined"
        density="comfortable"
        color="success"
        hide-details
        class="col-span-2"
      />
      <v-select
        :model-value="status"
        @update:model-value="emit('update:status', $event as 'all' | 'pending_approve' | 'active' | 'inactive')"
        :items="statusOptions"
        label="Trạng thái"
        variant="outlined"
        density="comfortable"
        color="success"
        hide-details
      />
    </div>

    <v-alert v-if="errorMessage" type="error" variant="tonal" rounded="lg">{{ errorMessage }}</v-alert>

    <div v-if="loading" class="space-y-4">
      <v-skeleton-loader v-for="idx in 3" :key="idx" type="article" class="rounded-xl" />
    </div>

    <template v-else>
      <div v-if="items.length > 0" class="space-y-4">
        <OwnerFacilityCard
          v-for="facility in items"
          :key="facility.id"
          :facility="facility"
          @view="emit('view', $event)"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
        />

        <div class="flex items-center justify-between gap-3 flex-wrap">
          <p class="text-sm text-slate-500">Hiển thị {{ startItem }} - {{ endItem }} trên tổng {{ pagination.total }} cơ sở</p>
          <v-pagination
            v-model="internalPage"
            :length="pagination.totalPages"
            :total-visible="5"
            rounded="circle"
            density="comfortable"
          />
        </div>
      </div>

      <v-card v-else rounded="xl" class="border border-dashed border-slate-300 bg-white py-14 text-center shadow-none">
        <p class="text-base font-semibold text-slate-700">Không có cơ sở phù hợp.</p>
      </v-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { OwnerFacilityItem, OwnerPaginationMeta, OwnerFacilityStatus } from "~/types/owner"

const props = withDefaults(
  defineProps<{
    items: OwnerFacilityItem[]
    pagination: OwnerPaginationMeta
    keyword: string
    status: "all" | OwnerFacilityStatus
    loading?: boolean
    errorMessage?: string
  }>(),
  {
    loading: false,
    errorMessage: "",
  },
)

const emit = defineEmits<{
  (e: "update:page", page: number): void
  (e: "update:keyword", keyword: string): void
  (e: "update:status", status: "all" | OwnerFacilityStatus): void
  (e: "create"): void
  (e: "view", facilityId: number): void
  (e: "edit", facilityId: number): void
  (e: "delete", facilityId: number): void
}>()

const statusOptions = [
  { title: "Tất cả", value: "all" },
  { title: "Chờ duyệt", value: "pending_approve" },
  { title: "Đang hoạt động", value: "active" },
  { title: "Tạm ngưng", value: "inactive" },
]

const internalPage = ref(props.pagination.page)

watch(
  () => props.pagination.page,
  (v) => {
    internalPage.value = v
  },
)

watch(internalPage, (v) => {
  if (v !== props.pagination.page) emit("update:page", v)
})

const startItem = computed(() => (props.pagination.total ? (props.pagination.page - 1) * props.pagination.limit + 1 : 0))
const endItem = computed(() => Math.min(props.pagination.page * props.pagination.limit, props.pagination.total))
</script>
