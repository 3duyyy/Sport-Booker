export const ROLES = {
  ADMIN: 1,
  OWNER: 2,
  CUSTOMER: 3
} as const

export type RoleId = (typeof ROLES)[keyof typeof ROLES]

export const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',

  CREATE_FACILITY: 'create_facility',
  UPDATE_FACILITY: 'update_facility',
  DELETE_FACILITY: 'delete_facility',
  APPROVE_FACILITY: 'approve_facility',

  CREATE_FIELD: 'create_field',
  UPDATE_FIELD: 'update_field',
  DELETE_FIELD: 'delete_field',

  CREATE_BOOKING: 'create_booking',
  VIEW_OWN_BOOKINGS: 'view_own_bookings',
  VIEW_FACILITY_BOOKINGS: 'view_facility_bookings',
  VIEW_ALL_BOOKINGS: 'view_all_bookings',

  VIEW_OWN_PAYMENTS: 'view_own_payments',
  VIEW_FACILITY_PAYMENTS: 'view_facility_payments',
  VIEW_ALL_PAYMENTS: 'view_all_payments',
  PROCESS_REFUND: 'process_refund',

  CREATE_REVIEW: 'create_review',
  UPDATE_OWN_REVIEW: 'update_own_review',
  DELETE_REVIEW: 'delete_review'
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export const ROLE_PERMISSIONS: Record<RoleId, Permission[]> = {
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.CREATE_FACILITY,
    PERMISSIONS.UPDATE_FACILITY,
    PERMISSIONS.DELETE_FACILITY,
    PERMISSIONS.APPROVE_FACILITY,
    PERMISSIONS.DELETE_FIELD,
    PERMISSIONS.CREATE_BOOKING,
    PERMISSIONS.VIEW_ALL_BOOKINGS,
    PERMISSIONS.VIEW_ALL_PAYMENTS,
    PERMISSIONS.PROCESS_REFUND,
    PERMISSIONS.DELETE_REVIEW
  ],

  [ROLES.OWNER]: [
    PERMISSIONS.CREATE_FACILITY,
    PERMISSIONS.UPDATE_FACILITY,
    PERMISSIONS.CREATE_FIELD,
    PERMISSIONS.UPDATE_FIELD,
    PERMISSIONS.DELETE_FIELD,
    PERMISSIONS.VIEW_FACILITY_BOOKINGS,
    PERMISSIONS.VIEW_FACILITY_PAYMENTS,

    PERMISSIONS.CREATE_BOOKING,
    PERMISSIONS.VIEW_OWN_BOOKINGS,
    PERMISSIONS.VIEW_OWN_PAYMENTS,
    PERMISSIONS.CREATE_REVIEW,
    PERMISSIONS.UPDATE_OWN_REVIEW
  ],

  [ROLES.CUSTOMER]: [
    PERMISSIONS.CREATE_BOOKING,
    PERMISSIONS.VIEW_OWN_BOOKINGS,
    PERMISSIONS.VIEW_OWN_PAYMENTS,
    PERMISSIONS.CREATE_REVIEW,
    PERMISSIONS.UPDATE_OWN_REVIEW
  ]
}

export const hasPermission = (roleId: RoleId, permission: Permission): boolean => {
  const permissions = ROLE_PERMISSIONS[roleId]
  if (!permissions) return false
  return permissions.includes(permission)
}
