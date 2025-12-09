'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import {
    Clock,
    Plus,
    Search,
    Users,
    Car,
    Calendar,
    CheckCircle,
    XCircle,
    ArrowRight,
    MessageSquare,
    Eye,
    Filter,
} from 'lucide-react';

export default function WaitingListPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const waitingList = [
        {
            id: 1,
            contactName: 'Michael Chen',
            phone: '+62 818-9012-3456',
            entryDate: '2024-12-15',
            entryTime: '14:00',
            vehicleType: 'Motor',
            vehicleCount: 1,
            itemsBrought: 'Kasur lipat, laptop, pakaian',
            totalPeople: 1,
            plannedDuration: 12,
            targetProperty: 'Building A',
            status: 'Pending',
            createdAt: '2024-12-08',
            notes: 'Mahasiswa UI, perlu WiFi cepat',
        },
        {
            id: 2,
            contactName: 'Sarah Martinez & David Lee',
            phone: '+62 819-0123-4567',
            entryDate: '2024-12-20',
            entryTime: '10:00',
            vehicleType: 'Mobil',
            vehicleCount: 1,
            itemsBrought: 'Furniture lengkap, elektronik',
            totalPeople: 2,
            plannedDuration: 24,
            targetProperty: 'Building B',
            status: 'Approved',
            createdAt: '2024-12-05',
            notes: 'Couple, butuh kamar besar',
        },
        {
            id: 3,
            contactName: 'Ahmad Rizki',
            phone: '+62 820-1234-5678',
            entryDate: '2024-12-18',
            entryTime: '15:30',
            vehicleType: 'Motor',
            vehicleCount: 1,
            itemsBrought: 'Pakaian, laptop',
            totalPeople: 1,
            plannedDuration: 6,
            targetProperty: 'Building C',
            status: 'Pending',
            createdAt: '2024-12-07',
            notes: 'Kerja di daerah Sudirman',
        },
        {
            id: 4,
            contactName: 'Linda Kusuma',
            phone: '+62 821-2345-6789',
            entryDate: '2024-12-12',
            entryTime: '09:00',
            vehicleType: 'None',
            vehicleCount: 0,
            itemsBrought: 'Tas dan pakaian saja',
            totalPeople: 1,
            plannedDuration: 3,
            targetProperty: 'Building A',
            status: 'Rejected',
            createdAt: '2024-12-06',
            notes: 'Durasi terlalu pendek',
        },
        {
            id: 5,
            contactName: 'Tommy Wijaya',
            phone: '+62 822-3456-7890',
            entryDate: '2024-12-25',
            entryTime: '11:00',
            vehicleType: 'Motor',
            vehicleCount: 2,
            itemsBrought: 'Barang pribadi, peralatan kerja',
            totalPeople: 1,
            plannedDuration: 18,
            targetProperty: 'Building C',
            status: 'Converted',
            createdAt: '2024-12-01',
            notes: 'Sudah jadi tenant Room 305',
        },
    ];

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'converted', label: 'Converted' },
    ];

    const propertyOptions = [
        { value: 'all', label: 'All Properties' },
        { value: 'building-a', label: 'Building A' },
        { value: 'building-b', label: 'Building B' },
        { value: 'building-c', label: 'Building C' },
    ];

    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            Pending: { variant: 'warning', icon: Clock },
            Approved: { variant: 'success', icon: CheckCircle },
            Rejected: { variant: 'danger', icon: XCircle },
            Converted: { variant: 'info', icon: CheckCircle },
        };
        return variants[status] || variants.Pending;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Table columns for desktop
    const columns = [
        {
            key: 'contactName',
            label: 'Contact',
            sortable: true,
            render: (item: any) => (
                <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                        {item.contactName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs text-slate-600 dark:text-slate-400">
              {item.phone}
            </span>
                    </div>
                </div>
            ),
        },
        {
            key: 'entryDate',
            label: 'Entry Date & Time',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {formatDate(item.entryDate)}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            {item.entryTime}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: 'vehicle',
            label: 'Vehicle',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-900 dark:text-white">
            {item.vehicleType} ({item.vehicleCount}x)
          </span>
                </div>
            ),
        },
        {
            key: 'people',
            label: 'People & Duration',
            render: (item: any) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-900 dark:text-white">
              {item.totalPeople} {item.totalPeople > 1 ? 'people' : 'person'}
            </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
              {item.plannedDuration} months
            </span>
                    </div>
                </div>
            ),
        },
        {
            key: 'targetProperty',
            label: 'Target Property',
            render: (item: any) => (
                <Badge variant="purple">{item.targetProperty}</Badge>
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
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => console.log('View', item.id)}
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    {item.status === 'Approved' && (
                        <Button
                            size="sm"
                            variant="primary"
                            onClick={() => console.log('Convert to booking', item.id)}
                        >
                            <ArrowRight className="w-4 h-4" />
                            Convert
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
            {/* Page Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        Waiting List
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Manage prospective tenants and inquiries
                    </p>
                </div>
                <Button onClick={() => console.log('Add new waiting list entry')} className="w-full sm:w-auto">
                    <Plus className="w-5 h-5" />
                    Add Entry
                </Button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Total Entries</p>
                                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                    {waitingList.length}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Users className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Pending</p>
                                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                    {waitingList.filter((w) => w.status === 'Pending').length}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 md:w-6 md:h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Approved</p>
                                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                    {waitingList.filter((w) => w.status === 'Approved').length}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Converted</p>
                                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                    {waitingList.filter((w) => w.status === 'Converted').length}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-3 md:p-4">
                    <div className="space-y-3">
                        <Input
                            placeholder="Search by name or phone..."
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
                {waitingList.map((item) => {
                    const statusInfo = getStatusBadge(item.status);

                    return (
                        <Card key={item.id} hover>
                            <CardContent className="p-4">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                                            {item.contactName}
                                        </h3>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <MessageSquare className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                            <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        {item.phone}
                      </span>
                                        </div>
                                    </div>
                                    <Badge variant={statusInfo.variant} dot size="sm">
                                        {item.status}
                                    </Badge>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-slate-900 dark:text-white font-medium truncate">
                                                {formatDate(item.entryDate)}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">{item.entryTime}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Car className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-slate-900 dark:text-white font-medium truncate">
                                                {item.vehicleType}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">{item.vehicleCount}x</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-slate-900 dark:text-white font-medium">
                                                {item.totalPeople} {item.totalPeople > 1 ? 'people' : 'person'}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">{item.plannedDuration} months</p>
                                        </div>
                                    </div>

                                    <div>
                                        <Badge variant="purple" size="sm" className="truncate max-w-full">
                                            {item.targetProperty}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Notes */}
                                {item.notes && (
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-1">
                                        📝 {item.notes}
                                    </p>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                                    <Button size="sm" variant="outline" className="flex-1">
                                        <Eye className="w-4 h-4" />
                                        View
                                    </Button>
                                    {item.status === 'Approved' && (
                                        <Button size="sm" variant="primary" className="flex-1">
                                            <ArrowRight className="w-4 h-4" />
                                            Convert
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block">
                <Table
                    data={waitingList}
                    columns={columns}
                    onRowClick={(item) => console.log('View waiting list:', item.id)}
                    emptyMessage="No waiting list entries found"
                />
            </div>
        </div>
    );
}