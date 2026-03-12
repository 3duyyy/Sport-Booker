import axios from "axios"

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config) => {
    if (import.meta.client) {
      const accessToken = localStorage.getItem("access_token")
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
    }
    return config
  },
  (err) => Promise.reject(err),
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const originalRequest = error.config

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const res = await axios.post(`${useRuntimeConfig().public.apiBaseUrl}/auth/refresh-token`, {}, { withCredentials: true })

        const newAT = res.data?.data?.accessToken
        localStorage.setItem("access_token", newAT)

        originalRequest.headers.Authorization = `Bearer ${newAT}`

        return axiosInstance(originalRequest)
      } catch (error) {
        localStorage.removeItem("access_token")
        await navigateTo("/auth/login")
      }
    }

    if (status === 403) {
      await navigateTo("/")
    }

    return Promise.reject(error.response?.data?.message || error)
  },
)
