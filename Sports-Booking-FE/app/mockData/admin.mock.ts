// Dashboard
import { mdiAlertCircleOutline, mdiBankTransferOut, mdiCheckCircleOutline, mdiSoccer } from "@mdi/js"
import type {
  AdminActivityItem,
  AdminBookingItem,
  AdminFacilityItem,
  AdminRefundRequestItem,
  AdminReviewItem,
  AdminSportItem,
  AdminTransactionItem,
  AdminUserItem,
} from "~/types/admin"

export const adminDashboardSportsMock: AdminSportItem[] = [
  { id: 1, name: "Bóng đá" },
  { id: 2, name: "Cầu lông" },
  { id: 3, name: "Tennis" },
  { id: 4, name: "Pickleball" },
]

export const adminDashboardUsersMock: AdminUserItem[] = [
  { id: 1, fullName: "Nguyễn Văn A" },
  { id: 2, fullName: "Trần Hoàng Nam" },
  { id: 3, fullName: "Lê Minh Quân" },
  { id: 4, fullName: "Phạm Gia Hưng" },
]

export const adminDashboardFacilitiesMock: AdminFacilityItem[] = [
  {
    id: 1,
    ownerId: 2,
    sportId: 1,
    name: "Sân bóng Trung tâm Quận 7",
    district: "Quận 7",
    city: "Hồ Chí Minh",
    status: "active",
    thumbnail: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 2,
    ownerId: 3,
    sportId: 2,
    name: "Cụm sân cầu lông Hoàng Gia",
    district: "Quận 10",
    city: "Hồ Chí Minh",
    status: "active",
    thumbnail: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 3,
    ownerId: 4,
    sportId: 3,
    name: "Tennis Garden Premium",
    district: "Thủ Đức",
    city: "Hồ Chí Minh",
    status: "pending_approve",
    thumbnail: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 4,
    ownerId: 2,
    sportId: 4,
    name: "Pickleball Arena Plus",
    district: "Quận 2",
    city: "Hồ Chí Minh",
    status: "active",
    thumbnail: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=400&auto=format&fit=crop",
  },
]

export const adminDashboardBookingsMock: AdminBookingItem[] = [
  { id: 1, facilityId: 1, totalPrice: 1200000, status: "completed" },
  { id: 2, facilityId: 1, totalPrice: 900000, status: "confirmed" },
  { id: 3, facilityId: 1, totalPrice: 800000, status: "completed" },
  { id: 4, facilityId: 2, totalPrice: 450000, status: "completed" },
  { id: 5, facilityId: 2, totalPrice: 500000, status: "pending" },
  { id: 6, facilityId: 2, totalPrice: 650000, status: "completed" },
  { id: 7, facilityId: 3, totalPrice: 1500000, status: "pending" },
  { id: 8, facilityId: 4, totalPrice: 700000, status: "completed" },
  { id: 9, facilityId: 4, totalPrice: 950000, status: "confirmed" },
  { id: 10, facilityId: 4, totalPrice: 780000, status: "completed" },
]

export const adminDashboardTransactionsMock: AdminTransactionItem[] = [
  { id: 1, bookingId: 1, amount: 1200000, status: "success" },
  { id: 2, bookingId: 2, amount: 300000, status: "success" },
  { id: 3, bookingId: 3, amount: 800000, status: "success" },
  { id: 4, bookingId: 4, amount: 450000, status: "success" },
  { id: 5, bookingId: 5, amount: 150000, status: "pending" },
  { id: 6, bookingId: 6, amount: 650000, status: "success" },
  { id: 7, bookingId: 7, amount: 500000, status: "pending" },
  { id: 8, bookingId: 8, amount: 700000, status: "success" },
  { id: 9, bookingId: 9, amount: 350000, status: "success" },
  { id: 10, bookingId: 10, amount: 780000, status: "success" },
]

export const adminDashboardRefundRequestsMock: AdminRefundRequestItem[] = [
  { id: 1, bookingId: 5, status: "pending" },
  { id: 2, bookingId: 7, status: "approved" },
  { id: 3, bookingId: 9, status: "pending" },
]

export const adminDashboardReviewsMock: AdminReviewItem[] = [
  { id: 1, facilityId: 1, rating: 5 },
  { id: 2, facilityId: 1, rating: 4 },
  { id: 3, facilityId: 1, rating: 5 },
  { id: 4, facilityId: 2, rating: 4 },
  { id: 5, facilityId: 2, rating: 5 },
  { id: 6, facilityId: 4, rating: 5 },
  { id: 7, facilityId: 4, rating: 4 },
]

