import { axiosInstance } from "./axiosInstance"
import type { ApiResponse } from "~/types/common"

export type UtilityOption = {
  id: number
  name: string
  iconClass?: string | null
}

export const utilityService = {
  getAllUtilities() {
    return axiosInstance.get<ApiResponse<UtilityOption[]>>("/utilities")
  },
}
