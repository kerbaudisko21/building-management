'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import {
    Building2,
    Plus,
    Search,
    Filter,
    Grid3x3,
    List,
    MapPin,
    Eye,
    Edit,
    Trash2,
    MoreVertical,
} from 'lucide-react';

export default function PropertiesPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const properties = [
        {
            id: 1,
            name: 'Building A',
            type: 'Apartemen',
            address: 'Jl. Sudirman No. 123, Jakarta',
            totalRooms: 50,
            occupiedRooms: 48,
            occupancyRate: 96,
            monthlyRevenue: 18500000,
            acquisitionStart: '2023-01-15',
            acquisitionEnd: '2028-01-14',
            status: 'Active',
        },
        {
            id: 2,
            name: 'Building B',
            type: 'Kostan',
            address: 'Jl. Gatot Subroto No. 456, Jakarta',
            totalRooms: 50,
            occupiedRooms: 46,
            occupancyRate: 92,
            monthlyRevenue: 15200000,
            acquisitionStart: '2023-03-20',
            acquisitionEnd: '2028-03-19',
            status: 'Active',
        },
        {
            id: 3,
            name: 'Building C',
            type: 'Apartemen',
            address: 'Jl. Thamrin No. 789, Jakarta',
            totalRooms: 50,
            occupiedRooms: 44,
            occupancyRate: 88,
            monthlyRevenue: 11600000,
            acquisitionStart: '2023-06-10',
            acquisitionEnd: '2028-06-09',
            status: 'Active',
        },
        {
            id: 4,
            name: 'Residence D',
            type: 'Kostan',
            address: 'Jl. Rasuna Said No. 321, Jakarta',
            totalRooms: 30,
            occupiedRooms: 25,
            occupancyRate: 83,
            monthlyRevenue: 8500000,
            acquisitionStart: '2023-09-05',
            acquisitionEnd: '2028-09-04',
            status: 'Active',
        },
        {
            id: 5,
            name: 'Tower E',
            type: 'Apartemen',
            address: 'Jl. Kuningan No. 654, Jakarta',
            totalRooms: 40,
            occupiedRooms: 30,
            occupancyRate: 75,
            monthlyRevenue: 10200000,
            acquisitionStart: '2024-01-15',
            acquisitionEnd: '2029-01-14',
            status: 'Active',
        },
        {
            id: 6,
            name: 'Mansion F',
            type: 'Kostan',
            address: 'Jl. Senopati No. 987, Jakarta',
            totalRooms: 25,
            occupiedRooms: 15,
            occupancyRate: 60,
            monthlyRevenue: 5500000,
            acquisitionStart: '2024-03-01',
            acquisitionEnd: '2029-02-28',
            status: 'Maintenance',
        },
    ];

    const typeOptions = [
        { value: 'all', label: 'All Types' },
        { value: 'apartemen', label: 'Apartemen' },
        { value: 'kostan', label: 'Kostan' },
    ];

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'maintenance', label: 'Maintenance' },
        { value: 'inactive', label: 'Inactive' },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Table columns for desktop
    const columns = [
        {
            key: 'name',
            label: 'Property Name',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{item.type}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'address',
            label: 'Address',
            render: (item: any) => (
                <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{item.address}</span>
                </div>
            ),
        },
        {
            key: 'occupancyRate',
            label: 'Occupancy',
            sortable: true,
            render: (item: any) => (
                <div>
                    <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {item.occupancyRate}%
            </span>
                        <Badge
                            variant={
                                item.occupancyRate >= 90
                                    ? 'success'
                                    : item.occupancyRate >= 70
                                        ? 'warning'
                                        : 'danger'
                            }
                            size="sm"
                        >
                            {item.occupiedRooms}/{item.totalRooms}
                        </Badge>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                        <div
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-1.5 rounded-full"
                            style={{ width: `${item.occupancyRate}%` }}
                        />
                    </div>
                </div>
            ),
        },
        {
            key: 'monthlyRevenue',
            label: 'Revenue',
            sortable: true,
            render: (item: any) => (
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
          {formatCurrency(item.monthlyRevenue)}
        </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (item: any) => (
                <Badge
                    variant={item.status === 'Active' ? 'success' : 'warning'}
                    dot
                >
                    {item.status}
                </Badge>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => console.log('View', item.id)}>
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => console.log('Edit', item.id)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => console.log('Delete', item.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
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
                        Properties
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Manage your properties and view occupancy rates
                    </p>
                </div>
                <Button onClick={() => console.log('Add new property')} className="w-full sm:w-auto">
                    <Plus className="w-5 h-5" />
                    Add Property
                </Button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Total Properties</p>
                        <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {properties.length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Total Rooms</p>
                        <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {properties.reduce((sum, p) => sum + p.totalRooms, 0)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Occupied Rooms</p>
                        <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {properties.reduce((sum, p) => sum + p.occupiedRooms, 0)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Total Revenue</p>
                        <p className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mt-1 truncate">
                            {formatCurrency(properties.reduce((sum, p) => sum + p.monthlyRevenue, 0))}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and View Toggle */}
            <Card>
                <CardContent className="p-3 md:p-4">
                    <div className="space-y-3">
                        {/* Search */}
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search properties..."
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

                        {/* Filter Toggle Button - Mobile Only */}
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full md:hidden"
                        >
                            <Filter className="w-4 h-4" />
                            {showFilters ? 'Hide' : 'Show'} Filters
                        </Button>

                        {/* Filter Options */}
                        <div className={`grid grid-cols-1 gap-3 md:grid-cols-2 ${showFilters ? 'block' : 'hidden md:grid'}`}>
                            <Select options={typeOptions} placeholder="Type" />
                            <Select options={statusOptions} placeholder="Status" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Mobile View - Cards */}
            <div className="block md:hidden space-y-3">
                {properties.map((property) => (
                    <Card key={property.id} hover>
                        {/* Property Image Placeholder */}
                        <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <Building2 className="w-12 h-12 text-white/80" />
                        </div>

                        <CardContent className="p-4">
                            {/* Property Name and Type */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                                        {property.name}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {property.type}
                                    </p>
                                </div>
                                <Badge
                                    variant={property.status === 'Active' ? 'success' : 'warning'}
                                    dot
                                    size="sm"
                                >
                                    {property.status}
                                </Badge>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-2 mb-4">
                                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                    {property.address}
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Occupancy</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                                        {property.occupancyRate}%
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Revenue</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white truncate">
                                        {formatCurrency(property.monthlyRevenue)}
                                    </p>
                                </div>
                            </div>

                            {/* Occupancy Bar */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {property.occupiedRooms} / {property.totalRooms} rooms
                  </span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                                        style={{ width: `${property.occupancyRate}%` }}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => console.log('View', property.id)}
                                >
                                    <Eye className="w-4 h-4" />
                                    View
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => console.log('Edit', property.id)}
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => console.log('More', property.id)}
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Desktop View - Grid or Table */}
            <div className="hidden md:block">
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map((property) => (
                            <Card key={property.id} hover className="overflow-hidden">
                                {/* Property Image Placeholder */}
                                <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <Building2 className="w-16 h-16 text-white/80" />
                                </div>

                                <CardContent className="p-6">
                                    {/* Property Name and Type */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                                {property.name}
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {property.type}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={property.status === 'Active' ? 'success' : 'warning'}
                                            dot
                                        >
                                            {property.status}
                                        </Badge>
                                    </div>

                                    {/* Address */}
                                    <div className="flex items-start gap-2 mb-4">
                                        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                            {property.address}
                                        </p>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">Occupancy</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                                                {property.occupancyRate}%
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">Revenue</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                                                {formatCurrency(property.monthlyRevenue)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Occupancy Bar */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {property.occupiedRooms} / {property.totalRooms} rooms
                      </span>
                                        </div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                                                style={{ width: `${property.occupancyRate}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => console.log('View', property.id)}
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => console.log('Edit', property.id)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => console.log('More', property.id)}
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Table
                        data={properties}
                        columns={columns}
                        onRowClick={(property) => console.log('View property:', property.id)}
                    />
                )}
            </div>
        </div>
    );
}