export const adminDashboardActivitiesMock: AdminActivityItem[] = [
  {
    id: 1,
    title: "Chủ sân mới đăng ký",
    description: "Tennis Garden Premium vừa gửi yêu cầu duyệt cơ sở",
    time: "25 phút trước",
    type: "success",
    icon: mdiCheckCircleOutline,
  },
  {
    id: 2,
    title: "Booking mới hoàn tất",
    description: "Sân bóng Trung tâm Quận 7 vừa hoàn thành một lượt đặt sân",
    time: "45 phút trước",
    type: "neutral",
    icon: mdiSoccer,
  },
  {
    id: 3,
    title: "Khiếu nại từ khách hàng",
    description: "Có một khiếu nại mới liên quan đến yêu cầu hoàn tiền",
    time: "2 giờ trước",
    type: "danger",
    icon: mdiAlertCircleOutline,
  },
  {
    id: 4,
    title: "Đã giải ngân hoàn tiền",
    description: "Một yêu cầu refund đã được xử lý thành công",
    time: "5 giờ trước",
    type: "primary",
    icon: mdiBankTransferOut,
  },
]

// Users
import type { AdminUserListItem } from "~/types/admin"

export const adminUsersMock: AdminUserListItem[] = [
  {
    id: 1,
    roleId: 1,
    email: "nguyenvana@gmail.com",
    fullName: "Nguyễn Văn A",
    phone: "0901234567",
    avatarUrl: "https://i.pravatar.cc/100?img=1",
    status: "active",
    isVerified: true,
    createdAt: "2026-03-01T08:00:00.000Z",
  },
  {
    id: 2,
    roleId: 2,
    email: "tranvanb@gmail.com",
    fullName: "Trần Văn B",
    phone: "0912345678",
    avatarUrl: "https://i.pravatar.cc/100?img=2",
    status: "pending_approve",
    isVerified: false,
    createdAt: "2026-03-05T10:30:00.000Z",
  },
  {
    id: 3,
    roleId: 1,
    email: "levanc@gmail.com",
    fullName: "Lê Văn C",
    phone: "0988888888",
    avatarUrl: "https://i.pravatar.cc/100?img=3",
    status: "banned",
    isVerified: true,
    createdAt: "2026-03-10T13:45:00.000Z",
  },
  {
    id: 4,
    roleId: 3,
    email: "admin@sportbooker.vn",
    fullName: "System Admin",
    phone: "0909999999",
    avatarUrl: "https://i.pravatar.cc/100?img=12",
    status: "active",
    isVerified: true,
    createdAt: "2026-02-20T09:15:00.000Z",
  },
  {
    id: 5,
    roleId: 2,
    email: "owner01@sportbooker.vn",
    fullName: "Phạm Hoàng Nam",
    phone: "0933555777",
    avatarUrl: null,
    status: "active",
    isVerified: true,
    createdAt: "2026-03-12T15:00:00.000Z",
  },
]

// Facilities
import type { AdminFacilityListItem, AdminFacilitySportOption } from "~/types/admin"

export const adminFacilitySportOptionsMock: AdminFacilitySportOption[] = [
  { label: "Tất cả môn thể thao", value: "all" },
  { label: "Bóng đá", value: 1 },
  { label: "Cầu lông", value: 2 },
  { label: "Tennis", value: 3 },
  { label: "Pickleball", value: 4 },
  { label: "Bơi lội", value: 5 },
]

