'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import AddContractForm, { ContractFormData } from '@/components/forms/AddContractForm';
import { FileText, User, Home, Plus, Calendar, DollarSign, Search, Filter } from 'lucide-react';

export default function ContractsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    const tenants = [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
    ];

    const rooms = [
        { id: '1', name: 'Room 201' },
        { id: '2', name: 'Room 202' },
    ];

    const [contracts, setContracts] = useState([
        {
            id: '1',
            tenantName: 'John Doe',
            roomName: 'Room 201',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            monthlyRent: 5000000,
            status: 'active',
            daysRemaining: 180,
        },
        {
            id: '2',
            tenantName: 'Jane Smith',
            roomName: 'Room 301',
            startDate: '2024-06-01',
            endDate: '2024-11-30',
            monthlyRent: 4500000,
            status: 'expiring',
            daysRemaining: 14,
        },
    ]);

    const handleSubmit = (data: ContractFormData) => {
        const tenant = tenants.find(t => t.id === data.tenantId);
        const room = rooms.find(r => r.id === data.roomId);

        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        const today = new Date();
        const daysRemaining = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        const newContract = {
            id: Date.now().toString(),
            tenantName: tenant?.name || 'Unknown',
            roomName: room?.name || 'Unknown',
            startDate: data.startDate,
            endDate: data.endDate,
            monthlyRent: data.monthlyRent,
            status: daysRemaining < 30 ? 'expiring' : 'active',
            daysRemaining,
        };

        setContracts([...contracts, newContract]);
    };

    const getStatusBadge = (status: string) => {
        const config: Record<string, any> = {
            active: { variant: 'success', label: 'Active' },
            expiring: { variant: 'warning', label: 'Expiring Soon' },
            expired: { variant: 'danger', label: 'Expired' },
        };
        const s = config[status] || config.active;
        return <Badge variant={s.variant}>{s.label}</Badge>;
    };

    const columns = [
        {
            key: 'tenant',
            label: 'Tenant & Room',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{item.tenantName}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.roomName}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'period',
            label: 'Contract Period',
            render: (item: any) => (
                <div className="text-sm">
                    <p className="text-slate-900 dark:text-white">{item.startDate}</p>
                    <p className="text-slate-500 dark:text-slate-400">to {item.endDate}</p>
                </div>
            ),
        },
        {
            key: 'monthlyRent',
            label: 'Monthly Rent',
            sortable: true,
            render: (item: any) => (
                <div className="font-semibold text-slate-900 dark:text-white">
                    Rp {item.monthlyRent.toLocaleString('id-ID')}
                </div>
            ),
        },
        {
            key: 'daysRemaining',
            label: 'Days Remaining',
            sortable: true,
            render: (item: any) => (
                <div className={`font-semibold ${item.daysRemaining < 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {item.daysRemaining} days
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (item: any) => getStatusBadge(item.status),
        },
    ];

    return (
        <div className="p-4 md:p-6 space-y-6 pb-24 md:pb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Contracts</h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Manage tenant contracts and agreements
                    </p>
                </div>
                <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="w-5 h-5" />
                    New Contract
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Total</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{contracts.length}</p>
                            </div>
                            <FileText className="w-8 h-8 text-indigo-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Active</p>
                                <p className="text-2xl font-bold text-emerald-600 mt-1">
                                    {contracts.filter(c => c.status === 'active').length}
                                </p>
                            </div>
                            <FileText className="w-8 h-8 text-emerald-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Expiring</p>
                                <p className="text-2xl font-bold text-amber-600 mt-1">
                                    {contracts.filter(c => c.status === 'expiring').length}
                                </p>
                            </div>
                            <FileText className="w-8 h-8 text-amber-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Revenue</p>
                                <p className="text-lg font-bold text-blue-600 mt-1">
                                    {(contracts.reduce((sum, c) => sum + c.monthlyRent, 0) / 1000000).toFixed(0)}M
                                </p>
                            </div>
                            <DollarSign className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

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
                        <div className={`grid grid-cols-1 gap-3 ${showFilters ? 'block' : 'hidden md:grid'}`}>
                            <Select
                                options={[
                                    { value: 'all', label: 'All Status' },
                                    { value: 'active', label: 'Active' },
                                    { value: 'expiring', label: 'Expiring Soon' },
                                    { value: 'expired', label: 'Expired' },
                                ]}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Table data={contracts} columns={columns} />

            <AddContractForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSubmit}
                tenants={tenants}
                rooms={rooms}
            />
        </div>
    );
}