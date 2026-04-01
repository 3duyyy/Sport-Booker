<script setup lang="ts">
import { mdiTwitter, mdiFacebook, mdiInstagram, mdiShieldCheckOutline } from "@mdi/js"

const companyLinks = [
  { label: "Về chúng tôi", to: "#" },
  { label: "Tuyển dụng", to: "#" },
  { label: "Blog", to: "#" },
  { label: "Liên hệ", to: "/lien-he" },
]

const customerLinks = [
  { label: "Tìm sân", to: "#" },
  { label: "Lịch đặt của tôi", to: "#" },
  { label: "Trung tâm hỗ trợ", to: "#" },
]

const partnerLinks = [
  { label: "Đăng sân của bạn", to: "#" },
  { label: "Bảng điều khiển đối tác", to: "#" },
  { label: "Câu chuyện thành công", to: "#" },
]

const legalLinks = [
  { label: "Chính sách bảo mật", to: "#" },
  { label: "Điều khoản dịch vụ", to: "#" },
]

const socialLinks = [
  { icon: mdiTwitter, to: "https://twitter.com", label: "Twitter" },
  { icon: mdiFacebook, to: "https://facebook.com", label: "Facebook" },
  { icon: mdiInstagram, to: "https://instagram.com", label: "Instagram" },
]
</script>

<template>
  <footer class="footer-wrap">
    <v-container max-width="1280" class="footer-container">
      <div class="footer-top">
        <!-- Brand -->
        <div class="footer-brand">
          <NuxtLink to="/" class="brand-link">
            <div class="brand-icon">
              <v-icon :icon="mdiShieldCheckOutline" size="25" color="success" />
            </div>
            <span class="brand-text">SportBooker</span>
          </NuxtLink>

          <p class="brand-desc">
            Cách đơn giản nhất để tìm và đặt sân thể thao trong thành phố. Đồng hành cùng cộng đồng yêu thể thao mỗi ngày.
          </p>

          <div class="social-list">
            <a
              v-for="item in socialLinks"
              :key="item.label"
              :href="item.to"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="item.label"
              class="social-btn"
            >
              <v-icon :icon="item.icon" size="18" />
            </a>
          </div>
        </div>

        <!-- Links -->
        <div class="footer-links-grid">
          <div class="footer-column">
            <h3 class="footer-heading">Công ty</h3>
            <div class="footer-link-list">
              <NuxtLink v-for="item in companyLinks" :key="item.label" :to="item.to" class="footer-link">
                {{ item.label }}
              </NuxtLink>
            </div>
          </div>

          <div class="footer-column">
            <h3 class="footer-heading">Dành cho khách hàng</h3>
            <div class="footer-link-list">
              <NuxtLink v-for="item in customerLinks" :key="item.label" :to="item.to" class="footer-link">
                {{ item.label }}
              </NuxtLink>
            </div>
          </div>

          <div class="footer-column">
            <h3 class="footer-heading">Dành cho đối tác</h3>
            <div class="footer-link-list">
              <NuxtLink v-for="item in partnerLinks" :key="item.label" :to="item.to" class="footer-link">
                {{ item.label }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-divider" />

      <div class="footer-bottom">
        <p class="copyright">© 2024 SportBooker Inc. Bảo lưu mọi quyền.</p>

        <div class="legal-links">
          <NuxtLink v-for="item in legalLinks" :key="item.label" :to="item.to" class="legal-link">
            {{ item.label }}
          </NuxtLink>
        </div>
      </div>
    </v-container>
  </footer>
</template>

<style scoped>
.footer-wrap {
  background: #f8faf8;
  border-top: 1px solid #e8eeea;
}

.footer-container {
  padding-top: 56px;
  padding-bottom: 28px;
}

.footer-top {
  display: grid;
  grid-template-columns: 1.25fr 2fr;
  gap: 56px;
  align-items: start;
}

.footer-brand {
  max-width: 360px;
}

.brand-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.brand-icon {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e9f9ee;
  border: 1px solid #ccefd7;
  transition: all 0.25s ease;
}

.brand-link:hover .brand-icon {
  transform: translateY(-1px) scale(1.04);
  background: #dcfce7;
}

.brand-text {
  color: #151515;
  font-size: 1.85rem;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.brand-desc {
  margin: 18px 0 0;
  color: #64806f;
  font-size: 1rem;
  line-height: 1.8;
}

.social-list {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 22px;
}

.social-btn {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid #e4ebe6;
  color: #1f2937;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
  transition: all 0.22s ease;
}

.social-btn:hover {
  transform: translateY(-2px);
  border-color: #bbf7d0;
  background: #f0fdf4;
  color: #16a34a;
  box-shadow: 0 10px 20px rgba(22, 163, 74, 0.12);
}

.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(160px, 1fr));
  gap: 36px;
}

.footer-column {
  min-width: 0;
}

.footer-heading {
  margin: 0 0 18px;
  color: #151515;
  font-size: 1.1rem;
  font-weight: 800;
}

.footer-link-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.footer-link {
  width: fit-content;
  color: #6d8a79;
  text-decoration: none;
  font-size: 0.98rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.footer-link:hover {
  color: #16a34a;
  transform: translateX(3px);
}

.footer-divider {
  height: 1px;
  background: #e4ebe6;
  margin: 36px 0 22px;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.copyright {
  margin: 0;
  color: #7b8f84;
  font-size: 0.9rem;
}

.legal-links {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.legal-link {
  color: #7b8f84;
  text-decoration: none;
  font-size: 0.92rem;
  transition: color 0.2s ease;
}

.legal-link:hover {
  color: #16a34a;
}

@media (max-width: 1024px) {
  .footer-top {
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .footer-brand {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .footer-container {
    padding-top: 40px;
    padding-bottom: 24px;
  }

  .footer-links-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .brand-text {
    font-size: 1.55rem;
  }

  .brand-desc {
    font-size: 0.95rem;
  }
}
</style>
