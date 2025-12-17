'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import AddCashInForm, { CashInFormData } from '@/components/forms/AddCashInForm';
import {
    TrendingUp,
    Plus,
    Search,
    Filter,
    Calendar,
    User,
    Eye,
    Edit,
    Trash2,
} from 'lucide-react';

export default function CashInPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [transactions, setTransactions] = useState([
        {
            id: 1,
            date: '2024-12-08',
            category: 'Rent Payment',
            source: 'John Doe - Room 305',
            amount: 3500000,
            paymentMethod: 'Bank Transfer',
            reference: 'TRF-20241208-001',
            status: 'Completed',
        },
        {
            id: 2,
            date: '2024-12-08',
            category: 'Rent Payment',
            source: 'Jane Smith - Room 201',
            amount: 2500000,
            paymentMethod: 'Cash',
            reference: 'CASH-20241208-002',
            status: 'Completed',
        },
        {
            id: 3,
            date: '2024-12-07',
            category: 'Deposit',
            source: 'Bob Johnson - Room 102',
            amount: 5000000,
            paymentMethod: 'Bank Transfer',
            reference: 'TRF-20241207-003',
            status: 'Completed',
        },
        {
            id: 4,
            date: '2024-12-05',
            category: 'Utility Bills',
            source: 'Alice Williams - Room 405',
            amount: 250000,
            paymentMethod: 'E-Wallet',
            reference: 'EWALLET-20241205-004',
            status: 'Completed',
        },
        {
            id: 5,
            date: '2024-12-10',
            category: 'Rent Payment',
            source: 'Charlie Brown - Room 501',
            amount: 4500000,
            paymentMethod: 'Bank Transfer',
            reference: 'TRF-20241210-005',
            status: 'Pending',
        },
    ]);

    const handleFormSubmit = (data: CashInFormData) => {
        const newTransaction = {
            id: transactions.length + 1,
            date: data.date,
            category: data.category,
            source: data.source,
            amount: data.amount,
            paymentMethod: data.paymentMethod,
            reference: data.reference,
            status: 'Completed',
        };
        setTransactions([newTransaction, ...transactions]);
    };

    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        { value: 'rent', label: 'Rent Payment' },
        { value: 'deposit', label: 'Deposit' },
        { value: 'utility', label: 'Utility Bills' },
        { value: 'other', label: 'Other' },
    ];

    const methodOptions = [
        { value: 'all', label: 'All Methods' },
        { value: 'bank', label: 'Bank Transfer' },
        { value: 'cash', label: 'Cash' },
        { value: 'ewallet', label: 'E-Wallet' },
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
            render: (item: any) => <Badge variant="info">{item.category}</Badge>,
        },
        {
            key: 'source',
            label: 'Source',
            render: (item: any) => (
                <div>
                    <p className="text-sm text-slate-900 dark:text-white font-medium">
                        {item.source}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                        {item.reference}
                    </p>
                </div>
            ),
        },
        {
            key: 'amount',
            label: 'Amount',
            sortable: true,
            render: (item: any) => (
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
          +{formatCurrency(item.amount)}
        </span>
            ),
        },
        {
            key: 'paymentMethod',
            label: 'Method',
            render: (item: any) => (
                <Badge variant="purple" size="sm">{item.paymentMethod}</Badge>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (item: any) => (
                <Badge variant={item.status === 'Completed' ? 'success' : 'warning'} dot>
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

    const totalIncome = transactions
        .filter(t => t.status === 'Completed')
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        Cash In
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Track income and payments received
                    </p>
                </div>
                <Button className="w-full sm:w-auto" onClick={() => setIsFormOpen(true)}>
                    <Plus className="w-5 h-5" />
                    Add Income
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Total Income</p>
                                <p className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                                    {formatCurrency(totalIncome)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 md:p-6">
                        <p className="text-sm text-slate-600 dark:text-slate-400">This Month</p>
                        <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-2">
                            {formatCurrency(totalIncome * 0.8)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 md:p-6">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Transactions</p>
                        <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-2">
                            {transactions.length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-3 md:p-4">
                    <div className="space-y-3">
                        <Input
                            placeholder="Search transactions..."
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
                {transactions.map((tx) => (
                    <Card key={tx.id} hover>
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <Badge variant="info" size="sm">{tx.category}</Badge>
                                    <p className="text-sm text-slate-900 dark:text-white font-medium mt-1 truncate">
                                        {tx.source}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">{tx.reference}</p>
                                </div>
                                <Badge variant={tx.status === 'Completed' ? 'success' : 'warning'} dot size="sm">
                                    {tx.status}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between mb-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Amount:</span>
                                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  +{formatCurrency(tx.amount)}
                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm mb-3">
                                <span className="text-slate-600 dark:text-slate-400">Date:</span>
                                <span className="text-slate-900 dark:text-white">{formatDate(tx.date)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Method:</span>
                                <Badge variant="purple" size="sm">{tx.paymentMethod}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
                <Table data={transactions} columns={columns} />
            </div>

            <AddCashInForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
            />
        </div>
    );
}