<template>
  <div>
    <div class="flex flex-col items-center justify-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900 m-0 p-0">Chào mừng trở lại!</h2>
      <p class="text-gray-500">Vui lòng đăng nhập để tiếp tục đặt sân.</p>
    </div>

    <v-form @submit.prevent="onSubmit">
      <v-text-field
        v-model="email"
        v-bind="emailProps"
        label="Địa chỉ Email"
        placeholder="ví dụ: abc@gmail.com"
        variant="outlined"
        density="comfortable"
        color="primary"
        :prepend-inner-icon="mdiEmailOutline"
        class="mb-3"
      />
      <v-text-field
        v-model="password"
        v-bind="passwordProps"
        label="Mật khẩu"
        :type="showPassword ? 'text' : 'password'"
        variant="outlined"
        density="comfortable"
        color="primary"
        :prepend-inner-icon="mdiLockOutline"
        :append-inner-icon="showPassword ? mdiEyeOff : mdiEye"
        @click:append-inner="showPassword = !showPassword"
        class="mb-1"
      />

      <div class="flex justify-end mb-6">
        <NuxtLink to="/forgot-password" class="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
          Quên mật khẩu?
        </NuxtLink>
      </div>

      <v-btn type="submit" color="primary" size="x-large" block elevation="2" class="font-bold mb-6" :loading="isSubmitting">
        Đăng nhập
      </v-btn>
    </v-form>

    <p class="text-center text-gray-600">
      Chưa có tài khoản ?
      <NuxtLink to="/register" class="font-semibold text-blue-600 hover:text-blue-500 transition-colors">Đăng ký ngay</NuxtLink>
    </p>
  </div>
</template>
<script setup lang="ts">
import { mdiEmailOutline, mdiEye, mdiEyeOff, mdiLockOutline } from "@mdi/js"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { toast } from "vue-sonner"
import { loginSchema, type LoginInput } from "~/schemas/authSchema"
import { authService } from "~/services/authService"

definePageMeta({
  layout: "auth",
})

const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref<boolean>(false)

const { handleSubmit, defineField, isSubmitting } = useForm({
  validationSchema: toTypedSchema(loginSchema),
})

const vuetifyConfig = (state: any) => ({
  props: { "error-messages": state.errors },
})

const [email, emailProps] = defineField("email", vuetifyConfig)
const [password, passwordProps] = defineField("password", vuetifyConfig)

const onSubmit = handleSubmit(async (payload: LoginInput) => {
  try {
    const response = await authService.login(payload)

    localStorage.setItem("access_token", response.data.data.accessToken)
    authStore.setUser(response.data.data.user)

    if (authStore.isAdmin) router.push("/admin")
    else router.push("/")
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Email hoặc mật khẩu không đúng")
  }
})
</script>
