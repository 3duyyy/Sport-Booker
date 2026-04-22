import type {
  CancelMyBookingPayload,
  CancelMyBookingResult,
  CreateBookingPayload,
  CreateBookingResult,
  MyBookingsListApiResponse,
  MyBookingsQueryParams,
} from "~/types/booking"
import { axiosInstance } from "./axiosInstance"
import type { ApiResponse } from "~/types/common"

export const bookingService = {
  getMyBookings(params: MyBookingsQueryParams) {
    return axiosInstance.get<MyBookingsListApiResponse>("/users/bookings", { params })
  },

  cancelMyBooking(bookingId: number, payload?: CancelMyBookingPayload) {
    return axiosInstance.patch<ApiResponse<CancelMyBookingResult>>("/users/bookings/" + bookingId + "/cancel", payload ?? {})
  },

  createBooking(payload: CreateBookingPayload) {
    return axiosInstance.post<ApiResponse<CreateBookingResult>>("/bookings", payload)
  },
}
