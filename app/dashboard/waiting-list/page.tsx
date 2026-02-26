'use client';

import { useState } from 'react'
import { waitingListService, contactService } from '@/lib/services'
import { useCrud } from '@/lib/hooks/useSupabaseQuery'
import type { WaitingListRow, WaitingListInsert, WaitingListUpdate } from '@/types/database'
import { formatCurrency, formatCurrencyShort, formatDate } from '@/utils'
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import AddWaitingListForm, { WaitingListFormData } from '@/components/forms/AddWaitingListForm';
import {
    Users,
    Plus,
    Search,
    Filter,
    Clock,
    Phone,
    Building,
    Home,
    DollarSign,
    Calendar,
    CheckCircle,
    Edit,
    Trash2,
    UserPlus,
Loader2, } from 'lucide-react';
import { useToast } from '@/components/ui/Toast'

export default function WaitingListPage() {
    const { toast, confirm } = useToast()
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterProperty, setFilterProperty] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProspect, setEditingProspect] = useState<WaitingListRow | null>(null)

    const {
        items: prospects,
        loading,
        error,
        addItem,
        updateItem,
        removeItem,
        actionLoading,
    } = useCrud<WaitingListRow, WaitingListInsert, WaitingListUpdate>({
        service: waitingListService,
        orderBy: 'created_at',
    })


    const propertyOptions = [
        { value: 'all', label: 'All Properties' },
        { value: 'Menteng Residence', label: 'Menteng Residence' },
        { value: 'BSD City Apartment', label: 'BSD City Apartment' },
        { value: 'Kemang Suites', label: 'Kemang Suites' },
        { value: 'Sudirman Park', label: 'Sudirman Park' },
    ];

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'New', label: 'New' },
        { value: 'Contacted', label: 'Contacted' },
        { value: 'Interested', label: 'Interested' },
        { value: 'Not Interested', label: 'Not Interested' },
    ];

    const getDaysUntilEntry = (dateString: string) => {
        const today = new Date();
        const entryDate = new Date(dateString);
        const diffTime = entryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            'New': 'info',
            'Contacted': 'warning',
            'Interested': 'success',
            'Not Interested': 'default',
        };
        return variants[status] || 'default';
    };

    const columns = [
        {
            key: 'name',
            label: 'Prospect Info',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                            {item.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                {item.phone}
                            </p>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'property',
            label: 'Property & Unit',
            render: (item: any) => (
                <div className="min-w-0">
                    <div className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <p className="text-sm text-slate-900 dark:text-white truncate">
                            {('—')}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                        <Home className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                            {item.unit_type}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: 'budget',
            label: 'Budget',
            sortable: true,
            render: (item: any) => (
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {formatCurrencyShort(item.budget)}
                </div>
            ),
        },
        {
            key: 'date',
            label: 'Entry Plan',
            sortable: true,
            render: (item: any) => {
                const daysUntil = getDaysUntilEntry(item.date_entry_plan);
                return (
                    <div>
                        <p className="text-sm text-slate-900 dark:text-white">
                            {formatDate(item.date_entry_plan)}
                        </p>
                        <p className={`text-xs mt-0.5 ${
                            daysUntil < 0 ? 'text-red-600' :
                                daysUntil <= 7 ? 'text-amber-600' :
                                    'text-slate-500'
                        }`}>
                            {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` :
                                daysUntil === 0 ? 'Today' :
                                    daysUntil === 1 ? 'Tomorrow' :
                                        `In ${daysUntil} days`}
                        </p>
                    </div>
                );
            },
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (item: any) => (
                <Badge variant={getStatusBadge(item.status)} dot>
                    {item.status}
                </Badge>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" title="Convert to customer" onClick={() => handleConvert(item)}>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                </div>
            ),
        },
    ];

    const handleFormSubmit = async (data: WaitingListFormData) => {
        if (editingProspect) {
            const updResult = await updateItem(editingProspect.id, data as unknown as WaitingListUpdate)
            if (updResult.error) toast.error('Gagal mengupdate', updResult.error)
            else toast.success('Berhasil', 'Data berhasil diupdate')
        } else {
            const addResult = await addItem({ ...data, unit_type: data.room_unit, source: '', status: 'Waiting' } as unknown as WaitingListInsert)
            if (addResult.error) toast.error('Gagal menyimpan', addResult.error)
            else toast.success('Berhasil', 'Data berhasil ditambahkan')
        }
        setEditingProspect(null)
    }


    const handleEdit = (prospect: any) => {
        setEditingProspect(prospect);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        const yes = await confirm({ title: 'Konfirmasi Hapus', message: 'Apakah kamu yakin ingin menghapus data ini? Tindakan ini tidak bisa dibatalkan.', variant: 'danger' })
        if (!yes) return
        const delResult = await removeItem(id)
        if (delResult.error) toast.error('Gagal menghapus', delResult.error)
        else toast.success('Berhasil', 'Data berhasil dihapus')
    }


    const handleConvert = async (prospect: WaitingListRow) => {
        const yes = await confirm({ title: 'Convert ke Customer', message: `Convert ${prospect.name} menjadi contact (Customer)?`, variant: 'info' })
        if (!yes) return
        const contactResult = await contactService.create({
            name: prospect.name,
            no_ktp: '-',
            no_wa: prospect.phone,
            address: '-',
            type: 'Customer',
            room: prospect.unit_type || '-',
            status: 'Active',
            date_check_in: null,
        } as any)
        if (contactResult.error) {
            toast.error('Gagal convert', contactResult.error)
            return
        }
        await updateItem(prospect.id, { status: 'Approved' } as any)
        toast.success('Berhasil', `${prospect.name} berhasil di-convert ke Customer`)
    }

    const handleAddNew = () => {
        setEditingProspect(null);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingProspect(null);
    };

    // Filter prospects
    const filteredProspects = prospects.filter(prospect => {
        const matchSearch = prospect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prospect.phone.includes(searchQuery) ||
            ('—').toLowerCase().includes(searchQuery.toLowerCase());
        const matchProperty = filterProperty === 'all' || ('—') === filterProperty;
        const matchStatus = filterStatus === 'all' || prospect.status === filterStatus;
        return matchSearch && matchProperty && matchStatus;
    });

    // Stats
    const totalProspects = prospects.length;
    const newProspects = prospects.filter(p => p.status === 'Waiting').length;
    const interestedProspects = prospects.filter(p => p.status === 'Contacted').length;
    const avgBudget = Math.round(
        prospects.reduce((sum, p) => sum + p.budget, 0) / prospects.length
    );

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
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        Waiting List
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Track prospects interested in your properties
                    </p>
                </div>
                <Button className="w-full sm:w-auto" onClick={handleAddNew}>
                    <Plus className="w-5 h-5" />
                    Add Prospect
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Total Prospects
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1 truncate">
                                    {totalProspects}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 ml-2">
                                <Users className="w-5 h-5 md:w-6 md:h-6 text-slate-600 dark:text-slate-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    New
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 truncate">
                                    {newProspects}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Interested
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                                    {interestedProspects}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Avg Budget
                                </p>
                                <p className="text-base md:text-xl font-bold text-purple-600 dark:text-purple-400 mt-1 truncate">
                                    {formatCurrencyShort(avgBudget)}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search & Filters */}
            <Card>
                <CardContent className="p-3 md:p-4">
                    <div className="space-y-3">
                        <Input
                            placeholder="Search by name, phone, or property..."
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
                        <div className={`grid grid-cols-1 gap-3 md:grid-cols-2 ${showFilters ? 'block' : 'hidden md:grid'}`}>
                            <Select
                                options={propertyOptions}
                                value={filterProperty}
                                onChange={(e) => setFilterProperty(e.target.value)}
                            />
                            <Select
                                options={statusOptions}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-3">
                {filteredProspects.map((prospect) => {
                    const daysUntil = getDaysUntilEntry(prospect.date_entry_plan || '');
                    return (
                        <Card key={prospect.id} hover>
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                        <UserPlus className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                                            {prospect.name}
                                        </h3>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <Phone className="w-3 h-3 text-slate-400" />
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                {prospect.phone}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant={getStatusBadge(prospect.status)} dot size="sm">
                                        {prospect.status}
                                    </Badge>
                                </div>

                                <div className="space-y-2 mb-3 text-sm">
                                    <div className="flex items-start gap-2">
                                        <Building className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-slate-900 dark:text-white font-medium truncate">
                                                {('—')}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                                {prospect.unit_type}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                                        <p className="text-slate-500 dark:text-slate-400">Budget</p>
                                        <p className="font-bold text-purple-600 dark:text-purple-400">
                                            {formatCurrency(prospect.budget)}
                                        </p>
                                    </div>
                                    <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded">
                                        <p className="text-slate-500 dark:text-slate-400">Entry Plan</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">
                                            {formatDate(prospect.date_entry_plan || '')}
                                        </p>
                                        <p className={`text-xs mt-0.5 ${
                                            daysUntil < 0 ? 'text-red-600' :
                                                daysUntil <= 7 ? 'text-amber-600' :
                                                    'text-slate-500'
                                        }`}>
                                            {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` :
                                                daysUntil === 0 ? 'Today' :
                                                    daysUntil === 1 ? 'Tomorrow' :
                                                        `In ${daysUntil} days`}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(prospect)}>
                                        <Edit className="w-4 h-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleDelete(prospect.id)}>
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
                <Table data={filteredProspects} columns={columns} />
            </div>

            {/* Add/Edit Form */}
            <AddWaitingListForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleFormSubmit}
                editData={editingProspect as unknown as WaitingListFormData | null}
            />
        </div>
    );
}