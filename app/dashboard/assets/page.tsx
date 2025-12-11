'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import {
    Package,
    Plus,
    Search,
    Filter,
    Calendar,
    Eye,
    Edit,
    Trash2,
    MapPin,
} from 'lucide-react';

export default function AssetsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const assets = [
        {
            id: 1,
            name: 'AC Unit',
            code: 'AST-AC-001',
            category: 'Electronics',
            location: 'Room 305 - Building A',
            condition: 'Good',
            purchaseDate: '2023-01-15',
            purchasePrice: 4500000,
            warranty: 'Until Jan 2026',
        },
        {
            id: 2,
            name: 'Bed Frame',
            code: 'AST-BED-001',
            category: 'Furniture',
            location: 'Room 201 - Building B',
            condition: 'Good',
            purchaseDate: '2023-02-20',
            purchasePrice: 2000000,
            warranty: 'N/A',
        },
        {
            id: 3,
            name: 'Refrigerator',
            code: 'AST-REF-001',
            category: 'Electronics',
            location: 'Room 102 - Building A',
            condition: 'Excellent',
            purchaseDate: '2024-01-10',
            purchasePrice: 3500000,
            warranty: 'Until Jan 2027',
        },
        {
            id: 4,
            name: 'Washing Machine',
            code: 'AST-WM-001',
            category: 'Electronics',
            location: 'Common Area - Building A',
            condition: 'Fair',
            purchaseDate: '2022-06-15',
            purchasePrice: 2800000,
            warranty: 'Expired',
        },
        {
            id: 5,
            name: 'Wardrobe',
            code: 'AST-WAR-001',
            category: 'Furniture',
            location: 'Room 501 - Building B',
            condition: 'Excellent',
            purchaseDate: '2024-03-05',
            purchasePrice: 1500000,
            warranty: 'N/A',
        },
        {
            id: 6,
            name: 'Water Heater',
            code: 'AST-WH-001',
            category: 'Electronics',
            location: 'Room 405 - Building C',
            condition: 'Good',
            purchaseDate: '2023-08-20',
            purchasePrice: 1200000,
            warranty: 'Until Aug 2025',
        },
    ];

    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'furniture', label: 'Furniture' },
        { value: 'appliances', label: 'Appliances' },
    ];

    const conditionOptions = [
        { value: 'all', label: 'All Conditions' },
        { value: 'excellent', label: 'Excellent' },
        { value: 'good', label: 'Good' },
        { value: 'fair', label: 'Fair' },
        { value: 'poor', label: 'Poor' },
    ];

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

    const getConditionBadge = (condition: string) => {
        const variants: Record<string, any> = {
            Excellent: 'success',
            Good: 'info',
            Fair: 'warning',
            Poor: 'danger',
        };
        return variants[condition] || 'default';
    };

    const columns = [
        {
            key: 'name',
            label: 'Asset',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{item.code}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'category',
            label: 'Category',
            render: (item: any) => <Badge variant="purple">{item.category}</Badge>,
        },
        {
            key: 'location',
            label: 'Location',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-900 dark:text-white">{item.location}</span>
                </div>
            ),
        },
        {
            key: 'condition',
            label: 'Condition',
            render: (item: any) => (
                <Badge variant={getConditionBadge(item.condition)}>{item.condition}</Badge>
            ),
        },
        {
            key: 'purchasePrice',
            label: 'Value',
            sortable: true,
            render: (item: any) => (
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
          {formatCurrency(item.purchasePrice)}
        </span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                </div>
            ),
        },
    ];

    const totalValue = assets.reduce((sum, a) => sum + a.purchasePrice, 0);

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        Assets
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Manage property assets and inventory
                    </p>
                </div>
                <Button className="w-full sm:w-auto">
                    <Plus className="w-5 h-5" />
                    Add Asset
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Total Assets</p>
                        <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {assets.length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Total Value</p>
                        <p className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mt-1 truncate">
                            {formatCurrency(totalValue)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Electronics</p>
                        <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {assets.filter(a => a.category === 'Electronics').length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Furniture</p>
                        <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {assets.filter(a => a.category === 'Furniture').length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-3 md:p-4">
                    <div className="space-y-3">
                        <Input
                            placeholder="Search assets..."
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
                            <Select options={categoryOptions} placeholder="Category" />
                            <Select options={conditionOptions} placeholder="Condition" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-3">
                {assets.map((asset) => (
                    <Card key={asset.id} hover>
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-900 dark:text-white">{asset.name}</h3>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">{asset.code}</p>
                                </div>
                                <Badge variant={getConditionBadge(asset.condition)} size="sm">
                                    {asset.condition}
                                </Badge>
                            </div>
                            <div className="space-y-2 text-sm mb-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">Category:</span>
                                    <Badge variant="purple" size="sm">{asset.category}</Badge>
                                </div>
                                <div className="flex items-start justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">Location:</span>
                                    <span className="text-slate-900 dark:text-white text-xs text-right">{asset.location}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">Value:</span>
                                    <span className="text-slate-900 dark:text-white font-semibold">
                    {formatCurrency(asset.purchasePrice)}
                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">Purchase:</span>
                                    <span className="text-slate-900 dark:text-white">{formatDate(asset.purchaseDate)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">Warranty:</span>
                                    <span className="text-slate-900 dark:text-white text-xs">{asset.warranty}</span>
                                </div>
                            </div>
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

            {/* Desktop Table */}
            <div className="hidden md:block">
                <Table data={assets} columns={columns} />
            </div>
        </div>
    );
}