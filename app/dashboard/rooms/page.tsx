'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import AddRoomForm, { RoomFormData } from '@/components/forms/AddRoomForm';
import { Home, Plus, Edit, Trash2, Search, Filter, Grid3x3, List, Bed, DollarSign } from 'lucide-react';

export default function RoomsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterProperty, setFilterProperty] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile and force grid view
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const effectiveViewMode = isMobile ? 'grid' : viewMode;

    // Mock properties for the form
    const properties = [
        { id: '1', name: 'Building A' },
        { id: '2', name: 'Building B' },
        { id: '3', name: 'Building C' },
    ];

    const [rooms, setRooms] = useState([
        {
            id: '1',
            number: '305',
            property: 'Building A',
            type: 'Deluxe',
            floor: 3,
            capacity: 2,
            price: 3500000,
            status: 'Occupied',
            tenant: 'John Doe',
        },
        {
            id: '2',
            number: '201',
            property: 'Building B',
            type: 'Standard',
            floor: 2,
            capacity: 1,
            price: 2500000,
            status: 'Available',
            tenant: null,
        },
        {
            id: '3',
            number: '405',
            property: 'Building A',
            type: 'Suite',
            floor: 4,
            capacity: 3,
            price: 5000000,
            status: 'Occupied',
            tenant: 'Jane Smith',
        },
        {
            id: '4',
            number: '102',
            property: 'Building C',
            type: 'Standard',
            floor: 1,
            capacity: 1,
            price: 2000000,
            status: 'Maintenance',
            tenant: null,
        },
    ]);

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
        { value: 'reserved', label: 'Reserved' },
    ];

    const typeOptions = [
        { value: 'all', label: 'All Types' },
        { value: 'standard', label: 'Standard' },
        { value: 'deluxe', label: 'Deluxe' },
        { value: 'suite', label: 'Suite' },
        { value: 'studio', label: 'Studio' },
    ];

    const handleSubmit = (data: RoomFormData) => {
        const property = properties.find(p => p.id === data.propertyId);
        const newRoom = {
            id: Date.now().toString(),
            number: data.roomNumber,
            property: property?.name || 'Unknown',
            type: data.type,
            floor: data.floor,
            capacity: 1, // Default capacity, can be updated later
            price: data.monthlyRate, // Use monthlyRate from form
            status: data.status === 'available' ? 'Available' : 'Occupied',
            tenant: null,
        };
        setRooms([...rooms, newRoom]);
    };

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
            Reserved: 'purple',
        };
        return variants[status] || 'default';
    };

    const columns = [
        {
            key: 'number',
            label: 'Room',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Home className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Room {item.number}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.property}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'type',
            label: 'Type',
            render: (item: any) => <Badge variant="default">{item.type}</Badge>,
        },
        {
            key: 'floor',
            label: 'Floor',
            sortable: true,
            render: (item: any) => (
                <span className="text-sm text-slate-600 dark:text-slate-400">Floor {item.floor}</span>
            ),
        },
        {
            key: 'capacity',
            label: 'Capacity',
            render: (item: any) => (
                <div className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{item.capacity} person(s)</span>
                </div>
            ),
        },
        {
            key: 'price',
            label: 'Price',
            sortable: true,
            render: (item: any) => (
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(item.price)}
                </span>
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
            key: 'tenant',
            label: 'Tenant',
            render: (item: any) => (
                <span className="text-sm text-slate-600 dark:text-slate-400">
                    {item.tenant || '-'}
                </span>
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
        <div className="p-4 md:p-6 space-y-6 pb-24 md:pb-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Rooms</h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Manage your rooms and units
                    </p>
                </div>
                <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="w-5 h-5" />
                    Add Room
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Total Rooms</p>
                                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1 truncate">{rooms.length}</p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <Home className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Available</p>
                                <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                                    {rooms.filter(r => r.status === 'Available').length}
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
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Occupied</p>
                                <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 truncate">
                                    {rooms.filter(r => r.status === 'Occupied').length}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <Bed className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Revenue</p>
                                <p className="text-base md:text-xl font-bold text-slate-900 dark:text-white mt-1 truncate">
                                    {formatCurrency(rooms.filter(r => r.status === 'Occupied').reduce((sum, r) => sum + r.price, 0)).replace('Rp', '').trim().substring(0, 10)}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search, Filters, and View Mode Toggle */}
            <Card>
                <CardContent className="p-3 md:p-4">
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Search rooms..."
                                leftIcon={<Search className="w-5 h-5" />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1"
                            />
                            {/* View Mode Toggle - Desktop */}
                            <div className="hidden md:flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setViewMode('grid')}
                                    className={`px-3 ${
                                        viewMode === 'grid'
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <Grid3x3 className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 ${
                                        viewMode === 'list'
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
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
                            <Select options={propertyOptions} value={filterProperty} onChange={(e) => setFilterProperty(e.target.value)} />
                            <Select options={statusOptions} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} />
                            <Select options={typeOptions} value={filterType} onChange={(e) => setFilterType(e.target.value)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Grid View */}
            {effectiveViewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rooms.map((room) => (
                        <Card key={room.id} hover>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                            <Home className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                Room {room.number}
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{room.property}</p>
                                        </div>
                                    </div>
                                    <Badge variant={getStatusBadge(room.status)} dot size="sm">
                                        {room.status}
                                    </Badge>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">Type:</span>
                                        <Badge variant="default" size="sm">{room.type}</Badge>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">Floor:</span>
                                        <span className="font-medium text-slate-900 dark:text-white">Floor {room.floor}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">Capacity:</span>
                                        <div className="flex items-center gap-1">
                                            <Bed className="w-4 h-4 text-slate-400" />
                                            <span className="font-medium text-slate-900 dark:text-white">{room.capacity}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-200 dark:border-slate-800">
                                        <span className="text-slate-600 dark:text-slate-400">Price:</span>
                                        <span className="font-bold text-blue-600 dark:text-blue-400">
                                            {formatCurrency(room.price)}
                                        </span>
                                    </div>

                                    {room.tenant && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600 dark:text-slate-400">Tenant:</span>
                                            <span className="font-medium text-slate-900 dark:text-white">{room.tenant}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-800 mt-3">
                                    <Button size="sm" variant="outline" className="flex-1">
                                        <Edit className="w-4 h-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* List View (Table) */}
            {effectiveViewMode === 'list' && (
                <Table data={rooms} columns={columns} />
            )}

            {/* Add Room Form */}
            <AddRoomForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSubmit}
                properties={properties}
            />
        </div>
    );
}