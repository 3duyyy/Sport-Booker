import { axiosInstance } from "./axiosInstance"

export interface UpdateProfilePayload {
  fullName: string
  phone?: string
  avatarUrl?: string
  bankName?: string
  bankAccount?: string
  accountHolder?: string
}

export const userService = {
  getMe() {
    return axiosInstance.get("/users/me")
  },

  updateMe(payload: UpdateProfilePayload) {
    return axiosInstance.patch("/users/me", payload)
  },
}
