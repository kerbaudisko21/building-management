'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Table from '@/components/ui/Table';
import AddPropertyForm, { PropertyFormData } from '@/components/forms/AddPropertyForm';
import {
    Building,
    Plus,
    Search,
    MapPin,
    Home,
    Users,
    CheckCircle,
    Edit,
    Trash2,
    Wifi,
    Car,
    Droplet,
    Zap,
    Wind,
    Shield,
} from 'lucide-react';

export default function PropertiesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState<any>(null);

    const [properties, setProperties] = useState([
        {
            id: '1',
            name: 'Menteng Residence',
            address: 'Jl. Menteng Raya No. 45, Jakarta Pusat',
            total_unit: 50,
            occupancy: 42,
            facility: ['WiFi', 'Parking', 'Security 24/7', 'Swimming Pool', 'Gym'],
        },
        {
            id: '2',
            name: 'Kemang Suites',
            address: 'Jl. Kemang Selatan No. 88, Jakarta Selatan',
            total_unit: 30,
            occupancy: 28,
            facility: ['WiFi', 'Parking', 'Security 24/7', 'Elevator'],
        },
        {
            id: '3',
            name: 'BSD City Apartment',
            address: 'Jl. Pahlawan Seribu, BSD City, Tangerang',
            total_unit: 100,
            occupancy: 85,
            facility: ['WiFi', 'Parking', 'Security 24/7', 'Swimming Pool', 'Gym', 'Garden', 'Playground'],
        },
        {
            id: '4',
            name: 'Sudirman Park',
            address: 'Jl. Jend. Sudirman Kav. 52, Jakarta Selatan',
            total_unit: 75,
            occupancy: 60,
            facility: ['WiFi', 'Parking', 'Security 24/7', 'Swimming Pool', 'Jogging Track'],
        },
    ]);

    const facilityIcons: Record<string, any> = {
        'WiFi': Wifi,
        'Parking': Car,
        'Swimming Pool': Droplet,
        'Gym': Users,
        'Security 24/7': Shield,
        'Elevator': Zap,
        'AC': Wind,
    };

    const getFacilityIcon = (facility: string) => {
        for (const [key, Icon] of Object.entries(facilityIcons)) {
            if (facility.includes(key)) return Icon;
        }
        return CheckCircle;
    };

    const getOccupancyPercentage = (occupied: number, total: number) => {
        return Math.round((occupied / total) * 100);
    };

    const getOccupancyColor = (percentage: number) => {
        if (percentage >= 90) return 'text-emerald-600 dark:text-emerald-400';
        if (percentage >= 70) return 'text-blue-600 dark:text-blue-400';
        if (percentage >= 50) return 'text-amber-600 dark:text-amber-400';
        return 'text-red-600 dark:text-red-400';
    };

    const columns = [
        {
            key: 'name',
            label: 'Property',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Building className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                            {item.name}
                        </p>
                        <div className="flex items-start gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                                {item.address}
                            </p>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'units',
            label: 'Units',
            sortable: true,
            render: (item: any) => (
                <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {item.total_unit}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Total Units</p>
                </div>
            ),
        },
        {
            key: 'occupancy',
            label: 'Occupancy',
            sortable: true,
            render: (item: any) => {
                const percentage = getOccupancyPercentage(item.occupancy, item.total_unit);
                return (
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-2xl font-bold ${getOccupancyColor(percentage)}`}>
                                {percentage}%
                            </span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                ({item.occupancy}/{item.total_unit})
                            </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                            <div
                                className={`h-2 rounded-full ${
                                    percentage >= 90 ? 'bg-emerald-500' :
                                        percentage >= 70 ? 'bg-blue-500' :
                                            percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'facility',
            label: 'Facilities',
            render: (item: any) => (
                <div className="flex flex-wrap gap-1">
                    {item.facility.slice(0, 3).map((fac: string, idx: number) => {
                        const Icon = getFacilityIcon(fac);
                        return (
                            <div
                                key={idx}
                                className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md"
                                title={fac}
                            >
                                <Icon className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                    {fac.split(' ')[0]}
                                </span>
                            </div>
                        );
                    })}
                    {item.facility.length > 3 && (
                        <Badge variant="default" size="sm">
                            +{item.facility.length - 3}
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item: any) => (
                <div className="flex items-center gap-2">
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
    const handleEdit = (property: any) => {
        setEditingProperty(property);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this property?')) {
            setProperties(properties.filter(p => p.id !== id));
        }
    };

    const handleAddNew = () => {
        setEditingProperty(null);
        setIsFormOpen(true);
    };

    // Filter properties
    const filteredProperties = properties.filter(property =>
        property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Stats
    const totalProperties = properties.length;
    const totalUnits = properties.reduce((sum, p) => sum + p.total_unit, 0);
    const totalOccupied = properties.reduce((sum, p) => sum + p.occupancy, 0);
    const totalVacant = totalUnits - totalOccupied;
    const avgOccupancy = Math.round((totalOccupied / totalUnits) * 100);

    // Form handlers
    const handleFormSubmit = (data: PropertyFormData) => {
        if (editingProperty) {
            // Update existing property
            setProperties(properties.map(p =>
                p.id === editingProperty.id
                    ? { ...p, ...data }
                    : p
            ));
        } else {
            // Add new property
            const newProperty = {
                id: Date.now().toString(),
                ...data,
            };
            setProperties([newProperty, ...properties]);
        }
        setEditingProperty(null);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingProperty(null);
    };

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        Properties
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Manage buildings and apartment listings
                    </p>
                </div>
                <Button className="w-full sm:w-auto" onClick={handleAddNew}>
                    <Plus className="w-5 h-5" />
                    Add Property
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Total Properties
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1 truncate">
                                    {totalProperties}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <Building className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Total Units
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 truncate">
                                    {totalUnits}
                                </p>
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
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Occupied
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                                    {totalOccupied}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <Users className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Avg Occupancy
                                </p>
                                <p className={`text-xl md:text-2xl font-bold mt-1 truncate ${getOccupancyColor(avgOccupancy)}`}>
                                    {avgOccupancy}%
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="p-3 md:p-4">
                    <Input
                        placeholder="Search properties by name or address..."
                        leftIcon={<Search className="w-5 h-5" />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </CardContent>
            </Card>

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-3">
                {filteredProperties.map((property) => {
                    const percentage = getOccupancyPercentage(property.occupancy, property.total_unit);
                    return (
                        <Card key={property.id} hover>
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                        <Building className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                                            {property.name}
                                        </h3>
                                        <div className="flex items-start gap-1 mt-1">
                                            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" />
                                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                                                {property.address}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {property.total_unit}
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">Total Units</p>
                                    </div>
                                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                        <p className={`text-2xl font-bold ${getOccupancyColor(percentage)}`}>
                                            {percentage}%
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                            {property.occupancy}/{property.total_unit}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Facilities:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {property.facility.map((fac, idx) => {
                                            const Icon = getFacilityIcon(fac);
                                            return (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md"
                                                >
                                                    <Icon className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                                                    <span className="text-xs text-slate-600 dark:text-slate-400">
                                                        {fac}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-3">
                                    <div
                                        className={`h-2 rounded-full ${
                                            percentage >= 90 ? 'bg-emerald-500' :
                                                percentage >= 70 ? 'bg-blue-500' :
                                                    percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                        }`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(property)}>
                                        <Edit className="w-4 h-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleDelete(property.id)}>
                                        <Trash2 className="w-4 h-4 mr-1 text-red-600" />
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
                <Table data={filteredProperties} columns={columns} />
            </div>

            {/* Add/Edit Property Form */}
            <AddPropertyForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleFormSubmit}
                editData={editingProperty}
            />
        </div>
    );
}