'use client';

import { useState } from 'react'
import { maintenanceService, roomService } from '@/lib/services'
import { useCrud, useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import type { MaintenanceRow, MaintenanceInsert, MaintenanceUpdate } from '@/types/database'
import { formatDate } from '@/utils'
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import AddMaintenanceForm, { MaintenanceFormData } from '@/components/forms/AddMaintenanceForm';
import {
    Wrench,
    Plus,
    Search,
    Filter,
    Calendar,
    User,
    Eye,
    Edit,
    CheckCircle,
    Clock,
    AlertCircle, Trash2,
Loader2, } from 'lucide-react';
import { useToast } from '@/components/ui/Toast'

export default function MaintenancePage() {
    const { toast, confirm } = useToast()
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);

    const {
        items: requests,
        loading,
        error,
        addItem,
        updateItem,
        removeItem,
        actionLoading,
    } = useCrud<MaintenanceRow, MaintenanceInsert, MaintenanceUpdate>({
        service: maintenanceService,
        orderBy: 'created_at',
    })

    const { data: roomsData } = useSupabaseQuery(() => roomService.getAll())
    const rooms = (roomsData ?? []).map(r => ({ id: r.id, name: r.name }))


    const handleDelete = async (id: string) => {
        const yes = await confirm({ title: 'Hapus Request', message: 'Yakin ingin menghapus request ini?', variant: 'danger' })
        if (!yes) return
        const result = await removeItem(id)
        if (result.error) toast.error('Gagal menghapus', result.error)
        else toast.success('Berhasil', 'Request berhasil dihapus')
    }

    const handleStatusChange = async (id: string, newStatus: string) => {
        const result = await updateItem(id, { status: newStatus, completed_date: newStatus === 'Completed' ? new Date().toISOString().split('T')[0] : null } as any)
        if (result.error) toast.error('Gagal', result.error)
        else toast.success('Berhasil', 'Status diubah ke ' + newStatus)
    }

    const handleFormSubmit = async (data: MaintenanceFormData) => {
        const room = rooms.find(r => r.id === data.roomId)
        const insert: MaintenanceInsert = {
            room_id: data.roomId || undefined,
            room_name: room?.name || 'Unknown',
            issue_type: data.issueType,
            title: data.description.substring(0, 50),
            description: data.description,
            priority: (data.priority.charAt(0).toUpperCase() + data.priority.slice(1)) as any,
            status: data.status === 'pending' ? 'Open' : data.status === 'in-progress' ? 'In Progress' : 'Completed',
            assigned_to: data.assignedTo || '',
            reported_date: new Date().toISOString().split('T')[0],
        }
        const addResult = await addItem(insert)
        if (addResult.error) toast.error('Gagal menyimpan', addResult.error)
        else toast.success('Berhasil', 'Data berhasil ditambahkan')
    }


    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        { value: 'ac', label: 'AC/Cooling' },
        { value: 'plumbing', label: 'Plumbing' },
        { value: 'electrical', label: 'Electrical' },
        { value: 'security', label: 'Security' },
        { value: 'elevator', label: 'Elevator' },
    ];

    const priorityOptions = [
        { value: 'all', label: 'All Priorities' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
    ];

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
    ];


    const getPriorityBadge = (priority: string) => {
        const variants: Record<string, any> = {
            High: 'danger',
            Medium: 'warning',
            Low: 'info',
        };
        return variants[priority] || 'default';
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            Pending: { variant: 'warning', icon: Clock },
            'In Progress': { variant: 'info', icon: AlertCircle },
            Completed: { variant: 'success', icon: CheckCircle },
        };
        return variants[status] || variants.Pending;
    };

    const columns = [
        {
            key: 'ticketNumber',
            label: 'Ticket',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                            {(`MNT-${item.id.slice(0,8)}`)}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{item.room_name}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'issue',
            label: 'Issue',
            render: (item: any) => (
                <div>
                    <p className="text-sm text-slate-900 dark:text-white font-medium">{item.title}</p>
                    <Badge variant="purple" size="sm">{item.issue_type}</Badge>
                </div>
            ),
        },
        {
            key: 'tenant',
            label: 'Reported By',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-900 dark:text-white">{item.assigned_to}</span>
                </div>
            ),
        },
        {
            key: 'priority',
            label: 'Priority',
            render: (item: any) => (
                <Badge variant={getPriorityBadge(item.priority)}>{item.priority}</Badge>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (item: any) => {
                const statusInfo = getStatusBadge(item.status);
                return (
                    <Badge variant={statusInfo.variant} dot>
                        {item.status}
                    </Badge>
                );
            },
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    {item.status !== 'Completed' && (
                        <Button size="sm" variant="ghost" title="Mark Complete" onClick={() => handleStatusChange(item.id, 'Completed')}>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        </Button>
                    )}
                    {item.status === 'Open' && (
                        <Button size="sm" variant="ghost" title="In Progress" onClick={() => handleStatusChange(item.id, 'In Progress')}>
                            <Clock className="w-4 h-4 text-blue-600" />
                        </Button>
                    )}
                    <Button size="sm" variant="ghost" title="Delete" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                </div>
            ),
        },
    ];

    const filteredRequests = requests.filter(r => {
        const q = searchQuery.toLowerCase()
        const matchSearch = q === '' ||
            r.title.toLowerCase().includes(q) ||
            (r.room_name || '').toLowerCase().includes(q) ||
            (r.description || '').toLowerCase().includes(q)
        const matchStatus = filterStatus === 'all' || r.status === filterStatus
        const matchPriority = filterPriority === 'all' || r.priority === filterPriority
        return matchSearch && matchStatus && matchPriority
    })

    // ─── Loading State ─────────────────────────────────────
    if (loading) {
        return (
            <div className="p-4 md:p-6 lg:p-8">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">Memuat data...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">

            {/* Action Loading Overlay */}
            {actionLoading && (
                <div className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-auto">
                    <div className="bg-white dark:bg-slate-800 rounded-xl px-6 py-4 shadow-xl flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Menyimpan...</span>
                    </div>
                </div>
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        Maintenance
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Manage maintenance requests and schedules
                    </p>
                </div>
                <Button className="w-full sm:w-auto" onClick={() => setIsFormOpen(true)}>
                    <Plus className="w-5 h-5" />
                    New Request
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Total</p>
                                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1 truncate">
                                    {requests.length}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <Wrench className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Pending</p>
                                <p className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 truncate">
                                    {requests.filter(r => r.status === 'Open').length}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <Clock className="w-5 h-5 md:w-6 md:h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">In Progress</p>
                                <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 truncate">
                                    {requests.filter(r => r.status === 'In Progress').length}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Completed</p>
                                <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                                    {requests.filter(r => r.status === 'Completed').length}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-3 md:p-4">
                    <div className="space-y-3">
                        <Input
                            placeholder="Search requests..."
                            leftIcon={<Search className="w-5 h-5" />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full md:hidden"
                        >
                            <Filter className="w-4 h-4" />
                            {showFilters ? 'Hide' : 'Show'} Filters
                        </Button>
                        <div className={`grid grid-cols-1 gap-3 md:grid-cols-3 ${showFilters ? 'block' : 'hidden md:grid'}`}>
                            <Select options={categoryOptions} />
                            <Select options={priorityOptions} value={filterPriority} onChange={e => setFilterPriority(e.target.value)} />
                            <Select options={statusOptions} value={filterStatus} onChange={e => setFilterStatus(e.target.value)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-3">
                {filteredRequests.map((request) => {
                    const statusInfo = getStatusBadge(request.status);
                    return (
                        <Card key={request.id} hover>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 dark:text-white truncate">
                                            {(`MNT-${request.id.slice(0,8)}`)}
                                        </h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">{request.room_name}</p>
                                    </div>
                                    <Badge variant={statusInfo.variant} dot size="sm">
                                        {request.status}
                                    </Badge>
                                </div>
                                <div className="space-y-2 text-sm mb-3">
                                    <p className="text-slate-900 dark:text-white font-medium">{request.title}</p>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="purple" size="sm">{request.issue_type}</Badge>
                                        <Badge variant={getPriorityBadge(request.priority)} size="sm">
                                            {request.priority}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                                        <User className="w-4 h-4" />
                                        <span>{request.assigned_to}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <Calendar className="w-4 h-4" />
                                        <span>Reported: {formatDate(request.reported_date)}</span>
                                    </div>
                                    {request.assigned_to && (
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-600 dark:text-slate-400">Assigned to:</span>
                                            <span className="text-slate-900 dark:text-white font-medium">{request.assigned_to}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                                    <Button size="sm" variant="outline" className="flex-1">
                                        <Eye className="w-4 h-4" />
                                        View
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
                <Table data={filteredRequests} columns={columns} />
            </div>

            {/* Add Maintenance Form */}
            <AddMaintenanceForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                rooms={rooms}
            />
        </div>
    );
}