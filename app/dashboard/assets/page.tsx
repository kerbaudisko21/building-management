'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import AddAssetForm, { AssetFormData } from '@/components/forms/AddAssetForm';
import { Package, Plus, Search, Filter, Calendar, MapPin, DollarSign, Edit, Trash2 } from 'lucide-react';

export default function AssetPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterCondition, setFilterCondition] = useState('all');

    const [assets, setAssets] = useState([
        {
            id: '1',
            name: 'AC Unit - Room 305',
            category: 'HVAC',
            location: 'Building A, Room 305',
            purchaseDate: '2023-01-15',
            purchasePrice: 5000000,
            currentValue: 4000000,
            condition: 'Good',
            serialNumber: 'AC-2023-001',
        },
        {
            id: '2',
            name: 'Refrigerator - Room 201',
            category: 'Appliances',
            location: 'Building B, Room 201',
            purchaseDate: '2022-06-10',
            purchasePrice: 3500000,
            currentValue: 2500000,
            condition: 'Good',
            serialNumber: 'REF-2022-045',
        },
        {
            id: '3',
            name: 'Security Camera System',
            category: 'Security',
            location: 'Building A, Main Entrance',
            purchaseDate: '2023-08-20',
            purchasePrice: 8000000,
            currentValue: 6500000,
            condition: 'Excellent',
            serialNumber: 'SEC-2023-012',
        },
        {
            id: '4',
            name: 'Water Heater - Room 405',
            category: 'Appliances',
            location: 'Building A, Room 405',
            purchaseDate: '2021-03-15',
            purchasePrice: 2000000,
            currentValue: 800000,
            condition: 'Fair',
            serialNumber: 'WH-2021-033',
        },
        {
            id: '5',
            name: 'Generator Backup',
            category: 'Equipment',
            location: 'Building C, Basement',
            purchaseDate: '2020-11-01',
            purchasePrice: 15000000,
            currentValue: 10000000,
            condition: 'Needs Repair',
            serialNumber: 'GEN-2020-005',
        },
    ]);

    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        { value: 'furniture', label: 'Furniture' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'appliances', label: 'Appliances' },
        { value: 'hvac', label: 'HVAC System' },
        { value: 'security', label: 'Security Equipment' },
        { value: 'vehicle', label: 'Vehicle' },
        { value: 'tools', label: 'Tools & Equipment' },
        { value: 'other', label: 'Other' },
    ];

    const conditionOptions = [
        { value: 'all', label: 'All Conditions' },
        { value: 'excellent', label: 'Excellent' },
        { value: 'good', label: 'Good' },
        { value: 'fair', label: 'Fair' },
        { value: 'poor', label: 'Poor' },
        { value: 'needs-repair', label: 'Needs Repair' },
    ];

    const handleFormSubmit = (data: AssetFormData) => {
        const depreciation = ((data.purchasePrice - data.currentValue) / data.purchasePrice * 100).toFixed(1);
        const newAsset = {
            id: Date.now().toString(),
            name: data.name,
            category: data.category,
            location: data.location,
            purchaseDate: data.purchaseDate,
            purchasePrice: data.purchasePrice,
            currentValue: data.currentValue,
            condition: data.condition,
            serialNumber: data.serialNumber || '-',
            depreciation,
        };
        setAssets([newAsset, ...assets]);
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

    const getConditionBadge = (condition: string) => {
        const variants: Record<string, any> = {
            'Excellent': 'success',
            'Good': 'info',
            'Fair': 'warning',
            'Poor': 'danger',
            'Needs Repair': 'danger',
        };
        return variants[condition] || 'default';
    };

    const calculateDepreciation = (purchase: number, current: number) => {
        return ((purchase - current) / purchase * 100).toFixed(1);
    };

    const columns = [
        {
            key: 'name',
            label: 'Asset',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.category}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'location',
            label: 'Location',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{item.location}</span>
                </div>
            ),
        },
        {
            key: 'purchaseDate',
            label: 'Purchase Date',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{formatDate(item.purchaseDate)}</span>
                </div>
            ),
        },
        {
            key: 'value',
            label: 'Value',
            render: (item: any) => (
                <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(item.currentValue)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Purchase: {formatCurrency(item.purchasePrice)}
                    </p>
                </div>
            ),
        },
        {
            key: 'depreciation',
            label: 'Depreciation',
            sortable: true,
            render: (item: any) => (
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {calculateDepreciation(item.purchasePrice, item.currentValue)}%
                </span>
            ),
        },
        {
            key: 'condition',
            label: 'Condition',
            render: (item: any) => (
                <Badge variant={getConditionBadge(item.condition)} dot>
                    {item.condition}
                </Badge>
            ),
        },
        {
            key: 'serialNumber',
            label: 'Serial #',
            render: (item: any) => (
                <span className="text-sm font-mono text-slate-600 dark:text-slate-400">{item.serialNumber}</span>
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

    const totalValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
    const totalPurchase = assets.reduce((sum, a) => sum + a.purchasePrice, 0);

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        Assets
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Manage property assets and equipment
                    </p>
                </div>
                <Button className="w-full sm:w-auto" onClick={() => setIsFormOpen(true)}>
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
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Current Value</p>
                        <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                            {formatCurrency(totalValue)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Good Condition</p>
                        <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                            {assets.filter(a => a.condition === 'Good' || a.condition === 'Excellent').length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Needs Repair</p>
                        <p className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                            {assets.filter(a => a.condition === 'Needs Repair' || a.condition === 'Poor').length}
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
                            <Select options={categoryOptions} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} />
                            <Select options={conditionOptions} value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="block md:hidden space-y-3">
                {assets.map((asset) => (
                    <Card key={asset.id} hover>
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                                        <Package className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-slate-900 dark:text-white truncate">{asset.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{asset.category}</p>
                                    </div>
                                </div>
                                <Badge variant={getConditionBadge(asset.condition)} dot size="sm">
                                    {asset.condition}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Location:</span>
                                    <span className="text-slate-900 dark:text-white">{asset.location}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Current Value:</span>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                        {formatCurrency(asset.currentValue)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Depreciation:</span>
                                    <span className="font-medium text-red-600 dark:text-red-400">
                                        {calculateDepreciation(asset.purchasePrice, asset.currentValue)}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Serial:</span>
                                    <span className="font-mono text-xs text-slate-900 dark:text-white">{asset.serialNumber}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="hidden md:block">
                <Table data={assets} columns={columns} />
            </div>

            <AddAssetForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
            />
        </div>
    );
}