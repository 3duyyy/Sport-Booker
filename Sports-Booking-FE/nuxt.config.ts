// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@vueuse/nuxt", "@nuxt/image", "vuetify-nuxt-module"],
  css: ["vuetify/styles", "@/assets/styles/main.css"],
  build: {
    transpile: ["vuetify"],
  },
  vuetify: {
    moduleOptions: {
      importComposables: true,
    },
    vuetifyOptions: {
      locale: {
        locale: "vi",
      },
      icons: {
        defaultSet: "mdi-svg",
      },
      theme: {
        defaultTheme: "light",
        themes: {
          light: {
            colors: {
              primary: "#1867C0",
              secondary: "#5CBBF6",
              accent: "#82B1FF",
              error: "#FF5252",
              info: "#2196F3",
              success: "#4CAF50",
              warning: "#FFC107",
              background: "#F5F5F5",
              surface: "#FFFFFF",
            },
          },
          dark: {
            colors: {
              primary: "#2196F3",
              secondary: "#424242",
              accent: "#FF4081",
              error: "#FF5252",
              info: "#2196F3",
              success: "#4CAF50",
              warning: "#FFC107",
              background: "#121212",
              surface: "#1E1E1E",
            },
          },
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api",
    },
  },
  typescript: {
    strict: true,
    typeCheck: process.env.NODE_ENV === "production",
  },
  routeRules: {
    "/admin": { ssr: false },
    "/admin/**": { ssr: false },
  },
})
