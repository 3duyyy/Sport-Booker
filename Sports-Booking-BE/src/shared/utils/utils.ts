export const USER_STATUSES = ['active', 'banned', 'pending_approve'] as const
export const ROLE_IDS = [1, 2, 3] as const

export const getQueryString = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0]
  return undefined
}

export const toNumber = (value: unknown) => {
  if (value === null || value === undefined) return 0
  return Number(value)
}

export const toPagination = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit))
})

export const formatBookingCode = (id: number) => {
  return 'BK-' + String(id).padStart(6, '0')
}
