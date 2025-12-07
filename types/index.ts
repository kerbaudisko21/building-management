/**
 * Core type definitions for the Building Management System
 */

export interface Property {
  id: string;
  name: string;
  address: string;
  totalRooms: number;
  occupiedRooms: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  propertyId: string;
  roomNumber: string;
  floor: number;
  capacity: number;
  occupied: number;
  price: number;
  status: "available" | "occupied" | "maintenance";
  createdAt: Date;
  updatedAt: Date;
}

export interface Bed {
  id: string;
  roomId: string;
  bedNumber: string;
  status: "available" | "occupied";
  tenantId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  bedId: string;
  checkInDate: Date;
  checkOutDate?: Date;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  tenantId: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: "pending" | "paid" | "overdue";
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UtilityBill {
  id: string;
  propertyId: string;
  roomId?: string;
  type: "electricity" | "water" | "gas" | "internet";
  amount: number;
  month: string;
  year: number;
  status: "pending" | "paid";
  createdAt: Date;
  updatedAt: Date;
}

export interface Complaint {
  id: string;
  tenantId: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "urgent";
  targetAudience: "all" | "tenants" | "staff";
  publishDate: Date;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  type: "payment" | "complaint" | "check_in" | "check_out" | "notice";
  description: string;
  timestamp: Date;
  userId?: string;
  metadata?: Record<string, any>;
}
