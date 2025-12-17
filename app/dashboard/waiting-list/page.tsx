'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import AddWaitingListForm, { WaitingListFormData } from '@/components/forms/AddWaitingListForm';
import { Users, Plus, Search, Filter, Calendar, User, Mail, Phone, Edit, Trash2 } from 'lucide-react';

export default function WaitingListPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRoomType, setFilterRoomType] = useState('all');

    const [waitingList, setWaitingList] = useState([
        {
            id: '1',
            name: 'Michael Chen',
            email: 'michael.chen@email.com',
            phone: '+62 812 9999 8888',
            roomType: 'deluxe',
            moveInDate: '2024-12-25',
            budget: 4000000,
            status: 'waiting',
            dateAdded: '2024-12-10',
            notes: 'Prefers high floor',
        },
        {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah.j@email.com',
            phone: '+62 821 7777 6666',
            roomType: 'suite',
            moveInDate: '2025-01-10',
            budget: 6000000,
            status: 'contacted',
            dateAdded: '2024-12-08',
            notes: 'Looking for 2-bedroom suite',
        },
        {
            id: '3',
            name: 'David Park',
            email: 'david.park@email.com',
            phone: '+62 813 5555 4444',
            roomType: 'standard',
            moveInDate: '2024-12-20',
            budget: 2500000,
            status: 'interested',
            dateAdded: '2024-12-12',
            notes: 'Student, needs parking',
        },
    ]);

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'waiting', label: 'Waiting' },
        { value: 'contacted', label: 'Contacted' },
        { value: 'interested', label: 'Interested' },
        { value: 'not-interested', label: 'Not Interested' },
    ];

    const roomTypeOptions = [
        { value: 'all', label: 'All Room Types' },
        { value: 'standard', label: 'Standard' },
        { value: 'deluxe', label: 'Deluxe' },
        { value: 'suite', label: 'Suite' },
        { value: 'studio', label: 'Studio' },
        { value: 'any', label: 'Any Available' },
    ];

    const handleFormSubmit = (data: WaitingListFormData) => {
        const newEntry = {
            id: Date.now().toString(),
            name: data.name,
            email: data.email,
            phone: data.phone,
            roomType: data.roomType,
            moveInDate: data.moveInDate,
            budget: data.budget,
            status: data.status,
            dateAdded: new Date().toISOString().split('T')[0],
            notes: data.notes || '',
        };
        setWaitingList([newEntry, ...waitingList]);
    };

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
            'waiting': 'warning',
            'contacted': 'info',
            'interested': 'success',
            'not-interested': 'default',
        };
        return variants[status] || 'default';
    };

    const getRoomTypeName = (type: string) => {
        const names: Record<string, string> = {
            'standard': 'Standard',
            'deluxe': 'Deluxe',
            'suite': 'Suite',
            'studio': 'Studio',
            'any': 'Any Available',
        };
        return names[type] || type;
    };

    const getStatusName = (status: string) => {
        const names: Record<string, string> = {
            'waiting': 'Waiting',
            'contacted': 'Contacted',
            'interested': 'Interested',
            'not-interested': 'Not Interested',
        };
        return names[status] || status;
    };

    const columns = [
        {
            key: 'name',
            label: 'Prospect',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'phone',
            label: 'Contact',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{item.phone}</span>
                </div>
            ),
        },
        {
            key: 'roomType',
            label: 'Room Type',
            render: (item: any) => <Badge variant="purple">{getRoomTypeName(item.roomType)}</Badge>,
        },
        {
            key: 'budget',
            label: 'Budget',
            sortable: true,
            render: (item: any) => (
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(item.budget)}
                </span>
            ),
        },
        {
            key: 'moveInDate',
            label: 'Move-in Date',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{formatDate(item.moveInDate)}</span>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (item: any) => (
                <Badge variant={getStatusBadge(item.status)} dot>
                    {getStatusName(item.status)}
                </Badge>
            ),
        },
        {
            key: 'dateAdded',
            label: 'Added',
            sortable: true,
            render: (item: any) => (
                <span className="text-sm text-slate-600 dark:text-slate-400">{formatDate(item.dateAdded)}</span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        Waiting List
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Manage prospects and waiting list
                    </p>
                </div>
                <Button className="w-full sm:w-auto" onClick={() => setIsFormOpen(true)}>
                    <Plus className="w-5 h-5" />
                    Add to Waiting List
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Total</p>
                        <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {waitingList.length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Waiting</p>
                        <p className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                            {waitingList.filter(w => w.status === 'waiting').length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Contacted</p>
                        <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                            {waitingList.filter(w => w.status === 'contacted').length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Interested</p>
                        <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                            {waitingList.filter(w => w.status === 'interested').length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-3 md:p-4">
                    <div className="space-y-3">
                        <Input
                            placeholder="Search prospects..."
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
                            <Select options={roomTypeOptions} value={filterRoomType} onChange={(e) => setFilterRoomType(e.target.value)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="block md:hidden space-y-3">
                {waitingList.map((item) => (
                    <Card key={item.id} hover>
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-slate-900 dark:text-white truncate">{item.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{item.email}</p>
                                    </div>
                                </div>
                                <Badge variant={getStatusBadge(item.status)} dot size="sm">
                                    {getStatusName(item.status)}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Phone:</span>
                                    <span className="text-slate-900 dark:text-white">{item.phone}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Room Type:</span>
                                    <Badge variant="purple" size="sm">{getRoomTypeName(item.roomType)}</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Budget:</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(item.budget)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Move-in:</span>
                                    <span className="text-slate-900 dark:text-white">{formatDate(item.moveInDate)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="hidden md:block">
                <Table data={waitingList} columns={columns} />
            </div>

            <AddWaitingListForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
            />
        </div>
    );
}