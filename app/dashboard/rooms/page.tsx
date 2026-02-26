'use client';

import { useState } from 'react'
import { roomService, propertyService } from '@/lib/services'
import { useCrud, useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { formatCurrency as _formatCurrency, formatCurrencyShort as _formatCurrencyShort } from '@/utils'

const formatCurrency = (amount: number) => amount === 0 ? '-' : _formatCurrency(amount)
const formatCurrencyShort = (amount: number) => amount === 0 ? '-' : _formatCurrencyShort(amount)
import type { RoomRow, RoomInsert, RoomUpdate } from '@/types/database'
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import AddRoomForm, { RoomFormData } from '@/components/forms/AddRoomForm';
import {
    Home,
    Plus,
    Search,
    Filter,
    Building,
    User,
    DollarSign,
    Maximize,
    Eye,
    Edit,
    Trash2,
Loader2, } from 'lucide-react';
import { useToast } from '@/components/ui/Toast'

export default function RoomsPage() {
    const { toast, confirm } = useToast()
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [filterRentType, setFilterRentType] = useState('all');
    const [filterProperty, setFilterProperty] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<RoomRow | null>(null)

    const {
        items: rooms,
        loading,
        error,
        addItem,
        updateItem,
        removeItem,
        actionLoading,
    } = useCrud<RoomRow, RoomInsert, RoomUpdate>({
        service: roomService,
        orderBy: 'created_at',
    })


    const { data: propertiesData } = useSupabaseQuery(() => propertyService.getAll())
    const propertyFilterOptions = [
        { value: 'all', label: 'All Properties' },
        ...(propertiesData ?? []).map(p => ({ value: p.id, label: p.name }))
    ]

    const typeOptions = [
        { value: 'all', label: 'All Types' },
        { value: 'Standard', label: 'Standard' },
        { value: 'Studio', label: 'Studio' },
        { value: 'Deluxe', label: 'Deluxe' },
        { value: 'Suite', label: 'Suite' },
    ];

    const rentTypeOptions = [
        { value: 'all', label: 'All Rent Types' },
        { value: 'flexible', label: 'Flexible' },
        { value: 'daily', label: 'Daily' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
    ];



    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            'Available': 'success',
            'Occupied': 'info',
            'Maintenance': 'warning',
            'Reserved': 'purple',
        };
        return variants[status] || 'default';
    };

    const getRentTypeBadge = (rentType: string) => {
        const variants: Record<string, any> = {
            'flexible': 'purple',
            'daily': 'info',
            'monthly': 'success',
            'yearly': 'default',
        };
        return variants[rentType] || 'default';
    };

    const getRentTypeLabel = (rentType: string) => {
        const labels: Record<string, string> = {
            'flexible': 'Flexible',
            'daily': 'Daily Only',
            'monthly': 'Monthly',
            'yearly': 'Yearly',
        };
        return labels[rentType] || rentType;
    };

    const columns = [
        {
            key: 'name',
            label: 'Unit Info',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                        <Home className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                            {item.name}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            {item.tower} • Floor {item.floor}
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
                    <Badge variant="info" size="sm">{item.type}</Badge>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {item.luas}m² • Cap: {item.capacity}
                    </p>
                </div>
            ),
        },
        {
            key: 'rent',
            label: 'Rent Type & Price',
            render: (item: any) => (
                <div>
                    <Badge variant={getRentTypeBadge(item.rent_type)} size="sm">
                        {getRentTypeLabel(item.rent_type)}
                    </Badge>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 space-y-0.5">
                        {item.rent_type === 'flexible' && (
                            <>
                                <p>Daily: {formatCurrencyShort(item.price_daily)}</p>
                                <p>Monthly: {formatCurrencyShort(item.price_monthly)}</p>
                            </>
                        )}
                        {item.rent_type === 'daily' && (
                            <p>Daily: {formatCurrencyShort(item.price_daily)}</p>
                        )}
                        {item.rent_type === 'monthly' && (
                            <p>Monthly: {formatCurrencyShort(item.price_monthly)}</p>
                        )}
                        {item.rent_type === 'yearly' && (
                            <p>Yearly: {formatCurrencyShort(item.price_yearly)}</p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'occupancy',
            label: 'Owner & Tenant',
            render: (item: any) => (
                <div className="text-xs space-y-1">
                    <div>
                        <p className="text-slate-500 dark:text-slate-400">Owner:</p>
                        <p className="text-slate-900 dark:text-white font-medium truncate">
                            {item.owner}
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400">Tenant:</p>
                        <p className="text-slate-900 dark:text-white font-medium truncate">
                            {item.tenant || '-'}
                        </p>
                    </div>
                </div>
            ),
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
                    <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
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
    const handleFormSubmit = async (data: RoomFormData) => {
        if (editingRoom) {
            const updResult = await updateItem(editingRoom.id, data as unknown as RoomUpdate)
            if (updResult.error) toast.error('Gagal mengupdate', updResult.error)
            else toast.success('Berhasil', 'Data berhasil diupdate')
        } else {
            const addResult = await addItem({ ...data, status: 'Available' } as unknown as RoomInsert)
            if (addResult.error) toast.error('Gagal menyimpan', addResult.error)
            else toast.success('Berhasil', 'Data berhasil ditambahkan')
        }
        setEditingRoom(null)
    }


    const handleEdit = (room: any) => {
        setEditingRoom(room);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        const yes = await confirm({ title: 'Konfirmasi Hapus', message: 'Apakah kamu yakin ingin menghapus data ini? Tindakan ini tidak bisa dibatalkan.', variant: 'danger' })
        if (!yes) return
        const delResult = await removeItem(id)
        if (delResult.error) toast.error('Gagal menghapus', delResult.error)
        else toast.success('Berhasil', 'Data berhasil dihapus')
    }


    const handleAddNew = () => {
        setEditingRoom(null);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingRoom(null);
    };

    // Filter rooms
    const filteredRooms = rooms.filter(room => {
        const matchSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.tower.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.owner.toLowerCase().includes(searchQuery.toLowerCase());
        const matchType = filterType === 'all' || room.type === filterType;
        const matchRentType = filterRentType === 'all' || room.rent_type === filterRentType;
        const matchProperty = filterProperty === 'all' || room.property_id === filterProperty;
        return matchSearch && matchType && matchRentType && matchProperty;
    });

    // Stats
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(r => r.status === 'Available').length;
    const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
    const avgRevenue = Math.round(
        rooms.reduce((sum, r) => sum + (r.price_monthly || r.price_daily * 30 || r.price_yearly / 12), 0) / rooms.length
    );

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
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        Rooms / Units
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Manage property units and rooms
                    </p>
                </div>
                <Button className="w-full sm:w-auto" onClick={handleAddNew}>
                    <Plus className="w-5 h-5" />
                    Add Unit
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Total Units
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1 truncate">
                                    {totalRooms}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 ml-2">
                                <Home className="w-5 h-5 md:w-6 md:h-6 text-slate-600 dark:text-slate-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Available
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                                    {availableRooms}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <Home className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Occupied
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 truncate">
                                    {occupiedRooms}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <User className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Avg Revenue
                                </p>
                                <p className="text-base md:text-xl font-bold text-purple-600 dark:text-purple-400 mt-1 truncate">
                                    {formatCurrencyShort(avgRevenue)}
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
                            placeholder="Search by unit name, tower, or owner..."
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
                            <Select
                                options={propertyFilterOptions}
                                value={filterProperty}
                                onChange={(e) => setFilterProperty(e.target.value)}
                            />
                            <Select
                                options={typeOptions}
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            />
                            <Select
                                options={rentTypeOptions}
                                value={filterRentType}
                                onChange={(e) => setFilterRentType(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-3">
                {filteredRooms.map((room) => (
                    <Card key={room.id} hover>
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                                    <Home className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                                        {room.name}
                                    </h3>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        {room.tower} • Floor {room.floor} • {room.view}
                                    </p>
                                    <div className="flex gap-2 mt-1">
                                        <Badge variant="info" size="sm">{room.type}</Badge>
                                        <Badge variant={getRentTypeBadge(room.rent_type)} size="sm">
                                            {getRentTypeLabel(room.rent_type)}
                                        </Badge>
                                    </div>
                                </div>
                                <Badge variant={getStatusBadge(room.status)} dot size="sm">
                                    {room.status}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                                <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded">
                                    <p className="text-slate-500 dark:text-slate-400">Size</p>
                                    <p className="font-semibold text-slate-900 dark:text-white">{room.luas}m²</p>
                                </div>
                                <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded">
                                    <p className="text-slate-500 dark:text-slate-400">Capacity</p>
                                    <p className="font-semibold text-slate-900 dark:text-white">{room.capacity} pax</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-xs mb-3">
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400">Owner:</p>
                                    <p className="text-slate-900 dark:text-white font-medium">{room.owner}</p>
                                </div>
                                {room.tenant && (
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400">Tenant:</p>
                                        <p className="text-slate-900 dark:text-white font-medium">{room.tenant}</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded mb-3">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pricing:</p>
                                {room.rent_type === 'flexible' && (
                                    <div className="space-y-0.5">
                                        <p className="text-xs text-slate-900 dark:text-white">
                                            Daily: <span className="font-semibold">{formatCurrency(room.price_daily)}</span>
                                        </p>
                                        <p className="text-xs text-slate-900 dark:text-white">
                                            Monthly: <span className="font-semibold">{formatCurrency(room.price_monthly)}</span>
                                        </p>
                                    </div>
                                )}
                                {room.rent_type === 'daily' && (
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                        {formatCurrency(room.price_daily)}
                                    </p>
                                )}
                                {room.rent_type === 'monthly' && (
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                        {formatCurrency(room.price_monthly)}
                                    </p>
                                )}
                                {room.rent_type === 'yearly' && (
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                        {formatCurrency(room.price_yearly)}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(room)}>
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleDelete(room.id)}>
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="hidden md:block">
                <Table data={filteredRooms} columns={columns} />
            </div>

            <AddRoomForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleFormSubmit}
                editData={editingRoom as unknown as RoomFormData | null}
            />
        </div>
    );
}