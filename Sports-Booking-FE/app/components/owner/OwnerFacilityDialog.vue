<template>
  <v-dialog :model-value="open" max-width="1100" persistent @update:model-value="emit('close')">
    <v-card rounded="xl">
      <v-card-title class="d-flex justify-space-between align-center">
        <span>{{ title }}</span>
        <v-btn icon variant="text" @click="emit('close')"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-divider />

      <v-card-text>
        <v-tabs v-model="tab" color="success">
          <v-tab value="facility">Thông tin cụm sân</v-tab>
          <v-tab value="fields">Sân con và giá</v-tab>
        </v-tabs>

        <v-window v-model="tab" class="mt-4">
          <v-window-item value="facility">
            <v-row class="pt-2">
              <v-col cols="12" md="6">
                <v-text-field v-model="name" v-bind="nameProps" label="Tên cụm sân" variant="outlined" :readonly="isViewMode" />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="sportId"
                  v-bind="sportIdProps"
                  :items="sportOptions"
                  item-title="label"
                  item-value="value"
                  label="Môn thể thao"
                  variant="outlined"
                  :readonly="isViewMode"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="address" v-bind="addressProps" label="Địa chỉ" variant="outlined" :readonly="isViewMode" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="district"
                  v-bind="districtProps"
                  label="Quận/Huyện"
                  variant="outlined"
                  :readonly="isViewMode"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="city"
                  v-bind="cityProps"
                  label="Tỉnh/Thành phố"
                  variant="outlined"
                  :readonly="isViewMode"
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  v-model="openTime"
                  v-bind="openTimeProps"
                  label="Mở cửa"
                  placeholder="08:00"
                  variant="outlined"
                  :readonly="isViewMode"
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  v-model="closeTime"
                  v-bind="closeTimeProps"
                  label="Đóng cửa"
                  placeholder="22:00"
                  variant="outlined"
                  :readonly="isViewMode"
                />
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
              <v-col cols="12">
                <v-combobox
                  v-model="utilityIdsModel"
                  v-bind="utilityIdsProps"
                  :items="utilityOptions"
                  item-title="label"
                  item-value="value"
                  :return-object="false"
                  chips
                  multiple
                  clearable
                  label="Tiện ích"
                  variant="outlined"
                  :readonly="isViewMode"
                />
              </v-col>
            </v-row>
          </v-window-item>

          <v-window-item value="fields">
            <div class="d-flex justify-space-between align-center mb-3">
              <p class="text-subtitle-1 font-weight-bold mb-0">Danh sách sân con</p>
              <v-btn color="success" variant="tonal" :disabled="isViewMode" @click="emit('add-field')">Thêm sân con</v-btn>
            </div>

            <v-table density="comfortable" class="border rounded-lg">
              <thead>
                <tr>
                  <th class="text-center">Tên sân</th>
                  <th class="text-center">Trạng thái</th>
                  <th class="text-center">Số khung giá</th>
                  <th class="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="f in fields" :key="f.clientId">
                  <td>{{ f.name }}</td>
                  <td>{{ f.status }}</td>
                  <td>{{ f.pricings.length }}</td>
                  <td class="text-right">
                    <v-btn
                      size="small"
                      variant="text"
                      color="primary"
                      :disabled="isViewMode"
                      @click="emit('edit-field', f.clientId)"
                      >Sửa</v-btn
                    >
                    <v-btn
                      size="small"
                      variant="text"
                      color="warning"
                      :disabled="isViewMode"
                      @click="emit('set-prices', f.clientId)"
                      >Set giá</v-btn
                    >
                    <v-btn
                      size="small"
                      variant="text"
                      color="error"
                      :disabled="isViewMode"
                      @click="emit('delete-field', f.clientId)"
                      >Xóa</v-btn
                    >
                  </td>
                </tr>
                <tr v-if="fields.length === 0">
                  <td colspan="4" class="text-center text-medium-emphasis py-6">Chưa có sân con</td>
                </tr>
              </tbody>
            </v-table>
          </v-window-item>
        </v-window>
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-end pa-4">
        <v-btn variant="tonal" @click="emit('close')">Đóng</v-btn>
        <v-btn v-if="!isViewMode" color="success" variant="flat" :loading="saving" @click="onSubmit">
          {{ mode === "create" ? "Tạo mới" : "Lưu thay đổi" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { ownerFacilitySchema } from "~/schemas/ownerFacilitySchema"
import type { OwnerFacilityDetailItem, OwnerFacilityUpsertPayload } from "~/types/owner"

const props = withDefaults(
  defineProps<{
    open: boolean
    mode: "create" | "edit" | "view"
    saving?: boolean
    sportOptions: Array<{ label: string; value: number }>
    utilityOptions: Array<{ label: string; value: number }>
    initialData?: OwnerFacilityDetailItem | null
    fieldItems?: Array<{
      clientId: string
      id: number | null
      name: string
      status: "active" | "maintenance" | "inactive"
      pricings: Array<{ startTime: string; endTime: string; pricePerHour: number; isWeekend: boolean }>
      deleted?: boolean
    }>
  }>(),
  {
    saving: false,
    initialData: null,
    fieldItems: () => [],
  },
)

const emit = defineEmits<{
  (e: "close"): void
  (e: "submit-facility", payload: OwnerFacilityUpsertPayload): void
  (e: "add-field"): void
  (e: "edit-field", clientId: string): void
  (e: "delete-field", clientId: string): void
  (e: "set-prices", clientId: string): void
}>()

const tab = ref<"facility" | "fields">("facility")
const isViewMode = computed(() => props.mode === "view")
const title = computed(() =>
  props.mode === "create" ? "Tạo cụm sân" : props.mode === "edit" ? "Cập nhật cụm sân" : "Chi tiết cụm sân",
)
const fields = computed(() => (props.fieldItems ?? []).filter((f) => !f.deleted))

const { handleSubmit, defineField, setValues, setFieldValue, resetForm } = useForm({
  validationSchema: toTypedSchema(ownerFacilitySchema),
  initialValues: {
    name: "",
    sportId: undefined as unknown as number,
    address: "",
    district: "",
    city: "",
    openTime: "08:00",
    closeTime: "22:00",
    description: "",
    utilityIds: [] as number[],
  },
})

const vuetifyConfig = (state: any) => ({ props: { "error-messages": state.touched ? state.errors : [] } })

const [name, nameProps] = defineField("name", vuetifyConfig)
const [sportId, sportIdProps] = defineField("sportId", vuetifyConfig)
const [address, addressProps] = defineField("address", vuetifyConfig)
const [district, districtProps] = defineField("district", vuetifyConfig)
const [city, cityProps] = defineField("city", vuetifyConfig)
const [openTime, openTimeProps] = defineField("openTime", vuetifyConfig)
const [closeTime, closeTimeProps] = defineField("closeTime", vuetifyConfig)
const [description, descriptionProps] = defineField("description", vuetifyConfig)
const [utilityIds, utilityIdsProps] = defineField("utilityIds", vuetifyConfig)

const utilityIdsModel = computed<number[]>({
  get: () => (Array.isArray(utilityIds.value) ? utilityIds.value : []),
  set: (val) => {
    const normalized = Array.isArray(val)
      ? [...new Set(val.map((item) => Number(item)).filter((item) => Number.isInteger(item) && item > 0))]
      : []
    setFieldValue("utilityIds", normalized)
  },
})

watch(
  () => [props.open, props.mode, props.initialData] as const,
  () => {
    if (!props.open) {
      resetForm()
      tab.value = "facility"
      return
    }

    if (props.initialData && props.mode !== "create") {
      setValues({
        name: props.initialData.name ?? "",
        sportId: props.initialData.sportId,
        address: props.initialData.address ?? "",
        district: props.initialData.district ?? "",
        city: props.initialData.city ?? "",
        openTime: props.initialData.openTime || "08:00",
        closeTime: props.initialData.closeTime || "22:00",
        description: props.initialData.description ?? "",
        utilityIds: props.initialData.utilities.map((u) => u.id),
      })
      return
    }

    setValues({
      name: "",
      sportId: undefined as unknown as number,
      address: "",
      district: "",
      city: "",
      openTime: "08:00",
      closeTime: "22:00",
      description: "",
      utilityIds: [],
    })
  },
  { immediate: true },
)

const onSubmit = handleSubmit((v) => {
  if (isViewMode.value) return

  emit("submit-facility", {
    name: v.name.trim(),
    sportId: Number(v.sportId),
    address: v.address.trim(),
    district: v.district?.trim() || "",
    city: v.city?.trim() || "",
    openTime: v.openTime,
    closeTime: v.closeTime,
    description: v.description?.trim() || "",
    utilityIds: Array.isArray(v.utilityIds)
      ? [...new Set(v.utilityIds.map((item) => Number(item)).filter((item) => Number.isInteger(item) && item > 0))]
      : [],
  })
})
</script>
