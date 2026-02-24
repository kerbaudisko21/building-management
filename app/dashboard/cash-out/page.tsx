'use client';

import { useState } from 'react'
import { cashFlowService } from '@/lib/services'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { formatCurrency, formatDate } from '@/utils'
import type { CashFlowRow, CashFlowInsert } from '@/types/database'
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import AddCashOutForm, { CashOutFormData } from '@/components/forms/AddCashOutForm';
import {
    TrendingDown,
    Plus,
    Search,
    Filter,
    Calendar,
    DollarSign,
    Eye,
    Edit,
    Trash2,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast'

export default function CashOutPage() {
    const { toast } = useToast()
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const {
        data: expenseData,
        loading,
        error,
        refetch,
    } = useSupabaseQuery(() => cashFlowService.getCashOut())

    const expenses = expenseData ?? []


    const handleFormSubmit = async (data: CashOutFormData) => {
        const insert: CashFlowInsert = {
            date: data.date,
            category: data.category,
            description: data.description,
            recipient: data.vendor,
            amount: data.amount,
            payment_method: data.paymentMethod,
            reference: '',
            status: 'Completed',
            type: 'out',
            notes: data.notes || '',
        }
        await cashFlowService.create(insert)
        toast.success('Berhasil', 'Pengeluaran berhasil ditambahkan')
        refetch()
        setIsFormOpen(false)
    }


    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        { value: 'maintenance', label: 'Maintenance' },
        { value: 'utilities', label: 'Utilities' },
        { value: 'cleaning', label: 'Cleaning' },
        { value: 'supplies', label: 'Supplies' },
        { value: 'salary', label: 'Salary' },
        { value: 'other', label: 'Other' },
    ];

    const methodOptions = [
        { value: 'all', label: 'All Methods' },
        { value: 'bank', label: 'Bank Transfer' },
        { value: 'cash', label: 'Cash' },
        { value: 'ewallet', label: 'E-Wallet' },
    ];

    const totalExpense = expenses
        .filter(e => e.status === 'Paid')
        .reduce((sum, e) => sum + e.amount, 0);

    const columns = [
        {
            key: 'date',
            label: 'Date',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-900 dark:text-white">
            {formatDate(item.date)}
          </span>
                </div>
            ),
        },
        {
            key: 'category',
            label: 'Category',
            render: (item: any) => <Badge variant="purple">{item.category}</Badge>,
        },
        {
            key: 'description',
            label: 'Description',
            render: (item: any) => (
                <div>
                    <p className="text-sm text-slate-900 dark:text-white font-medium">
                        {item.description}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{item.recipient}</p>
                </div>
            ),
        },
        {
            key: 'amount',
            label: 'Amount',
            sortable: true,
            render: (item: any) => (
                <span className="text-sm font-bold text-red-600 dark:text-red-400">
          -{formatCurrency(item.amount)}
        </span>
            ),
        },
        {
            key: 'paymentMethod',
            label: 'Method',
            render: (item: any) => (
                <Badge variant="default" size="sm">{item.payment_method}</Badge>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (item: any) => (
                <Badge variant={item.status === 'Paid' ? 'success' : 'warning'} dot>
                    {item.status}
                </Badge>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                </div>
            ),
        },
    ];

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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        Cash Out
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Track expenses and payments made
                    </p>
                </div>
                <Button className="w-full sm:w-auto" onClick={() => setIsFormOpen(true)}>
                    <Plus className="w-5 h-5" />
                    Add Expense
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Total Expenses</p>
                                <p className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
                                    {formatCurrency(totalExpense)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 md:p-6">
                        <p className="text-sm text-slate-600 dark:text-slate-400">This Month</p>
                        <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-2">
                            {formatCurrency(totalExpense * 0.9)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 md:p-6">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Transactions</p>
                        <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-2">
                            {expenses.length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-3 md:p-4">
                    <div className="space-y-3">
                        <Input
                            placeholder="Search expenses..."
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
                            <Select options={methodOptions} />
                            <Input type="date" placeholder="Date" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-3">
                {expenses.map((expense) => (
                    <Card key={expense.id} hover>
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <Badge variant="purple" size="sm">{expense.category}</Badge>
                                    <p className="text-sm text-slate-900 dark:text-white font-medium mt-1">
                                        {expense.description}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">{expense.recipient}</p>
                                </div>
                                <Badge variant={expense.status === 'Paid' ? 'success' : 'warning'} dot size="sm">
                                    {expense.status}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between mb-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Amount:</span>
                                <span className="text-xl font-bold text-red-600 dark:text-red-400">
                  -{formatCurrency(expense.amount)}
                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm mb-3">
                                <span className="text-slate-600 dark:text-slate-400">Date:</span>
                                <span className="text-slate-900 dark:text-white">{formatDate(expense.date)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Method:</span>
                                <Badge variant="default" size="sm">{expense.payment_method}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
                <Table data={expenses} columns={columns} />
            </div>

            <AddCashOutForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
            />
        </div>
    );
}