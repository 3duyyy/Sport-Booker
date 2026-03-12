import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query"

export default defineNuxtPlugin((app) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5'
        gcTime: 1000 * 60 * 10, // 10'
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  })

  app.vueApp.use(VueQueryPlugin, {
    queryClient,
  })
})
