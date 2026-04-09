export interface FindManyForAdminParams {
  page: number
  limit: number
  keyword?: string
  roleId?: number
  status?: 'active' | 'banned' | 'pending_approve'
  sortBy: 'createdAt' | 'fullName'
  sortOrder: 'asc' | 'desc'
}

export interface FindManyFacilitiesParams {
  page: number
  limit: number
  keyword?: string
  sportId?: number
  performance?: 'high' | 'normal' | 'low'
  sortBy: 'createdAt' | 'bookingCount' | 'name'
  sortOrder: 'asc' | 'desc'
}

export interface FindManyPaymentVerificationsParams {
  page: number
  limit: number
  keyword?: string
  status?: 'pending' | 'approved' | 'rejected'
  verificationType?: 'full_payment' | 'deposit'
  from?: Date
  to?: Date
  sortBy: 'transferredAt' | 'amount'
  sortOrder: 'asc' | 'desc'
}

export type PaymentVerificationStatus = 'pending' | 'approved' | 'rejected'

export interface FindManyPayoutsParams {
  page: number
  limit: number
  keyword?: string
  sortBy: 'createdAt' | 'amount'
  sortOrder: 'asc' | 'desc'
}

export interface FindManyRefundsParams {
  page: number
  limit: number
  keyword?: string
  sortBy: 'createdAt' | 'amount'
  sortOrder: 'asc' | 'desc'
}
