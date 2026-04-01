export interface SportResponse {
  id: number
  name: string
  iconUrl?: string
  createdAt?: string
  updatedAt?: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}
