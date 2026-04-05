export type FacilityStatus = "pending_approve" | "active" | "inactive"
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "rejected"
export type TransactionStatus = "pending" | "success" | "failed"
export type RefundStatus = "pending" | "approved" | "rejected"

export interface AdminSportItem {
  id: number
  name: string
}

export interface AdminUserItem {
  id: number
  fullName: string
}

export interface AdminFacilityItem {
  id: number
  ownerId: number
  sportId: number
  name: string
  district: string
  city: string
  status: FacilityStatus
  thumbnail: string
}

export interface AdminBookingItem {
  id: number
  facilityId: number
  totalPrice: number
  status: BookingStatus
}

export interface AdminTransactionItem {
  id: number
  bookingId: number
  amount: number
  status: TransactionStatus
}

export interface AdminRefundRequestItem {
  id: number
  bookingId: number
  status: RefundStatus
}

export interface AdminReviewItem {
  id: number
  facilityId: number
  rating: number
}

export interface AdminDashboardStatItem {
  key: string
  label: string
  value: string | number
  subText: string
  tone?: "default" | "success" | "error" | "primary"
}

export interface AdminRevenueBySportItem {
  sportId: number
  sportName: string
  revenue: number
  percent: number
}

export interface AdminActivityItem {
  id: number
  title: string
  description: string
  time: string
  type: "success" | "neutral" | "danger" | "primary"
  icon: string
}

export interface AdminTopFacilityItem {
  id: number
  name: string
  ownerName: string
  sportName: string
  location: string
  bookingCount: number
  revenue: number
  rating: number
  thumbnail: string
}

// Users
export type UserStatus = "active" | "banned" | "pending_approve"

export interface AdminUserListItem {
  id: number
  roleId: number
  email: string
  fullName: string
  phone: string | null
  avatarUrl: string | null
  status: UserStatus
  isVerified: boolean
  createdAt: string
}

export type AdminUserRoleFilter = "all" | 1 | 2 | 3
export type AdminUserStatusFilter = "all" | UserStatus

export interface AdminUserFilterForm {
  keyword: string
  role: AdminUserRoleFilter
  status: AdminUserStatusFilter
}

// Facilities
export type AdminFacilityPerformance = "high" | "normal" | "low"

export interface AdminFacilityListItem {
  id: number
  ownerId: number
  ownerName: string
  sportId: number
  sportName: string
  name: string
  address: string
  district: string
  city: string
  thumbnailUrl: string | null
  status: FacilityStatus
  performance: AdminFacilityPerformance
  fieldCount: number
  bookingCount: number
  createdAt: string
}

export type AdminFacilitySportFilter = "all" | number
export type AdminFacilityPerformanceFilter = "all" | AdminFacilityPerformance

export interface AdminFacilityFilterForm {
  keyword: string
  sportId: AdminFacilitySportFilter
  performance: AdminFacilityPerformanceFilter
}

export interface AdminFacilitySportOption {
  label: string
  value: AdminFacilitySportFilter
}

// Financial
export type PaymentStatus = "unpaid" | "paid" | "refunded" | "partially_paid"
export type TransactionType = "payment" | "refund"

export interface FinancialUserMock {
  id: number
  fullName: string
  email: string
  bankName?: string | null
  bankAccount?: string | null
  accountHolder?: string | null
}

export interface FinancialFacilityMock {
  id: number
  ownerId: number
  name: string
}

export interface FinancialFieldMock {
  id: number
  facilityId: number
  name: string
}

export interface FinancialBookingMock {
  id: number
  userId: number
  fieldId: number
  totalPrice: number
  depositAmount?: number | null
  status: BookingStatus
  paymentStatus: PaymentStatus
  startTime: string
  endTime: string
  createdAt: string
}

export interface FinancialTransactionMock {
  id: number
  bookingId: number
  amount: number
  type: TransactionType
  status: TransactionStatus
  description?: string | null
  createdAt: string
}

export interface FinancialRefundRequestMock {
  id: number
  userId: number
  bookingId: number
  amount: number
  bankName: string
  bankAccount: string
  accountHolder: string
  reason?: string | null
  status: RefundStatus
  adminNote?: string | null
  createdAt: string
  updatedAt: string
}

export interface FinancialStats {
  pendingPayoutAmount: number
  pendingPayoutCount: number
  pendingRefundAmount: number
  pendingRefundCount: number
}

export interface PayoutRow {
  id: number
  bookingId: number
  bookingCode: string
  ownerName: string
  facilityName: string
  bankName: string
  bankAccount: string
  accountHolder: string
  payoutAmount: number
}

export interface RefundRow {
  id: number
  refundRequestId: number
  customerName: string
  customerEmail: string
  bookingCode: string
  refundMethodLabel: string
  refundAmount: number
  status: RefundStatus
  createdAt: string
}

// Payments
export type PaymentVerificationRowStatus = "pending" | "approved" | "rejected"
export type PaymentVerificationKind = "full_payment" | "deposit"

export interface PaymentVerificationRow {
  id: number
  bookingId: number
  transactionId: number
  customerName: string
  customerAvatarUrl?: string | null
  facilityName: string
  fieldName: string
  verificationType: PaymentVerificationKind
  amount: number
  status: PaymentVerificationRowStatus
  transferredAt: string
}
