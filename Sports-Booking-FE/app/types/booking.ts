export type PaymentOption = "deposit" | "full"

export interface BookingDraftSlot {
  id: string
  startTime: string
  endTime: string
  price: number
}

export interface BookingDraft {
  facilityId: number
  facilityName: string
  facilityAddress: string
  facilityImage: string | null
  sportName: string
  fieldId: number
  fieldName: string
  date: string
  slots: BookingDraftSlot[]
  totalPrice: number
}

// My bookings
export type CustomerBookingTab = "upcoming" | "pending_confirmation" | "completed" | "cancelled"

export type CustomerPaymentBadge =
  | "Đã cọc"
  | "Đã thanh toán"
  | "Chờ xác nhận"
  | "Chờ thanh toán"
  | "Đã hoàn tiền"
  | "Thanh toán một phần"

export interface CustomerBookingItem {
  id: number
  bookingCode: string

  tab: CustomerBookingTab

  sportName: string
  facilityName: string
  fieldName: string

  facilityAddress: string
  facilityImage: string

  bookingDate: string
  startTime: string
  endTime: string

  totalPrice: number
  depositAmount?: number | null
  remainingAmount?: number | null

  paymentBadge: CustomerPaymentBadge
  paymentNote?: string | null

  canViewDetail?: boolean
  canCancel?: boolean
  canViewReceipt?: boolean
  canPayRemainingAtVenue?: boolean
}
