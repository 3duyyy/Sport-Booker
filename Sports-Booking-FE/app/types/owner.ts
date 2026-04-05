// Tab dashboard
export type OwnerSidebarKey = "overview" | "facilities" | "calendar" | "revenue" | "checkin"

export interface OwnerStatItem {
  key: string
  title: string
  value: string | number
  subtitle?: string
  changeText?: string
  icon: string
}

export type OwnerBookingStatus = "confirmed" | "pending" | "cancelled" | "completed"

export interface OwnerRecentBookingItem {
  id: string
  customerName: string
  fieldName: string
  sportName: string
  timeLabel: string
  status: OwnerBookingStatus
}

export interface OwnerScheduleItem {
  id: string
  time: string
  title: string
  description: string
  status: "success" | "warning" | "neutral"
}

export interface OwnerOverviewData {
  stats: OwnerStatItem[]
  recentBookings: OwnerRecentBookingItem[]
  todaySchedule: OwnerScheduleItem[]
}

// Tab facilities
export type OwnerFacilityStatus = "pending_approve" | "active" | "inactive"
export type OwnerFieldStatus = "active" | "maintenance" | "inactive"

export interface OwnerFieldItem {
  id: number
  name: string
  status: OwnerFieldStatus
  priceFrom: number
}

export interface OwnerFacilityItem {
  id: number
  name: string
  status: OwnerFacilityStatus
  sportName: string
  address: string
  district: string
  city: string
  openTime: string
  closeTime: string
  fieldsCount: number
  fields: OwnerFieldItem[]
}

// Check-in
export interface OwnerCheckInBookingItem {
  id: number
  bookingCode: string
  customerName: string
  customerPhone: string
  fieldName: string
  bookingDate: string
  timeLabel: string
  totalAmount: number
  depositAmount: number
  remainingAmount: number
  paymentStatus: "unpaid" | "paid" | "partially_paid" | "refunded"
  isCheckedIn: boolean
}

export interface OwnerCheckInHistoryItem {
  id: number
  checkedInTime: string
  customerName: string
  fieldName: string
  status: "checked_in"
}

// Calendar
export interface OwnerCalendarFacilityFilterItem {
  id: number
  name: string
}

export type OwnerCalendarEventStatus = "confirmed" | "pending" | "maintenance" | "completed" | "cancelled"

export interface OwnerCalendarEventItem {
  id: string
  title: string
  facilityId: number
  facilityName: string
  fieldName: string
  start: string
  end: string
  status: OwnerCalendarEventStatus
  customerName?: string
}
