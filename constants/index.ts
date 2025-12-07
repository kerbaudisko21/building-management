/**
 * Application-wide constants
 */

export const APP_NAME = "Gatau";
export const APP_DESCRIPTION = "Building Management System";

export const ROUTES = {
  DASHBOARD: "/",
  INVOICES: "/invoices",
  PROPERTIES: "/properties",
  ROOMS: "/rooms",
  BEDS: "/beds",
  TENANTS: "/tenants",
  UTILITY_BILLS: "/utility-bills",
  COMPLAINTS: "/complaints",
  NOTICES: "/notices",
  REPORTS: "/reports",
  ACCOUNT: "/account",
} as const;

export const THEME = {
  LIGHT: "light",
  DARK: "dark",
} as const;

export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  COMPLETED: "completed",
} as const;

export const COMPLAINT_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  CLOSED: "closed",
} as const;

export const PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;
