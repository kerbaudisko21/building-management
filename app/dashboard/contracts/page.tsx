'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import {
    FileText,
    Plus,
    Search,
    Filter,
    User,
    Calendar,
    DollarSign,
    Eye,
    Download,
    AlertCircle,
    CheckCircle,
    Clock, XCircle,
} from 'lucide-react';

export default function ContractsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const contracts = [
        {
            id: 1,
            contractNumber: 'CNT-2024-001',
            tenant: 'John Doe',
            room: 'Room 305 - Building A',
            startDate: '2024-01-15',
            endDate: '2025-01-14',
            monthlyRate: 3500000,
            deposit: 7000000,
            status: 'Active',
            daysUntilExpiry: 35,
            autoRenew: true,
        },
        {
            id: 2,
            contractNumber: 'CNT-2024-002',
            tenant: 'Jane Smith',
            room: 'Room 201 - Building B',
            startDate: '2024-02-20',
            endDate: '2026-02-19',
            monthlyRate: 2500000,
            deposit: 5000000,
            status: 'Active',
            daysUntilExpiry: 437,
            autoRenew: false,
        },
        {
            id: 3,
            contractNumber: 'CNT-2024-003',
            tenant: 'Bob Johnson',
            room: 'Room 102 - Building A',
            startDate: '2024-03-10',
            endDate: '2024-12-31',
            monthlyRate: 2500000,
            deposit: 5000000,
            status: 'Expiring Soon',
            daysUntilExpiry: 21,
            autoRenew: false,
        },
        {
            id: 4,
            contractNumber: 'CNT-2023-045',
            tenant: 'Alice Williams',
            room: 'Room 405 - Building C',
            startDate: '2023-11-05',
            endDate: '2024-11-04',
            monthlyRate: 3000000,
            deposit: 6000000,
            status: 'Expired',
            daysUntilExpiry: -36,
            autoRenew: false,
        },
        {
            id: 5,
            contractNumber: 'CNT-2024-004',
            tenant: 'Charlie Brown',
            room: 'Room 501 - Building B',
            startDate: '2024-06-01',
            endDate: '2025-05-31',
            monthlyRate: 4500000,
            deposit: 9000000,
            status: 'Active',
            daysUntilExpiry: 172,
            autoRenew: true,
        },
    ];

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'expiring-soon', label: 'Expiring Soon' },
        { value: 'expired', label: 'Expired' },
        { value: 'terminated', label: 'Terminated' },
    ];

    const propertyOptions = [
        { value: 'all', label: 'All Properties' },
        { value: 'building-a', label: 'Building A' },
        { value: 'building-b', label: 'Building B' },
        { value: 'building-c', label: 'Building C' },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            Active: { variant: 'success', icon: CheckCircle },
            'Expiring Soon': { variant: 'warning', icon: AlertCircle },
            Expired: { variant: 'danger', icon: XCircle },
            Terminated: { variant: 'default', icon: XCircle },
        };
        return variants[status] || variants.Active;
    };

    // Table columns
    const columns = [
        {
            key: 'contractNumber',
            label: 'Contract',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                            {item.contractNumber}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            {item.room}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: 'tenant',
            label: 'Tenant',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-900 dark:text-white">{item.tenant}</span>
                </div>
            ),
        },
        {
            key: 'period',
            label: 'Contract Period',
            render: (item: any) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-900 dark:text-white">
              {formatDate(item.startDate)}
            </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-600 dark:text-slate-400">to</span>
                        <span className="text-slate-900 dark:text-white">
              {formatDate(item.endDate)}
            </span>
                    </div>
                </div>
            ),
        },
        {
            key: 'monthlyRate',
            label: 'Monthly Rate',
            sortable: true,
            render: (item: any) => (
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
          {formatCurrency(item.monthlyRate)}
        </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (item: any) => {
                const statusInfo = getStatusBadge(item.status);
                const StatusIcon = statusInfo.icon;
                return (
                    <div>
                        <Badge variant={statusInfo.variant} dot>
                            {item.status}
                        </Badge>
                        {item.status === 'Expiring Soon' && (
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                {item.daysUntilExpiry} days left
                            </p>
                        )}
                    </div>
                );
            },
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        Contracts
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Manage tenant contracts and agreements
                    </p>
                </div>
                <Button className="w-full sm:w-auto">
                    <Plus className="w-5 h-5" />
                    New Contract
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Total</p>
                        <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {contracts.length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Active</p>
                        <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                            {contracts.filter(c => c.status === 'Active').length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Expiring Soon</p>
                        <p className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                            {contracts.filter(c => c.status === 'Expiring Soon').length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Expired</p>
                        <p className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                            {contracts.filter(c => c.status === 'Expired').length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-3 md:p-4">
                    <div className="space-y-3">
                        <Input
                            placeholder="Search contracts..."
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
                            <Select options={statusOptions} placeholder="Status" />
                            <Select options={propertyOptions} placeholder="Property" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Mobile View - Cards */}
            <div className="block md:hidden space-y-3">
                {contracts.map((contract) => {
                    const statusInfo = getStatusBadge(contract.status);
                    const StatusIcon = statusInfo.icon;

                    return (
                        <Card key={contract.id} hover>
                            <CardContent className="p-4">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 dark:text-white truncate">
                                            {contract.contractNumber}
                                        </h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                            {contract.room}
                                        </p>
                                    </div>
                                    <Badge variant={statusInfo.variant} dot size="sm">
                                        {contract.status}
                                    </Badge>
                                </div>

                                {/* Tenant */}
                                <div className="flex items-center gap-2 mb-3">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-900 dark:text-white">{contract.tenant}</span>
                                </div>

                                {/* Info Grid */}
                                <div className="space-y-2 mb-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Period:</span>
                                        <span className="text-slate-900 dark:text-white font-medium">
                      {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                    </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Monthly:</span>
                                        <span className="text-slate-900 dark:text-white font-semibold">
                      {formatCurrency(contract.monthlyRate)}
                    </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Deposit:</span>
                                        <span className="text-slate-900 dark:text-white font-medium">
                      {formatCurrency(contract.deposit)}
                    </span>
                                    </div>
                                    {contract.status === 'Expiring Soon' && (
                                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                                            <AlertCircle className="w-4 h-4 text-amber-600" />
                                            <span className="text-amber-600 dark:text-amber-400 font-medium">
                        {contract.daysUntilExpiry} days until expiry
                      </span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                                    <Button size="sm" variant="outline" className="flex-1">
                                        <Eye className="w-4 h-4" />
                                        View
                                    </Button>
                                    <Button size="sm" variant="outline" className="flex-1">
                                        <Download className="w-4 h-4" />
                                        Download
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block">
                <Table
                    data={contracts}
                    columns={columns}
                    emptyMessage="No contracts found"
                />
            </div>
        </div>
    );
}