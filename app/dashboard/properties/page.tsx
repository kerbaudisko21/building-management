'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import AddPropertyForm, { PropertyFormData } from '@/components/forms/AddPropertyForm';
import { Building2, MapPin, Home, Plus, Edit, Trash2, Search, Filter, Grid3x3, List } from 'lucide-react';

export default function PropertiesPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [filterCity, setFilterCity] = useState('all');
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

    // Force grid view on mobile
    const effectiveViewMode = isMobile ? 'grid' : viewMode;

    // Auto switch to grid on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setViewMode('grid');
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [properties, setProperties] = useState([
        {
            id: '1',
            name: 'Green Valley Apartments',
            address: 'Jl. Sudirman No. 123, Jakarta',
            city: 'Jakarta',
            type: 'Apartment',
            totalUnits: 50,
            occupiedUnits: 42,
            yearBuilt: 2020,
        },
        {
            id: '2',
            name: 'Blue Ocean Kost',
            address: 'Jl. Gatot Subroto No. 45, Bandung',
            city: 'Bandung',
            type: 'Kost',
            totalUnits: 30,
            occupiedUnits: 28,
            yearBuilt: 2019,
        },
        {
            id: '3',
            name: 'Sunset Villa',
            address: 'Jl. Kuta Beach, Bali',
            city: 'Bali',
            type: 'Villa',
            totalUnits: 10,
            occupiedUnits: 8,
            yearBuilt: 2021,
        },
    ]);

    const typeOptions = [
        { value: 'all', label: 'All Types' },
        { value: 'apartment', label: 'Apartment' },
        { value: 'kost', label: 'Kost' },
        { value: 'villa', label: 'Villa' },
        { value: 'house', label: 'House' },
    ];

    const cityOptions = [
        { value: 'all', label: 'All Cities' },
        { value: 'jakarta', label: 'Jakarta' },
        { value: 'bandung', label: 'Bandung' },
        { value: 'surabaya', label: 'Surabaya' },
        { value: 'bali', label: 'Bali' },
    ];

    const handleSubmit = (data: PropertyFormData) => {
        const newProperty = {
            id: Date.now().toString(),
            name: data.name,
            address: data.address,
            city: data.city,
            type: data.type,
            totalUnits: data.totalUnits,
            occupiedUnits: 0,
            yearBuilt: data.yearBuilt || new Date().getFullYear(),
        };
        setProperties([...properties, newProperty]);
    };

    const calculateOccupancy = (occupied: number, total: number) => {
        return Math.round((occupied / total) * 100);
    };

    const columns = [
        {
            key: 'name',
            label: 'Property Name',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.type}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'address',
            label: 'Location',
            render: (item: any) => (
                <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{item.address}</span>
                </div>
            ),
        },
        {
            key: 'totalUnits',
            label: 'Units',
            sortable: true,
            render: (item: any) => (
                <div className="text-center">
                    <p className="font-semibold text-slate-900 dark:text-white">{item.totalUnits}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total Units</p>
                </div>
            ),
        },
        {
            key: 'occupancy',
            label: 'Occupancy',
            sortable: true,
            render: (item: any) => {
                const occupancy = calculateOccupancy(item.occupiedUnits, item.totalUnits);
                return (
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-600 dark:text-slate-400">
                                    {item.occupiedUnits}/{item.totalUnits}
                                </span>
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {occupancy}%
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${
                                        occupancy >= 80
                                            ? 'bg-emerald-500'
                                            : occupancy >= 50
                                                ? 'bg-amber-500'
                                                : 'bg-red-500'
                                    }`}
                                    style={{ width: `${occupancy}%` }}
                                />
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'yearBuilt',
            label: 'Year',
            sortable: true,
            render: (item: any) => (
                <span className="text-sm text-slate-600 dark:text-slate-400">{item.yearBuilt}</span>
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
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Properties</h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Manage your properties and buildings
                    </p>
                </div>
                <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="w-5 h-5" />
                    Add Property
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Total Properties</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{properties.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Total Units</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                    {properties.reduce((sum, p) => sum + p.totalUnits, 0)}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <Home className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Occupied</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                    {properties.reduce((sum, p) => sum + p.occupiedUnits, 0)}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Home className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Avg Occupancy</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                    {Math.round((properties.reduce((sum, p) => sum + p.occupiedUnits, 0) /
                                        properties.reduce((sum, p) => sum + p.totalUnits, 0)) * 100)}%
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
                                placeholder="Search properties..."
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
                        <div className={`grid grid-cols-1 gap-3 md:grid-cols-2 ${showFilters ? 'block' : 'hidden md:grid'}`}>
                            <Select options={typeOptions} value={filterType} onChange={(e) => setFilterType(e.target.value)} />
                            <Select options={cityOptions} value={filterCity} onChange={(e) => setFilterCity(e.target.value)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Grid View */}
            {effectiveViewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {properties.map((property) => {
                        const occupancy = calculateOccupancy(property.occupiedUnits, property.totalUnits);
                        return (
                            <Card key={property.id} hover>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                                <Building2 className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                                    {property.name}
                                                </h3>
                                                <Badge variant="default" size="sm">{property.type}</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{property.address}</p>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600 dark:text-slate-400">Total Units:</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">{property.totalUnits}</span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600 dark:text-slate-400">Year Built:</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">{property.yearBuilt}</span>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-slate-600 dark:text-slate-400">Occupancy</span>
                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                    {property.occupiedUnits}/{property.totalUnits} ({occupancy}%)
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all ${
                                                        occupancy >= 80
                                                            ? 'bg-emerald-500'
                                                            : occupancy >= 50
                                                                ? 'bg-amber-500'
                                                                : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${occupancy}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                                            <Button size="sm" variant="outline" className="flex-1">
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button size="sm" variant="ghost">
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* List View (Table) */}
            {effectiveViewMode === 'list' && (
                <Table data={properties} columns={columns} onRowClick={(property) => console.log('Clicked:', property)} />
            )}

            {/* Add Property Form */}
            <AddPropertyForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSubmit}
            />
        </div>
    );
}