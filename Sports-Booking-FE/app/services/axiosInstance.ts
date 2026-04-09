import type { AxiosError, AxiosRequestConfig } from "axios"
import axios from "axios"
import { toast } from "vue-sonner"

declare module "axios" {
  interface AxiosRequestConfig {
    _retry?: boolean
    _silentErrorToast?: boolean
  }
}

type ApiErrorPayload = {
  status?: string
  message?: string
  stack?: string
}

const getErrorMessage = (error: AxiosError<ApiErrorPayload>) => {
  const data = error.response?.data
  if (typeof data?.message === "string" && data.message.trim()) return data.message
  if (typeof error.message === "string" && error.message.trim()) return error.message
  return "Có lỗi xảy ra, vui lòng thử lại"
}

const showErrorToast = (message: string, config?: AxiosRequestConfig) => {
  if (!import.meta.client) return
  if (config?._silentErrorToast) return
  toast.error(message)
}

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
  async (rawError: AxiosError<ApiErrorPayload>) => {
    const status = rawError.response?.status
    const originalRequest = (rawError.config || {}) as AxiosRequestConfig

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const res = await axios.post(`${useRuntimeConfig().public.apiBaseUrl}/auth/refresh-token`, {}, { withCredentials: true })

        const newAT = res.data?.data?.accessToken
        if (newAT) {
          localStorage.setItem("access_token", newAT)
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${newAT}`,
          }
          return axiosInstance(originalRequest)
        }

        throw new Error("Không thể làm mới phiên đăng nhập")
      } catch (refreshErr) {
        localStorage.removeItem("access_token")
        showErrorToast("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại", originalRequest)
        await navigateTo("/auth/login")
        return Promise.reject(refreshErr)
      }
    }

    if (status === 403) {
      showErrorToast(getErrorMessage(rawError), originalRequest)
      await navigateTo("/")
      return Promise.reject(rawError)
    }

    const message = getErrorMessage(rawError)
    showErrorToast(message, originalRequest)

    return Promise.reject(message)
  },
)
