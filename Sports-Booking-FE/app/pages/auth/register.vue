<template>
  <div>
    <div class="flex flex-col items-center justify-center mb-8">
      <h2 class="text-3xl font-bold text-slate-900 m-0 p-0">Tạo tài khoản mới</h2>
      <p class="text-slate-500">Đăng ký để bắt đầu đặt sân và quản lý lịch chơi.</p>
    </div>

    <v-form @submit.prevent="onSubmit">
      <v-text-field
        v-model="fullName"
        v-bind="fullNameProps"
        label="Họ và tên"
        placeholder="ví dụ: Nguyễn Văn A"
        variant="outlined"
        density="comfortable"
        color="success"
        :prepend-inner-icon="mdiAccountOutline"
        class="mb-3"
      />

      <div class="grid gap-3 sm:grid-cols-2">
        <v-text-field
          v-model="email"
          v-bind="emailProps"
          label="Địa chỉ Email"
          placeholder="ví dụ: abc@gmail.com"
          variant="outlined"
          density="comfortable"
          color="success"
          :prepend-inner-icon="mdiEmailOutline"
          class="mb-3"
        />

        <v-text-field
          v-model="phone"
          v-bind="phoneProps"
          label="Số điện thoại"
          placeholder="ví dụ: 0901234567"
          variant="outlined"
          density="comfortable"
          color="success"
          :prepend-inner-icon="mdiPhoneOutline"
          class="mb-3"
        />
      </div>

      <v-text-field
        v-model="password"
        v-bind="passwordProps"
        label="Mật khẩu"
        :type="showPassword ? 'text' : 'password'"
        variant="outlined"
        density="comfortable"
        color="success"
        :prepend-inner-icon="mdiLockOutline"
        :append-inner-icon="showPassword ? mdiEyeOff : mdiEye"
        @click:append-inner="showPassword = !showPassword"
        class="mb-3"
      />

      <v-text-field
        v-model="confirmPassword"
        v-bind="confirmPasswordProps"
        label="Xác nhận mật khẩu"
        :type="showConfirmPassword ? 'text' : 'password'"
        variant="outlined"
        density="comfortable"
        color="success"
        :prepend-inner-icon="mdiShieldLockOutline"
        :append-inner-icon="showConfirmPassword ? mdiEyeOff : mdiEye"
        @click:append-inner="showConfirmPassword = !showConfirmPassword"
        class="mb-6"
      />

      <v-btn type="submit" color="success" size="x-large" block elevation="2" class="font-bold mb-6" :loading="isSubmitting">
        Đăng ký
      </v-btn>
    </v-form>

    <p class="text-center text-gray-600">
      Đã có tài khoản ?
      <NuxtLink to="/auth/login" class="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
        >Đăng nhập ngay</NuxtLink
      >
    </p>
  </div>
</template>

<script setup lang="ts">
import {
  mdiAccountOutline,
  mdiEmailOutline,
  mdiEye,
  mdiEyeOff,
  mdiLockOutline,
  mdiPhoneOutline,
  mdiShieldLockOutline,
} from "@mdi/js"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { toast } from "vue-sonner"
import { registerSchema, type RegisterInput } from "~/schemas/authSchema"
import { authService } from "~/services/authService"

definePageMeta({
  layout: "auth",
})

const authStore = useAuthStore()

const router = useRouter()

const showPassword = ref<boolean>(false)
const showConfirmPassword = ref<boolean>(false)

const { handleSubmit, defineField, isSubmitting } = useForm({
  validationSchema: toTypedSchema(registerSchema),
})

const vuetifyConfig = (state: any) => ({
  props: { "error-messages": state.errors },
})

const [fullName, fullNameProps] = defineField("fullName", vuetifyConfig)
const [email, emailProps] = defineField("email", vuetifyConfig)
const [phone, phoneProps] = defineField("phone", vuetifyConfig)
const [password, passwordProps] = defineField("password", vuetifyConfig)
const [confirmPassword, confirmPasswordProps] = defineField("confirmPassword", vuetifyConfig)

const onSubmit = handleSubmit(async (payload: RegisterInput) => {
  try {
    const { confirmPassword, ...submitData } = payload

    const res = await authService.register(submitData)

    const token = res.data.data.accessToken
    if (import.meta.client) {
      localStorage.setItem("access_token", token)
    }

    const user = res.data.data.user
    authStore.setUser(user)

    toast.success("Đăng ký thành công! Đang chuyển hướng...")
    router.push("/")
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Đăng ký thất bại, vui lòng kiểm tra lại.")
  }
})
</script>
