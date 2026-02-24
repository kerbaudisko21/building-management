'use client';

import { useState } from 'react'
import { assetService } from '@/lib/services'
import { useCrud } from '@/lib/hooks/useSupabaseQuery'
import type { AssetRow, AssetInsert, AssetUpdate } from '@/types/database'
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import AddAssetForm, { AssetFormData } from '@/components/forms/AddAssetForm';
import { formatCurrency, formatCurrencyShort } from '@/utils/currency';
import {
    Package,
    Plus,
    Search,
    Filter,
    Building,
    Home,
    MapPin,
    DollarSign,
    CheckCircle,
    AlertCircle,
    Edit,
    Trash2,
    Move,
Loader2, } from 'lucide-react';
import { useToast } from '@/components/ui/Toast'

export default function AssetsPage() {
    const { toast, confirm } = useToast()
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterProperty, setFilterProperty] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<AssetRow | null>(null)

    const {
        items: assets,
        loading,
        error,
        addItem,
        updateItem,
        removeItem,
        actionLoading,
    } = useCrud<AssetRow, AssetInsert, AssetUpdate>({
        service: assetService,
        orderBy: 'created_at',
    })


    const propertyOptions = [
        { value: 'all', label: 'All Properties' },
        { value: 'Menteng Residence', label: 'Menteng Residence' },
        { value: 'BSD City Apartment', label: 'BSD City Apartment' },
        { value: 'Kemang Suites', label: 'Kemang Suites' },
        { value: 'Sudirman Park', label: 'Sudirman Park' },
    ];

    const statusOptions = [
        { value: 'all', label: 'All Conditions' },
        { value: 'Excellent', label: 'Excellent' },
        { value: 'Good', label: 'Good' },
        { value: 'Fair', label: 'Fair' },
        { value: 'Poor', label: 'Poor' },
        { value: 'Needs Repair', label: 'Needs Repair' },
    ];

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

    const columns = [
        {
            key: 'asset',
            label: 'Asset Info',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                            {item.name}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            {item.number}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: 'location',
            label: 'Property & Location',
            render: (item: any) => (
                <div className="min-w-0">
                    <div className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <p className="text-sm text-slate-900 dark:text-white truncate">
                            {item.property}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                        <Home className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                            {item.room_unit}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                            Current: {item.current_location}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: 'category',
            label: 'Category',
            render: (item: any) => (
                <Badge variant="info" size="sm">
                    {item.category}
                </Badge>
            ),
        },
        {
            key: 'value',
            label: 'Purchase Price',
            sortable: true,
            render: (item: any) => (
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {formatCurrencyShort(item.purchase_price)}
                </div>
            ),
        },
        {
            key: 'condition',
            label: 'Condition',
            sortable: true,
            render: (item: any) => (
                <Badge variant={getConditionBadge(item.condition)} dot>
                    {item.condition}
                </Badge>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" title="Move asset">
                        <Move className="w-4 h-4" />
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

    const handleFormSubmit = async (data: AssetFormData) => {
        if (editingAsset) {
            const updResult = await updateItem(editingAsset.id, data as unknown as AssetUpdate)
            if (updResult.error) toast.error('Gagal mengupdate', updResult.error)
            else toast.success('Berhasil', 'Data berhasil diupdate')
        } else {
            const number = `AST-${String(assets.length + 1).padStart(3, '0')}`
            const addResult = await addItem({ ...data, number } as unknown as AssetInsert)
            if (addResult.error) toast.error('Gagal menyimpan', addResult.error)
            else toast.success('Berhasil', 'Data berhasil ditambahkan')
        }
        setEditingAsset(null)
    }


    const handleEdit = (asset: any) => {
        setEditingAsset(asset);
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
        setEditingAsset(null);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingAsset(null);
    };

    // Filter assets
    const filteredAssets = assets.filter(asset => {
        const matchSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            asset.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            asset.current_location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchProperty = filterProperty === 'all' || asset.property === filterProperty;
        const matchStatus = filterStatus === 'all' || asset.condition === filterStatus;
        return matchSearch && matchProperty && matchStatus;
    });

    // Stats
    const totalAssets = assets.length;
    const goodCondition = assets.filter(a => a.condition === 'Excellent' || a.condition === 'Good').length;
    const needsAttention = assets.filter(a => a.condition === 'Poor' || a.condition === 'Needs Repair').length;
    const totalValue = assets.reduce((sum, a) => sum + a.purchase_price, 0);

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
                        Assets
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Track property assets and their locations
                    </p>
                </div>
                <Button className="w-full sm:w-auto" onClick={handleAddNew}>
                    <Plus className="w-5 h-5" />
                    Add Asset
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Total Assets
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1 truncate">
                                    {totalAssets}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 ml-2">
                                <Package className="w-5 h-5 md:w-6 md:h-6 text-slate-600 dark:text-slate-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Good Condition
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                                    {goodCondition}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Needs Attention
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 truncate">
                                    {needsAttention}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Total Value
                                </p>
                                <p className="text-base md:text-xl font-bold text-purple-600 dark:text-purple-400 mt-1 truncate">
                                    {formatCurrencyShort(totalValue)}
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
                            placeholder="Search by name, number, or location..."
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
                            <Select
                                options={propertyOptions}
                                value={filterProperty}
                                onChange={(e) => setFilterProperty(e.target.value)}
                            />
                            <Select
                                options={statusOptions}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-3">
                {filteredAssets.map((asset) => (
                    <Card key={asset.id} hover>
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                                        {asset.name}
                                    </h3>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        {asset.number}
                                    </p>
                                    <div className="flex gap-2 mt-1">
                                        <Badge variant="info" size="sm">{asset.category}</Badge>
                                        <Badge variant={getConditionBadge(asset.condition)} dot size="sm">
                                            {asset.condition}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-3 text-sm">
                                <div className="flex items-start gap-2">
                                    <Building className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-slate-900 dark:text-white font-medium truncate">
                                            {asset.property}
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                            {asset.room_unit}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-slate-900 dark:text-white font-medium truncate">
                                        {asset.current_location}
                                    </p>
                                </div>
                            </div>

                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded mb-3">
                                <p className="text-xs text-slate-500 dark:text-slate-400">Purchase Price</p>
                                <p className="font-bold text-purple-600 dark:text-purple-400">
                                    {formatCurrency(asset.purchase_price)}
                                </p>
                            </div>

                            {asset.notes && (
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 italic">
                                    {asset.notes}
                                </p>
                            )}

                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(asset)}>
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleDelete(asset.id)}>
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
                <Table data={filteredAssets} columns={columns} />
            </div>

            {/* Add/Edit Form */}
            <AddAssetForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleFormSubmit}
                editData={editingAsset}
            />
        </div>
    );
}