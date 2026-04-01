import { axiosInstance } from "./axiosInstance"
import type { ApiResponse, SportResponse } from "~/types/common"

export const sportService = {
  getAllSports() {
    return axiosInstance.get<ApiResponse<SportResponse[]>>("/sports")
  },
}
