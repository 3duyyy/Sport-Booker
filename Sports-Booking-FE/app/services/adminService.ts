import { axiosInstance } from "./axiosInstance"
import type { ApiResponse } from "~/types/common"
import type {
  AdminCreateUserPayload,
  AdminDashboardOverviewResponse,
  AdminFacilitiesListApiResponse,
  AdminFacilitiesQueryParams,
  AdminFacilityStatusUpdateApiResponse,
  AdminFinancialsSummaryApiResponse,
  AdminPaymentVerificationsListApiResponse,
  AdminPaymentVerificationsQueryParams,
  AdminPayoutsListApiResponse,
  AdminPayoutsQueryParams,
  AdminRefundsListApiResponse,
  AdminRefundsQueryParams,
  AdminRejectPaymentVerificationPayload,
  AdminUpdateFacilityStatusPayload,
  AdminUpdateUserPayload,
  AdminUpdateUserStatusPayload,
  AdminUserDetailApiResponse,
  AdminUsersListApiResponse,
  AdminUsersQueryParams,
  AdminUserUpsertApiResponse,
  PaymentVerificationRow,
} from "~/types/admin"

export interface GetAdminDashboardParams {
  days?: number
  topPage?: number
  topLimit?: number
  activityLimit?: number
}

export interface GetAdminDashboardParams {
  days?: number
  topPage?: number
  topLimit?: number
  activityLimit?: number
  topSearch?: string
}

export const adminService = {
  getDashboardOverview(params: GetAdminDashboardParams) {
    return axiosInstance.get<ApiResponse<AdminDashboardOverviewResponse>>("/admin/dashboard", {
      params,
    })
  },

  getUsers(params: AdminUsersQueryParams) {
    return axiosInstance.get<AdminUsersListApiResponse>("/admin/users", { params })
  },

  getFacilities(params: AdminFacilitiesQueryParams) {
    return axiosInstance.get<AdminFacilitiesListApiResponse>("/admin/facilities", { params })
  },

  getPaymentVerifications(params: AdminPaymentVerificationsQueryParams) {
    return axiosInstance.get<AdminPaymentVerificationsListApiResponse>("/admin/payment-verifications", { params })
  },

  approvePaymentVerification(transactionId: number) {
    return axiosInstance.patch<ApiResponse<PaymentVerificationRow>>("/admin/payment-verifications/" + transactionId + "/approve")
  },

  rejectPaymentVerification(transactionId: number, payload: AdminRejectPaymentVerificationPayload) {
    return axiosInstance.patch<ApiResponse<PaymentVerificationRow>>(
      "/admin/payment-verifications/" + transactionId + "/reject",
      payload,
    )
  },

  getFinancialSummary() {
    return axiosInstance.get<AdminFinancialsSummaryApiResponse>("/admin/financials/summary")
  },

  getPayouts(params: AdminPayoutsQueryParams) {
    return axiosInstance.get<AdminPayoutsListApiResponse>("/admin/financials/payouts", { params })
  },

  getRefunds(params: AdminRefundsQueryParams) {
    return axiosInstance.get<AdminRefundsListApiResponse>("/admin/financials/refunds", { params })
  },

  getUserDetail(userId: number) {
    return axiosInstance.get<AdminUserDetailApiResponse>("/admin/users/" + userId)
  },

  createUser(payload: AdminCreateUserPayload) {
    return axiosInstance.post<AdminUserUpsertApiResponse>("/admin/users", payload)
  },

  updateUser(userId: number, payload: AdminUpdateUserPayload) {
    return axiosInstance.patch<AdminUserUpsertApiResponse>("/admin/users/" + userId, payload)
  },

  updateUserStatus(userId: number, payload: AdminUpdateUserStatusPayload) {
    return axiosInstance.patch<AdminUserUpsertApiResponse>("/admin/users/" + userId + "/status", payload)
  },

  updateFacilityStatus(facilityId: number, payload: AdminUpdateFacilityStatusPayload) {
    return axiosInstance.patch<AdminFacilityStatusUpdateApiResponse>("/admin/facilities/" + facilityId + "/status", payload)
  },

  approveFacility(facilityId: number) {
    return axiosInstance.patch<AdminFacilityStatusUpdateApiResponse>("/admin/facilities/" + facilityId + "/approve")
  },

  settlePayout(ownerId: number) {
    return axiosInstance.patch(`/admin/financials/payouts/${ownerId}/settle`)
  },

  approveRefund(refundId: number) {
    return axiosInstance.patch(`/admin/financials/refunds/${refundId}/approve`)
  },
}
