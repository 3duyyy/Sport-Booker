export type OwnerFacilitiesListParams = {
  ownerId: number
  page: number
  limit: number
  keyword?: string
  status?: 'pending_approve' | 'active' | 'inactive'
}

export type OwnerCheckInHistoryParams = {
  ownerId: number
  page: number
  limit: number
  date?: string
}
