/**
 * Application-wide constants
 */

export const APP_NAME = 'Gatau'
export const APP_DESCRIPTION = 'Building Management System'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROPERTIES: '/dashboard/properties',
  ROOMS: '/dashboard/rooms',
  CONTACTS: '/dashboard/contacts',
  WAITING_LIST: '/dashboard/waiting-list',
  CONTRACTS: '/dashboard/contracts',
  INVOICES: '/dashboard/invoices',
  CASH_IN: '/dashboard/cash-in',
  CASH_OUT: '/dashboard/cash-out',
  ASSETS: '/dashboard/assets',
  MAINTENANCE: '/dashboard/maintenance',
  TODO: '/dashboard/todo',
  CALENDAR: '/dashboard/calendar',
  NOTIFICATIONS: '/dashboard/notifications',
  SETTINGS: '/dashboard/settings',
  USERS: '/dashboard/users',
} as const

export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  '/auth',
] as const

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const

export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  COMPLETED: 'completed',
} as const

export const ROOM_STATUS = {
  AVAILABLE: 'Available',
  OCCUPIED: 'Occupied',
  MAINTENANCE: 'Maintenance',
  RESERVED: 'Reserved',
} as const

export const PAYMENT_STATUS = {
  PAID: 'Paid',
  PENDING: 'Pending',
  OVERDUE: 'Overdue',
} as const

export const PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
} as const
