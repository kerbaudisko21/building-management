'use client';

import { useState } from 'react'
import { invoiceService } from '@/lib/services'
import { useCrud } from '@/lib/hooks/useSupabaseQuery'
import type { InvoiceRow, InvoiceInsert, InvoiceUpdate } from '@/types/database'
import { formatCurrency, formatDate } from '@/utils'
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import AddInvoiceForm, { InvoiceFormData } from '@/components/forms/AddInvoiceForm';
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
    AlertCircle, XCircle, Trash2,
Loader2, } from 'lucide-react';
import { useToast } from '@/components/ui/Toast'

export default function InvoicesPage() {
    const { toast, confirm } = useToast()
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);

    const {
        items: invoices,
        loading,
        error,
        addItem,
        updateItem,
        removeItem,
        actionLoading,
        refetch,
    } = useCrud<InvoiceRow, InvoiceInsert, InvoiceUpdate>({
        service: invoiceService,
        orderBy: 'created_at',
    })


    const handleMarkPaid = async (id: string) => {
        const yes = await confirm({ title: 'Mark as Paid', message: 'Tandai invoice ini sebagai Paid?', variant: 'info' })
        if (!yes) return
        const result = await updateItem(id, { status: 'Paid' } as any)
        if (result.error) toast.error('Gagal', result.error)
        else toast.success('Berhasil', 'Invoice ditandai Paid')
    }

    const handleDeleteInvoice = async (id: string) => {
        const yes = await confirm({ title: 'Hapus Invoice', message: 'Yakin ingin menghapus invoice ini?', variant: 'danger' })
        if (!yes) return
        const result = await removeItem(id)
        if (result.error) toast.error('Gagal menghapus', result.error)
        else toast.success('Berhasil', 'Invoice berhasil dihapus')
    }

    const filteredInvoices = invoices.filter(inv => {
        const matchSearch = searchQuery === '' ||
            inv.tenant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.invoice_type?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchStatus = filterStatus === 'all' || inv.status === filterStatus
        const matchType = filterType === 'all' || inv.invoice_type === filterType
        return matchSearch && matchStatus && matchType
    })

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
                            {(`INV-${item.id.slice(0,8)}`)}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            {'—'}
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
                    <span className="text-sm text-slate-900 dark:text-white">{item.tenant_name}</span>
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
              {formatDate(item.issue_date)}
            </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Due:</span>
                        <span className="text-slate-900 dark:text-white">
              {formatDate(item.due_date)}
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
                    {(item.status === 'Pending' || item.status === 'Overdue') && (
                        <Button size="sm" variant="ghost" title="Mark as Paid" onClick={() => handleMarkPaid(item.id)}>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteInvoice(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
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
                        Invoices
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Manage and track invoice payments
                    </p>
                </div>
                <Button className="w-full sm:w-auto" onClick={() => setIsFormOpen(true)}>
                    <Plus className="w-5 h-5" />
                    Create Invoice
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Total</p>
                                <p className="text-base md:text-xl font-bold text-slate-900 dark:text-white mt-1 truncate">
                                    {formatCurrency(totalAmount).substring(0, 12)}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 ml-2">
                                <Receipt className="w-5 h-5 md:w-6 md:h-6 text-slate-600 dark:text-slate-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Paid</p>
                                <p className="text-base md:text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                                    {formatCurrency(paidAmount).substring(0, 12)}
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
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Pending</p>
                                <p className="text-base md:text-xl font-bold text-amber-600 dark:text-amber-400 mt-1 truncate">
                                    {formatCurrency(pendingAmount).substring(0, 12)}
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
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Overdue</p>
                                <p className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400 mt-1 truncate">
                                    {invoices.filter(i => i.status === 'Overdue').length}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
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
                            <Select options={statusOptions} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} />
                            <Select options={propertyOptions} value={filterType} onChange={(e) => setFilterType(e.target.value)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-3">
                {filteredInvoices.map((invoice) => {
                    const statusInfo = getStatusBadge(invoice.status);

                    return (
                        <Card key={invoice.id} hover>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 dark:text-white truncate">
                                            {`INV-${invoice.id.slice(0,8)}`}
                                        </h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                            {'—'}
                                        </p>
                                    </div>
                                    <Badge variant={statusInfo.variant} dot size="sm">
                                        {invoice.status}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-900 dark:text-white">{invoice.tenant_name}</span>
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
                      {formatDate(invoice.issue_date)}
                    </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Due Date:</span>
                                        <span className="text-slate-900 dark:text-white font-medium">
                      {formatDate(invoice.due_date)}
                    </span>
                                    </div>
                                    {invoice.paid_date && (
                                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                                            <span className="text-slate-600 dark:text-slate-400">Paid:</span>
                                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {formatDate(invoice.paid_date)} • {invoice.payment_method}
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
                    data={filteredInvoices}
                    columns={columns}
                    emptyMessage="No invoices found"
                />
            </div>

            {/* Add Invoice Form */}
            <AddInvoiceForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                            />
        </div>
    );

    async function handleFormSubmit(data: InvoiceFormData) {
        const insert: InvoiceInsert = {
            tenant_name: data.tenantId,
            invoice_type: data.invoiceType,
            amount: data.amount,
            issue_date: data.issueDate,
            due_date: data.dueDate,
            description: data.description || '',
            status: data.status === 'paid' ? 'Paid' : data.status === 'pending' ? 'Pending' : 'Overdue',
        }
        const addResult = await addItem(insert)
        if (addResult.error) toast.error('Gagal menyimpan', addResult.error)
        else toast.success('Berhasil', 'Data berhasil ditambahkan')
    }
}