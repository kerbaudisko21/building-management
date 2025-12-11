'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import {
    Receipt,
    Plus,
    Search,
    Filter,
    User,
    Calendar,
    Eye,
    Download,
    Send,
    CheckCircle,
    Clock,
    AlertCircle, XCircle,
} from 'lucide-react';

export default function InvoicesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const invoices = [
        {
            id: 1,
            invoiceNumber: 'INV-2024-001',
            tenant: 'John Doe',
            room: 'Room 305 - Building A',
            issueDate: '2024-12-01',
            dueDate: '2024-12-10',
            amount: 3500000,
            status: 'Paid',
            paidDate: '2024-12-08',
            paymentMethod: 'Bank Transfer',
        },
        {
            id: 2,
            invoiceNumber: 'INV-2024-002',
            tenant: 'Jane Smith',
            room: 'Room 201 - Building B',
            issueDate: '2024-12-01',
            dueDate: '2024-12-10',
            amount: 2500000,
            status: 'Pending',
            paidDate: null,
            paymentMethod: null,
        },
        {
            id: 3,
            invoiceNumber: 'INV-2024-003',
            tenant: 'Bob Johnson',
            room: 'Room 102 - Building A',
            issueDate: '2024-11-25',
            dueDate: '2024-12-05',
            amount: 2500000,
            status: 'Overdue',
            paidDate: null,
            paymentMethod: null,
        },
        {
            id: 4,
            invoiceNumber: 'INV-2024-004',
            tenant: 'Alice Williams',
            room: 'Room 405 - Building C',
            issueDate: '2024-12-01',
            dueDate: '2024-12-10',
            amount: 3000000,
            status: 'Paid',
            paidDate: '2024-12-05',
            paymentMethod: 'Cash',
        },
        {
            id: 5,
            invoiceNumber: 'INV-2024-005',
            tenant: 'Charlie Brown',
            room: 'Room 501 - Building B',
            issueDate: '2024-12-01',
            dueDate: '2024-12-10',
            amount: 4500000,
            status: 'Pending',
            paidDate: null,
            paymentMethod: null,
        },
        {
            id: 6,
            invoiceNumber: 'INV-2024-006',
            tenant: 'Diana Prince',
            room: 'Room 302 - Building A',
            issueDate: '2024-11-20',
            dueDate: '2024-11-30',
            amount: 2800000,
            status: 'Cancelled',
            paidDate: null,
            paymentMethod: null,
        },
    ];

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'paid', label: 'Paid' },
        { value: 'pending', label: 'Pending' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'cancelled', label: 'Cancelled' },
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
            Paid: { variant: 'success', icon: CheckCircle },
            Pending: { variant: 'warning', icon: Clock },
            Overdue: { variant: 'danger', icon: AlertCircle },
            Cancelled: { variant: 'default', icon: XCircle },
        };
        return variants[status] || variants.Pending;
    };

    const columns = [
        {
            key: 'invoiceNumber',
            label: 'Invoice',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                            {item.invoiceNumber}
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
            key: 'dates',
            label: 'Issue / Due Date',
            render: (item: any) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-900 dark:text-white">
              {formatDate(item.issueDate)}
            </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Due:</span>
                        <span className="text-slate-900 dark:text-white">
              {formatDate(item.dueDate)}
            </span>
                    </div>
                </div>
            ),
        },
        {
            key: 'amount',
            label: 'Amount',
            sortable: true,
            render: (item: any) => (
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
          {formatCurrency(item.amount)}
        </span>
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
                    <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                    </Button>
                    {item.status === 'Pending' && (
                        <Button size="sm" variant="ghost">
                            <Send className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidAmount = invoices
        .filter(inv => inv.status === 'Paid')
        .reduce((sum, inv) => sum + inv.amount, 0);
    const pendingAmount = invoices
        .filter(inv => inv.status === 'Pending' || inv.status === 'Overdue')
        .reduce((sum, inv) => sum + inv.amount, 0);

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        Invoices
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Manage and track invoice payments
                    </p>
                </div>
                <Button className="w-full sm:w-auto">
                    <Plus className="w-5 h-5" />
                    Create Invoice
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Total</p>
                        <p className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mt-1 truncate">
                            {formatCurrency(totalAmount)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Paid</p>
                        <p className="text-lg md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                            {formatCurrency(paidAmount)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Pending</p>
                        <p className="text-lg md:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 truncate">
                            {formatCurrency(pendingAmount)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Overdue</p>
                        <p className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                            {invoices.filter(i => i.status === 'Overdue').length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-3 md:p-4">
                    <div className="space-y-3">
                        <Input
                            placeholder="Search invoices..."
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

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-3">
                {invoices.map((invoice) => {
                    const statusInfo = getStatusBadge(invoice.status);

                    return (
                        <Card key={invoice.id} hover>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 dark:text-white truncate">
                                            {invoice.invoiceNumber}
                                        </h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                            {invoice.room}
                                        </p>
                                    </div>
                                    <Badge variant={statusInfo.variant} dot size="sm">
                                        {invoice.status}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-900 dark:text-white">{invoice.tenant}</span>
                                </div>

                                <div className="flex items-center justify-between mb-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Amount:</span>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatCurrency(invoice.amount)}
                  </span>
                                </div>

                                <div className="space-y-2 mb-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Issue Date:</span>
                                        <span className="text-slate-900 dark:text-white font-medium">
                      {formatDate(invoice.issueDate)}
                    </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Due Date:</span>
                                        <span className="text-slate-900 dark:text-white font-medium">
                      {formatDate(invoice.dueDate)}
                    </span>
                                    </div>
                                    {invoice.paidDate && (
                                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                                            <span className="text-slate-600 dark:text-slate-400">Paid:</span>
                                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {formatDate(invoice.paidDate)} • {invoice.paymentMethod}
                      </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                                    <Button size="sm" variant="outline" className="flex-1">
                                        <Eye className="w-4 h-4" />
                                        View
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                    {invoice.status === 'Pending' && (
                                        <Button size="sm" variant="ghost">
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
                <Table
                    data={invoices}
                    columns={columns}
                    emptyMessage="No invoices found"
                />
            </div>
        </div>
    );
}