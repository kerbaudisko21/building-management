'use client';

import { useState } from 'react'
import { contractService } from '@/lib/services'
import { useCrud } from '@/lib/hooks/useSupabaseQuery'
import type { ContractRow, ContractInsert, ContractUpdate } from '@/types/database'
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import AddContractForm, { ContractFormData } from '@/components/forms/AddContractForm';
import { formatCurrency, formatCurrencyShort } from '@/utils/currency';
import { formatDate, getDaysBetween, formatCountdown } from '@/utils/date';
import {
    FileText,
    Plus,
    Search,
    Filter,
    User,
    Building,
    Home,
    Calendar,
    DollarSign,
    Clock,
    CheckCircle,
    AlertCircle,
    Edit,
    Trash2,
    Download,
Loader2, } from 'lucide-react';
import { useToast } from '@/components/ui/Toast'

export default function ContractsPage() {
    const { toast, confirm } = useToast()
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRentType, setFilterRentType] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingContract, setEditingContract] = useState<ContractRow | null>(null)

    const {
        items: contracts,
        loading,
        error,
        addItem,
        updateItem,
        removeItem,
        actionLoading,
    } = useCrud<ContractRow, ContractInsert, ContractUpdate>({
        service: contractService,
        orderBy: 'created_at',
    })


    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'Active', label: 'Active' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Expired', label: 'Expired' },
        { value: 'Cancelled', label: 'Cancelled' },
    ];

    const rentTypeOptions = [
        { value: 'all', label: 'All Rent Types' },
        { value: 'flexible', label: 'Flexible' },
        { value: 'daily', label: 'Daily' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
    ];

    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            'Active': 'success',
            'Completed': 'info',
            'Expired': 'danger',
            'Cancelled': 'default',
        };
        return variants[status] || 'default';
    };

    const getRentTypeBadge = (rentType: string) => {
        const variants: Record<string, any> = {
            'flexible': 'purple',
            'daily': 'info',
            'monthly': 'success',
            'yearly': 'default',
        };
        return variants[rentType] || 'default';
    };

    const getRentTypeLabel = (rentType: string) => {
        const labels: Record<string, string> = {
            'flexible': 'Flexible',
            'daily': 'Daily',
            'monthly': 'Monthly',
            'yearly': 'Yearly',
        };
        return labels[rentType] || rentType;
    };

    const getDaysRemainingColor = (days: number) => {
        if (days < 0) return 'text-red-600 dark:text-red-400';
        if (days <= 7) return 'text-amber-600 dark:text-amber-400';
        if (days <= 30) return 'text-blue-600 dark:text-blue-400';
        return 'text-emerald-600 dark:text-emerald-400';
    };

    const columns = [
        {
            key: 'number',
            label: 'Contract Info',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                            {item.number}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            {formatDate(item.date_check_in)}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: 'parties',
            label: 'Customer & Owner',
            render: (item: any) => (
                <div className="text-xs space-y-1">
                    <div>
                        <p className="text-slate-500 dark:text-slate-400">Customer:</p>
                        <p className="text-slate-900 dark:text-white font-medium truncate">
                            {item.name_customer}
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400">Owner:</p>
                        <p className="text-slate-900 dark:text-white font-medium truncate">
                            {item.name_owner}
                        </p>
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
                            {item.property}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                        <Home className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                            {item.room_unit}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: 'period',
            label: 'Period & Type',
            render: (item: any) => (
                <div>
                    <Badge variant={getRentTypeBadge(item.rent_type)} size="sm">
                        {getRentTypeLabel(item.rent_type)}
                    </Badge>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {formatDate(item.date_check_in)} - {formatDate(item.date_check_out)}
                    </p>
                </div>
            ),
        },
        {
            key: 'amount',
            label: 'Amount',
            sortable: true,
            render: (item: any) => (
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {formatCurrencyShort(item.amount_rent)}
                </div>
            ),
        },
        {
            key: 'remaining',
            label: 'Days Remaining',
            sortable: true,
            render: (item: any) => (
                <div>
                    <p className={`text-sm font-bold ${getDaysRemainingColor(item.days_remaining)}`}>
                        {item.days_remaining < 0
                            ? `${Math.abs(item.days_remaining)} days overdue`
                            : item.days_remaining === 0
                                ? 'Ending today'
                                : `${item.days_remaining} days`
                        }
                    </p>
                </div>
            ),
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
                    <Button size="sm" variant="ghost" title="Download contract">
                        <Download className="w-4 h-4" />
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

    const handleFormSubmit = async (data: ContractFormData) => {
        if (editingContract) {
            const updResult = await updateItem(editingContract.id, data as unknown as ContractUpdate)
            if (updResult.error) toast.error('Gagal mengupdate', updResult.error)
            else toast.success('Berhasil', 'Data berhasil diupdate')
        } else {
            const number = `CTR-${new Date().getFullYear()}-${String(contracts.length + 1).padStart(3, '0')}`
            const addResult = await addItem({ ...data, number, status: 'Active', deposit: 0, payment_status: 'Pending' } as unknown as ContractInsert)
            if (addResult.error) toast.error('Gagal menyimpan', addResult.error)
            else toast.success('Berhasil', 'Data berhasil ditambahkan')
        }
        setEditingContract(null)
    }


    const handleEdit = (contract: any) => {
        setEditingContract(contract);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        const yes = await confirm({ title: 'Konfirmasi Hapus', message: 'Apakah kamu yakin ingin menghapus data ini? Tindakan ini tidak bisa dibatalkan.', variant: 'danger' })
        if (!yes) return
        const delResult = await removeItem(id)
        if (delResult.error) toast.error('Gagal menghapus', delResult.error)
        else toast.success('Berhasil', 'Data berhasil dihapus')
    }


    const handleAddNew = () => {
        setEditingContract(null);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingContract(null);
    };

    // Filter contracts
    const filteredContracts = contracts.filter(contract => {
        const matchSearch = contract.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contract.name_customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (contract.property_id || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = filterStatus === 'all' || contract.status === filterStatus;
        const matchRentType = filterRentType === 'all' || contract.rent_type === filterRentType;
        return matchSearch && matchStatus && matchRentType;
    });

    // Stats
    const totalContracts = contracts.length;
    const activeContracts = contracts.filter(c => c.status === 'Active').length;
    const expiringSoon = contracts.filter(c => c.status === 'Active' && c.days_remaining <= 30 && c.days_remaining > 0).length;
    const totalRevenue = contracts.filter(c => c.status === 'Active').reduce((sum, c) => sum + c.amount_rent, 0);

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
                        Contracts
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Manage rental contracts and agreements
                    </p>
                </div>
                <Button className="w-full sm:w-auto" onClick={handleAddNew}>
                    <Plus className="w-5 h-5" />
                    New Contract
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Total Contracts
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1 truncate">
                                    {totalContracts}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 ml-2">
                                <FileText className="w-5 h-5 md:w-6 md:h-6 text-slate-600 dark:text-slate-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Active
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                                    {activeContracts}
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
                                    Expiring Soon
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 truncate">
                                    {expiringSoon}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Total Revenue
                                </p>
                                <p className="text-base md:text-xl font-bold text-purple-600 dark:text-purple-400 mt-1 truncate">
                                    {formatCurrencyShort(totalRevenue)}
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
                            placeholder="Search by contract number, customer, or property..."
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
                                options={statusOptions}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            />
                            <Select
                                options={rentTypeOptions}
                                value={filterRentType}
                                onChange={(e) => setFilterRentType(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-3">
                {filteredContracts.map((contract) => (
                    <Card key={contract.id} hover>
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                                        {contract.number}
                                    </h3>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        {formatDate(contract.date_check_in || '')}
                                    </p>
                                    <div className="flex gap-2 mt-1">
                                        <Badge variant={getRentTypeBadge(contract.rent_type)} size="sm">
                                            {getRentTypeLabel(contract.rent_type)}
                                        </Badge>
                                        <Badge variant={getStatusBadge(contract.status)} dot size="sm">
                                            {contract.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-3 text-sm">
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Customer:</p>
                                    <p className="text-slate-900 dark:text-white font-medium">{contract.name_customer}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Owner:</p>
                                    <p className="text-slate-900 dark:text-white font-medium">{contract.name_owner}</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Building className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-slate-900 dark:text-white font-medium truncate">
                                            {contract.property_id || '-'}
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                            {contract.room_id || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                                    <p className="text-slate-500 dark:text-slate-400">Amount</p>
                                    <p className="font-bold text-purple-600 dark:text-purple-400">
                                        {formatCurrency(contract.amount_rent)}
                                    </p>
                                </div>
                                <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded">
                                    <p className="text-slate-500 dark:text-slate-400">Days Left</p>
                                    <p className={`font-bold ${getDaysRemainingColor(contract.days_remaining)}`}>
                                        {contract.days_remaining < 0
                                            ? `${Math.abs(contract.days_remaining)} overdue`
                                            : contract.days_remaining === 0
                                                ? 'Ending today'
                                                : `${contract.days_remaining} days`
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(contract)}>
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleDelete(contract.id)}>
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="hidden md:block">
                <Table data={filteredContracts} columns={columns} />
            </div>

            <AddContractForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleFormSubmit}
                editData={editingContract as unknown as ContractFormData | null}
            />
        </div>
    );
}