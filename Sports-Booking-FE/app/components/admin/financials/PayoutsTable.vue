<template>
  <v-card rounded="xl" elevation="0" class="border border-slate-200">
    <v-card-text class="pa-0">
      <div class="px-5 pt-5 pb-3">
        <div class="text-h6 font-weight-bold text-slate-900">Chi trả cho chủ sân</div>

        <div class="text-body-2 text-slate-500 mt-1">
          Danh sách booking đã thanh toán, sẵn sàng đối soát và chi trả cho chủ sân.
        </div>
      </div>

      <v-divider />

      <div class="table-wrap">
        <v-table class="financial-table">
          <thead>
            <tr>
              <th>Chủ sân / Cơ sở</th>
              <th>Mã booking</th>
              <th>Thông tin ngân hàng</th>
              <th class="text-right">Số tiền chi trả</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in rows" :key="item.id">
              <td>
                <div class="font-weight-bold text-slate-900">
                  {{ item.ownerName }}
                </div>
                <div class="text-body-2 text-slate-500 mt-1">
                  {{ item.facilityName }}
                </div>
              </td>

              <td class="font-weight-medium text-slate-700">
                {{ item.bookingCode }}
              </td>

              <td>
                <div class="text-slate-800">
                  {{ item.bankName }}
                </div>
                <div class="text-body-2 text-slate-500 mt-1">{{ item.bankAccount }} - {{ item.accountHolder }}</div>
              </td>

              <td class="text-right font-weight-bold text-slate-900">
                {{ formatAdminCurrency(item.payoutAmount) }}
              </td>

              <td class="text-center">
                <v-btn color="primary" variant="flat" rounded="lg" class="text-none" size="small"> Thực hiện chi trả </v-btn>
              </td>
            </tr>

            <tr v-if="rows.length === 0">
              <td colspan="5" class="text-center py-8 text-slate-500">Chưa có dữ liệu chi trả.</td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { PayoutRow } from "~/types/admin"
import { formatAdminCurrency } from "~/mockData/admin.mock"

defineProps<{
  rows: PayoutRow[]
}>()
</script>

<style scoped>
.table-wrap {
  overflow-x: auto;
}

.financial-table :deep(th) {
  white-space: nowrap;
  color: rgb(100 116 139);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.financial-table :deep(td) {
  padding-top: 18px !important;
  padding-bottom: 18px !important;
  vertical-align: middle;
}
</style>
