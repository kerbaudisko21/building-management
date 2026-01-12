'use client';

import { useState } from 'react';
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
} from 'lucide-react';

export default function WaitingListPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterProperty, setFilterProperty] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProspect, setEditingProspect] = useState<any>(null);

    const [prospects, setProspects] = useState([
        {
            id: '1',
            name: 'Amanda Lee',
            property: 'Menteng Residence',
            room_unit: 'Studio (35m²)',
            budget: 5000000,
            date_entry_plan: '2024-02-15',
            phone: '+62 817 8888 9999',
            status: 'New',
            created_at: '2024-01-10',
        },
        {
            id: '2',
            name: 'Robert Kim',
            property: 'BSD City Apartment',
            room_unit: 'Deluxe (45m²)',
            budget: 7000000,
            date_entry_plan: '2024-03-01',
            phone: '+62 819 5555 4444',
            status: 'Contacted',
            created_at: '2024-01-12',
        },
        {
            id: '3',
            name: 'Lisa Chen',
            property: 'Kemang Suites',
            room_unit: 'Suite (60m²)',
            budget: 10000000,
            date_entry_plan: '2024-02-20',
            phone: '+62 856 7777 8888',
            status: 'Interested',
            created_at: '2024-01-08',
        },
        {
            id: '4',
            name: 'David Wong',
            property: 'Menteng Residence',
            room_unit: 'Standard (30m²)',
            budget: 4000000,
            date_entry_plan: '2024-04-01',
            phone: '+62 821 3333 4444',
            status: 'Not Interested',
            created_at: '2024-01-05',
        },
        {
            id: '5',
            name: 'Emily Zhang',
            property: 'Sudirman Park',
            room_unit: 'Studio (35m²)',
            budget: 5500000,
            date_entry_plan: '2024-02-25',
            phone: '+62 813 6666 7777',
            status: 'New',
            created_at: '2024-01-13',
        },
    ]);

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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatCurrencyShort = (amount: number) => {
        if (amount >= 1000000) {
            return `Rp ${(amount / 1000000).toFixed(1)}M`;
        }
        if (amount >= 1000) {
            return `Rp ${(amount / 1000).toFixed(0)}K`;
        }
        return `Rp ${amount.toLocaleString('id-ID')}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

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
                    <Button size="sm" variant="ghost" title="Convert to customer">
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

    // Handlers
    const handleFormSubmit = (data: WaitingListFormData) => {
        if (editingProspect) {
            setProspects(prospects.map(p =>
                p.id === editingProspect.id
                    ? { ...p, ...data, phone: data.phone || p.phone }
                    : p
            ));
        } else {
            const newProspect = {
                id: Date.now().toString(),
                name: data.name,
                property: data.property,
                room_unit: data.room_unit,
                budget: data.budget,
                date_entry_plan: data.date_entry_plan,
                phone: data.phone,
                status: 'New',
                created_at: new Date().toISOString().split('T')[0],
            };
            setProspects([newProspect, ...prospects]);
        }
        setEditingProspect(null);
    };

    const handleEdit = (prospect: any) => {
        setEditingProspect(prospect);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to remove this prospect?')) {
            setProspects(prospects.filter(p => p.id !== id));
        }
    };

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
            prospect.property.toLowerCase().includes(searchQuery.toLowerCase());
        const matchProperty = filterProperty === 'all' || prospect.property === filterProperty;
        const matchStatus = filterStatus === 'all' || prospect.status === filterStatus;
        return matchSearch && matchProperty && matchStatus;
    });

    // Stats
    const totalProspects = prospects.length;
    const newProspects = prospects.filter(p => p.status === 'New').length;
    const interestedProspects = prospects.filter(p => p.status === 'Interested').length;
    const avgBudget = Math.round(
        prospects.reduce((sum, p) => sum + p.budget, 0) / prospects.length
    );

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
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
                    const daysUntil = getDaysUntilEntry(prospect.date_entry_plan);
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
                                                {prospect.property}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                                {prospect.room_unit}
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
                                            {formatDate(prospect.date_entry_plan)}
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
                editData={editingProspect}
            />
        </div>
    );
}