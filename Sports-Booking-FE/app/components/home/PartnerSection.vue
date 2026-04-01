<template>
  <section class="section-block">
    <v-card class="partner-card" rounded="xl" elevation="2">
      <v-row align="center">
        <v-col cols="12" md="7">
          <v-card-text class="partner-content">
            <div class="partner-badge">Dành cho chủ sân</div>

            <h2 class="partner-title">Hợp tác cùng SportBooker</h2>

            <p class="partner-desc">
              Bạn đang sở hữu sân thể thao? Hãy đăng sân của bạn lên hệ thống để tiếp cận nhiều khách hàng hơn, quản lý lịch đặt
              sân hiệu quả và tăng doanh thu dễ dàng.
            </p>

            <div class="partner-actions">
              <v-btn
                color="success"
                rounded="lg"
                size="large"
                class="text-none font-weight-bold"
                @click="$emit('register-owner')"
              >
                Đăng ký sân của bạn
              </v-btn>

              <v-btn variant="outlined" rounded="lg" size="large" class="text-none font-weight-bold" @click="$emit('learn-more')">
                Tìm hiểu thêm
              </v-btn>
            </div>
          </v-card-text>
        </v-col>

        <v-col cols="12" md="5">
          <div class="partner-image-wrap">
            <NuxtImg :src="image" alt="Chủ sân thể thao" class="partner-image" width="1400" height="900" />
          </div>
        </v-col>
      </v-row>
    </v-card>
  </section>
</template>

<script setup lang="ts">
interface Props {
  image?: string
}

withDefaults(defineProps<Props>(), {
  image:
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=1400&q=80",
})

defineEmits<{
  "register-owner": []
  "learn-more": []
}>()
</script>

<style scoped>
.section-block {
  margin-top: 100px;
}

.partner-card {
  overflow: hidden;
  border: 1px solid #dcfce7;
  background: linear-gradient(90deg, #ecfdf5 0%, #ffffff 55%, #f0fdf4 100%);
}

.partner-content {
  padding: 32px;
}

.partner-badge {
  display: inline-flex;
  padding: 8px 12px;
  border-radius: 999px;
  background: #dcfce7;
  color: #15803d;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.partner-title {
  margin: 16px 0 0;
  color: #0f172a;
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.partner-desc {
  max-width: 620px;
  margin: 16px 0 0;
  color: #475569;
  font-size: 1rem;
  line-height: 1.8;
}

.partner-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.partner-image-wrap {
  padding: 24px;
}

.partner-image {
  width: 100%;
  height: 280px;
  border-radius: 24px;
  object-fit: cover;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.14);
}

@media (max-width: 959px) {
  .partner-content {
    padding: 24px;
  }

  .partner-title {
    font-size: 1.65rem;
  }
}
</style>
