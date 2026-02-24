export interface PropertyRow {
    id: string
    name: string
    address: string
    total_unit: number
    occupancy: number
    facility: string[]
    created_at: string
    updated_at?: string
}

export interface RoomRow {
    id: string
    property_id?: string
    name: string
    type: string
    tower: string
    floor: number
    capacity: number
    view: string
    luas: number
    owner: string
    tenant: string | null
    rent_type: 'flexible' | 'daily' | 'monthly' | 'yearly'
    price_daily: number
    price_monthly: number
    price_yearly: number
    status: 'Available' | 'Occupied' | 'Maintenance' | 'Reserved'
    created_at: string
    updated_at?: string
}

export interface ContactRow {
    id: string
    name: string
    no_ktp: string
    no_wa: string
    address: string
    type: 'Customer' | 'Vendor' | 'Owner'
    room: string
    status: 'Active' | 'Inactive' | 'Prospect'
    date_check_in: string | null
    created_at: string
    updated_at?: string
}

export interface ContractRow {
    id: string
    name_customer: string
    name_owner: string
    number: string
    property_id?: string
    room_id?: string
    date_check_in: string | null
    date_check_out: string | null
    rent_type: 'flexible' | 'daily' | 'monthly' | 'yearly'
    days_remaining: number
    amount_rent: number
    deposit: number
    status: 'Active' | 'Expired' | 'Terminated' | 'Draft'
    payment_status: 'Paid' | 'Pending' | 'Overdue'
    notes?: string
    created_at: string
    updated_at?: string
}

export interface TemplateContractRow {
    id: string
    property_id?: string
    room_id?: string
    name: string
    number: string
    content?: string
    created_at: string
    updated_at?: string
}

export interface InvoiceRow {
    id: string
    tenant_name: string
    invoice_type: string
    amount: number
    issue_date: string
    due_date: string
    paid_date?: string | null
    payment_method?: string
    status: 'Paid' | 'Pending' | 'Overdue'
    description?: string
    created_at: string
    updated_at?: string
}

export interface CashFlowRow {
    id: string
    date: string
    category: string
    source?: string
    description?: string
    recipient?: string
    amount: number
    payment_method: string
    reference: string
    status: 'Completed' | 'Pending'
    type: 'in' | 'out'
    notes?: string
    created_at: string
}

export interface AssetRow {
    id: string
    property_id?: string
    room_id?: string
    name: string
    number: string
    category: string
    current_location: string
    purchase_date?: string | null
    purchase_price: number
    condition: 'Good' | 'Fair' | 'Poor' | 'New'
    notes?: string
    created_at: string
    updated_at?: string
}

export interface MaintenanceRow {
    id: string
    room_id?: string
    asset_id?: string
    room_name: string
    issue_type: string
    title: string
    description: string
    priority: 'Low' | 'Medium' | 'High' | 'Critical'
    status: 'Open' | 'In Progress' | 'Completed' | 'Cancelled'
    assigned_to?: string
    reported_date: string
    completed_date?: string | null
    cost?: number
    created_at: string
    updated_at?: string
}

export interface TodoRow {
    id: string
    title: string
    description: string
    category: string
    priority: 'Low' | 'Medium' | 'High'
    due_date: string | null
    assigned_to?: string
    status: 'Pending' | 'In Progress' | 'Completed'
    created_at: string
    updated_at?: string
}

export interface WaitingListRow {
    id: string
    contact_id?: string
    name: string
    phone: string
    property_id?: string
    room_id?: string
    unit_type: string
    budget: number
    date_entry_plan: string | null
    source: string
    status: 'Waiting' | 'Contacted' | 'Approved' | 'Rejected' | 'Cancelled'
    notes?: string
    created_at: string
    updated_at?: string
}

export interface NotificationRow {
    id: string
    user_id?: string
    title: string
    message: string
    type: 'info' | 'warning' | 'success' | 'error'
    is_read: boolean
    created_at: string
}

export interface UserProfileRow {
    id: string
    email: string
    full_name: string
    role: 'superadmin' | 'admin'
    created_at: string
}

// ============================================================
// Insert Types (omit id, timestamps, computed fields)
// ============================================================

export type PropertyInsert = Omit<PropertyRow, 'id' | 'created_at' | 'updated_at'>
export type RoomInsert = Omit<RoomRow, 'id' | 'created_at' | 'updated_at'>
export type ContactInsert = Omit<ContactRow, 'id' | 'created_at' | 'updated_at'>
export type ContractInsert = Omit<ContractRow, 'id' | 'created_at' | 'updated_at' | 'days_remaining'>
export type TemplateContractInsert = Omit<TemplateContractRow, 'id' | 'created_at' | 'updated_at'>
export type InvoiceInsert = Omit<InvoiceRow, 'id' | 'created_at' | 'updated_at'>
export type CashFlowInsert = Omit<CashFlowRow, 'id' | 'created_at'>
export type AssetInsert = Omit<AssetRow, 'id' | 'created_at' | 'updated_at'>
export type MaintenanceInsert = Omit<MaintenanceRow, 'id' | 'created_at' | 'updated_at'>
export type TodoInsert = Omit<TodoRow, 'id' | 'created_at' | 'updated_at'>
export type WaitingListInsert = Omit<WaitingListRow, 'id' | 'created_at' | 'updated_at'>

// ============================================================
// Update Types (all fields optional)
// ============================================================

export type PropertyUpdate = Partial<PropertyInsert>
export type RoomUpdate = Partial<RoomInsert>
export type ContactUpdate = Partial<ContactInsert>
export type ContractUpdate = Partial<ContractInsert>
export type TemplateContractUpdate = Partial<TemplateContractInsert>
export type InvoiceUpdate = Partial<InvoiceInsert>
export type AssetUpdate = Partial<AssetInsert>
export type MaintenanceUpdate = Partial<MaintenanceInsert>
export type TodoUpdate = Partial<TodoInsert>
export type WaitingListUpdate = Partial<WaitingListInsert>