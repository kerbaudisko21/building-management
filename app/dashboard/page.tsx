'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Users, Key, FileText, DollarSign, Wrench, Calendar, CheckCircle, AlertCircle } from 'lucide-react'
import { propertyService, roomService, contractService, maintenanceService, invoiceService, cashFlowService } from '@/lib/services'
import type { PropertyRow, RoomRow, ContractRow, MaintenanceRow, InvoiceRow, CashFlowRow } from '@/types/database'

export default function DashboardPage() {
    const router = useRouter()
    const [holidays, setHolidays] = useState<any[]>([])
    const [loadingHolidays, setLoadingHolidays] = useState(false)
    const [loading, setLoading] = useState(true)
    const [properties, setProperties] = useState<PropertyRow[]>([])
    const [rooms, setRooms] = useState<RoomRow[]>([])
    const [contracts, setContracts] = useState<ContractRow[]>([])
    const [maintenance, setMaintenance] = useState<MaintenanceRow[]>([])
    const [invoices, setInvoices] = useState<InvoiceRow[]>([])
    const [cashIn, setCashIn] = useState<CashFlowRow[]>([])

    useEffect(() => {
        Promise.all([
            propertyService.getAll(), roomService.getAll(), contractService.getAll(),
            maintenanceService.getAll(), invoiceService.getAll(), cashFlowService.getCashIn(),
        ]).then(([p, r, c, m, i, ci]) => {
            if (p.data) setProperties(p.data)
            if (r.data) setRooms(r.data)
            if (c.data) setContracts(c.data)
            if (m.data) setMaintenance(m.data)
            if (i.data) setInvoices(i.data)
            if (ci.data) setCashIn(ci.data)
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        setLoadingHolidays(true)
        fetch('/api/holidays').then(r => r.ok ? r.json() : { holidays: [] })
            .then(d => setHolidays(d.holidays || []))
            .catch(() => {})
            .finally(() => setLoadingHolidays(false))
    }, [])

    const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length
    const occupancyRate = rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0
    const monthlyRevenue = cashIn.filter(c => c.status === 'Completed').reduce((s, c) => s + c.amount, 0)
    const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')

    if (loading) return (
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Memuat dashboard...</p>
            </div>
        </div>
    )

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">Dashboard Overview</h1>
                <p className="text-slate-600 dark:text-slate-400">Building Management System</p>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-11 h-11 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{properties.length}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Properties</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-11 h-11 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                            <Key className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{rooms.length}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Units</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-11 h-11 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">{occupancyRate}%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{occupiedRooms}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Occupied Units</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-11 h-11 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{fmt(monthlyRevenue)}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Revenue (Cash In)</p>
                </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <FileText className="w-5 h-5 text-indigo-500" />
                    <div><p className="text-lg font-bold text-slate-900 dark:text-white">{contracts.filter(c => c.status === 'Active').length}</p><p className="text-xs text-slate-500">Active Contracts</p></div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <Wrench className="w-5 h-5 text-amber-500" />
                    <div><p className="text-lg font-bold text-slate-900 dark:text-white">{maintenance.filter(m => m.status === 'Open' || m.status === 'In Progress').length}</p><p className="text-xs text-slate-500">Open Maintenance</p></div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <div><p className="text-lg font-bold text-slate-900 dark:text-white">{invoices.filter(i => i.status === 'Overdue').length}</p><p className="text-xs text-slate-500">Overdue Invoices</p></div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-500" />
                    <div><p className="text-lg font-bold text-slate-900 dark:text-white">{rooms.filter(r => r.status === 'Available').length}</p><p className="text-xs text-slate-500">Available Units</p></div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {([
                        { href: '/dashboard/properties', icon: Building2, label: 'Properties', bg: 'bg-blue-100 dark:bg-blue-900/20', ic: 'text-blue-600 dark:text-blue-400' },
                        { href: '/dashboard/rooms', icon: Key, label: 'Rooms', bg: 'bg-purple-100 dark:bg-purple-900/20', ic: 'text-purple-600 dark:text-purple-400' },
                        { href: '/dashboard/contacts', icon: Users, label: 'Contacts', bg: 'bg-green-100 dark:bg-green-900/20', ic: 'text-green-600 dark:text-green-400' },
                        { href: '/dashboard/contracts', icon: FileText, label: 'Contracts', bg: 'bg-amber-100 dark:bg-amber-900/20', ic: 'text-amber-600 dark:text-amber-400' },
                    ] as const).map(a => (
                        <button key={a.href} onClick={() => router.push(a.href)} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-colors text-center group">
                            <div className={`w-12 h-12 rounded-lg ${a.bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                                <a.icon className={`w-6 h-6 ${a.ic}`} />
                            </div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{a.label}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Invoices + Holidays */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Invoices</h3>
                    <div className="space-y-3">
                        {invoices.slice(0, 5).map(inv => (
                            <div key={inv.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{inv.tenant_name}</p>
                                    <p className="text-xs text-slate-500 truncate">{inv.description || inv.invoice_type}</p>
                                </div>
                                <div className="text-right ml-3">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{fmt(inv.amount)}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : inv.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{inv.status}</span>
                                </div>
                            </div>
                        ))}
                        {invoices.length === 0 && <p className="text-sm text-slate-500 text-center py-4">Belum ada invoice</p>}
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-600" /> Upcoming Holidays</h3>
                    {loadingHolidays ? (
                        <div className="text-center py-8"><div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" /><p className="text-sm text-slate-500">Loading...</p></div>
                    ) : holidays.length === 0 ? (
                        <div className="text-center py-8 text-slate-500"><Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" /><p className="text-sm">No upcoming holidays</p></div>
                    ) : (
                        <div className="space-y-3">
                            {holidays.map((h, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                    <div className="w-8 h-8 rounded bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0"><Calendar className="w-4 h-4 text-indigo-600" /></div>
                                    <div><p className="text-sm text-slate-900 dark:text-white font-medium">{h.name}</p><p className="text-xs text-slate-500">{new Date(h.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}{h.daysUntil === 0 && ' • Hari ini!'}{h.daysUntil === 1 && ' • Besok'}{h.daysUntil > 1 && ` • ${h.daysUntil} hari lagi`}</p></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
