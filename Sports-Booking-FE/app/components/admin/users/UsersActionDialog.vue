<template>
  <v-dialog :model-value="open" max-width="760" persistent @update:model-value="onClose">
    <v-card rounded="xl" class="pa-2">
      <v-card-title class="d-flex align-center justify-space-between">
        <span>{{ dialogTitle }}</span>
        <v-btn icon variant="text" @click="onClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pt-4">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="fullName" v-bind="fullNameProps" label="Họ tên" variant="outlined" :readonly="isViewMode" />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="email" v-bind="emailProps" label="Email" variant="outlined" :readonly="isViewMode" />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="phone" v-bind="phoneProps" label="Số điện thoại" variant="outlined" :readonly="isViewMode" />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="roleId"
              v-bind="roleIdProps"
              :items="roleOptions"
              item-title="label"
              item-value="value"
              label="Vai trò"
              :readonly="isViewMode"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="status"
              v-bind="statusProps"
              :items="statusOptions"
              item-title="label"
              item-value="value"
              label="Trạng thái"
              :readonly="isViewMode"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-switch v-model="isVerified" v-bind="isVerifiedProps" label="Đã xác minh" color="success" :disabled="isViewMode" />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="avatarUrl"
              v-bind="avatarUrlProps"
              label="Avatar URL"
              variant="outlined"
              :readonly="isViewMode"
            />
          </v-col>

          <v-col v-if="showPasswordField" cols="12">
            <v-text-field
              v-if="showPasswordField"
              v-model="password"
              v-bind="passwordProps"
              :label="mode === 'create' ? 'Mật khẩu' : 'Mật khẩu mới (không bắt buộc)'"
              :type="!showPassword ? 'password' : 'text'"
              variant="outlined"
              :readonly="isViewMode"
              :append-inner-icon="showPassword ? mdiEyeOff : mdiEye"
              @click:append-inner="showPassword = !showPassword"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4 d-flex justify-end ga-2">
        <v-btn variant="tonal" @click="onClose">Đóng</v-btn>
        <v-btn v-if="!isViewMode" color="success" variant="flat" class="bg-" :loading="submitting" @click="onSubmit">
          {{ mode === "create" ? "Tạo mới" : "Lưu thay đổi" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { mdiEye, mdiEyeOff } from "@mdi/js"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { computed, watch } from "vue"
import { adminUserActionSchema, type AdminUserActionInput } from "~/schemas/adminUserSchema"
import type {
  AdminCreateUserPayload,
  AdminUpdateUserPayload,
  AdminUserDetailItem,
  AdminUserFormMode,
  UserStatus,
} from "~/types/admin"

const props = defineProps<{
  open: boolean
  mode: AdminUserFormMode
  submitting?: boolean
  initialData?: AdminUserDetailItem | null
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "submit", payload: { createData?: AdminCreateUserPayload; updateData?: AdminUpdateUserPayload }): void
}>()

const showPassword = ref(false)

const roleOptions = [
  { label: "Admin", value: 1 },
  { label: "Chủ sân", value: 2 },
  { label: "Khách hàng", value: 3 },
]

const statusOptions: Array<{ label: string; value: UserStatus }> = [
  { label: "Hoạt động", value: "active" },
  { label: "Bị khóa", value: "banned" },
  { label: "Chờ duyệt", value: "pending_approve" },
]

const isViewMode = computed(() => props.mode === "view")
const showPasswordField = computed(() => props.mode === "create" || props.mode === "edit")
const dialogTitle = computed(() => {
  if (props.mode === "create") return "Thêm người dùng mới"
  if (props.mode === "edit") return "Chỉnh sửa người dùng"
  return "Xem người dùng"
})

const { handleSubmit, defineField, setValues, setFieldValue, resetForm } = useForm<AdminUserActionInput>({
  validationSchema: toTypedSchema(adminUserActionSchema),
  initialValues: {
    fullName: "",
    email: "",
    phone: "",
    roleId: 3,
    status: "active",
    isVerified: false,
    avatarUrl: "",
    password: "",
    requirePassword: true,
  },
})

const vuetifyConfig = (state: any) => ({
  props: { "error-messages": state.touched ? state.errors : [] },
})

const [fullName, fullNameProps] = defineField("fullName", vuetifyConfig)
const [email, emailProps] = defineField("email", vuetifyConfig)
const [phone, phoneProps] = defineField("phone", vuetifyConfig)
const [roleId, roleIdProps] = defineField("roleId", vuetifyConfig)
const [status, statusProps] = defineField("status", vuetifyConfig)
const [isVerified, isVerifiedProps] = defineField("isVerified", vuetifyConfig)
const [avatarUrl, avatarUrlProps] = defineField("avatarUrl", vuetifyConfig)
const [password, passwordProps] = defineField("password", vuetifyConfig)

watch(
  () => [props.open, props.mode, props.initialData] as const,
  () => {
    if (!props.open) {
      resetForm()
      return
    }

    const requirePassword = props.mode === "create"
    setFieldValue("requirePassword", requirePassword)

    if (props.initialData) {
      setValues({
        fullName: props.initialData.fullName,
        email: props.initialData.email,
        phone: props.initialData.phone ?? "",
        roleId: props.initialData.roleId as 1 | 2 | 3,
        status: props.initialData.status,
        isVerified: props.initialData.isVerified,
        avatarUrl: props.initialData.avatarUrl ?? "",
        password: "",
        requirePassword,
      })
    } else {
      setValues({
        fullName: "",
        email: "",
        phone: "",
        roleId: 3,
        status: "active",
        isVerified: true,
        avatarUrl: "",
        password: "",
        requirePassword,
      })
    }
  },
  { immediate: true },
)

const onSubmit = handleSubmit((values) => {
  if (isViewMode.value) return

  const base = {
    roleId: values.roleId,
    email: values.email.trim().toLowerCase(),
    fullName: values.fullName.trim(),
    ...(values.phone?.trim() ? { phone: values.phone.trim() } : {}),
    ...(values.avatarUrl?.trim() ? { avatarUrl: values.avatarUrl.trim() } : {}),
    status: values.status,
    isVerified: values.isVerified,
  }

  if (props.mode === "create") {
    emit("submit", {
      createData: {
        ...base,
        password: values.password!,
      },
    })
    return
  }

  emit("submit", {
    updateData: {
      ...base,
      ...(values.password?.trim() ? { password: values.password.trim() } : {}),
    },
  })
})

const onClose = () => emit("close")
</script>