export const adminFacilitiesMock: AdminFacilityListItem[] = [
  {
    id: 1,
    ownerId: 2,
    ownerName: "Trần Hoàng Nam",
    sportId: 1,
    sportName: "Bóng đá",
    name: "Sân bóng Trung tâm Quận 7",
    address: "12 Nguyễn Thị Thập",
    district: "Quận 7",
    city: "Hồ Chí Minh",
    thumbnailUrl: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=300&auto=format&fit=crop",
    status: "active",
    performance: "high",
    fieldCount: 5,
    bookingCount: 342,
    createdAt: "2026-03-01T08:00:00.000Z",
  },
  {
    id: 2,
    ownerId: 3,
    ownerName: "Lê Minh Quân",
    sportId: 2,
    sportName: "Cầu lông",
    name: "Cụm sân cầu lông Hoàng Gia",
    address: "88 Thành Thái",
    district: "Quận 10",
    city: "Hồ Chí Minh",
    thumbnailUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=300&auto=format&fit=crop",
    status: "active",
    performance: "normal",
    fieldCount: 8,
    bookingCount: 298,
    createdAt: "2026-03-05T10:30:00.000Z",
  },
  {
    id: 3,
    ownerId: 4,
    ownerName: "Phạm Gia Hưng",
    sportId: 3,
    sportName: "Tennis",
    name: "Tennis Garden Premium",
    address: "25 Xa lộ Hà Nội",
    district: "Thủ Đức",
    city: "Hồ Chí Minh",
    thumbnailUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=300&auto=format&fit=crop",
    status: "pending_approve",
    performance: "normal",
    fieldCount: 4,
    bookingCount: 84,
    createdAt: "2026-03-08T09:20:00.000Z",
  },
  {
    id: 4,
    ownerId: 5,
    ownerName: "Nguyễn Quốc Bảo",
    sportId: 4,
    sportName: "Pickleball",
    name: "Pickleball Arena Plus",
    address: "10 Mai Chí Thọ",
    district: "Quận 2",
    city: "Hồ Chí Minh",
    thumbnailUrl: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=300&auto=format&fit=crop",
    status: "active",
    performance: "high",
    fieldCount: 6,
    bookingCount: 265,
    createdAt: "2026-03-10T15:00:00.000Z",
  },
  {
    id: 5,
    ownerId: 6,
    ownerName: "Võ Thành Đạt",
    sportId: 5,
    sportName: "Bơi lội",
    name: "Blue Horizon Aquatic",
    address: "120 Võ Văn Kiệt",
    district: "Quận 1",
    city: "Hồ Chí Minh",
    thumbnailUrl: "https://images.unsplash.com/photo-1438029071396-1e831a7fa6d8?q=80&w=300&auto=format&fit=crop",
    status: "inactive",
    performance: "low",
    fieldCount: 2,
    bookingCount: 41,
    createdAt: "2026-03-12T11:15:00.000Z",
  },
]

// Financials
import type {
  FinancialBookingMock,
  FinancialFacilityMock,
  FinancialFieldMock,
  FinancialRefundRequestMock,
  FinancialStats,
  FinancialTransactionMock,
  FinancialUserMock,
  PayoutRow,
  RefundRow,
} from "~/types/admin"

export const financialUsersMock: FinancialUserMock[] = [
  {
    id: 1,
    fullName: "Nguyễn Văn Minh",
    email: "minh.owner@sportbooker.vn",
    bankName: "Vietcombank",
    bankAccount: "0123456789",
    accountHolder: "NGUYEN VAN MINH",
  },
  {
    id: 2,
    fullName: "Trần Hoàng Phúc",
    email: "phuc.owner@sportbooker.vn",
    bankName: "ACB",
    bankAccount: "2233445566",
    accountHolder: "TRAN HOANG PHUC",
  },
  {
    id: 3,
    fullName: "Lê Thu Hà",
    email: "ha.owner@sportbooker.vn",
    bankName: "Techcombank",
    bankAccount: "9988776655",
    accountHolder: "LE THU HA",
  },
  {
    id: 10,
    fullName: "Nguyễn Quốc An",
    email: "an.customer@gmail.com",
  },
  {
    id: 11,
    fullName: "Phạm Mai Linh",
    email: "linh.customer@gmail.com",
  },
  {
    id: 12,
    fullName: "Vũ Gia Hưng",
    email: "hung.customer@gmail.com",
  },
]

export const financialFacilitiesMock: FinancialFacilityMock[] = [
  {
    id: 101,
    ownerId: 1,
    name: "Sân cầu lông Ánh Dương",
  },
  {
    id: 102,
    ownerId: 2,
    name: "Trung tâm bóng đá Nam Việt",
  },
  {
    id: 103,
    ownerId: 3,
    name: "Cụm sân pickleball Riverside",
  },
]

export const financialFieldsMock: FinancialFieldMock[] = [
  {
    id: 1001,
    facilityId: 101,
    name: "Sân 1",
  },
  {
    id: 1002,
    facilityId: 102,
    name: "Sân A",
  },
  {
    id: 1003,
    facilityId: 103,
    name: "Sân P2",
  },
]

