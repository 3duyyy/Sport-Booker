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
}
