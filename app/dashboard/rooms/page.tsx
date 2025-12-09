'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import {
    Bed,
    Plus,
    Search,
    Filter,
    Grid3x3,
    List,
    User,
    DollarSign,
    Calendar,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
} from 'lucide-react';

export default function RoomsPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const rooms = [
        {
            id: 1,
            roomNumber: '101',
            property: 'Building A',
            floor: 1,
            type: 'Standard',
            size: 25,
            capacity: 1,
            monthlyRate: 2500000,
            status: 'Occupied',
            tenant: 'John Doe',
            occupiedSince: '2024-01-15',
            contractEnd: '2025-01-14',
            facilities: ['AC', 'Wifi', 'Kasur', 'Lemari'],
        },
        {
            id: 2,
            roomNumber: '102',
            property: 'Building A',
            floor: 1,
            type: 'Deluxe',
            size: 30,
            capacity: 2,
            monthlyRate: 3500000,
            status: 'Occupied',
            tenant: 'Jane Smith & Bob Johnson',
            occupiedSince: '2024-02-20',
            contractEnd: '2026-02-19',
            facilities: ['AC', 'Wifi', 'Kasur', 'Lemari', 'TV', 'Kulkas'],
        },
        {
            id: 3,
            roomNumber: '201',
            property: 'Building A',
            floor: 2,
            type: 'Standard',
            size: 25,
            capacity: 1,
            monthlyRate: 2500000,
            status: 'Available',
            tenant: null,
            occupiedSince: null,
            contractEnd: null,
            facilities: ['AC', 'Wifi', 'Kasur', 'Lemari'],
        },
        {
            id: 4,
            roomNumber: '202',
            property: 'Building A',
            floor: 2,
            type: 'Standard',
            size: 25,
            capacity: 1,
            monthlyRate: 2500000,
            status: 'Maintenance',
            tenant: null,
            occupiedSince: null,
            contractEnd: null,
            facilities: ['AC', 'Wifi', 'Kasur', 'Lemari'],
        },
        {
            id: 5,
            roomNumber: '305',
            property: 'Building B',
            floor: 3,
            type: 'Premium',
            size: 35,
            capacity: 2,
            monthlyRate: 4500000,
            status: 'Occupied',
            tenant: 'Alice Williams',
            occupiedSince: '2024-03-10',
            contractEnd: '2025-03-09',
            facilities: ['AC', 'Wifi', 'Kasur', 'Lemari', 'TV', 'Kulkas', 'Kitchen'],
        },
        {
            id: 6,
            roomNumber: '401',
            property: 'Building B',
            floor: 4,
            type: 'Standard',
            size: 25,
            capacity: 1,
            monthlyRate: 2500000,
            status: 'Available',
            tenant: null,
            occupiedSince: null,
            contractEnd: null,
            facilities: ['AC', 'Wifi', 'Kasur', 'Lemari'],
        },
    ];

    const propertyOptions = [
        { value: 'all', label: 'All Properties' },
        { value: 'building-a', label: 'Building A' },
        { value: 'building-b', label: 'Building B' },
        { value: 'building-c', label: 'Building C' },
    ];

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'available', label: 'Available' },
        { value: 'occupied', label: 'Occupied' },
        { value: 'maintenance', label: 'Maintenance' },
    ];

    const typeOptions = [
        { value: 'all', label: 'All Types' },
        { value: 'standard', label: 'Standard' },
        { value: 'deluxe', label: 'Deluxe' },
        { value: 'premium', label: 'Premium' },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            Available: 'success',
            Occupied: 'info',
            Maintenance: 'warning',
        };
        return variants[status] || 'default';
    };

    // Table columns
    const columns = [
        {
            key: 'roomNumber',
            label: 'Room',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                        <Bed className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                            Room {item.roomNumber}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            {item.property} - Floor {item.floor}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: 'type',
            label: 'Type & Size',
            render: (item: any) => (
                <div>
                    <Badge variant="purple" size="sm">{item.type}</Badge>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {item.size}m² • Max {item.capacity} person
                    </p>
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
            key: 'tenant',
            label: 'Tenant',
            render: (item: any) => (
                item.tenant ? (
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <div>
                            <p className="text-sm text-slate-900 dark:text-white">{item.tenant}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                Since {new Date(item.occupiedSince).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                ) : (
                    <span className="text-sm text-slate-500 dark:text-slate-500">-</span>
                )
            ),
        },
        {
            key: 'status',
            label: 'Status',
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
                    <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                        <Trash2 className="w-4 h-4 text-red-600" />
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
                        Rooms
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Manage rooms across all properties
                    </p>
                </div>
                <Button className="w-full sm:w-auto">
                    <Plus className="w-5 h-5" />
                    Add Room
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Total Rooms</p>
                        <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {rooms.length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Available</p>
                        <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                            {rooms.filter(r => r.status === 'Available').length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Occupied</p>
                        <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                            {rooms.filter(r => r.status === 'Occupied').length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Maintenance</p>
                        <p className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                            {rooms.filter(r => r.status === 'Maintenance').length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-3 md:p-4">
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search rooms..."
                                    leftIcon={<Search className="w-5 h-5" />}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* View Toggle - Desktop Only */}
                            <div className="hidden md:flex gap-1 border border-slate-300 dark:border-slate-700 rounded-lg p-1">
                                <Button
                                    size="sm"
                                    variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid3x3 className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant={viewMode === 'table' ? 'primary' : 'ghost'}
                                    onClick={() => setViewMode('table')}
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full md:hidden"
                        >
                            <Filter className="w-4 h-4" />
                            {showFilters ? 'Hide' : 'Show'} Filters
                        </Button>

                        <div className={`grid grid-cols-1 gap-3 md:grid-cols-3 ${showFilters ? 'block' : 'hidden md:grid'}`}>
                            <Select options={propertyOptions} placeholder="Property" />
                            <Select options={statusOptions} placeholder="Status" />
                            <Select options={typeOptions} placeholder="Type" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Mobile View - Cards */}
            <div className="block md:hidden space-y-3">
                {rooms.map((room) => (
                    <Card key={room.id} hover>
                        <CardContent className="p-4">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                        <Bed className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">
                                            Room {room.roomNumber}
                                        </h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                            {room.property} - Floor {room.floor}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant={getStatusBadge(room.status)} dot size="sm">
                                    {room.status}
                                </Badge>
                            </div>

                            {/* Info */}
                            <div className="space-y-2 mb-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">Type:</span>
                                    <Badge variant="purple" size="sm">{room.type}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">Size:</span>
                                    <span className="text-slate-900 dark:text-white font-medium">
                    {room.size}m² • Max {room.capacity}
                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">Rate:</span>
                                    <span className="text-slate-900 dark:text-white font-semibold">
                    {formatCurrency(room.monthlyRate)}
                  </span>
                                </div>
                                {room.tenant && (
                                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-900 dark:text-white text-sm">{room.tenant}</span>
                                    </div>
                                )}
                            </div>

                            {/* Facilities */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {room.facilities.map((facility, idx) => (
                                    <Badge key={idx} variant="default" size="sm">
                                        {facility}
                                    </Badge>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                                <Button size="sm" variant="outline" className="flex-1">
                                    <Eye className="w-4 h-4" />
                                    View
                                </Button>
                                <Button size="sm" variant="ghost">
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {rooms.map((room) => (
                            <Card key={room.id} hover>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                                <Bed className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                                                    Room {room.roomNumber}
                                                </h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    {room.property} - Floor {room.floor}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={getStatusBadge(room.status)} dot>
                                            {room.status}
                                        </Badge>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">Type:</span>
                                            <Badge variant="purple">{room.type}</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">Size:</span>
                                            <span className="text-sm text-slate-900 dark:text-white font-medium">
                        {room.size}m² • Max {room.capacity}
                      </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">Rate:</span>
                                            <span className="text-sm text-slate-900 dark:text-white font-semibold">
                        {formatCurrency(room.monthlyRate)}
                      </span>
                                        </div>
                                        {room.tenant && (
                                            <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                                                <User className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm text-slate-900 dark:text-white">{room.tenant}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {room.facilities.map((facility, idx) => (
                                            <Badge key={idx} variant="default" size="sm">
                                                {facility}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                                        <Button size="sm" variant="outline" className="flex-1">
                                            <Eye className="w-4 h-4" />
                                            View
                                        </Button>
                                        <Button size="sm" variant="ghost">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button size="sm" variant="ghost">
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Table data={rooms} columns={columns} />
                )}
            </div>
        </div>
    );
}