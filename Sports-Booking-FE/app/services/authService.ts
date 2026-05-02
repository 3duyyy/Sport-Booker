import type { LoginInput, RegisterInput } from "~/schemas/authSchema"
import { axiosInstance } from "./axiosInstance"

export const authService = {
  login(data: LoginInput) {
    return axiosInstance.post("/auth/login", data)
  },
  register(data: Omit<RegisterInput, "confirmPassword">) {
    return axiosInstance.post("auth/register", data)
  },
  logout() {
    return axiosInstance.post("auth/logout")
  },
  forgotPassword(email: string) {
    return axiosInstance.post("/auth/forgot-password", { email })
  },
  verifyOtp(email: string, otp: string) {
    return axiosInstance.post("/auth/verify-otp", { email, otp })
  },
  resetPassword(data: any) {
    return axiosInstance.post("/auth/reset-password", data)
  },
}