export const financialBookingsMock: FinancialBookingMock[] = [
  {
    id: 90021,
    userId: 10,
    fieldId: 1001,
    totalPrice: 1450000,
    depositAmount: 300000,
    status: "completed",
    paymentStatus: "paid",
    startTime: "2026-04-01T18:00:00.000Z",
    endTime: "2026-04-01T21:00:00.000Z",
    createdAt: "2026-04-01T10:00:00.000Z",
  },
  {
    id: 90022,
    userId: 11,
    fieldId: 1002,
    totalPrice: 890000,
    depositAmount: 200000,
    status: "completed",
    paymentStatus: "paid",
    startTime: "2026-04-01T15:00:00.000Z",
    endTime: "2026-04-01T17:00:00.000Z",
    createdAt: "2026-04-01T08:30:00.000Z",
  },
  {
    id: 90023,
    userId: 12,
    fieldId: 1003,
    totalPrice: 2100000,
    depositAmount: 500000,
    status: "confirmed",
    paymentStatus: "paid",
    startTime: "2026-04-03T17:00:00.000Z",
    endTime: "2026-04-03T21:00:00.000Z",
    createdAt: "2026-04-02T09:15:00.000Z",
  },
  {
    id: 90024,
    userId: 11,
    fieldId: 1002,
    totalPrice: 1200000,
    depositAmount: 300000,
    status: "cancelled",
    paymentStatus: "partially_paid",
    startTime: "2026-04-02T09:00:00.000Z",
    endTime: "2026-04-02T11:00:00.000Z",
    createdAt: "2026-04-01T12:00:00.000Z",
  },
  {
    id: 90025,
    userId: 10,
    fieldId: 1001,
    totalPrice: 450000,
    depositAmount: 150000,
    status: "cancelled",
    paymentStatus: "refunded",
    startTime: "2026-04-02T13:00:00.000Z",
    endTime: "2026-04-02T14:00:00.000Z",
    createdAt: "2026-04-01T14:45:00.000Z",
  },
]

export const financialTransactionsMock: FinancialTransactionMock[] = [
  {
    id: 1,
    bookingId: 90021,
    amount: 1450000,
    type: "payment",
    status: "success",
    description: "Thanh toán booking #90021",
    createdAt: "2026-04-01T10:05:00.000Z",
  },
  {
    id: 2,
    bookingId: 90022,
    amount: 890000,
    type: "payment",
    status: "success",
    description: "Thanh toán booking #90022",
    createdAt: "2026-04-01T08:40:00.000Z",
  },
  {
    id: 3,
    bookingId: 90023,
    amount: 2100000,
    type: "payment",
    status: "success",
    description: "Thanh toán booking #90023",
    createdAt: "2026-04-02T09:20:00.000Z",
  },
  {
    id: 4,
    bookingId: 90024,
    amount: 300000,
    type: "payment",
    status: "success",
    description: "Đặt cọc booking #90024",
    createdAt: "2026-04-01T12:10:00.000Z",
  },
  {
    id: 5,
    bookingId: 90025,
    amount: 150000,
    type: "payment",
    status: "success",
    description: "Đặt cọc booking #90025",
    createdAt: "2026-04-01T14:50:00.000Z",
  },
  {
    id: 6,
    bookingId: 90025,
    amount: 150000,
    type: "refund",
    status: "success",
    description: "Hoàn tiền booking #90025",
    createdAt: "2026-04-02T16:00:00.000Z",
  },
]

export const financialRefundRequestsMock: FinancialRefundRequestMock[] = [
  {
    id: 501,
    userId: 11,
    bookingId: 90024,
    amount: 300000,
    bankName: "MB Bank",
    bankAccount: "0912345678",
    accountHolder: "PHAM MAI LINH",
    reason: "Khách hủy sân do thay đổi lịch cá nhân",
    status: "pending",
    adminNote: null,
    createdAt: "2026-04-02T10:00:00.000Z",
    updatedAt: "2026-04-02T10:00:00.000Z",
  },
  {
    id: 502,
    userId: 10,
    bookingId: 90025,
    amount: 150000,
    bankName: "VietinBank",
    bankAccount: "0777888999",
    accountHolder: "NGUYEN QUOC AN",
    reason: "Sân không thể phục vụ",
    status: "approved",
    adminNote: "Đã xác minh với chủ sân",
    createdAt: "2026-04-02T11:00:00.000Z",
    updatedAt: "2026-04-02T15:00:00.000Z",
  },
]

export function formatAdminBookingCode(bookingId: number) {
  return `#BK-${bookingId}`
}

export function formatAdminCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatAdminDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

