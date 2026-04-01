<script setup lang="ts">
import { mdiTrophyOutline } from "@mdi/js"
</script>

<template>
  <div class="min-h-screen flex">
    <div class="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop"
        alt="Sports Background"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-900/80 to-black/95"></div>

      <div
        class="relative z-10 text-center px-10 py-14 mx-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:bg-white/10 transition-all duration-500"
      >
        <div
          class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 mb-6 shadow-lg shadow-blue-500/40"
        >
          <v-icon :icon="mdiTrophyOutline" size="40" color="white"></v-icon>
        </div>

        <h1 class="text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
          Sports Booker
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Pro</span>
        </h1>

        <p class="text-blue-100/80 text-lg max-w-md mx-auto leading-relaxed font-medium">
          Hệ thống quản lý và đặt lịch sân thể thao tiện lợi, nhanh chóng và chuyên nghiệp nhất.
        </p>
      </div>
    </div>

    <div
      class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50"
    >
      <div class="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="w-full max-w-lg relative z-10 bg-white/60 backdrop-blur-xl p-12 rounded-2xl shadow-xl border border-white/50">
        <slot />
      </div>
    </div>
  </div>
</template>
