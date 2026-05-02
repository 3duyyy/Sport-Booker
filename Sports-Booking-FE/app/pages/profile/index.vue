<template>
  <div class="container-layout">
    <v-card class="pa-5 max-w-2xl mx-auto" rounded="xl" elevation="2">
      <h2 class="text-xl font-bold mb-6">Thông tin cá nhân</h2>

      <form @submit.prevent="onSubmit">
        <!-- Upload Avatar -->
        <div class="mb-6 d-flex flex-column align-center">
          <v-avatar size="120" color="grey-lighten-2">
            <v-img v-if="previewAvatar" :src="previewAvatar" cover />
            <v-icon v-else :icon="mdiAccount" size="64" />
          </v-avatar>

          <v-btn class="mt-4 text-none" size="small" variant="outlined" @click="fileInput?.click()"> Đổi ảnh đại diện </v-btn>

          <input ref="fileInput" type="file" class="d-none" accept="image/*" @change="onFileChange" />
        </div>

        <v-text-field
          v-model="fullName"
          :error-messages="errors.fullName"
          label="Họ và tên (*)"
          variant="outlined"
          density="comfortable"
          class="mb-3"
        />
        <v-text-field
          v-model="phone"
          :error-messages="errors.phone"
          label="Số điện thoại"
          variant="outlined"
          density="comfortable"
          class="mb-3"
        />

        <v-divider class="my-5" />

        <h3 class="text-lg font-bold">Thông tin Ngân hàng</h3>
        <p class="text-sm text-gray-500 pb-3">(Phục vụ cho việc hoàn trả khi bạn hủy lịch đặt)</p>
        <v-text-field
          v-model="bankName"
          :error-messages="errors.bankName"
          label="Tên ngân hàng (VD: Vietcombank)"
          variant="outlined"
          density="comfortable"
          class="mb-3"
        />

        <v-text-field
          v-model="bankAccount"
          :error-messages="errors.bankAccount"
          label="Số tài khoản"
          variant="outlined"
          density="comfortable"
          class="mb-3"
        />

        <v-text-field
          v-model="accountHolder"
          :error-messages="errors.accountHolder"
          label="Tên chủ tài khoản"
          variant="outlined"
          density="comfortable"
          class="mb-3"
        />

        <v-btn
          type="submit"
          color="success"
          block
          size="large"
          rounded="lg"
          :loading="isUpdating || isUploading"
          class="mt-4 text-none"
        >
          Lưu thay đổi
        </v-btn>
      </form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useForm } from "vee-validate"
import { toast } from "vue-sonner"
import { axiosInstance } from "~/services/axiosInstance"
import { useUpdateUserProfileMutation, useUserProfileQuery } from "~/composables/user/useUserProfileQueries"
import { userProfileSchema } from "~/schemas/userSchema"
import { mdiAccount } from "@mdi/js"

const fileInput = ref<HTMLInputElement | null>()
const selectedFile = ref<File | null>(null)
const previewAvatar = ref("")
const isUploading = ref(false)

const { data: userProfile } = useUserProfileQuery()
const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateUserProfileMutation()

const { handleSubmit, defineField, setValues, errors } = useForm({
  validationSchema: userProfileSchema,
})

const [fullName] = defineField("fullName")
const [phone] = defineField("phone")
const [bankName] = defineField("bankName")
const [bankAccount] = defineField("bankAccount")
const [accountHolder] = defineField("accountHolder")

// Load data cũ vào Form khi query xong
watch(
  userProfile,
  (newVal) => {
    if (newVal) {
      setValues({
        fullName: newVal.fullName || "",
        phone: newVal.phone || "",
        bankName: newVal.bankName || "",
        bankAccount: newVal.bankAccount || "",
        accountHolder: newVal.accountHolder || "",
      })
      previewAvatar.value = newVal.avatarUrl || ""
    }
  },
  { immediate: true },
)

watch(previewAvatar, (newVal) => {
  console.log("previewAvatar", newVal)
})

// Xử lý Preview Ảnh
const onFileChange = (e: any) => {
  const file = e.target.files[0]
  if (!file) return
  selectedFile.value = file
  previewAvatar.value = URL.createObjectURL(file) // Tạo link ảo để preview tạm
}

// Submit Form
const onSubmit = handleSubmit(async (values) => {
  try {
    let uploadedAvatarUrl = userProfile.value?.avatarUrl

    // Nếu user có chọn file mới -> Up file lên BE lấy URL thật
    if (selectedFile.value) {
      isUploading.value = true
      const formData = new FormData()
      formData.append("image", selectedFile.value) // Phải map với 'upload.single('image')'

      const res = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      uploadedAvatarUrl = res.data.data.url
      isUploading.value = false
    }

    // Ném toàn bộ thông tin + URL ảnh (mới hoặc cũ) lên API cập nhật Profile
    const payload = {
      ...values,
      avatarUrl: uploadedAvatarUrl,
    }

    await updateProfile(payload)
    toast.success("Cập nhật thông tin thành công!")
    selectedFile.value = null
  } catch (error) {
    toast.error("Có lỗi xảy ra khi lưu thông tin!")
    isUploading.value = false
  }
})
</script>