/**
 * Dữ liệu chi trả cho chủ sân là dữ liệu tổng hợp phục vụ màn admin.
 * Schema hiện tại chưa có bảng payout riêng.
 */
export function getAdminFinancialPayoutRows(): PayoutRow[] {
  return financialBookingsMock
    .filter((booking) => {
      const paymentTransaction = financialTransactionsMock.find(
        (transaction) =>
          transaction.bookingId === booking.id && transaction.type === "payment" && transaction.status === "success",
      )

      return Boolean(paymentTransaction) && booking.paymentStatus === "paid"
    })
    .map((booking) => {
      const field = financialFieldsMock.find((item) => item.id === booking.fieldId)
      const facility = financialFacilitiesMock.find((item) => item.id === field?.facilityId)
      const owner = financialUsersMock.find((item) => item.id === facility?.ownerId)

      return {
        id: booking.id,
        bookingId: booking.id,
        bookingCode: formatAdminBookingCode(booking.id),
        ownerName: owner?.fullName || "Chưa cập nhật",
        facilityName: facility?.name || "Chưa cập nhật",
        bankName: owner?.bankName || "Chưa cập nhật",
        bankAccount: owner?.bankAccount || "Chưa cập nhật",
        accountHolder: owner?.accountHolder || "Chưa cập nhật",
        payoutAmount: booking.totalPrice,
      }
    })
}

export function getAdminFinancialRefundRows(): RefundRow[] {
  return financialRefundRequestsMock.map((refund) => {
    const customer = financialUsersMock.find((item) => item.id === refund.userId)

    return {
      id: refund.id,
      refundRequestId: refund.id,
      customerName: customer?.fullName || "Khách hàng",
      customerEmail: customer?.email || "-",
      bookingCode: formatAdminBookingCode(refund.bookingId),
      refundMethodLabel: `${refund.bankName} - ${refund.bankAccount}`,
      refundAmount: refund.amount,
      status: refund.status,
      createdAt: refund.createdAt,
    }
  })
}

export function getAdminFinancialStats(): FinancialStats {
  const payoutRows = getAdminFinancialPayoutRows()
  const refundRows = getAdminFinancialRefundRows()

  const pendingRefundRows = refundRows.filter((item) => item.status === "pending")

  return {
    pendingPayoutAmount: payoutRows.reduce((total, item) => total + item.payoutAmount, 0),
    pendingPayoutCount: payoutRows.length,
    pendingRefundAmount: pendingRefundRows.reduce((total, item) => total + item.refundAmount, 0),
    pendingRefundCount: pendingRefundRows.length,
  }
}

// Payment verifications
import type { PaymentVerificationRow } from "~/types/admin"

export const paymentVerificationRowsMock: PaymentVerificationRow[] = [
  {
    id: 1,
    bookingId: 1012,
    transactionId: 8001,
    customerName: "Nguyễn Minh Anh",
    customerAvatarUrl: "https://i.pravatar.cc/100?img=12",
    facilityName: "Sunshine Sports Complex",
    fieldName: "Sân bóng đá 7 người - Sân A",
    verificationType: "full_payment",
    amount: 450000,
    status: "pending",
    transferredAt: "2026-04-05T08:20:00",
  },
  {
    id: 2,
    bookingId: 1013,
    transactionId: 8002,
    customerName: "Trần Quang Huy",
    customerAvatarUrl: "https://i.pravatar.cc/100?img=15",
    facilityName: "Arena Pickleball Club",
    fieldName: "Sân Pickleball 02",
    verificationType: "deposit",
    amount: 150000,
    status: "pending",
    transferredAt: "2026-04-05T09:10:00",
  },
  {
    id: 3,
    bookingId: 1014,
    transactionId: 8003,
    customerName: "Lê Hoàng Nam",
    customerAvatarUrl: "https://i.pravatar.cc/100?img=18",
    facilityName: "Peak Performance Center",
    fieldName: "Sân Tennis 03",
    verificationType: "full_payment",
    amount: 620000,
    status: "approved",
    transferredAt: "2026-04-04T19:10:00",
  },
  {
    id: 4,
    bookingId: 1015,
    transactionId: 8004,
    customerName: "Phạm Thu Trang",
    customerAvatarUrl: "https://i.pravatar.cc/100?img=32",
    facilityName: "Sunshine Sports Complex",
    fieldName: "Sân cầu lông 01",
    verificationType: "deposit",
    amount: 120000,
    status: "rejected",
    transferredAt: "2026-04-04T17:45:00",
  },
]
