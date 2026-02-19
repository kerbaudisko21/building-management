/**
 * Entity-specific services
 *
 * Each service wraps `createService` and can add entity-specific methods.
 * Import these instead of calling Supabase directly in components.
 */

import { createService } from './supabase-service'
import type {
  PropertyRow, PropertyInsert, PropertyUpdate,
  RoomRow, RoomInsert, RoomUpdate,
  ContactRow, ContactInsert, ContactUpdate,
  ContractRow, ContractInsert, ContractUpdate,
  InvoiceRow, InvoiceInsert, InvoiceUpdate,
  CashFlowRow, CashFlowInsert,
  AssetRow, AssetInsert, AssetUpdate,
  MaintenanceRow, MaintenanceInsert, MaintenanceUpdate,
  TodoRow, TodoInsert, TodoUpdate,
  WaitingListRow, WaitingListInsert, WaitingListUpdate,
  NotificationRow,
  UserProfileRow,
} from '@/types/database'

// ─── Properties ──────────────────────────────────────────────
export const propertyService = createService<PropertyRow, PropertyInsert, PropertyUpdate>('properties')

// ─── Rooms ───────────────────────────────────────────────────
export const roomService = createService<RoomRow, RoomInsert, RoomUpdate>('rooms')

// ─── Contacts ────────────────────────────────────────────────
export const contactService = createService<ContactRow, ContactInsert, ContactUpdate>('contacts')

// ─── Contracts ───────────────────────────────────────────────
export const contractService = createService<ContractRow, ContractInsert, ContractUpdate>('contracts')

// ─── Invoices ────────────────────────────────────────────────
export const invoiceService = createService<InvoiceRow, InvoiceInsert, InvoiceUpdate>('invoices')

// ─── Cash Flow (In & Out combined) ──────────────────────────
export const cashFlowService = {
  ...createService<CashFlowRow, CashFlowInsert>('cash_flows'),

  /** Get only income (cash in) */
  async getCashIn() {
    return createService<CashFlowRow>('cash_flows').getAll({
      filters: { type: 'in' },
      orderBy: 'date',
      ascending: false,
    })
  },

  /** Get only expenses (cash out) */
  async getCashOut() {
    return createService<CashFlowRow>('cash_flows').getAll({
      filters: { type: 'out' },
      orderBy: 'date',
      ascending: false,
    })
  },
}

// ─── Assets ──────────────────────────────────────────────────
export const assetService = createService<AssetRow, AssetInsert, AssetUpdate>('assets')

// ─── Maintenance ─────────────────────────────────────────────
export const maintenanceService = createService<MaintenanceRow, MaintenanceInsert, MaintenanceUpdate>('maintenance_requests')

// ─── Todos ───────────────────────────────────────────────────
export const todoService = createService<TodoRow, TodoInsert, TodoUpdate>('todos')

// ─── Waiting List ────────────────────────────────────────────
export const waitingListService = createService<WaitingListRow, WaitingListInsert, WaitingListUpdate>('waiting_list')

// ─── Notifications ───────────────────────────────────────────
export const notificationService = createService<NotificationRow>('notifications')

// ─── Users ───────────────────────────────────────────────────
export const userService = createService<UserProfileRow>('user_profiles')
