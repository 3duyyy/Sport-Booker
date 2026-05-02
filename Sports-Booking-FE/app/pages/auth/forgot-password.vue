<template>
  <div class="max-w-md mx-auto mt-10">
    <h2 class="text-2xl font-bold mb-4 text-center">Quên mật khẩu</h2>

    <v-form v-if="step === 1" @submit.prevent="onSendOtp">
      <v-text-field
        v-model="emailInput"
        label="Nhập email của bạn"
        variant="outlined"
        color="success"
        class="mb-4"
        :error-messages="emailError"
      />
      <v-btn type="submit" color="success" block size="large" :loading="isLoading"> Nhận mã OTP </v-btn>
    </v-form>

    <v-form v-if="step === 2" @submit.prevent="onVerifyOtp">
      <p class="text-sm text-gray-500 mb-4 text-center">
        Mã OTP đã được gửi đến: <b>{{ emailInput }}</b>
      </p>
      <v-text-field
        v-model="otpInput"
        label="Nhập mã OTP (6 số)"
        variant="outlined"
        color="success"
        class="mb-4"
        :error-messages="otpError"
      />
      <v-btn type="submit" color="success" block size="large" :loading="isLoading"> Xác nhận OTP </v-btn>
    </v-form>

    <v-form v-if="step === 3" @submit.prevent="onResetPassword">
      <v-text-field v-model="newPassword" label="Mật khẩu mới" type="password" variant="outlined" color="success" class="mb-4" />
      <v-text-field
        v-model="confirmPassword"
        label="Xác nhận mật khẩu mới"
        type="password"
        variant="outlined"
        color="success"
        class="mb-4"
        :error-messages="resetError"
      />
      <v-btn type="submit" color="success" block size="large" :loading="isLoading"> Đổi mật khẩu </v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { toast } from "vue-sonner"
import { authService } from "~/services/authService"

definePageMeta({ layout: "auth" })
const router = useRouter()

const step = ref(1)
const isLoading = ref(false)

const emailInput = ref("")
const emailError = ref("")

const otpInput = ref("")
const otpError = ref("")

const newPassword = ref("")
const confirmPassword = ref("")
const resetError = ref("")

const onSendOtp = async () => {
  if (!emailInput.value) return (emailError.value = "Vui lòng nhập email")

  try {
    isLoading.value = true
    await authService.forgotPassword(emailInput.value)
    toast.success("Mã OTP đã được gửi!")
    step.value = 2
  } catch (error: any) {
    emailError.value = error.response?.data?.message || "Lỗi gửi email"
  } finally {
    isLoading.value = false
  }
}

const onVerifyOtp = async () => {
  if (otpInput.value.length !== 6) return (otpError.value = "OTP phải gồm 6 số")

  try {
    isLoading.value = true
    await authService.verifyOtp(emailInput.value, otpInput.value)
    toast.success("OTP hợp lệ!")
    step.value = 3
  } catch (error: any) {
    otpError.value = error.response?.data?.message || "OTP không hợp lệ"
  } finally {
    isLoading.value = false
  }
}

const onResetPassword = async () => {
  if (newPassword.value.length < 6) return (resetError.value = "Mật khẩu tối thiểu 6 ký tự")

  if (newPassword.value !== confirmPassword.value) return (resetError.value = "Xác nhận không khớp")

  try {
    isLoading.value = true
    await authService.resetPassword({
      email: emailInput.value,
      otp: otpInput.value,
      newPassword: newPassword.value,
    })
    toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.")
    router.push("/auth/login")
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Có lỗi xảy ra")
  } finally {
    isLoading.value = false
  }
}
</script>
