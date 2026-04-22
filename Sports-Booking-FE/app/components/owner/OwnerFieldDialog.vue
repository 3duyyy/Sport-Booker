<template>
  <v-dialog :model-value="open" max-width="680" persistent @update:model-value="emit('close')">
    <v-card rounded="xl">
      <v-card-title class="d-flex justify-space-between align-center">
        <span>{{ title }}</span>
        <v-btn icon variant="text" @click="emit('close')"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-divider />

      <v-card-text class="pt-4">
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="name" v-bind="nameProps" label="Tên sân" variant="outlined" :readonly="isViewMode" />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="description"
              v-bind="descriptionProps"
              label="Mô tả"
              rows="3"
              variant="outlined"
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
              variant="outlined"
              :readonly="isViewMode"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-end pa-4">
        <v-btn variant="tonal" @click="emit('close')">Đóng</v-btn>
        <v-btn v-if="!isViewMode" color="success" variant="flat" :loading="saving" @click="onSubmit">
          {{ mode === "create" ? "Thêm sân" : "Lưu thay đổi" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { ownerFieldSchema } from "~/schemas/ownerFacilitySchema"
import type { OwnerFieldUpsertPayload } from "~/types/owner"

type FieldDialogModel = {
  name: string
  description: string
  status: "active" | "maintenance" | "inactive"
}

const props = withDefaults(
  defineProps<{
    open: boolean
    mode: "create" | "edit" | "view"
    saving?: boolean
    initialData?: FieldDialogModel | null
  }>(),
  {
    saving: false,
    initialData: null,
  },
)

const emit = defineEmits<{
  (e: "close"): void
  (e: "submit", payload: OwnerFieldUpsertPayload): void
}>()

const isViewMode = computed(() => props.mode === "view")
const title = computed(() =>
  props.mode === "create" ? "Thêm sân con" : props.mode === "edit" ? "Cập nhật sân con" : "Chi tiết sân con",
)

const statusOptions = [
  { label: "Hoạt động", value: "active" },
  { label: "Bảo trì", value: "maintenance" },
  { label: "Tạm ngưng", value: "inactive" },
]

const { handleSubmit, defineField, resetForm, setFieldError } = useForm({
  validationSchema: toTypedSchema(ownerFieldSchema),
  initialValues: {
    name: "",
    description: "",
    status: "active",
  },
})

const vuetifyConfig = (state: any) => ({ props: { "error-messages": state.touched ? state.errors : [] } })

const [name, nameProps] = defineField("name", vuetifyConfig)
const [description, descriptionProps] = defineField("description", vuetifyConfig)
const [status, statusProps] = defineField("status", vuetifyConfig)

watch(
  () => [props.open, props.mode, props.initialData] as const,
  () => {
    if (!props.open) {
      resetForm()
      return
    }

    if (props.initialData) {
      resetForm({
        values: {
          name: props.initialData.name ?? "",
          description: props.initialData.description ?? "",
          status: props.initialData.status ?? "active",
        },
      })
      return
    }

    resetForm({
      values: {
        name: "",
        description: "",
        status: "active",
      },
    })
  },
  { immediate: true },
)

const onSubmit = handleSubmit((v) => {
  if (isViewMode.value) return

  const normalizedName = v.name.trim()
  if (normalizedName.length < 2) {
    setFieldError("name", "Tên sân tối thiểu 2 ký tự")
    return
  }

  emit("submit", {
    name: normalizedName,
    description: v.description?.trim() || "",
    status: v.status,
  })
})
</script>
