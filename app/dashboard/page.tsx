'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Users, Key, FileText, DollarSign, Wrench, Calendar, CheckCircle, AlertCircle, ClipboardList, Clock, Receipt, TrendingUp, TrendingDown, UserPlus, Settings2 } from 'lucide-react'
import { propertyService, roomService, contractService, maintenanceService, invoiceService, cashFlowService } from '@/lib/services'
import type { PropertyRow, RoomRow, ContractRow, MaintenanceRow, InvoiceRow, CashFlowRow } from '@/types/database'

const ALL_QUICK_ACTIONS = [
    { id: 'properties', href: '/dashboard/properties', icon: Building2, label: 'Properties', bg: 'bg-blue-100 dark:bg-blue-900/20', ic: 'text-blue-600 dark:text-blue-400' },
    { id: 'rooms', href: '/dashboard/rooms', icon: Key, label: 'Rooms', bg: 'bg-purple-100 dark:bg-purple-900/20', ic: 'text-purple-600 dark:text-purple-400' },
    { id: 'contacts', href: '/dashboard/contacts', icon: Users, label: 'Contacts', bg: 'bg-green-100 dark:bg-green-900/20', ic: 'text-green-600 dark:text-green-400' },
    { id: 'contracts', href: '/dashboard/contracts', icon: FileText, label: 'Contracts', bg: 'bg-amber-100 dark:bg-amber-900/20', ic: 'text-amber-600 dark:text-amber-400' },
    { id: 'invoices', href: '/dashboard/invoices', icon: Receipt, label: 'Invoices', bg: 'bg-pink-100 dark:bg-pink-900/20', ic: 'text-pink-600 dark:text-pink-400' },
    { id: 'cash-in', href: '/dashboard/cash-in', icon: TrendingUp, label: 'Cash In', bg: 'bg-emerald-100 dark:bg-emerald-900/20', ic: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'cash-out', href: '/dashboard/cash-out', icon: TrendingDown, label: 'Cash Out', bg: 'bg-red-100 dark:bg-red-900/20', ic: 'text-red-600 dark:text-red-400' },
    { id: 'maintenance', href: '/dashboard/maintenance', icon: Wrench, label: 'Maintenance', bg: 'bg-orange-100 dark:bg-orange-900/20', ic: 'text-orange-600 dark:text-orange-400' },
    { id: 'todo', href: '/dashboard/todo', icon: ClipboardList, label: 'Todo', bg: 'bg-cyan-100 dark:bg-cyan-900/20', ic: 'text-cyan-600 dark:text-cyan-400' },
    { id: 'waiting-list', href: '/dashboard/waiting-list', icon: UserPlus, label: 'Waiting List', bg: 'bg-violet-100 dark:bg-violet-900/20', ic: 'text-violet-600 dark:text-violet-400' },
    { id: 'calendar', href: '/dashboard/calendar', icon: Calendar, label: 'Calendar', bg: 'bg-indigo-100 dark:bg-indigo-900/20', ic: 'text-indigo-600 dark:text-indigo-400' },
    { id: 'assets', href: '/dashboard/assets', icon: Settings2, label: 'Assets', bg: 'bg-slate-100 dark:bg-slate-700/50', ic: 'text-slate-600 dark:text-slate-400' },
]

const DEFAULT_ACTIONS = ['properties', 'rooms', 'contacts', 'contracts']

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
    const [selectedActions, setSelectedActions] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('dashboard_quick_actions')
            return saved ? JSON.parse(saved) : DEFAULT_ACTIONS
        }
        return DEFAULT_ACTIONS
    })
    const [editingActions, setEditingActions] = useState(false)

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

    const toggleAction = (id: string) => {
        setSelectedActions(prev => {
            const next = prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
            localStorage.setItem('dashboard_quick_actions', JSON.stringify(next))
            return next
        })
    }

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

    const quickActions = ALL_QUICK_ACTIONS.filter(a => selectedActions.includes(a.id))

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">Dashboard Overview</h1>
                <p className="text-slate-600 dark:text-slate-400">Building Management System</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3"><div className="w-11 h-11 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center"><Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div></div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{properties.length}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Properties</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3"><div className="w-11 h-11 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center"><Key className="w-5 h-5 text-purple-600 dark:text-purple-400" /></div></div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{rooms.length}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Units</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3"><div className="w-11 h-11 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" /></div><span className="text-xs font-medium text-green-600 dark:text-green-400">{occupancyRate}%</span></div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{occupiedRooms}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Occupied Units</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3"><div className="w-11 h-11 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center"><DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" /></div></div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{fmt(monthlyRevenue)}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Revenue (Cash In)</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {([
                    { icon: FileText, value: contracts.filter(c => c.status === 'Active').length, label: 'Active Contracts', color: 'text-indigo-500' },
                    { icon: Wrench, value: maintenance.filter(m => m.status === 'Open' || m.status === 'In Progress').length, label: 'Open Maintenance', color: 'text-amber-500' },
                    { icon: AlertCircle, value: invoices.filter(i => i.status === 'Overdue').length, label: 'Overdue Invoices', color: 'text-red-500' },
                    { icon: Users, value: rooms.filter(r => r.status === 'Available').length, label: 'Available Units', color: 'text-green-500' },
                ] as const).map((s, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                        <s.icon className={`w-5 h-5 ${s.color}`} /><div><p className="text-lg font-bold text-slate-900 dark:text-white">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
                    </div>
                ))}
            </div>

            {/* Quick Actions - Customizable */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Actions</h2>
                    <button onClick={() => setEditingActions(!editingActions)} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                        <Settings2 className="w-4 h-4" /> {editingActions ? 'Done' : 'Customize'}
                    </button>
                </div>
                {editingActions && (
                    <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Toggle shortcuts yang mau ditampilkan:</p>
                        <div className="flex flex-wrap gap-2">
                            {ALL_QUICK_ACTIONS.map(a => (
                                <button key={a.id} onClick={() => toggleAction(a.id)} className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${selectedActions.includes(a.id) ? 'bg-indigo-100 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-600 dark:text-indigo-300' : 'bg-white border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'}`}>
                                    {a.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map(a => (
                        <button key={a.id} onClick={() => router.push(a.href)} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-colors text-center group">
                            <div className={`w-12 h-12 rounded-lg ${a.bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                                <a.icon className={`w-6 h-6 ${a.ic}`} />
                            </div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{a.label}</p>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Invoices</h3>
                    <div className="space-y-3">
                        {invoices.slice(0, 5).map(inv => (
                            <div key={inv.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-900 dark:text-white truncate">{inv.tenant_name}</p><p className="text-xs text-slate-500 truncate">{inv.description || inv.invoice_type}</p></div>
                                <div className="text-right ml-3"><p className="text-sm font-bold text-slate-900 dark:text-white">{fmt(inv.amount)}</p><span className={`text-xs px-2 py-0.5 rounded-full ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : inv.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{inv.status}</span></div>
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
